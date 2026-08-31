import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('S I A Luxe Real Estate Content')
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
      S.divider(),
      S.documentTypeListItem('article').title('Journal Articles'),
    ]);
