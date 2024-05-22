import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'trainingStep',
  title: 'Training Step',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{ type: 'block' }],
    },
    {
      name: 'stepNumber',
      type: 'number',
      title: 'Step Number',
    },
    {
      name: 'relatedResources',
      type: 'array',
      title: 'Related Resources',
      of: [{ type: 'reference', to: [{ type: 'resource' }] }],
    },
  ],
});
