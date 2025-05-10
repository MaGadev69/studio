'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';
import { extractInvoiceData, type SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';
import { useToast } from '@/hooks/use-toast';

interface InvoiceUploaderProps {
  onDataExtracted: (data: SmartDataExtractionOutput, fileName: string) => void;
  isProcessing: boolean; // Controlled by parent for overall processing state
}

export function InvoiceUploader({ onDataExtracted, isProcessing }: InvoiceUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({ title: 'No file selected', description: 'Please select an invoice image.', variant: 'destructive' });
      return;
    }

    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUri = reader.result as string;
          const result = await extractInvoiceData({ invoiceDataUri: dataUri });
          onDataExtracted(result, selectedFile.name);
          toast({ title: 'Data Extracted', description: 'Invoice data has been successfully extracted.' });
        } catch (aiError) {
          console.error('AI Extraction Error:', aiError);
          toast({ title: 'Extraction Error', description: 'Failed to extract data using AI. Please try again.', variant: 'destructive' });
        } finally {
          setIsExtracting(false); 
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({ title: 'File Read Error', description: 'Could not read the selected file.', variant: 'destructive' });
        setIsExtracting(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error setting up file reader:', error);
      toast({ title: 'Setup Error', description: 'An unexpected error occurred while preparing the file.', variant: 'destructive' });
      setIsExtracting(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" />
          Upload Invoice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="invoice-file" type="file" accept="image/jpeg, image/png, image/webp, image/gif" onChange={handleFileChange} disabled={isExtracting || isProcessing} />
             {selectedFile && <p className="text-sm text-muted-foreground pt-1">Selected: {selectedFile.name}</p>}
          </div>
          <Button onClick={handleSubmit} disabled={isExtracting || isProcessing || !selectedFile} className="w-full sm:w-auto">
            {(isExtracting || isProcessing) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isExtracting ? 'Extracting...' : (isProcessing ? 'Processing...' : 'Extract Data')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
