// src/components/client/client-dialogs.tsx
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Client } from '@/lib/types';
import { ClientForm, type ClientFormValues } from './client-form';

// Add/Edit Client Dialog
interface ClientFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientToEdit?: Client | null;
  onSubmit: (values: ClientFormValues, clientId?: string) => void;
  isSubmitting?: boolean;
}

export function ClientFormDialog({ isOpen, onOpenChange, clientToEdit, onSubmit, isSubmitting }: ClientFormDialogProps) {
  const handleSubmit = (values: ClientFormValues) => {
    onSubmit(values, clientToEdit?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{clientToEdit ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {clientToEdit ? "Update the client's details below." : "Enter the new client's details."}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          initialData={clientToEdit}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText={clientToEdit ? 'Save Changes' : 'Add Client'}
        />
      </DialogContent>
    </Dialog>
  );
}

// Delete Client Dialog
interface DeleteClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  clientName?: string;
  isDeleting?: boolean;
}

export function DeleteClientDialog({ isOpen, onOpenChange, onConfirm, clientName, isDeleting }: DeleteClientDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this client?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the client
            {clientName && <span className="font-semibold"> {clientName}</span>}.
            Associated invoices will remain but may lose their direct client link if not updated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
