import { defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Journal Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Market Insight', 'Buying Guide', 'Neighborhood Guide', 'Off-Plan', 'Lifestyle'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Optional — extra photos shown as a gallery within the article. Leave empty if not needed.',
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 2, description: 'Short teaser shown on the Journal index and article cards.', validation: (r) => r.required().max(220) }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 14, description: 'Separate paragraphs with a blank line.', validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'agent' }] }),
    defineField({ name: 'publishedAt', title: 'Published Date', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'readMinutes', title: 'Read Time (minutes)', type: 'number' }),
    defineField({ name: 'featured', title: 'Featured on Journal', type: 'boolean', initialValue: false, description: 'Shown as the large lead story at the top of the Journal.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
});
