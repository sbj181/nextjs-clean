import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'trainingStep',
  title: 'Training Step',
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
        maxLength: 200, // Ensure slug is shorter than 200 characters
      },
    }),
    defineField({
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'stepNumber',
      type: 'number',
      title: 'Step Number',
    }),
    defineField({
      name: 'relatedResources',
      type: 'array',
      title: 'Related Resources',
      of: [{ type: 'reference', to: { type: 'resource' } }],
    }),
  ],
});
