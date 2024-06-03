import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'training',
  title: 'Training',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        slugify: (input) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 200), // Ensure slug is shorter than 200 characters
        isUnique: (slug, context) => context.defaultIsUnique(slug, context),
      },
    }),
    defineField({
      name: 'steps',
      type: 'array',
      title: 'Steps',
      of: [{ type: 'reference', to: { type: 'trainingStep' } }],
    }),
  ],
});
