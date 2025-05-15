// src/components/client/client-table.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Client } from '@/lib/types';
import { ClientTableActions } from './client-table-actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ClientTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

export function ClientTable({ clients, onEditClient, onDeleteClient }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se Encontraron Clientes</AlertTitle>
        <AlertDescription>
          Aún no has agregado ningún cliente. Haz clic en "Agregar Nuevo Cliente" para comenzar.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <ScrollArea className="h-[600px] w-full mt-6 rounded-md border shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Correo Electrónico</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.dni}</TableCell>
              <TableCell>{client.email || '-'}</TableCell>
              <TableCell>{client.phone || '-'}</TableCell>
              <TableCell className="truncate max-w-xs">{client.address || '-'}</TableCell>
              <TableCell className="text-right">
                <ClientTableActions
                  client={client}
                  onEdit={onEditClient}
                  onDelete={onDeleteClient}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
