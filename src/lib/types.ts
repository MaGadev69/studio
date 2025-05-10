import type { SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';

export interface StoredInvoice extends SmartDataExtractionOutput {
  id: string; // Unique ID for the stored invoice
  fileName: string; // Original name of the uploaded file
  uploadDate: string; // ISO string for the date of upload
  userDni: string; // DNI associated with this invoice for filtering
}
