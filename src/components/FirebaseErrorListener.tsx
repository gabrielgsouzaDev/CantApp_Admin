"use client";

import React, { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (err: Error) => {
      if (err instanceof FirestorePermissionError) {
        setError(err);
      } else {
        // Handle other types of global errors if necessary
        toast({
          variant: "destructive",
          title: "Ocorreu um erro inesperado",
          description: err.message || "Por favor, tente novamente.",
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  if (!error || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-3xl w-full">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Erro de Permissão do Firestore</AlertTitle>
        <AlertDescription>
          <p className="mb-4">A operação solicitada foi bloqueada por suas regras de segurança do Firestore. Use as informações abaixo para diagnosticar e corrigir as regras no seu `firestore.rules`.</p>
          <pre className="bg-background/80 p-4 rounded-md text-xs overflow-auto max-h-[50vh]">
            <code>{error.message}</code>
          </pre>
        </AlertDescription>
        <div className="flex justify-end mt-4">
            <Button onClick={() => setError(null)}>
                Fechar
            </Button>
        </div>
      </Alert>
    </div>
  );
}
