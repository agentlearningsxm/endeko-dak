import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Loader2 } from 'lucide-react';
import { useQuoteStore } from '../../stores/quoteStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { QuoteDocument } from '../pdf/QuoteDocument';

export function PDFViewer() {
  const { currentQuote, getQuoteTotals } = useQuoteStore();
  const { company, app } = useSettingsStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totals = getQuoteTotals();

  // Generate PDF when quote changes
  useEffect(() => {
    let isMounted = true;

    const generatePdf = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const doc = (
          <QuoteDocument
            quote={currentQuote}
            company={company}
            totals={totals}
            vatRate={app.vatRate}
          />
        );

        const blob = await pdf(doc).toBlob();

        if (isMounted) {
          // Revoke previous URL
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }

          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      } catch (err) {
        console.error('PDF generation error:', err);
        if (isMounted) {
          setError('Fout bij genereren PDF');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Debounce PDF generation
    const timeoutId = setTimeout(generatePdf, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [currentQuote, company, app.vatRate]);

  // Handle download event
  useEffect(() => {
    const handleDownload = () => {
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${currentQuote.number}.pdf`;
        link.click();
      }
    };

    window.addEventListener('downloadPdf', handleDownload);
    return () => window.removeEventListener('downloadPdf', handleDownload);
  }, [pdfUrl, currentQuote.number]);

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-white/40">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading && !pdfUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute top-2 right-2 z-10">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
      )}

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title="PDF Preview"
        />
      )}
    </div>
  );
}
