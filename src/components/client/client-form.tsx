// src/components/client/client-form.tsx
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Client } from '@/lib/types';
import { Fingerprint, User, Mail, Phone, MapPin } from 'lucide-react';

const clientFormSchema = z.object({
  dni: z.string().min(1, { message: 'El DNI es obligatorio.' }).regex(/^\d{7,8}[A-Za-z]?$/, { message: 'Formato de DNI inválido (ej: 12345678A).' }),
  name: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  email: z.string().email({ message: 'Dirección de correo electrónico inválida.' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: Client | null;
  onSubmit: (values: ClientFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function ClientForm({ initialData, onSubmit, isSubmitting = false, submitButtonText = 'Guardar Cliente' }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      dni: initialData?.dni || '',
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />DNI</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el DNI del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el nombre completo del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Correo Electrónico (Opcional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ingresa el correo electrónico del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Teléfono (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el número de teléfono del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Dirección (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa la dirección del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Guardando...' : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
