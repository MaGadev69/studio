// src/app/clients/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClientTable } from '@/components/client/client-table';
import { ClientFormDialog, DeleteClientDialog } from '@/components/client/client-dialogs';
import type { ClientFormValues } from '@/components/client/client-form';
import {
  addClientToStorage,
  deleteClientFromStorage,
  getClientsFromStorage,
  updateClientInStorage,
} from '@/lib/client-storage';
import type { Client } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Users } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setClients(getClientsFromStorage());
  }, []);

  const handleOpenFormDialog = (client?: Client) => {
    setSelectedClient(client || null);
    setIsFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (values: ClientFormValues, clientId?: string) => {
    setIsSubmitting(true);
    try {
      if (clientId) {
        const updatedClient = { ...values, id: clientId };
        const updatedClients = updateClientInStorage(updatedClient);
        setClients(updatedClients);
        toast({ title: 'Client Updated', description: `Client "${values.name}" has been updated.` });
      } else {
        const newClient = addClientToStorage(values);
        setClients(prev => [...prev, newClient]);
        toast({ title: 'Client Added', description: `Client "${values.name}" has been added.` });
      }
      setIsFormDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save client.', variant: 'destructive' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedClient) return;
    setIsSubmitting(true);
    try {
      const updatedClients = deleteClientFromStorage(selectedClient.id);
      setClients(updatedClients);
      toast({ title: 'Client Deleted', description: `Client "${selectedClient.name}" has been deleted.` });
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete client.', variant: 'destructive' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Manage Clients
        </h1>
        <Button onClick={() => handleOpenFormDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </div>

      <ClientTable
        clients={clients}
        onEditClient={handleOpenFormDialog}
        onDeleteClient={handleOpenDeleteDialog}
      />

      <ClientFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        clientToEdit={selectedClient}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        clientName={selectedClient?.name}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
