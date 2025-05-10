// src/components/invoice/invoice-list-item.tsx
'use client';

import type { StoredInvoice } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, CalendarDays, DollarSign, FileText, List, User, Fingerprint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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
        displayDate = format(parsedDate, 'PPP');
    }
  } catch (e) {
    console.warn(`Could not parse date for list item: ${invoice.invoiceDate}`);
  }

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Invoice #{invoice.invoiceNumber || 'N/A'}
          </span>
          <Badge variant="outline">{displayDate}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center">
            <Fingerprint className="mr-1 h-4 w-4 text-muted-foreground" /> Client DNI: {invoice.clientDni}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold flex items-center mb-1">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            Client Details (from invoice)
          </h4>
          <p className="text-muted-foreground truncate">{invoice.clientDetails || 'N/A'}</p>
        </div>
        <div>
          <h4 className="font-semibold flex items-center mb-1">
            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
            Company Details
          </h4>
          <p className="text-muted-foreground truncate">{invoice.companyDetails || 'N/A'}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-semibold flex items-center mb-1">
            <List className="mr-2 h-4 w-4 text-muted-foreground" />
            Items ({invoice.items?.length || 0})
          </h4>
          {invoice.items && invoice.items.length > 0 ? (
            <ul className="list-disc pl-5 text-muted-foreground max-h-20 overflow-y-auto">
              {invoice.items.map((item, index) => (
                <li key={index} className="truncate">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No items listed.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Uploaded: {format(new Date(invoice.uploadDate), 'PPP p')}</p>
        <div className="flex items-center font-semibold text-lg text-primary">
          <DollarSign className="mr-1 h-5 w-5" />
          {invoice.totalAmount?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || 'N/A'}
        </div>
      </CardFooter>
    </Card>
  );
}
