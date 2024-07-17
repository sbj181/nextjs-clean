import { FiBook,FiFileText, FiLayers, FiTag } from 'react-icons/fi';
import { defineField, defineType } from 'sanity'

import tag from './tag'; // Import the tag schema

export default defineType({
  name: 'resource',
  title: 'Resources',
  type: 'document',
  icon: FiLayers,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Enter the title of the resource.',
    }),
    defineField({
      name: 'slug',
      title: 'Link (URL)',
      type: 'slug',
      description: 'Press the generate button to create the link. You may also create your own.',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      rows: 4,
      description: 'This is the short description that appears in the resource card.',
      type: 'text',
    }),
    defineField({
      name: 'longDescription',
      title: 'Main Resource Description',
      description: 'This is where you can describe your resource in detail.',
      type: 'blockContent',
    }),
    defineField({
      name: 'mainImage',
      title: 'Resource Thumbnail',
      description: 'You may press Command+V to paste an image or screenshot which has been copied to clipboard. (Mac users can take a screenshot using Command-Control-Shift-4)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Categorize and group resources by selecting an existing tag below or by creating a new one.',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      name: 'resourceKind',
      title: 'What kind of resource are you adding?',
      type: 'string',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'File', value: 'file' },
        ],
        layout: 'radio', // Use radio buttons for better UX
      },
    }),
    defineField({
      name: 'BMSResourceLink',
      title: 'Resource Location Link',
      description: 'Paste the URL location or Share Link file URL here',
      type: 'url',
      hidden: ({ parent }) => parent.resourceKind !== 'website', // Conditionally hide this field
    }),
    defineField({
      name: 'fileUpload',
      title: 'Upload File',
      type: 'file',
      description: 'Upload the file if URL is not available',
      hidden: ({ parent }) => parent.resourceKind !== 'file', // Conditionally hide this field
    }),
    defineField({
      name: 'fileShareURL',
      title: 'File Share URL',
      type: 'url',
      description: 'Paste the share URL for the file here',
      hidden: ({ parent }) => parent.resourceKind !== 'file', // Conditionally hide this field
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'lastModified',
      title: 'Last Modified',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'description',
    },
    prepare(selection) {
      const { title, media, subtitle } = selection;
      return {
        title,
        media,
        subtitle,
      };
    },
  },
});
