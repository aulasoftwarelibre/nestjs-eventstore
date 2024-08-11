import { Event } from '../domain'

export type Transformer = (event: Event) => Event

export interface TransformerRepo {
  [aggregate: string]: Transformer
}
