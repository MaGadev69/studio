// src/components/invoice/invoice-list-item.tsx
'use client';

import type { StoredInvoice } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, CalendarDays, DollarSign, FileText, List, User, Fingerprint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface InvoiceListItemProps {
  invoice: StoredInvoice;
}

export function InvoiceListItem({ invoice }: InvoiceListItemProps) {
  let displayDate = 'N/A';
  try {
    const dateParts = invoice.invoiceDate.split(/[\/\-\.]/);
    let parsedDate: Date;
    if (dateParts.length === 3) {
        if (dateParts[0].length === 4) { // YYYY-MM-DD
            parsedDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        } else { // DD-MM-YYYY
             parsedDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        }
    } else {
        parsedDate = new Date(invoice.invoiceDate); 
    }
    if (!isNaN(parsedDate.getTime())) {
        displayDate = format(parsedDate, 'PPP', { locale: es });
    }
  } catch (e) {
    console.warn(`No se pudo analizar la fecha para el ítem de la lista: ${invoice.invoiceDate}`);
  }

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Factura #{invoice.invoiceNumber || 'N/A'}
          </span>
          <Badge variant="outline">{displayDate}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center">
            <Fingerprint className="mr-1 h-4 w-4 text-muted-foreground" /> DNI Cliente: {invoice.clientDni}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold flex items-center mb-1">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            Detalles del Cliente (de la factura)
          </h4>
          <p className="text-muted-foreground truncate">{invoice.clientDetails || 'N/A'}</p>
        </div>
        <div>
          <h4 className="font-semibold flex items-center mb-1">
            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
            Detalles de la Empresa
          </h4>
          <p className="text-muted-foreground truncate">{invoice.companyDetails || 'N/A'}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-semibold flex items-center mb-1">
            <List className="mr-2 h-4 w-4 text-muted-foreground" />
            Ítems ({invoice.items?.length || 0})
          </h4>
          {invoice.items && invoice.items.length > 0 ? (
            <ul className="list-disc pl-5 text-muted-foreground max-h-20 overflow-y-auto">
              {invoice.items.map((item, index) => (
                <li key={index} className="truncate">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No hay ítems listados.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Subido: {format(new Date(invoice.uploadDate), 'PPP p', { locale: es })}</p>
        <div className="flex items-center font-semibold text-lg text-primary">
          <DollarSign className="mr-1 h-5 w-5" />
          {invoice.totalAmount?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) || 'N/A'}
        </div>
      </CardFooter>
    </Card>
  );
}
