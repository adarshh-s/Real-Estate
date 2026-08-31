import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sialuxe Real Estate Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
      S.divider(),
      S.documentTypeListItem('property').title('Properties'),
      S.documentTypeListItem('project').title('Off-Plan Projects'),
      S.documentTypeListItem('community').title('Communities'),
      S.documentTypeListItem('agent').title('Agents'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ]);
