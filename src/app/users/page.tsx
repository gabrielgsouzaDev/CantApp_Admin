"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, MoreHorizontal } from "lucide-react";
import { CtnAppUser, Role } from "@/lib/types";
import { useEffect, useState } from "react";
import { addUser, deleteUser, getUsers, updateUser } from "@/services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useAuth } from "@/hooks/use-auth";
import { UserForm } from "@/components/users/user-form";
import { UserCreationPayload } from "@/services/userService";

export default function UsersPage() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<CtnAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CtnAppUser | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      // Admin global vê todos, EscolaAdmin vê apenas os da sua escola.
      const allUsers = await getUsers();
      if (authUser.role === 'GlobalAdmin') {
        setUsers(allUsers);
      } else if (authUser.role === 'EscolaAdmin' && authUser.id_escola) {
        const schoolUsers = allUsers.filter(u => u.id_escola === authUser.id_escola);
        setUsers(schoolUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro ao buscar usuários",
        description: "Ocorreu um erro ao buscar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchUsers();
    }
  }, [authUser]);

  const handleFormSubmit = async (data: Omit<UserCreationPayload, 'ativo'>) => {
    try {
      const payload: UserCreationPayload = { 
        ...data, 
        id_escola: authUser?.id_escola,
        ativo: true 
      };

      if (selectedUser) {
        // Para edição, não enviamos a senha se não for alterada
        const updatePayload: Partial<CtnAppUser> & { id_role?: number } = {
          nome: payload.nome,
          email: payload.email,
          id_role: payload.id_role,
        };
        await updateUser(selectedUser.id, updatePayload);
        toast({ title: "Usuário atualizado!", description: "Os dados foram atualizados." });
      } else {
        if (!payload.senha) {
            toast({ title: "Erro", description: "A senha é obrigatória para criar um novo usuário.", variant: "destructive" });
            return;
        }
        await addUser(payload);
        toast({ title: "Usuário adicionado!", description: "O novo usuário foi cadastrado." });
      }
      setIsFormOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
       toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar os dados.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: CtnAppUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  }

  const openDeleteDialog = (user: CtnAppUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      toast({ title: "Usuário excluído!", description: "O usuário foi excluído com sucesso." });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive"
      });
    }
  };
  
  // A map to show friendly role names
  const roleNames: Record<string, string> = {
    Admin: "Admin Global",
    Escola: "Admin da Escola",
    Cantina: "Cantina",
    Responsavel: "Responsável",
    Aluno: "Aluno",
    Funcionario: "Funcionário",
  }

  return (
    <>
      <PageHeader title="Usuários" description="Gerencie os usuários do sistema.">
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedUser(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            </DialogHeader>
            <UserForm 
              onSubmit={handleFormSubmit}
              defaultValues={selectedUser}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="w-[64px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell>{roleNames[user.role] || user.role}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
                 {users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Nenhum usuário encontrado.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      )}
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Tem certeza que deseja excluir este usuário?"
        description="Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário."
      />
    </>
  );
}
