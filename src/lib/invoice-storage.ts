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
    const matchesDni = invoice.userDni.toLowerCase() === dni.toLowerCase();
    if (!matchesDni) return false;

    // The AI extracts invoiceDate as a string. We need to parse it.
    // Assuming AI returns date in a parseable format like YYYY-MM-DD or DD/MM/YYYY.
    // This might need robust parsing. For simplicity, assuming YYYY-MM-DD from AI.
    let invoiceDateObj: Date;
    try {
        // Attempt to parse common date formats if not already in ISO
        const dateParts = invoice.invoiceDate.split(/[\/\-\.]/); // Handles YYYY-MM-DD, DD/MM/YYYY etc.
        if (dateParts.length === 3) {
            if (dateParts[0].length === 4) { // YYYY-MM-DD
                invoiceDateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else { // DD-MM-YYYY
                 invoiceDateObj = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
            }
        } else {
            invoiceDateObj = new Date(invoice.invoiceDate); // Fallback to direct parsing
        }
        if (isNaN(invoiceDateObj.getTime())) { // Check if date is valid
             console.warn(`Invalid date format for invoice ${invoice.id}: ${invoice.invoiceDate}`);
             return false; // Skip if date is invalid
        }
    } catch (e) {
        console.warn(`Error parsing date for invoice ${invoice.id}: ${invoice.invoiceDate}`, e);
        return false; // Skip if date parsing fails
    }


    const matchesStartDate = startDate ? invoiceDateObj >= startDate : true;
    const matchesEndDate = endDate ? invoiceDateObj <= endDate : true;
    
    return matchesStartDate && matchesEndDate;
  });
};
