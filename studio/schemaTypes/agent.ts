import { defineField, defineType } from 'sanity';

export const agent = defineType({
  name: 'agent',
  title: 'Agent',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', title: 'Job Title', type: 'string' }),
    defineField({ name: 'photo', title: 'Headshot', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp Number', type: 'string', description: 'Digits only, e.g. 971501234567' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'languages', title: 'Languages', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'specialties', title: 'Specialties', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({ name: 'listingsCount', title: 'Listings Count', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'photo' },
  },
});
