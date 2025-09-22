export type CitationType = 'inline' | 'footnote' | 'endnote';

export type SourceReliability = 'high' | 'medium' | 'low' | 'unknown';

export type AttachmentType = 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'other';

export type ExportFormat = 'pdf' | 'markdown' | 'html' | 'png' | 'jpg' | 'svg';

export type ExportStatus = 'idle' | 'preparing' | 'exporting' | 'completed' | 'error';

export type Citation = {
  id: string;
  text: string;
  sourceId: string;
  page?: number;
  line?: number;
  position: number; // Position in the text
  type: CitationType;
};

export type Source = {
  id: string;
  title: string;
  author?: string;
  url?: string;
  date?: string;
  relevance: number; // 0-100
  reliability: SourceReliability;
  description?: string;
  citations: Citation[];
  metadata?: Record<string, unknown>;
};

export type Attachment = {
  id: string;
  name: string;
  type: AttachmentType;
  url: string;
  size?: number; // in bytes
  thumbnailUrl?: string;
  mimeType: string;
  status: 'loading' | 'ready' | 'error';
  errorMessage?: string;
  metadata?: Record<string, unknown>;
};

export type ExportOptions = {
  format: ExportFormat;
  includeSources: boolean;
  includeAttachments: boolean;
  includeMetadata: boolean;
  customTitle?: string;
  customAuthor?: string;
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  quality?: number; // for image exports
  scale?: number; // for image exports
};

export type ExportResult = {
  url: string;
  filename: string;
  size: number;
  format: ExportFormat;
};

export type CitationsProps = {
  citations: Citation[];
  sources: Source[];
  onCitationClick?: (citation: Citation) => void;
  onSourceClick?: (source: Source) => void;
  showInline?: boolean;
  showPopover?: boolean;
};

export type SourcesListProps = {
  sources: Source[];
  expanded?: boolean;
  onToggle?: () => void;
  onSourceClick?: (source: Source) => void;
  onFilter?: (filter: SourceFilter) => void;
  onSort?: (sort: SourceSort) => void;
  showMetadata?: boolean;
  showRelevance?: boolean;
  showReliability?: boolean;
};

export type AttachmentsProps = {
  attachments: Attachment[];
  onDownload?: (attachment: Attachment) => void;
  onPreview?: (attachment: Attachment) => void;
  showThumbnails?: boolean;
  showStatus?: boolean;
  maxItems?: number;
};

export type ExportProps = {
  content: string;
  sources?: Source[];
  attachments?: Attachment[];
  options: ExportOptions;
  onExport?: (result: ExportResult) => void;
  onPreview?: (preview: string) => void;
  showPreview?: boolean;
};

export type SourceFilter = {
  reliability?: SourceReliability[];
  relevanceMin?: number;
  relevanceMax?: number;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
};

export type SourceSort = {
  field: 'title' | 'author' | 'date' | 'relevance' | 'reliability';
  direction: 'asc' | 'desc';
};