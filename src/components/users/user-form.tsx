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
import { CtnAppUser, UserRole } from "@/lib/types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserRoles } from "@/services/userService";
import { UserCreationPayload } from "@/services/userService";

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Por favor, insira um email válido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional(),
  id_role: z.coerce.number().int().positive("Selecione uma função."),
});


interface UserFormProps {
  onSubmit: (data: UserCreationPayload) => void;
  defaultValues?: Partial<CtnAppUser> | null;
  onCancel: () => void;
}

export function UserForm({ onSubmit, defaultValues, onCancel }: UserFormProps) {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  });

  useEffect(() => {
    getUserRoles().then(setRoles).catch(err => {
      toast({
        title: "Erro ao buscar funções",
        description: "Não foi possível carregar a lista de funções de usuário.",
        variant: "destructive"
      })
    });
  }, [toast]);
  

  useEffect(() => {
    if (defaultValues) {
        form.reset({
            nome: defaultValues.nome || "",
            email: defaultValues.email || "",
            // Find the role id based on the role name
            id_role: roles.find(r => r.nome === defaultValues.role)?.id_role,
        });
    }
  }, [defaultValues, form, roles]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ex: joao.silva@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!defaultValues && ( // Only show password field for new users
             <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        )}
        <FormField
          control={form.control}
          name="id_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id_role} value={String(role.id_role)}>
                      {role.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">{defaultValues?.id ? 'Salvar Alterações' : 'Criar Usuário'}</Button>
        </div>
      </form>
    </Form>
  );
}
