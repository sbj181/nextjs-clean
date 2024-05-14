import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import resource from './resource'

export const schemaTypes = [post, resource, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, resource, blockContent],
}
