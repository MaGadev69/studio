// src/ai/flows/smart-data-extraction.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting data from invoices. The flow uses a prompt
 * to extract key information such as invoice number, date, client details, company details, items,
 * and total amount. The extracted information is then returned as a structured object.
 *
 * - extractInvoiceData - A function that handles the invoice data extraction process.
 * - SmartDataExtractionInput - The input type for the extractInvoiceData function.
 * - SmartDataExtractionOutput - The return type for the extractInvoiceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartDataExtractionInputSchema = z.object({
  invoiceDataUri: z
    .string()
    .describe(
      "A photo of an invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SmartDataExtractionInput = z.infer<typeof SmartDataExtractionInputSchema>;

const SmartDataExtractionOutputSchema = z.object({
  invoiceNumber: z.string().describe('The invoice number.'),
  invoiceDate: z.string().describe('The invoice date.'),
  clientDetails: z.string().describe('Details of the client.'),
  companyDetails: z.string().describe('Details of the company issuing the invoice.'),
  items: z.array(z.string()).describe('List of items in the invoice.'),
  totalAmount: z.number().describe('The total amount of the invoice.'),
  shouldAddCategory: z.boolean().describe('Whether or not to add a product category to the information presented to the user.'),
  categoryDetails: z.string().optional().describe('Details of product category, if applicable.')
});
export type SmartDataExtractionOutput = z.infer<typeof SmartDataExtractionOutputSchema>;

export async function extractInvoiceData(input: SmartDataExtractionInput): Promise<SmartDataExtractionOutput> {
  return smartDataExtractionFlow(input);
}

const smartDataExtractionPrompt = ai.definePrompt({
  name: 'smartDataExtractionPrompt',
  input: {schema: SmartDataExtractionInputSchema},
  output: {schema: SmartDataExtractionOutputSchema},
  prompt: `You are an expert AI assistant specialized in extracting information from invoices.

  Extract the following information from the invoice image:
  - Invoice Number
  - Invoice Date
  - Client Details
  - Company Details
  - Items (as a list of strings)
  - Total Amount (as a number)
  - Determine if you should add category details to the information presented to the user. If so, set 'shouldAddCategory' to true, and provide relevant details.

  Here is the invoice image:
  {{media url=invoiceDataUri}}
  `,
});

const smartDataExtractionFlow = ai.defineFlow(
  {
    name: 'smartDataExtractionFlow',
    inputSchema: SmartDataExtractionInputSchema,
    outputSchema: SmartDataExtractionOutputSchema,
  },
  async input => {
    const {output} = await smartDataExtractionPrompt(input);
    return output!;
  }
);
