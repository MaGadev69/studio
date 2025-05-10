'use client';

import type { StoredInvoice } from '@/lib/types';
import { InvoiceListItem } from './invoice-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


interface InvoiceListProps {
  invoices: StoredInvoice[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
       <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Invoices Found</AlertTitle>
          <AlertDescription>
            No invoices match your current filter criteria. Try adjusting your search.
          </AlertDescription>
        </Alert>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full mt-6 rounded-md border p-4 shadow">
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <InvoiceListItem key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </ScrollArea>
  );
}
