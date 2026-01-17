import type { ServiceBlockData } from '../types/blocks';

// Default roofing services for the library
export const DEFAULT_SERVICES: ServiceBlockData[] = [
  {
    title: 'Bitumen Dakbedekking',
    description: 'Volledige vervanging van bitumen dakbedekking inclusief onderlaag',
    items: [
      'Verwijderen oude dakbedekking',
      'Controle en reparatie ondergrond',
      'Nieuwe APP/SBS bitumen dakbedekking',
      'Waterdichte afwerking randen',
    ],
    price: 65,
    quantity: 1,
    unit: 'm²',
    category: 'dakbedekking',
  },
  {
    title: 'Pannendak Renovatie',
    description: 'Complete renovatie van pannendak inclusief nieuwe pannen en onderdelen',
    items: [
      'Verwijderen oude dakpannen',
      'Controle en vervanging tengels/panlatten',
      'Nieuwe betonnen/keramische dakpannen',
      'Nokvorsten en hulpstukken',
    ],
    price: 85,
    quantity: 1,
    unit: 'm²',
    category: 'renovatie',
  },
  {
    title: 'Dakgoot Vervanging',
    description: 'Nieuwe aluminium dakgoten met beugels en afvoeren',
    items: [
      'Verwijderen oude dakgoten',
      'Nieuwe aluminium bakgoot',
      'RVS gootbeugels',
      'Hemelwaterafvoer aansluiting',
    ],
    price: 45,
    quantity: 1,
    unit: 'meter',
    category: 'hemelwaterafvoer',
  },
  {
    title: 'Dakisolatie PIR',
    description: 'PIR isolatieplaten met hoge R-waarde voor optimale warmte-isolatie',
    items: [
      'PIR isolatieplaten 120mm (Rc 5.5)',
      'Dampremmer',
      'Luchtdichte afwerking',
      'Inclusief bevestiging',
    ],
    price: 55,
    quantity: 1,
    unit: 'm²',
    category: 'isolatie',
  },
  {
    title: 'Loodwerk Schoorsteen',
    description: 'Professioneel loodwerk rond schoorstenen en dakranden',
    items: [
      'Verwijderen oud loodwerk',
      'Nieuw lood code 25/30',
      'Soldeer verbindingen',
      'Kitafwerking',
    ],
    price: 125,
    quantity: 1,
    unit: 'meter',
    category: 'loodwerk',
  },
];

// Default text templates
export const DEFAULT_TEXT_TEMPLATES = [
  {
    variant: 'terms' as const,
    content: 'Deze offerte is 30 dagen geldig. Prijzen zijn exclusief BTW tenzij anders vermeld. Betaling binnen 14 dagen na factuurdatum.',
  },
  {
    variant: 'disclaimer' as const,
    content: 'Bovenstaande prijzen zijn gebaseerd op de huidige situatie. Onvoorziene omstandigheden kunnen leiden tot meerwerk.',
  },
  {
    variant: 'note' as const,
    content: 'Werkzaamheden worden uitgevoerd volgens de geldende normen en richtlijnen. Garantie conform fabrikantspecificaties.',
  },
];

// Quote number generation
export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `OFF-${year}-${random}`;
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, locale: string = 'nl-NL'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Calculate VAT
export function calculateVAT(subtotal: number, vatRate: number = 21): number {
  return subtotal * (vatRate / 100);
}
