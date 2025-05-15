'use client';

import { useState } from 'react';
import type { SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';
import type { Client } from '@/lib/types';
import { ClientSelector } from '@/components/invoice/client-selector';
import { InvoiceUploader } from '@/components/invoice/invoice-uploader';
import { InvoiceDataDisplay } from '@/components/invoice/invoice-data-display';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type HomePageStep = 'client_selection' | 'invoice_upload' | 'data_display';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<HomePageStep>('client_selection');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [extractedData, setExtractedData] = useState<SmartDataExtractionOutput | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const handleClientSelected = (client: Client) => {
    setSelectedClient(client);
    setCurrentStep('invoice_upload');
  };

  const handleDataExtracted = (data: SmartDataExtractionOutput, fileName: string) => {
    setExtractedData(data);
    setCurrentFileName(fileName);
    setCurrentStep('data_display');
  };

  const handleInvoiceSaved = () => {
    setExtractedData(null);
    setCurrentFileName('');
    setCurrentStep('invoice_upload'); 
  };

  const handleBackToClientSelection = () => {
    setSelectedClient(null);
    setExtractedData(null);
    setCurrentFileName('');
    setCurrentStep('client_selection');
  };
  
  const handleBackToUpload = () => {
    setExtractedData(null);
    setCurrentFileName('');
    setCurrentStep('invoice_upload');
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-2">
      {currentStep !== 'client_selection' && selectedClient && (
        <Button variant="outline" onClick={currentStep === 'invoice_upload' ? handleBackToClientSelection : handleBackToUpload} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a {currentStep === 'invoice_upload' ? 'Selección de Cliente' : 'Subir Factura'}
        </Button>
      )}

      {currentStep === 'client_selection' && (
        <ClientSelector onClientSelected={handleClientSelected} />
      )}

      {currentStep === 'invoice_upload' && selectedClient && (
        <>
          <p className="mb-4 text-lg">
            Cliente Seleccionado: <span className="font-semibold">{selectedClient.name} (DNI: {selectedClient.dni})</span>
          </p>
          <InvoiceUploader onDataExtracted={handleDataExtracted} />
        </>
      )}

      {currentStep === 'data_display' && selectedClient && extractedData && (
        <>
          <p className="mb-4 text-lg">
            Factura para Cliente: <span className="font-semibold">{selectedClient.name} (DNI: {selectedClient.dni})</span>
          </p>
          <InvoiceDataDisplay
            extractedData={extractedData}
            fileName={currentFileName}
            onInvoiceSaved={handleInvoiceSaved}
            clientId={selectedClient.id}
            clientDni={selectedClient.dni}
          />
        </>
      )}
    </div>
  );
}
