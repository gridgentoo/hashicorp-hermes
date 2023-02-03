/**
 * NOTE: This is a partial type definition.
 * We are defining it incrementally as we expand TS coverage.
 */
export interface HermesDocument {
  status: string;
  product?: string;
  modifiedAgo: string;
  modifiedTime: number;
  createdTime: number;
  docNumber: string;
  title: string;

  thumbnail?: string;
  _snippetResult?: {
    content: {
      value: string;
    };
  };
  readonly objectID: string;
}
