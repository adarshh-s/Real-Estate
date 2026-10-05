// Vercel serverless function — handles Contact, Sell/Valuation, Brochure,
// Property Enquiry, and Newsletter submissions by dispatching emails via Resend.
//
// Ready to use: Just add RESEND_API_KEY in your .env or Vercel Environment Variables.
//
// Supported Environment Variables:
//   RESEND_API_KEY    — Required to send live emails. Get yours from https://resend.com/api-keys
//   RESEND_FROM_EMAIL — Optional. Defaults to "S I A Luxe <onboarding@resend.dev>".
//                       When sia-luxe.com is verified in Resend, set e.g.:
//                       "S I A Luxe <enquiries@sia-luxe.com>"
//   CONTACT_TO_EMAIL  — Optional. Defaults to "info@sia-luxe.com".
//                       (Note: in Resend free sandbox with onboarding@resend.dev,
//                       Resend requires sending to your Resend account email).

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export interface EnquiryBody {
  formType?: 'contact' | 'sell' | 'brochure' | 'enquiry' | 'viewing' | 'newsletter';
  name?: string;
  email?: string;
  phone?: string;
  userRole?: string;
  subject?: string;
  community?: string;
  propertyReference?: string;
  projectName?: string;
  developer?: string;
  priceAED?: number | string;
  preferredDelivery?: string;
  agentName?: string;
  agentEmail?: string;
  message?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrencyAED(val: number | string | undefined): string {
  if (!val) return '';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return String(val);
  return `AED ${num.toLocaleString('en-US')}`;
}

export function buildEnquiryContent(body: EnquiryBody) {
  const {
    formType = 'contact',
    name = '',
    email = '',
    phone,
    userRole,
    subject,
    community,
    propertyReference,
    projectName,
    developer,
    priceAED,
    preferredDelivery,
    agentName,
    agentEmail,
    message,
  } = body;

  const cleanName = name.trim() || (email ? email.split('@')[0] : 'Website Visitor');
  const cleanEmail = email.trim();
  const cleanPhone = phone?.trim() || '';

  // Form type specifics
  let categoryBadge = 'Contact Enquiry';
  let categoryTitle = `New Contact Message from ${cleanName}`;
  let emailSubject = `[S I A Luxe] Contact Enquiry: ${cleanName}`;

  if (formType === 'sell') {
    categoryBadge = 'Valuation Request';
    categoryTitle = `Valuation Request from ${cleanName}`;
    emailSubject = `[S I A Luxe] Valuation Request: ${cleanName}${community ? ` — ${community}` : ''}`;
  } else if (formType === 'brochure') {
    const itemLabel = projectName ? `${projectName}${developer ? ` (${developer})` : ''}` : 'Off-Plan Project';
    categoryBadge = 'Brochure Request';
    categoryTitle = `Brochure Request: ${itemLabel}`;
    emailSubject = `[S I A Luxe] Brochure Request: ${projectName || 'Project'} — ${cleanName}`;
  } else if (formType === 'enquiry' || formType === 'viewing') {
    const itemLabel = projectName || 'Ready Property';
    categoryBadge = formType === 'viewing' ? 'Private Viewing Request' : 'Property Enquiry';
    categoryTitle = `${categoryBadge}: ${itemLabel}`;
    emailSubject = `[S I A Luxe] ${categoryBadge}: ${projectName || 'Property'}${propertyReference ? ` (${propertyReference})` : ''} — ${cleanName}`;
  } else if (formType === 'newsletter') {
    categoryBadge = 'Newsletter Subscription';
    categoryTitle = `New Market Perspectives Subscriber`;
    emailSubject = `[S I A Luxe] Newsletter Subscription: ${cleanEmail}`;
  } else if (subject) {
    emailSubject = `[S I A Luxe] ${subject}: ${cleanName}`;
  }

  // Plain Text Layout
  const textLines: (string | null)[] = [
    '==================================================',
    `S I A   L U X E   ·   ${categoryBadge.toUpperCase()}`,
    '==================================================',
    '',
    `Client Name:        ${cleanName}`,
    `Email:              ${cleanEmail}`,
    cleanPhone ? `Phone / WhatsApp:   ${cleanPhone}` : null,
    userRole ? `Client Role:        ${userRole}` : null,
    subject ? `Subject:            ${subject}` : null,
    projectName ? `Property / Project: ${projectName}` : null,
    developer ? `Developer:          ${developer}` : null,
    community ? `Community:          ${community}` : null,
    propertyReference ? `Reference ID:       ${propertyReference}` : null,
    priceAED ? `Listed Price:       ${formatCurrencyAED(priceAED)}` : null,
    preferredDelivery ? `Delivery Method:    ${preferredDelivery}` : null,
    agentName ? `Assigned Advisor:   ${agentName}${agentEmail ? ` (${agentEmail})` : ''}` : null,
    '',
    '--------------------------------------------------',
    'Client Message / Notes:',
    '--------------------------------------------------',
    message && message.trim() ? message.trim() : '(No additional notes provided)',
    '',
    '==================================================',
    `Sent from S I A Luxe Website · ${new Date().toISOString()}`,
    '==================================================',
  ];

  const text = textLines.filter((l): l is string => l !== null).join('\n');

  // HTML Layout
  const detailRows: { label: string; value: string; isLink?: 'email' | 'tel' | 'wa' }[] = [
    { label: 'Client Name', value: cleanName },
    { label: 'Email Address', value: cleanEmail, isLink: 'email' },
  ];

  if (cleanPhone) {
    detailRows.push({ label: 'Phone / WhatsApp', value: cleanPhone, isLink: 'tel' });
  }
  if (userRole) {
    detailRows.push({ label: 'Client Role', value: userRole });
  }
  if (subject) {
    detailRows.push({ label: 'Subject', value: subject });
  }
  if (projectName) {
    detailRows.push({ label: 'Property / Project', value: projectName });
  }
  if (developer) {
    detailRows.push({ label: 'Developer', value: developer });
  }
  if (community) {
    detailRows.push({ label: 'Community', value: community });
  }
  if (propertyReference) {
    detailRows.push({ label: 'Reference Number', value: propertyReference });
  }
  if (priceAED) {
    detailRows.push({ label: 'Listed Price', value: formatCurrencyAED(priceAED) });
  }
  if (preferredDelivery) {
    detailRows.push({ label: 'Delivery Preference', value: preferredDelivery });
  }
  if (agentName) {
    detailRows.push({
      label: 'Assigned Advisor',
      value: `${agentName}${agentEmail ? ` (${agentEmail})` : ''}`,
    });
  }

  const phoneDigitsOnly = cleanPhone.replace(/[^0-9]/g, '');

  const rowsHtml = detailRows
    .map((r, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#faf8f5';
      let valueHtml = `<strong>${escapeHtml(r.value)}</strong>`;
      if (r.isLink === 'email') {
        valueHtml = `<a href="mailto:${encodeURIComponent(r.value)}" style="color: #c5a880; font-weight: 600; text-decoration: none;">${escapeHtml(r.value)}</a>`;
      } else if (r.isLink === 'tel') {
        valueHtml = `
          <a href="tel:${encodeURIComponent(r.value)}" style="color: #141312; font-weight: 600; text-decoration: none;">${escapeHtml(r.value)}</a>
          ${phoneDigitsOnly ? `&nbsp;·&nbsp;<a href="https://wa.me/${phoneDigitsOnly}" style="color: #25D366; font-size: 12px; font-weight: 600; text-decoration: none;" target="_blank">Chat on WhatsApp &rarr;</a>` : ''}
        `;
      }
      return `
        <tr style="background-color: ${bg}; border-bottom: 1px solid #f0ede8;">
          <td style="padding: 12px 16px; font-size: 12px; color: #767067; text-transform: uppercase; letter-spacing: 0.08em; width: 38%;">${escapeHtml(r.label)}</td>
          <td style="padding: 12px 16px; font-size: 14px; color: #141312;">${valueHtml}</td>
        </tr>
      `;
    })
    .join('');

  const messageBlock = message && message.trim()
    ? `
      <div style="margin-top: 24px; padding: 20px; background-color: #faf8f5; border-left: 3px solid #c5a880; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8e877e; font-weight: 600;">Client Notes / Message</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2d2b28; white-space: pre-wrap;">${escapeHtml(message.trim())}</p>
      </div>
    `
    : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(emailSubject)}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f5f2eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141312; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e7e2d9; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">
    <!-- Dark Luxury Header -->
    <div style="background-color: #141312; padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; color: #c5a880; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase;">S I A &nbsp; L U X E</h1>
      <p style="margin: 8px 0 0 0; color: #9c9589; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;">Private Client Real Estate · Dubai</p>
    </div>

    <!-- Category Banner -->
    <div style="background-color: #faf8f5; border-bottom: 1px solid #ede8e0; padding: 20px 28px;">
      <span style="display: inline-block; background-color: #c5a880; color: #ffffff; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 12px; border-radius: 999px;">
        ${escapeHtml(categoryBadge)}
      </span>
      <h2 style="margin: 12px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #141312; font-weight: 400; line-height: 1.3;">
        ${escapeHtml(categoryTitle)}
      </h2>
    </div>

    <!-- Content Table -->
    <div style="padding: 24px 28px;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #f0ede8; border-radius: 12px; overflow: hidden;">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      ${messageBlock}

      <!-- Action Buttons -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #ede8e0; display: flex; gap: 12px; text-align: center;">
        <a href="mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(`Re: ${emailSubject}`)}" style="display: inline-block; background-color: #141312; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;">
          Reply to Client &rarr;
        </a>
        ${phoneDigitsOnly ? `
          <a href="https://wa.me/${phoneDigitsOnly}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;" target="_blank">
            Open WhatsApp &rarr;
          </a>
        ` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #faf8f5; border-top: 1px solid #ede8e0; padding: 20px 28px; text-align: center; font-size: 11px; color: #9c9589;">
      <p style="margin: 0; font-weight: 500;">S I A Luxe Real Estate · Private Client Advisory Desk</p>
      <p style="margin: 4px 0 0 0;">Boulevard Plaza Tower 1, Downtown Dubai, UAE</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { emailSubject, text, html, cleanEmail };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  let body = req.body as EnquiryBody;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: 'Invalid JSON payload.' });
      return;
    }
  }

  const { formType = 'contact', name, email } = body || {};

  // Validation
  if (formType === 'newsletter') {
    if (!email || !email.trim()) {
      res.status(400).json({ error: 'Email address is required for newsletter subscription.' });
      return;
    }
  } else {
    if (!name || !name.trim()) {
      res.status(400).json({ error: 'Name is required.' });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ error: 'Email address is required.' });
      return;
    }
  }

  const { emailSubject, text, html, cleanEmail } = buildEnquiryContent(body);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toRaw = process.env.CONTACT_TO_EMAIL?.trim() || 'info@sia-luxe.com';
  const toAddresses = toRaw.split(',').map((e) => e.trim()).filter(Boolean);
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || 'S I A Luxe Website <onboarding@resend.dev>';

  // DEV / SIMULATION MODE (when RESEND_API_KEY is not yet added)
  if (!apiKey) {
    console.log('----------------------------------------------------');
    console.log('[S I A Luxe Form Submission] (DEV MODE - RESEND_API_KEY not configured)');
    console.log(`Subject: ${emailSubject}`);
    console.log(`Client Email: ${cleanEmail}`);
    console.log(text);
    console.log('----------------------------------------------------');
    res.status(200).json({
      ok: true,
      devMode: true,
      message: 'Request received successfully. Add RESEND_API_KEY to your environment variables to send live emails.',
    });
    return;
  }

  // LIVE SEND VIA RESEND
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toAddresses,
      replyTo: cleanEmail,
      subject: emailSubject,
      text,
      html,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      // Helpful diagnosis for common sandbox constraint
      const isSandboxRestriction =
        error.message?.includes('testing emails') ||
        error.message?.includes('verify a domain');

      const userFriendlyError = isSandboxRestriction
        ? `Resend sandbox active: with onboarding@resend.dev you can only send to your Resend account email (${toRaw}). Set CONTACT_TO_EMAIL to your account email in .env or verify your domain at resend.com/domains.`
        : error.message || 'Failed to dispatch email via Resend.';

      res.status(400).json({
        ok: false,
        error: userFriendlyError,
      });
      return;
    }

    console.log(`[Resend Success] Email delivered. ID: ${data?.id}`);
    res.status(200).json({ ok: true, id: data?.id });
  } catch (err: any) {
    console.error('[Resend Exception]:', err);
    res.status(500).json({
      ok: false,
      error: err?.message || 'Server error while sending email via Resend.',
    });
  }
}
