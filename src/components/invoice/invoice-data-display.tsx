// src/components/invoice/invoice-data-display.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { saveInvoiceToStorage } from '@/lib/invoice-storage';
import type { StoredInvoice } from '@/lib/types';
import type { SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';
import { Building, CalendarDays, DollarSign, FileText, List, User, Package, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InvoiceDataDisplayProps {
  extractedData: SmartDataExtractionOutput;
  fileName: string;
  onInvoiceSaved: () => void;
  clientId: string;
  clientDni: string;
}

export function InvoiceDataDisplay({
  extractedData,
  fileName,
  onInvoiceSaved,
  clientId,
  clientDni,
}: InvoiceDataDisplayProps) {
  const { toast } = useToast();

  const handleSaveInvoice = () => {
    const newInvoice: StoredInvoice = {
      ...extractedData,
      id: crypto.randomUUID(),
      fileName,
      uploadDate: new Date().toISOString(),
      clientId,
      clientDni,
    };
    saveInvoiceToStorage(newInvoice);
    toast({ title: 'Invoice Saved', description: `Invoice "${fileName}" has been saved successfully for client DNI ${clientDni}.` });
    onInvoiceSaved();
  };

  const renderDetailItem = (icon: React.ReactNode, label: string, value?: string | number | string[] | boolean) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    return (
      <div className="flex items-start space-x-3 py-2">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {Array.isArray(value) ? (
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {value.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          ) : typeof value === 'boolean' ? (
             <Badge variant={value ? "default" : "secondary"}>{value ? 'Yes' : 'No'}</Badge>
          ) : (
            <p className="text-sm text-muted-foreground">{String(value)}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Extracted Invoice Data
        </CardTitle>
        <CardDescription>Review the extracted information for client DNI: <span className="font-semibold">{clientDni}</span>.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4"> {/* Reduced height slightly */}
          <div className="space-y-3">
            {renderDetailItem(<FileText size={20} />, 'Invoice Number', extractedData.invoiceNumber)}
            {renderDetailItem(<CalendarDays size={20} />, 'Invoice Date', extractedData.invoiceDate)}
            <Separator />
            {renderDetailItem(<User size={20} />, 'Client Details', extractedData.clientDetails)}
            <Separator />
            {renderDetailItem(<Building size={20} />, 'Company Details', extractedData.companyDetails)}
            <Separator />
            {renderDetailItem(<List size={20} />, 'Items', extractedData.items)}
            <Separator />
            {renderDetailItem(<DollarSign size={20} />, 'Total Amount', extractedData.totalAmount?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }))}
            <Separator />
            {renderDetailItem(<Tag size={20} />, 'Add Category Details?', extractedData.shouldAddCategory)}
            {extractedData.shouldAddCategory && renderDetailItem(<Package size={20} />, 'Category Details', extractedData.categoryDetails)}
          </div>
        </ScrollArea>
        
        <Separator className="my-6" />

        <Button onClick={handleSaveInvoice} className="w-full sm:w-auto">Save Invoice</Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          File: {fileName}
        </p>
      </CardFooter>
    </Card>
  );
}
