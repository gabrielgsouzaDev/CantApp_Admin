import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SchoolsPage() {
  return (
    <>
      <PageHeader title="Escolas" description="Gerencie as escolas cadastradas no sistema.">
        <Button>
          <PlusCircle className="mr-2" />
          Adicionar Escola
        </Button>
      </PageHeader>
      <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
        Tabela de dados de escolas a ser implementada aqui.
      </div>
    </>
  );
}
