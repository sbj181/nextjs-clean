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
      description: 'Click the generate button to create the training url automatically',
      options: {
        source: 'title',
        maxLength: 200, // Ensure slug is shorter than 200 characters
      },
    }),
    defineField({
      name: 'stepNumber',
      type: 'number',
      title: 'Step Number',
    }),
    defineField({
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'requiresMedia',
      type: 'boolean',
      title: 'Requires Media (Video or Image)',
    }),
    defineField({
      name: 'mediaType',
      type: 'string',
      title: 'Media Type',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Image', value: 'image' },
        ],
        layout: 'radio', // Display options as radio buttons
      },
      hidden: ({ parent }) => !parent?.requiresMedia, // Hide if requiresMedia is false
    }),
    defineField({
      name: 'TrainingVideoFile',
      description: 'Upload a brief MP4 video here.',
      type: 'file',
      title: 'Video File',
      hidden: ({ parent }) => parent?.mediaType !== 'video', // Hide if mediaType is not 'video'
    }),
    defineField({
      name: 'TrainingImageUrl',
      description: 'Upload an image or screenshot here.',
      type: 'image',
      title: 'Image',
      hidden: ({ parent }) => parent?.mediaType !== 'image', // Hide if mediaType is not 'image'
      options: {
        hotspot: true, // Enable image hotspot for better cropping
      },
    }),
    defineField({
      name: 'mediaTitle',
      type: 'string',
      title: 'Media Title',
      description: 'Enter a title for your Video or Image',
      hidden: ({ parent }) => !parent?.requiresMedia, // Hide if requiresMedia is false
    }),
    defineField({
      name: 'mediaCaption',
      type: 'text',
      rows: 4,
      title: 'Media Caption',
      description: 'Enter a caption or short description for your Video or Image',
      hidden: ({ parent }) => !parent?.requiresMedia, // Hide if requiresMedia is false
    }),
    defineField({
      name: 'relatedResources',
      description: 'Are there resources such as a PDF download or an external website related to this training? Choose them here to help users access them quickly.',
      type: 'array',
      title: 'Related Resources',
      of: [{ type: 'reference', to: { type: 'resource' } }],
    }),
  ],
});
