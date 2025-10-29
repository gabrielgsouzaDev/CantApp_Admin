"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, MoreHorizontal } from "lucide-react";
import { School } from "@/lib/types";
import { useEffect, useState } from "react";
import { addSchool, deleteSchool, getSchools, updateSchool } from "@/services/schoolService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { SchoolForm } from "@/components/schools/school-form";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";


export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const { toast } = useToast();

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const schoolsData = await getSchools();
      setSchools(schoolsData);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Erro ao buscar escolas",
        description: "Ocorreu um erro ao buscar os dados das escolas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleFormSubmit = async (data: Omit<School, 'id'>) => {
    try {
      if (selectedSchool) {
        await updateSchool(selectedSchool.id, data);
        toast({ title: "Escola atualizada!", description: "Os dados da escola foram atualizados com sucesso." });
      } else {
        await addSchool(data);
        toast({ title: "Escola adicionada!", description: "A nova escola foi cadastrada com sucesso." });
      }
      setIsFormOpen(false);
      setSelectedSchool(null);
      fetchSchools(); // Refresh data
    } catch (error) {
       toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados da escola.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (school: School) => {
    setSelectedSchool(school);
    setIsFormOpen(true);
  }

  const openDeleteDialog = (school: School) => {
    setSelectedSchool(school);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedSchool) return;
    try {
      await deleteSchool(selectedSchool.id);
      toast({ title: "Escola excluída!", description: "A escola foi excluída com sucesso." });
      setIsDeleteDialogOpen(false);
      setSelectedSchool(null);
      fetchSchools();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a escola.",
        variant: "destructive"
      });
    }
  };


  return (
    <>
      <PageHeader title="Escolas" description="Gerencie as escolas cadastradas no sistema.">
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedSchool(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Adicionar Escola
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedSchool ? 'Editar Escola' : 'Adicionar Nova Escola'}</DialogTitle>
            </DialogHeader>
            <SchoolForm 
              onSubmit={handleFormSubmit}
              defaultValues={selectedSchool}
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
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[64px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.city}</TableCell>
                  <TableCell>
                    <Badge variant={school.status === 'inactive' ? 'destructive' : 'default'} className={cn(school.status === 'active' && 'bg-green-600')}>
                      {school.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(school)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDeleteDialog(school)} className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Tem certeza que deseja excluir esta escola?"
        description="Esta ação não pode ser desfeita. Isso excluirá permanentemente a escola e todos os seus dados associados."
      />
    </>
  );
}
