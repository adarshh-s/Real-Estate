import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / Location', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
});
