import { PageHeader } from "@/components/page-header";

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Produtos" description="Gerencie os produtos da cantina." />
       <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
        Tabela de dados de produtos a ser implementada aqui.
      </div>
    </>
  );
}
