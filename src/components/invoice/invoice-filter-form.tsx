'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Fingerprint, Filter, Search } from 'lucide-react';
import { useState } from 'react';


const invoiceFilterSchema = z.object({
  dni: z.string().min(1, { message: 'DNI is required.' }).regex(/^\d{7,8}[A-Za-z]?$/, { message: 'Invalid DNI format.'}),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(data => {
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: "End date cannot be earlier than start date.",
  path: ["endDate"],
});

export type InvoiceFilterFormValues = z.infer<typeof invoiceFilterSchema>;

interface InvoiceFilterFormProps {
  onFilter: (filters: InvoiceFilterFormValues) => void;
  isFiltering: boolean;
}

export function InvoiceFilterForm({ onFilter, isFiltering }: InvoiceFilterFormProps) {
  const form = useForm<InvoiceFilterFormValues>({
    resolver: zodResolver(invoiceFilterSchema),
    defaultValues: {
      dni: '',
    },
  });

  const onSubmit = (values: InvoiceFilterFormValues) => {
    onFilter(values);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-6 w-6 text-primary" />
          Filter Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Fingerprint className="mr-2 h-5 w-5 text-muted-foreground" />
                    Client DNI
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client's DNI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isFiltering} className="w-full sm:w-auto">
              {isFiltering ? (
                <Search className="mr-2 h-4 w-4 animate-pulse" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search Invoices
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
