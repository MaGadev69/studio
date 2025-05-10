'use client';

import type { StoredInvoice } from './types';

const INVOICES_STORAGE_KEY = 'invoiceAI_invoices';

export const saveInvoiceToStorage = (invoice: StoredInvoice): void => {
  if (typeof window === 'undefined') return;
  try {
    const existingInvoices = getInvoicesFromStorage();
    const updatedInvoices = [...existingInvoices, invoice];
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));
  } catch (error) {
    console.error("Error saving invoice to localStorage:", error);
  }
};

export const getInvoicesFromStorage = (): StoredInvoice[] => {
  if (typeof window === 'undefined') return [];
  try {
    const storedData = localStorage.getItem(INVOICES_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Error getting invoices from localStorage:", error);
    return [];
  }
};

export const getFilteredInvoicesFromStorage = (dni: string, startDate?: Date, endDate?: Date): StoredInvoice[] => {
  if (typeof window === 'undefined') return [];
  const allInvoices = getInvoicesFromStorage();
  return allInvoices.filter(invoice => {
    const matchesDni = invoice.clientDni.toLowerCase() === dni.toLowerCase();
    if (!matchesDni) return false;

    let invoiceDateObj: Date;
    try {
        const dateParts = invoice.invoiceDate.split(/[\/\-\.]/); 
        if (dateParts.length === 3) {
            if (dateParts[0].length === 4) { // YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
                invoiceDateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else { // DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
                 invoiceDateObj = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
            }
        } else {
            invoiceDateObj = new Date(invoice.invoiceDate); // Fallback to direct parsing
        }
        if (isNaN(invoiceDateObj.getTime())) { 
             console.warn(`Invalid date format for invoice ${invoice.id}: ${invoice.invoiceDate}`);
             return false; 
        }
    } catch (e) {
        console.warn(`Error parsing date for invoice ${invoice.id}: ${invoice.invoiceDate}`, e);
        return false; 
    }

    const matchesStartDate = startDate ? invoiceDateObj >= startDate : true;
    
    // For endDate, make sure to include the entire day
    let matchesEndDate = true;
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to end of day
      matchesEndDate = invoiceDateObj <= endOfDay;
    }
    
    return matchesStartDate && matchesEndDate;
  });
};
