import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import resource from './resource'
import tag from './tag'

export const schemaTypes = [post, tag, resource, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, tag, resource, blockContent],
}
