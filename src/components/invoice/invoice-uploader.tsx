// src/components/invoice/invoice-uploader.tsx
'use client';

import type { ChangeEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, Camera, VideoOff, AlertTriangle } from 'lucide-react';
import { extractInvoiceData, type SmartDataExtractionOutput } from '@/ai/flows/smart-data-extraction';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface InvoiceUploaderProps {
  onDataExtracted: (data: SmartDataExtractionOutput, fileName: string) => void;
}

export function InvoiceUploader({ onDataExtracted }: InvoiceUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null); 
  const [isBusy, setIsBusy] = useState(false); 
  
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  const requestCameraPermission = async () => {
    if (showCamera && videoRef.current?.srcObject) { 
        setShowCamera(false);
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setHasCameraPermission(null); 
        return;
    }

    setShowCamera(true);
    setIsBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Acceso a Cámara Denegado',
        description: 'Por favor, habilita los permisos de cámara en la configuración de tu navegador.',
      });
      setShowCamera(false);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      setIsBusy(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreviewDataUrl(dataUri);
        setSelectedFile(null); 
        setShowCamera(false); 
         if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsBusy(false);
      } else {
        toast({ title: 'Error de Captura', description: 'No se pudo capturar la foto.', variant: 'destructive' });
        setIsBusy(false);
      }
    }
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewDataUrl(null); 

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

    } else {
      setSelectedFile(null);
      setPreviewDataUrl(null);
    }
  };

  const processDataUri = async (dataUri: string, fileName: string) => {
    setIsBusy(true);
    try {
      const result = await extractInvoiceData({ invoiceDataUri: dataUri });
      onDataExtracted(result, fileName);
      toast({ title: 'Datos Extraídos', description: 'Los datos de la factura se han extraído correctamente.' });
    } catch (aiError) {
      console.error('Error de extracción IA:', aiError);
      toast({ title: 'Error de Extracción', description: 'Error al extraer datos con IA. Por favor, inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsBusy(false);
    }
  };


  const handleSubmit = async () => {
    if (previewDataUrl && !selectedFile) { 
      processDataUri(previewDataUrl, `captura-webcam-${new Date().toISOString()}.jpg`);
    } else if (selectedFile) { 
      const reader = new FileReader();
      reader.onload = () => {
        processDataUri(reader.result as string, selectedFile.name);
      };
      reader.onerror = (error) => {
        console.error('Error al leer archivo:', error);
        toast({ title: 'Error al Leer Archivo', description: 'No se pudo leer el archivo seleccionado.', variant: 'destructive' });
        setIsBusy(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
       toast({ title: 'Ninguna fuente de imagen', description: 'Por favor, sube un archivo o captura una foto.', variant: 'destructive' });
    }
  };
  
  const inputDisabled = isBusy || showCamera;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" />
          Subir o Capturar Imagen de Factura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input 
              id="invoice-file" 
              type="file" 
              accept="image/jpeg, image/png, image/webp, image/gif" 
              onChange={handleFileChange} 
              disabled={inputDisabled}
            />
            {selectedFile && <p className="text-sm text-muted-foreground pt-1">Seleccionado: {selectedFile.name}</p>}
          </div>

          <Button onClick={requestCameraPermission} variant="outline" disabled={isBusy} className="w-full sm:w-auto">
            {showCamera && videoRef.current?.srcObject ? <VideoOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
            {showCamera && videoRef.current?.srcObject ? 'Cerrar Cámara' : 'Usar Cámara Web'}
          </Button>

          {showCamera && (
            <div className="space-y-2">
              <video ref={videoRef} className="w-full aspect-video rounded-md border bg-muted" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Acceso a Cámara Denegado</AlertTitle>
                  <AlertDescription>
                    Por favor, habilita los permisos de cámara en la configuración de tu navegador. Es posible que necesites refrescar la página.
                  </AlertDescription>
                </Alert>
              )}
              {hasCameraPermission && (
                <Button onClick={handleCapturePhoto} disabled={isBusy} className="w-full sm:w-auto">
                  Capturar Foto
                </Button>
              )}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />

          {previewDataUrl && (
            <div className="mt-4 border rounded-md p-2">
              <p className="text-sm font-medium mb-2">Vista Previa:</p>
              <img src={previewDataUrl} alt="Vista previa de factura" className="max-w-full max-h-60 rounded-md object-contain" data-ai-hint="invoice document" />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={isBusy || (!selectedFile && !previewDataUrl)} className="w-full sm:w-auto mt-4">
            {isBusy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isBusy ? 'Procesando...' : 'Extraer Datos'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
