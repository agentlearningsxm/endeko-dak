// ============================================
// BLOCK TYPE DEFINITIONS
// ============================================

export type BlockType = 'service' | 'image' | 'text' | 'section';

export interface BaseBlock {
  id: string;
  type: BlockType;
  createdAt: string;
}

// ============ SERVICE BLOCK ============
export type ServiceCategory =
  | 'dakbedekking'
  | 'groen-dak'
  | 'hemelwaterafvoer'
  | 'inspectie'
  | 'isolatie'
  | 'loodwerk'
  | 'renovatie'
  | 'reparatie'
  | 'zinkwerk'
  | 'overig';

export type ServiceUnit = 'm²' | 'stuks' | 'uur' | 'meter' | 'forfait';

export interface ServiceBlockData {
  title: string;
  description: string;
  items: string[]; // Bullet points
  price: number;
  quantity: number;
  unit: ServiceUnit;
  category: ServiceCategory;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
}

export interface ServiceBlock extends BaseBlock {
  type: 'service';
  data: ServiceBlockData;
}

// ============ IMAGE BLOCK ============
export type ImageWidth = 'full' | 'half' | 'third';
export type ImageAlignment = 'left' | 'center' | 'right';

export interface ImageBlockData {
  src: string; // base64 or URL
  alt: string;
  caption: string;
  width: ImageWidth;
  alignment: ImageAlignment;
  fileName?: string;
  fileSize?: number;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: ImageBlockData;
}

// ============ TEXT BLOCK ============
export type TextVariant = 'paragraph' | 'heading' | 'note' | 'terms' | 'disclaimer';
export type TextAlignment = 'left' | 'center' | 'right';
export type TextSize = 'small' | 'normal' | 'large';

export interface TextBlockData {
  content: string;
  variant: TextVariant;
  alignment?: TextAlignment;
  fontSize?: TextSize;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  data: TextBlockData;
}

// ============ SECTION BLOCK ============
export interface SectionBlockData {
  title: string;
  showDivider: boolean;
}

export interface SectionBlock extends BaseBlock {
  type: 'section';
  data: SectionBlockData;
}

// ============ UNION TYPE ============
export type Block = ServiceBlock | ImageBlock | TextBlock | SectionBlock;

// ============ CLIENT DETAILS ============
export interface ClientDetails {
  name: string;
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
}

// ============ QUOTE ============
export type QuoteTemplate = 'modern' | 'classy' | 'technical' | 'compact';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quote {
  id: string;
  number: string;
  clientDetails: ClientDetails;
  blocks: Block[];
  template: QuoteTemplate;
  templateBackgroundImage: string | null;
  status: QuoteStatus;
  validityDays: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ============ SAVED IMAGE ============
export interface SavedImage {
  id: string;
  src: string;
  name: string;
  uploadedAt: string;
}

// ============ SAVED TEMPLATE ============
export interface SavedTemplate {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

// ============ COMPANY SETTINGS ============
export interface CompanySettings {
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  kvkNumber: string;
  btwNumber: string;
  bankAccount: string;
  logoBase64: string | null;
}

// ============ APP SETTINGS ============
export type Language = 'nl' | 'en';

export interface AppSettings {
  language: Language;
  currency: 'EUR';
  vatRate: number;
  defaultTemplate: QuoteTemplate;
  autoSaveInterval: number;
}

// ============ FACTORY FUNCTIONS ============
export function createServiceBlock(data: Partial<ServiceBlockData> = {}): ServiceBlock {
  return {
    id: crypto.randomUUID(),
    type: 'service',
    createdAt: new Date().toISOString(),
    data: {
      title: data.title || '',
      description: data.description || '',
      items: data.items || [],
      price: data.price || 0,
      quantity: data.quantity || 1,
      unit: data.unit || 'stuks',
      category: data.category || 'overig',
      ...data,
    },
  };
}

export function createImageBlock(data: Partial<ImageBlockData> = {}): ImageBlock {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    createdAt: new Date().toISOString(),
    data: {
      src: data.src || '',
      alt: data.alt || '',
      caption: data.caption || '',
      width: data.width || 'full',
      alignment: data.alignment || 'center',
      ...data,
    },
  };
}

export function createTextBlock(data: Partial<TextBlockData> = {}): TextBlock {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    createdAt: new Date().toISOString(),
    data: {
      content: data.content || '',
      variant: data.variant || 'paragraph',
      alignment: data.alignment || 'left',
      fontSize: data.fontSize || 'normal',
    },
  };
}

export function createSectionBlock(data: Partial<SectionBlockData> = {}): SectionBlock {
  return {
    id: crypto.randomUUID(),
    type: 'section',
    createdAt: new Date().toISOString(),
    data: {
      title: data.title || '',
      showDivider: data.showDivider ?? true,
    },
  };
}

export function createBlock(type: BlockType, data: Partial<Block['data']> = {}): Block {
  switch (type) {
    case 'service':
      return createServiceBlock(data as Partial<ServiceBlockData>);
    case 'image':
      return createImageBlock(data as Partial<ImageBlockData>);
    case 'text':
      return createTextBlock(data as Partial<TextBlockData>);
    case 'section':
      return createSectionBlock(data as Partial<SectionBlockData>);
  }
}
