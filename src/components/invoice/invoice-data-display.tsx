'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { saveInvoiceToStorage } from '@/lib/invoice-storage';
import type { StoredInvoice } from '@/lib/types';
import type { SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';
import { Building, CalendarDays, DollarSign, FileText, Fingerprint, List, User, Package, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InvoiceDataDisplayProps {
  extractedData: SmartDataExtractionOutput;
  fileName: string;
  onInvoiceSaved: () => void;
}

const saveInvoiceSchema = z.object({
  userDni: z.string().min(1, { message: 'DNI is required.' }).regex(/^\d{7,8}[A-Za-z]?$/, { message: 'Invalid DNI format.'}), // Common Spanish DNI format
});

type SaveInvoiceFormValues = z.infer<typeof saveInvoiceSchema>;

export function InvoiceDataDisplay({ extractedData, fileName, onInvoiceSaved }: InvoiceDataDisplayProps) {
  const { toast } = useToast();
  const form = useForm<SaveInvoiceFormValues>({
    resolver: zodResolver(saveInvoiceSchema),
    defaultValues: {
      userDni: '',
    },
  });

  const handleSaveInvoice = (values: SaveInvoiceFormValues) => {
    const newInvoice: StoredInvoice = {
      ...extractedData,
      id: crypto.randomUUID(),
      fileName,
      uploadDate: new Date().toISOString(),
      userDni: values.userDni,
    };
    saveInvoiceToStorage(newInvoice);
    toast({ title: 'Invoice Saved', description: `Invoice "${fileName}" has been saved successfully.` });
    onInvoiceSaved();
    form.reset();
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
             <Badge variant={value ? "default" : "secondary"}>{value ? 'Yes' : 'No'}</Badge>
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
          Extracted Invoice Data
        </CardTitle>
        <CardDescription>Review the extracted information below and save the invoice.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {renderDetailItem(<FileText size={20} />, 'Invoice Number', extractedData.invoiceNumber)}
            {renderDetailItem(<CalendarDays size={20} />, 'Invoice Date', extractedData.invoiceDate)}
            <Separator />
            {renderDetailItem(<User size={20} />, 'Client Details', extractedData.clientDetails)}
            <Separator />
            {renderDetailItem(<Building size={20} />, 'Company Details', extractedData.companyDetails)}
            <Separator />
            {renderDetailItem(<List size={20} />, 'Items', extractedData.items)}
            <Separator />
            {renderDetailItem(<DollarSign size={20} />, 'Total Amount', extractedData.totalAmount?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }))} {/* Adjust currency as needed */}
             <Separator />
            {renderDetailItem(<Tag size={20} />, 'Add Category Details?', extractedData.shouldAddCategory)}
            {extractedData.shouldAddCategory && renderDetailItem(<Package size={20} />, 'Category Details', extractedData.categoryDetails)}
          </div>
        </ScrollArea>
        
        <Separator className="my-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveInvoice)} className="space-y-6">
            <FormField
              control={form.control}
              name="userDni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="userDni" className="flex items-center">
                    <Fingerprint className="mr-2 h-5 w-5 text-muted-foreground" />
                    Client DNI (for filtering)
                  </FormLabel>
                  <FormControl>
                    <Input id="userDni" placeholder="Enter client's DNI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto">Save Invoice</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          File: {fileName}
        </p>
      </CardFooter>
    </Card>
  );
}
