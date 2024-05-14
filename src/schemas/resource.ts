import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Link (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'mainImage',
      title: 'Image Source',
      type: 'image',
      options: {
        hotspot: true,
      },
    }), 
    defineField({
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'viewDetailsButtonText',
      title: 'View Details Button Text',
      type: 'string',
    }),
    defineField({
      name: 'shareButtonText',
      title: 'Share Button Text',
      type: 'string',
    }),
    defineField({
      name: 'resourceDetailsLink',
      title: 'Resource Details Link',
      type: 'url',
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
      title: 'BMS Resource Link',
      type: 'url',
    }),
    defineField({
      name: 'PfizerResourceLink',
      title: 'Pfizer Resource Link',
      type: 'url',
    }),
    defineField({
      name: 'RelatedResources',
      title: 'Related Resources',
      type: 'object',
      fields: [
        defineField({
          name: 'tags',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Tags'
        }),
        defineField({
          name: 'titles',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Titles'
        }),
      ],
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
