"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { School } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  city: z.string().min(2, "A cidade deve ter pelo menos 2 caracteres."),
  status: z.enum(["active", "inactive"]),
});

type SchoolFormData = z.infer<typeof formSchema>;

interface SchoolFormProps {
  onSubmit: (data: SchoolFormData) => void;
  defaultValues?: School | null;
  onCancel: () => void;
}

export function SchoolForm({ onSubmit, defaultValues, onCancel }: SchoolFormProps) {
  const form = useForm<SchoolFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      city: defaultValues?.city || "",
      status: defaultValues?.status || "active",
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues?.name || "",
      city: defaultValues?.city || "",
      status: defaultValues?.status || "active",
    });
  }, [defaultValues, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Escola</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Colégio Central" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">{defaultValues ? 'Salvar Alterações' : 'Criar Escola'}</Button>
        </div>
      </form>
    </Form>
  );
}
