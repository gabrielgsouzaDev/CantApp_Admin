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
import { SchoolFormSchema } from "@/lib/schemas";


type SchoolFormData = z.infer<typeof SchoolFormSchema>;

interface SchoolFormProps {
  onSubmit: (data: SchoolFormData) => void;
  defaultValues?: School | null;
  onCancel: () => void;
}

export function SchoolForm({ onSubmit, defaultValues, onCancel }: SchoolFormProps) {
  const form = useForm<SchoolFormData>({
    resolver: zodResolver(SchoolFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      address: defaultValues?.address || "",
      cnpj: defaultValues?.cnpj || "",
      status: defaultValues?.status || "active",
      qtd_alunos: defaultValues?.qtd_alunos || 0,
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues?.name || defaultValues?.nome || "",
      address: defaultValues?.address || "",
      cnpj: defaultValues?.cnpj || "",
      status: defaultValues?.status || "active",
      qtd_alunos: defaultValues?.qtd_alunos || 0,
    });
  }, [defaultValues, form]);
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    form.setValue("cnpj", value.substring(0, 18));
  };


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
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input 
                    placeholder="XX.XXX.XXX/XXXX-XX" 
                    {...field}
                    onChange={handleCnpjChange}
                    value={field.value}
                 />
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
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Rua Principal, 123, São Paulo - SP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qtd_alunos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Alunos</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 500" {...field} />
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
