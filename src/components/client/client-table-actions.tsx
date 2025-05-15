// src/components/client/client-table-actions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';
import type { Client } from '@/lib/types';

interface ClientTableActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientTableActions({ client, onEdit, onDelete }: ClientTableActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={() => onEdit(client)} aria-label="Editar cliente">
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="icon" onClick={() => onDelete(client)} aria-label="Eliminar cliente">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
