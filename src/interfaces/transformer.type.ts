import { Event } from '../domain';

export type Transformer = (event: Event<any>) => Event<any>;

export interface TransformerRepo {
  [aggregate: string]: Transformer;
}
