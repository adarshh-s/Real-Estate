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
  ],
  preview: {
    select: { title: 'name', subtitle: 'developer', media: 'images.0' },
  },
});
