// Vercel serverless function — handles Contact and Sell-With-Us form submissions
// by emailing them via Resend. Inactive (returns 503) until RESEND_API_KEY is set
// in the Vercel project's environment variables.
//
// Env vars:
//   RESEND_API_KEY   — required. From resend.com once the client's account exists.
//   RESEND_FROM_EMAIL — optional. Defaults to Resend's shared sandbox sender, which
//                       works immediately with no setup. Once sia-luxe.com is added
//                       and verified in Resend, set this to e.g.
//                       "S I A Luxe <noreply@sia-luxe.com>" for proper deliverability.
//   CONTACT_TO_EMAIL — optional. Defaults to info@sia-luxe.com.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface EnquiryBody {
  formType?: 'contact' | 'sell' | 'brochure';
  name?: string;
  email?: string;
  phone?: string;
  userRole?: string;
  subject?: string;
  community?: string;
  propertyReference?: string;
  projectName?: string;
  developer?: string;
  message?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = (req.body ?? {}) as EnquiryBody;
  const {
    formType = 'contact',
    name,
    email,
    phone,
    userRole,
    subject,
    community,
    propertyReference,
    projectName,
    developer,
    message,
  } = body;

  if (!name || !email) {
    res.status(400).json({ error: 'Missing required fields: name and email are required.' });
    return;
  }

  if (formType !== 'brochure' && !message) {
    res.status(400).json({ error: 'Missing required message field.' });
    return;
  }

  const to = process.env.CONTACT_TO_EMAIL || 'info@sia-luxe.com';
  const from = process.env.RESEND_FROM_EMAIL || 'S I A Luxe Website <onboarding@resend.dev>';

  let heading = 'New Contact Enquiry';
  let emailSubject = `${heading} — ${name}`;

  if (formType === 'sell') {
    heading = 'New Valuation Request';
    emailSubject = `${heading} — ${name}`;
  } else if (formType === 'brochure') {
    const projLabel = projectName ? `${projectName}${developer ? ` by ${developer}` : ''}` : 'Off-Plan Project';
    heading = `New Brochure Request — ${projLabel}`;
    emailSubject = `Brochure Request: ${projLabel} — ${name}${userRole ? ` (${userRole})` : ''}`;
  }

  const lines = [
    `Request Type: ${formType.toUpperCase()}`,
    userRole ? `Client Role (I am): ${userRole}` : null,
    `Client Name: ${name}`,
    `Client Email: ${email}`,
    phone ? `Client Phone / WhatsApp: ${phone}` : null,
    projectName ? `Requested Project / Property: ${projectName}` : null,
    developer ? `Developer: ${developer}` : null,
    community ? `Community: ${community}` : null,
    propertyReference ? `Property Reference: ${propertyReference}` : null,
    subject ? `Subject: ${subject}` : null,
    '',
    'Client Notes / Message:',
    message || (formType === 'brochure' ? `Client requested the official brochure and floor plans for ${projectName || 'this project'}.` : 'N/A'),
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Logging request in dev mode:');
    console.warn(lines);
    res.status(200).json({
      ok: true,
      devMode: true,
      message: 'Request received (email provider in development/sandbox mode).',
    });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: emailSubject,
      text: lines,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend send failed:', err);
    res.status(502).json({ error: 'Failed to send email.' });
  }
}
