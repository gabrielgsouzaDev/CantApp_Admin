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
import { Canteen, Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { getCanteens } from "@/services/canteenService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  price: z.coerce.number().positive("O preço deve ser um número positivo."),
  id_cantina: z.coerce.number().int().positive("Selecione uma cantina."),
});

type ProductFormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData & { id?: number }) => void;
  defaultValues?: Partial<Product> | null;
  onCancel: () => void;
  schoolId?: number | null;
}

export function ProductForm({ onSubmit, defaultValues, onCancel, schoolId }: ProductFormProps) {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      id_cantina: undefined,
    },
  });

  useEffect(() => {
    if (schoolId) {
      getCanteens(schoolId).then(setCanteens).catch(err => {
        toast({
          title: "Erro ao buscar cantinas",
          description: "Não foi possível carregar a lista de cantinas.",
          variant: "destructive"
        })
      });
    }
  }, [schoolId, toast]);
  

  useEffect(() => {
    form.reset({
      name: defaultValues?.name || defaultValues?.nome || "",
      price: defaultValues?.price || defaultValues?.preco || 0,
      id_cantina: defaultValues?.id_cantina,
    });
  }, [defaultValues, form]);

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({ ...data, id: defaultValues?.id });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
         <FormField
          control={form.control}
          name="id_cantina"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantina</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cantina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {canteens.map(canteen => (
                    <SelectItem key={canteen.id} value={String(canteen.id)}>
                      {canteen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Pão de Queijo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (em R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 5.50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">{defaultValues?.id ? 'Salvar Alterações' : 'Criar Produto'}</Button>
        </div>
      </form>
    </Form>
  );
}
