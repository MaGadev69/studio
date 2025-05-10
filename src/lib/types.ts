import type { SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';

export interface Client {
  id: string;
  dni: string; // Unique identifier for the client
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface StoredInvoice extends SmartDataExtractionOutput {
  id: string; // Unique ID for the stored invoice
  fileName: string; // Original name of the uploaded file
  uploadDate: string; // ISO string for the date of upload
  clientId: string; // ID of the associated client
  clientDni: string; // DNI of the client, denormalized for filtering
}
