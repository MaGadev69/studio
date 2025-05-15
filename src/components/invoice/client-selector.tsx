// src/components/invoice/client-selector.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientFormDialog } from '@/components/client/client-dialogs';
import type { ClientFormValues } from '@/components/client/client-form';
import { addClientToStorage, getClientsFromStorage } from '@/lib/client-storage';
import type { Client } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, UserCheck, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface ClientSelectorProps {
  onClientSelected: (client: Client) => void;
}

export function ClientSelector({ onClientSelected }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For fetching clients
  const [isSubmittingClient, setIsSubmittingClient] = useState(false); // For adding new client
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = () => {
      setIsLoading(true);
      try {
        setClients(getClientsFromStorage());
      } catch (error) {
        toast({ title: 'Error', description: 'Error al cargar los clientes.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [toast]);

  const handleClientSelectionChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      onClientSelected(client);
    }
  };

  const handleAddNewClient = (values: ClientFormValues) => {
    setIsSubmittingClient(true);
    try {
      const newClient = addClientToStorage(values);
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      setSelectedClientId(newClient.id); // Auto-select the new client
      onClientSelected(newClient);
      setIsFormDialogOpen(false);
      toast({ title: 'Cliente Agregado', description: `El cliente "${newClient.name}" ha sido agregado y seleccionado.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Error al agregar nuevo cliente.', variant: 'destructive' });
    } finally {
      setIsSubmittingClient(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />Seleccionar Cliente</CardTitle>
          <CardDescription>Elige un cliente existente o agrega uno nuevo para continuar.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Cargando clientes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />Seleccionar Cliente</CardTitle>
        <CardDescription>Elige un cliente existente o agrega uno nuevo para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={handleClientSelectionChange} value={selectedClientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un cliente existente" />
            </SelectTrigger>
            <SelectContent>
              {clients.length > 0 ? (
                clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} (DNI: {client.dni})
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No se encontraron clientes. Agrega uno nuevo.</div>
              )}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setIsFormDialogOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Nuevo Cliente
          </Button>
        </div>
      </CardContent>

      <ClientFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleAddNewClient}
        isSubmitting={isSubmittingClient}
      />
    </Card>
  );
}
