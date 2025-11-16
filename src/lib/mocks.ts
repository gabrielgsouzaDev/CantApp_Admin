// src/lib/mocks.ts
import { School, Product, Order, CtnAppUser, Role } from './types';

export const mockSchools: School[] = [
  { id: 1, name: 'Escola Modelo', cnpj: '11.222.333/0001-44', address: 'Rua das Flores, 123', status: 'active' },
  { id: 2, name: 'Colégio Alpha', cnpj: '22.333.444/0001-55', address: 'Avenida Principal, 456', status: 'active' },
  { id: 3, name: 'Escola Beta', cnpj: '33.444.555/0001-66', address: 'Praça Central, 789', status: 'inactive' },
];

export const mockProducts: Product[] = [
  { id: 1, name: 'Pão de Queijo', price: 5.50, school_id: 1 },
  { id: 2, name: 'Suco de Laranja', price: 4.00, school_id: 1 },
  { id: 3, name: 'Misto Quente', price: 7.00, school_id: 1 },
  { id: 4, name: 'Bolo de Chocolate', price: 6.00, school_id: 2 },
  { id: 5, name: 'Coxinha', price: 5.00, school_id: 2 },
];

export const mockOrders: Order[] = [
  { id: 1, student_name: 'João Silva', time: new Date(Date.now() - 300000).toISOString(), items: [{ id: 1, name: 'Pão de Queijo', price: 5.50 }], status: 'A Fazer', payment_status: 'Pago', total: 5.50 },
  { id: 2, student_name: 'Maria Clara', time: new Date(Date.now() - 250000).toISOString(), items: [{ id: 3, name: 'Misto Quente', price: 7.00 }], status: 'A Fazer', payment_status: 'Pendente', total: 7.00 },
  { id: 3, student_name: 'Pedro Alves', time: new Date(Date.now() - 200000).toISOString(), items: [{ id: 4, name: 'Bolo de Chocolate', price: 6.00 }], status: 'Em Preparo', payment_status: 'Pago', total: 6.00 },
  { id: 4, student_name: 'Ana Beatriz', time: new Date(Date.now() - 150000).toISOString(), items: [{ id: 5, name: 'Coxinha', price: 5.00 }], status: 'Em Preparo', payment_status: 'Pendente', total: 5.00 },
  { id: 5, student_name: 'Lucas Costa', time: new Date(Date.now() - 100000).toISOString(), items: [{ id: 2, name: 'Suco de Laranja', price: 4.00 }], status: 'Pronto', payment_status: 'Pago', total: 4.00 },
];

export const mockUsers: Record<string, CtnAppUser> = {
    "admin@ctn.com": {
        id: 1,
        name: 'Admin Master',
        email: 'admin@ctn.com',
        role: 'GlobalAdmin',
        avatar: 'https://i.pravatar.cc/150?u=admin'
    },
    "escola@ctn.com": {
        id: 2,
        name: 'Diretor da Escola',
        email: 'escola@ctn.com',
        role: 'EscolaAdmin',
        schoolId: 1,
        avatar: 'https://i.pravatar.cc/150?u=escola'
    },
    "cantineiro@ctn.com": {
        id: 3,
        name: 'Cantineiro Chefe',
        email: 'cantineiro@ctn.com',
        role: 'Cantineiro',
        schoolId: 1,
        avatar: 'https://i.pravatar.cc/150?u=cantineiro'
    }
}
