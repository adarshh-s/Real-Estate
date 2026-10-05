import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Off-Plan Project',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Project Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'developer', title: 'Developer', type: 'string' }),
    defineField({ name: 'community', title: 'Community', type: 'string' }),
    defineField({
      name: 'tier',
      title: 'Internal Tier',
      type: 'string',
      options: { list: ['T1', 'T2', 'T3'] },
      description: 'Internal developer/project prioritisation tier used by the S I A Luxe team. Not shown to site visitors.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Launching Soon', 'Presale', 'Under Construction', 'Ready'] },
    }),
    defineField({ name: 'priceFromAED', title: 'Price From (AED)', type: 'number' }),
    defineField({
      name: 'paymentPlan',
      title: 'Payment Plan (%)',
      type: 'object',
      fields: [
        defineField({ name: 'onBooking', title: 'On Booking', type: 'number' }),
        defineField({ name: 'duringConstruction', title: 'During Construction', type: 'number' }),
        defineField({ name: 'onHandover', title: 'On Handover', type: 'number' }),
      ],
    }),
    defineField({ name: 'handover', title: 'Handover Date', type: 'string' }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
    defineField({ name: 'unitTypes', title: 'Unit Types', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'amenities', title: 'Amenities', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'brochure',
      title: 'Brochure (PDF File)',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Upload official developer brochure or fact sheet PDF directly to Sanity.',
    }),
    defineField({
      name: 'brochureUrl',
      title: 'Brochure URL / Hosted Path',
      type: 'string',
      description: 'Direct URL or path to hosted brochure PDF (e.g. /brochures/volga-tower.pdf).',
    }),
    defineField({
      name: 'transactions',
      title: 'DLD Transactions History',
      type: 'array',
      description: 'Official DLD registered transactions. If left empty, benchmark records will display automatically.',
      of: [
        {
          type: 'object',
          name: 'transaction',
          fields: [
            { name: 'date', title: 'Date (DD/MM/YYYY)', type: 'string' },
            { name: 'unitNumber', title: 'Unit Number', type: 'string' },
            { name: 'type', title: 'Type', type: 'string', options: { list: ['Primary', 'Resale'] }, initialValue: 'Primary' },
            { name: 'rooms', title: 'Rooms', type: 'number' },
            { name: 'procedure', title: 'Procedure', type: 'string', initialValue: 'Sales' },
            { name: 'areaSqm', title: 'Area (sqm)', type: 'number' },
            { name: 'priceAED', title: 'Price (AED)', type: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'showInActivity',
      title: 'Show in "Live Portfolio Activity"',
      type: 'boolean',
      initialValue: false,
      description: 'Shows this project in the scrolling activity feed on the homepage.',
    }),
    defineField({
      name: 'activityLabel',
      title: 'Activity Label',
      type: 'string',
      options: { list: ['Just Listed', 'Price Updated', 'Under Offer', 'New Match', 'Reserved', 'Sold Out'] },
      hidden: ({ document }) => !document?.showInActivity,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'developer', media: 'images.0', tier: 'tier' },
    prepare: ({ title, subtitle, media, tier }) => ({
      title,
      subtitle: tier ? `${subtitle} · ${tier}` : subtitle,
      media,
    }),
  },
});
