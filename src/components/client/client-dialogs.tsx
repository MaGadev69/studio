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
          <DialogTitle>{clientToEdit ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</DialogTitle>
          <DialogDescription>
            {clientToEdit ? "Actualiza los detalles del cliente a continuación." : "Ingresa los detalles del nuevo cliente."}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          initialData={clientToEdit}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText={clientToEdit ? 'Guardar Cambios' : 'Agregar Cliente'}
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
          <AlertDialogTitle>¿Estás seguro de que quieres eliminar este cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente
            {clientName && <span className="font-semibold"> {clientName}</span>}.
            Las facturas asociadas permanecerán pero podrían perder su enlace directo al cliente si no se actualizan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
