'use client';

import { useState } from 'react';
import type { SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';
import { InvoiceUploader } from '@/components/invoice/invoice-uploader';
import { InvoiceDataDisplay } from '@/components/invoice/invoice-data-display';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [extractedData, setExtractedData] = useState<SmartDataExtractionOutput | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false); // For overall page processing state

  const handleDataExtracted = (data: SmartDataExtractionOutput, fileName: string) => {
    setExtractedData(data);
    setCurrentFileName(fileName);
    setIsProcessing(false); // Reset processing state after extraction is done
  };

  const handleInvoiceSaved = () => {
    setExtractedData(null); // Clear data after saving
    setCurrentFileName('');
    // Potentially reset file input in InvoiceUploader, or let user select new file
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-2">
      <InvoiceUploader onDataExtracted={handleDataExtracted} isProcessing={isProcessing} />

      {extractedData && currentFileName && (
        <>
          <Separator className="my-8" />
          <InvoiceDataDisplay
            extractedData={extractedData}
            fileName={currentFileName}
            onInvoiceSaved={handleInvoiceSaved}
          />
        </>
      )}
    </div>
  );
}
