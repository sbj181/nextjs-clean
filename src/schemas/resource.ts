import { defineField, defineType } from 'sanity'
import CustomStringInput from './../components/CustomStringInput';
import tag from './tag'; // Import the tag schema


export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Enter the title of the resource.',
      /* components: {
        input: CustomStringInput, // Use custom input component
      }, */
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
      title: 'Description',
      rows: 4,
      description: 'This is the short description that appears in tbe resource card.',
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
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'lastModified',
      title: 'Last Modified',
      type: 'string',
    }),
    defineField({
      name: 'BMSResourceLink',
      title: 'Resource Location Link',
      description: 'Paste the URL location or Share Link file URL here',
      type: 'url',
    }),
   
    
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'description'
    },
    prepare(selection) {
      const { title, media, subtitle } = selection
      return {
        title,
        media,
        subtitle
      }
    },
  },
})
