import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'training',
  title: 'Training',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Enter the title of the training.',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trainingStep' }] }],
      description: 'List of training steps.',
    }),
  ],
});
