# **App Name**: CTNADMIN

## Core Features:

- Autenticação de Usuário: Autenticar usuários (Admin, Escola, Cantineiro) via Firebase Auth com declarações de função personalizadas.
- Controle de Acesso Baseado em Função: Controlar o acesso a rotas e componentes com base na função do usuário (Admin, Escola, Cantineiro).
- Espelhamento de Dados para o Firestore: Espelhar dados essenciais (usuários, escolas, cantinas, produtos, pedidos) do backend Laravel/MySQL para o Firestore para exibição em tempo real.
- Painel de Administração: Fornecer uma visão geral das métricas relevantes com base na função do usuário.
- Gerenciamento de CRUD: Permitir operações CRUD (Criar, Ler, Atualizar, Excluir) para escolas, cantinas, produtos, usuários e pedidos, comunicando-se com a API Laravel.
- Geração de Relatórios: Gerar relatórios e estatísticas com base em dados de vendas, pedidos, produtos e consumo da API Laravel.
- Ferramenta de tratamento de erros: Utilize uma ferramenta alimentada por LLM para lidar com erros, identificando problemas e possíveis correções que melhoram a experiência do usuário quando as solicitações à API falham. Se surgirem problemas com permissões de segurança com as configurações do Firestore, envie sugestões imediatamente.

## Style Guidelines:

- Cor primária: Laranja Aeroespacial (#FC5407) para uma sensação ousada e enérgica.
- Cor de fundo: Rosa Champagne (#FFE7D4) para um pano de fundo suave e convidativo; um tom mais claro do primário.
- Cor de destaque: Marrom Arenoso (#FBAF72) para elementos interativos e destaques, para uma alternativa harmoniosa e mais suave ao primário altamente saturado.
- Fonte do corpo e do título: 'Inter', uma fonte sans-serif, com tamanhos que variam de text-sm a text-4xl para títulos, e usando font-semibold para títulos.
- Use ícones consistentes para navegação e ações em todo o painel.
- Implemente uma barra de navegação lateral dinâmica (menu que se adapta à função do usuário), um cabeçalho fixo (busca global, perfil, alternância de tema), cards em painéis, tabelas responsivas (filtros e paginação), modais para confirmação, toasts/snackbars para feedback.
- Incorpore animações e transições sutis para uma experiência de usuário suave (por exemplo, esqueletos de carregamento).