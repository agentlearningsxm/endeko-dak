import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Quote, CompanySettings, Block, ServiceBlock, ImageBlock, TextBlock, SectionBlock } from '../../types/blocks';

interface QuoteDocumentProps {
  quote: Quote;
  company: CompanySettings;
  totals: { subtotal: number; vat: number; total: number };
  vatRate: number;
}

// Format currency for PDF
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Format date for PDF
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Get styles based on template
const getStyles = (template: Quote['template']) => {
  const baseStyles = {
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 30,
      paddingBottom: 15,
      borderBottomWidth: 2,
      borderBottomColor: '#0ea5e9',
    },
    companyInfo: {
      maxWidth: 200,
    },
    companyName: {
      fontSize: 16,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 4,
      color: '#1a1a1a',
    },
    companyDetails: {
      fontSize: 9,
      color: '#666666',
      lineHeight: 1.4,
    },
    quoteInfo: {
      textAlign: 'right' as const,
    },
    quoteTitle: {
      fontSize: 24,
      fontFamily: 'Helvetica-Bold',
      color: '#0ea5e9',
      marginBottom: 8,
    },
    quoteNumber: {
      fontSize: 11,
      color: '#333333',
      marginBottom: 4,
    },
    clientSection: {
      marginBottom: 25,
      padding: 15,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#0ea5e9',
      marginBottom: 8,
    },
    clientText: {
      fontSize: 10,
      color: '#333333',
      lineHeight: 1.5,
    },
    serviceBlock: {
      marginBottom: 15,
      padding: 12,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderRadius: 4,
    },
    serviceTitle: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    serviceDescription: {
      fontSize: 9,
      color: '#666666',
      marginBottom: 8,
    },
    serviceItems: {
      marginBottom: 8,
    },
    serviceItem: {
      fontSize: 9,
      color: '#444444',
      marginBottom: 2,
    },
    servicePricing: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
    },
    servicePrice: {
      fontSize: 10,
      color: '#666666',
    },
    serviceTotal: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#0ea5e9',
    },
    imageBlock: {
      marginBottom: 15,
    },
    imageCaption: {
      fontSize: 9,
      color: '#666666',
      textAlign: 'center' as const,
      marginTop: 4,
    },
    textBlock: {
      marginBottom: 15,
    },
    paragraph: {
      fontSize: 10,
      color: '#333333',
      lineHeight: 1.5,
    },
    heading: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    note: {
      fontSize: 9,
      color: '#666666',
      padding: 10,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    },
    terms: {
      fontSize: 8,
      color: '#888888',
    },
    sectionDivider: {
      marginVertical: 15,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
    },
    sectionBlockTitle: {
      fontSize: 13,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
    },
    totalsSection: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    },
    totalsRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 6,
    },
    totalsLabel: {
      fontSize: 10,
      color: '#666666',
    },
    totalsValue: {
      fontSize: 10,
      color: '#333333',
    },
    totalsFinal: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      paddingTop: 10,
      marginTop: 10,
      borderTopWidth: 2,
      borderTopColor: '#0ea5e9',
    },
    totalsFinalLabel: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
    },
    totalsFinalValue: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#0ea5e9',
    },
    footer: {
      position: 'absolute' as const,
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center' as const,
      fontSize: 8,
      color: '#999999',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
    },
  };

  // Template variations
  if (template === 'classy') {
    return {
      ...baseStyles,
      header: {
        ...baseStyles.header,
        borderBottomColor: '#b8860b',
      },
      quoteTitle: {
        ...baseStyles.quoteTitle,
        color: '#b8860b',
        fontSize: 20,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        color: '#b8860b',
      },
      serviceTotal: {
        ...baseStyles.serviceTotal,
        color: '#b8860b',
      },
      totalsFinal: {
        ...baseStyles.totalsFinal,
        borderTopColor: '#b8860b',
      },
      totalsFinalValue: {
        ...baseStyles.totalsFinalValue,
        color: '#b8860b',
      },
    };
  }

  if (template === 'technical') {
    return {
      ...baseStyles,
      page: {
        ...baseStyles.page,
        fontSize: 9,
      },
      serviceBlock: {
        ...baseStyles.serviceBlock,
        backgroundColor: '#fafafa',
      },
    };
  }

  if (template === 'compact') {
    return {
      ...baseStyles,
      page: {
        ...baseStyles.page,
        padding: 30,
        fontSize: 9,
      },
      serviceBlock: {
        ...baseStyles.serviceBlock,
        padding: 8,
        marginBottom: 8,
      },
      clientSection: {
        ...baseStyles.clientSection,
        padding: 10,
        marginBottom: 15,
      },
    };
  }

  return baseStyles;
};

export function QuoteDocument({ quote, company, totals, vatRate }: QuoteDocumentProps) {
  const styles = StyleSheet.create(getStyles(quote.template));

  const validityDate = new Date(quote.createdAt);
  validityDate.setDate(validityDate.getDate() + quote.validityDays);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {company.logoBase64 && (
              <Image src={company.logoBase64} style={{ width: 100, height: 40, marginBottom: 8 }} />
            )}
            <Text style={styles.companyName}>{company.companyName || 'Uw Bedrijf'}</Text>
            <Text style={styles.companyDetails}>
              {company.address && `${company.address}\n`}
              {company.postalCode && company.city && `${company.postalCode} ${company.city}\n`}
              {company.phone && `Tel: ${company.phone}\n`}
              {company.email && `${company.email}`}
            </Text>
          </View>

          <View style={styles.quoteInfo}>
            <Text style={styles.quoteTitle}>OFFERTE</Text>
            <Text style={styles.quoteNumber}>{quote.number}</Text>
            <Text style={styles.quoteNumber}>Datum: {formatDate(quote.createdAt)}</Text>
            <Text style={styles.quoteNumber}>Geldig tot: {formatDate(validityDate.toISOString())}</Text>
          </View>
        </View>

        {/* Client Details */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Aan:</Text>
          <Text style={styles.clientText}>
            {quote.clientDetails.companyName && `${quote.clientDetails.companyName}\n`}
            {quote.clientDetails.name && `t.a.v. ${quote.clientDetails.name}\n`}
            {quote.clientDetails.address && `${quote.clientDetails.address}\n`}
            {quote.clientDetails.postalCode && quote.clientDetails.city &&
              `${quote.clientDetails.postalCode} ${quote.clientDetails.city}\n`}
            {quote.clientDetails.email && `${quote.clientDetails.email}`}
          </Text>
        </View>

        {/* Blocks */}
        {quote.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} styles={styles} />
        ))}

        {/* Totals */}
        {quote.blocks.some((b) => b.type === 'service') && (
          <View style={styles.totalsSection}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotaal</Text>
              <Text style={styles.totalsValue}>{formatCurrency(totals.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>BTW ({vatRate}%)</Text>
              <Text style={styles.totalsValue}>{formatCurrency(totals.vat)}</Text>
            </View>
            <View style={styles.totalsFinal}>
              <Text style={styles.totalsFinalLabel}>Totaal (incl. BTW)</Text>
              <Text style={styles.totalsFinalValue}>{formatCurrency(totals.total)}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            {company.companyName}
            {company.kvkNumber && ` | KVK: ${company.kvkNumber}`}
            {company.btwNumber && ` | BTW: ${company.btwNumber}`}
            {company.bankAccount && ` | IBAN: ${company.bankAccount}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// Block renderer component
function BlockRenderer({ block, styles }: { block: Block; styles: ReturnType<typeof StyleSheet.create> }) {
  switch (block.type) {
    case 'service':
      return <ServiceBlockPDF block={block} styles={styles} />;
    case 'image':
      return <ImageBlockPDF block={block} styles={styles} />;
    case 'text':
      return <TextBlockPDF block={block} styles={styles} />;
    case 'section':
      return <SectionBlockPDF block={block} styles={styles} />;
    default:
      return null;
  }
}

function ServiceBlockPDF({ block, styles }: { block: ServiceBlock; styles: ReturnType<typeof StyleSheet.create> }) {
  const { data } = block;
  const lineTotal = data.price * data.quantity;

  return (
    <View style={styles.serviceBlock}>
      <Text style={styles.serviceTitle}>{data.title}</Text>
      {data.description && <Text style={styles.serviceDescription}>{data.description}</Text>}

      {data.items.length > 0 && (
        <View style={styles.serviceItems}>
          {data.items.map((item, idx) => (
            <Text key={idx} style={styles.serviceItem}>• {item}</Text>
          ))}
        </View>
      )}

      <View style={styles.servicePricing}>
        <Text style={styles.servicePrice}>
          {data.quantity} {data.unit} × {formatCurrency(data.price)}
        </Text>
        <Text style={styles.serviceTotal}>{formatCurrency(lineTotal)}</Text>
      </View>
    </View>
  );
}

function ImageBlockPDF({ block, styles }: { block: ImageBlock; styles: ReturnType<typeof StyleSheet.create> }) {
  const { data } = block;

  const widthMap = { full: '100%', half: '50%', third: '33%' };
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };

  return (
    <View style={[styles.imageBlock, { alignItems: alignMap[data.alignment] as 'flex-start' | 'center' | 'flex-end' }]}>
      {data.src && (
        <Image
          src={data.src}
          style={{ width: widthMap[data.width], maxHeight: 200 }}
        />
      )}
      {data.caption && <Text style={styles.imageCaption}>{data.caption}</Text>}
    </View>
  );
}

function TextBlockPDF({ block, styles }: { block: TextBlock; styles: ReturnType<typeof StyleSheet.create> }) {
  const { data } = block;

  const getVariantStyle = () => {
    switch (data.variant) {
      case 'heading':
        return styles.heading;
      case 'note':
        return styles.note;
      case 'terms':
      case 'disclaimer':
        return styles.terms;
      default:
        return styles.paragraph;
    }
  };

  return (
    <View style={styles.textBlock}>
      <Text style={getVariantStyle()}>{data.content}</Text>
    </View>
  );
}

function SectionBlockPDF({ block, styles }: { block: SectionBlock; styles: ReturnType<typeof StyleSheet.create> }) {
  const { data } = block;

  return (
    <View style={styles.sectionDivider}>
      <Text style={styles.sectionBlockTitle}>{data.title}</Text>
    </View>
  );
}
