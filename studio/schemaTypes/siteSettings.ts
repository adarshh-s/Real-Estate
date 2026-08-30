import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Homepage Hero' },
    { name: 'interstitial', title: 'Cinematic Video Section' },
    { name: 'contact', title: 'Contact Info' },
  ],
  fields: [
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      options: { accept: 'video/mp4' },
      description: 'The full-screen video behind the homepage headline. Keep it under ~15MB and 30-40s long for fast loading — compress with HandBrake or similar before uploading.',
      group: 'hero',
    }),
    defineField({ name: 'heroPoster', title: 'Hero Poster Image', type: 'image', description: 'Shown while the video loads.', group: 'hero' }),
    defineField({ name: 'heroKicker', title: 'Hero Kicker Text', type: 'string', initialValue: 'Dubai · International Realty', group: 'hero' }),
    defineField({ name: 'heroHeadlineLine1', title: 'Hero Headline — Line 1', type: 'string', initialValue: 'Extraordinary addresses,', group: 'hero' }),
    defineField({ name: 'heroHeadlineLine2', title: 'Hero Headline — Line 2', type: 'string', initialValue: 'for an extraordinary city.', group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', rows: 3, group: 'hero' }),
    defineField({
      name: 'interstitialVideo',
      title: 'Cinematic Section Video',
      type: 'file',
      options: { accept: 'video/mp4' },
      description: 'The second video, shown lower on the homepage between New Developments and Communities.',
      group: 'interstitial',
    }),
    defineField({ name: 'interstitialHeadline', title: 'Cinematic Section Headline', type: 'string', group: 'interstitial' }),
    defineField({ name: 'interstitialBody', title: 'Cinematic Section Body', type: 'text', rows: 3, group: 'interstitial' }),
    defineField({ name: 'contactPhone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({ name: 'contactEmail', title: 'Email', type: 'string', group: 'contact' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string', description: 'Digits only, e.g. 971501234567', group: 'contact' }),
    defineField({ name: 'officeAddress', title: 'Office Address', type: 'string', group: 'contact' }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
