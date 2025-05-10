'use client';

import { useState } from 'react';
import { InvoiceFilterForm, type InvoiceFilterFormValues } from '@/components/invoice/invoice-filter-form';
import { InvoiceList } from '@/components/invoice/invoice-list';
import { getFilteredInvoicesFromStorage } from '@/lib/invoice-storage';
import type { StoredInvoice } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function ReportsPage() {
  const [filteredInvoices, setFilteredInvoices] = useState<StoredInvoice[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);


  const handleFilterInvoices = (filters: InvoiceFilterFormValues) => {
    setIsFiltering(true);
    setHasSearched(true);
    // Simulate API call delay for realism if desired
    // setTimeout(() => {
      const invoices = getFilteredInvoicesFromStorage(filters.dni, filters.startDate, filters.endDate);
      setFilteredInvoices(invoices);
      setIsFiltering(false);
    // }, 500);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-2">
      <InvoiceFilterForm onFilter={handleFilterInvoices} isFiltering={isFiltering} />
      {hasSearched && (
        <>
          <Separator className="my-8" />
          <InvoiceList invoices={filteredInvoices} />
        </>
      )}
    </div>
  );
}
