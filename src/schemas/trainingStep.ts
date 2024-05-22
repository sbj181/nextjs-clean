import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'trainingStep',
  title: 'Training Step',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Enter the title of the training step.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Enter the detailed description of the training step.',
    }),
    defineField({
      name: 'stepNumber',
      title: 'Step Number',
      type: 'number',
      description: 'The order of this step in the training sequence.',
    }),
    defineField({
      name: 'relatedResource',
      title: 'Related Resource',
      type: 'reference',
      to: [{ type: 'resource' }],
      description: 'Link to a related resource if any.',
    }),
  ],
});
