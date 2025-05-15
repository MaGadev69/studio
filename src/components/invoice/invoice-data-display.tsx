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
    toast({ title: 'Factura Guardada', description: `La factura "${fileName}" ha sido guardada exitosamente para el cliente con DNI ${clientDni}.` });
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
             <Badge variant={value ? "default" : "secondary"}>{value ? 'Sí' : 'No'}</Badge>
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
          Datos de Factura Extraídos
        </CardTitle>
        <CardDescription>Revisa la información extraída para el cliente con DNI: <span className="font-semibold">{clientDni}</span>.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-3">
            {renderDetailItem(<FileText size={20} />, 'Número de Factura', extractedData.invoiceNumber)}
            {renderDetailItem(<CalendarDays size={20} />, 'Fecha de Factura', extractedData.invoiceDate)}
            <Separator />
            {renderDetailItem(<User size={20} />, 'Detalles del Cliente', extractedData.clientDetails)}
            <Separator />
            {renderDetailItem(<Building size={20} />, 'Detalles de la Empresa', extractedData.companyDetails)}
            <Separator />
            {renderDetailItem(<List size={20} />, 'Ítems', extractedData.items)}
            <Separator />
            {renderDetailItem(<DollarSign size={20} />, 'Monto Total', extractedData.totalAmount?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }))}
            <Separator />
            {renderDetailItem(<Tag size={20} />, '¿Agregar Detalles de Categoría?', extractedData.shouldAddCategory)}
            {extractedData.shouldAddCategory && renderDetailItem(<Package size={20} />, 'Detalles de Categoría', extractedData.categoryDetails)}
          </div>
        </ScrollArea>
        
        <Separator className="my-6" />

        <Button onClick={handleSaveInvoice} className="w-full sm:w-auto">Guardar Factura</Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Archivo: {fileName}
        </p>
      </CardFooter>
    </Card>
  );
}
