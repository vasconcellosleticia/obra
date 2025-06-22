# Sistema de Cadastro de Obras - Backend

Backend desenvolvido em Node.js para gerenciamento de obras e fiscalizações.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Nodemailer** - Envio de emails
- **Express Validator** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logger HTTP
- **Compression** - Compressão de respostas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB (local ou MongoDB Atlas)
- Conta de email para envio (Gmail recomendado)

## 🔧 Instalação

1. Clone o repositório:
\`\`\`bash
git clone <url-do-repositorio>
cd backend
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Edite o arquivo \`.env\` com suas configurações:
\`\`\`env
MONGODB_URI=sua-string-de-conexao-mongodb
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
JWT_SECRET=sua-chave-secreta-jwt
\`\`\`

5. Popule o banco de dados com dados de exemplo:
\`\`\`bash
npm run populate
\`\`\`

6. Inicie o servidor:
\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm start
\`\`\`

## 📚 Documentação da API

### Base URL
\`\`\`
http://localhost:3000/api/v1
\`\`\`

### Endpoints - Obras

#### GET /obras
Lista todas as obras com paginação e filtros.

**Query Parameters:**
- \`page\` (number): Página (padrão: 1)
- \`limit\` (number): Itens por página (padrão: 10)
- \`status\` (string): Filtrar por status
- \`responsavel\` (string): Filtrar por responsável
- \`search\` (string): Busca por nome, descrição ou responsável
- \`sortBy\` (string): Campo para ordenação (padrão: createdAt)
- \`sortOrder\` (string): Ordem (asc/desc, padrão: desc)

**Exemplo de Resposta:**
\`\`\`json
{
  "success": true,
  "count": 5,
  "total": 5,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nome": "Construção do Edifício Residencial Alpha",
      "responsavel": "João Silva Santos",
      "dataInicio": "2024-01-15T00:00:00.000Z",
      "dataFim": "2024-12-15T00:00:00.000Z",
      "localizacao": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "descricao": "Construção de edifício residencial...",
      "foto": "data:image/jpeg;base64,...",
      "status": "Em Andamento",
      "orcamento": 2500000,
      "progresso": 45,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

#### GET /obras/:id
Busca uma obra específica por ID.

#### POST /obras
Cria uma nova obra.

**Body (JSON):**
\`\`\`json
{
  "nome": "Nome da Obra",
  "responsavel": "Nome do Responsável",
  "dataInicio": "2024-01-15",
  "dataFim": "2024-12-15",
  "localizacao": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "descricao": "Descrição detalhada da obra",
  "foto": "data:image/jpeg;base64,...",
  "status": "Planejada",
  "orcamento": 1000000,
  "progresso": 0
}
\`\`\`

#### PUT /obras/:id
Atualiza uma obra existente.

#### DELETE /obras/:id
Remove uma obra e todas as fiscalizações relacionadas.

#### GET /obras/:id/fiscalizacoes
Lista todas as fiscalizações de uma obra específica.

#### GET /obras/stats
Retorna estatísticas das obras.

### Endpoints - Fiscalizações

#### GET /fiscalizacoes
Lista todas as fiscalizações com paginação e filtros.

**Query Parameters:**
- \`page\` (number): Página
- \`limit\` (number): Itens por página
- \`status\` (string): Filtrar por status
- \`obra\` (string): ID da obra
- \`dataInicio\` (date): Data inicial
- \`dataFim\` (date): Data final

#### GET /fiscalizacoes/:id
Busca uma fiscalização específica por ID.

#### POST /fiscalizacoes
Cria uma nova fiscalização.

**Body (JSON):**
\`\`\`json
{
  "data": "2024-01-20",
  "status": "Em dia",
  "observacoes": "Obra progredindo conforme cronograma",
  "localizacao": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "foto": "data:image/jpeg;base64,...",
  "obra": "64f8a1b2c3d4e5f6a7b8c9d0",
  "fiscal": {
    "nome": "Eng. Carlos Mendes",
    "registro": "CREA-SP 123456"
  },
  "temperatura": 25,
  "condicaoClimatica": "Ensolarado",
  "nivelRisco": "Baixo"
}
\`\`\`

#### PUT /fiscalizacoes/:id
Atualiza uma fiscalização existente.

#### DELETE /fiscalizacoes/:id
Remove uma fiscalização.

#### GET /fiscalizacoes/stats
Retorna estatísticas das fiscalizações.

### Endpoints - Email

#### POST /email/obra/:id
Envia detalhes de uma obra por email.

**Body (JSON):**
\`\`\`json
{
  "email": "destinatario@email.com",
  "message": "Mensagem personalizada (opcional)"
}
\`\`\`

#### POST /email/fiscalizacao/:id
Envia detalhes de uma fiscalização por email.

#### POST /email/relatorio-obras
Envia relatório de múltiplas obras por email.

**Body (JSON):**
\`\`\`json
{
  "email": "destinatario@email.com",
  "filtros": {
    "status": "Em Andamento",
    "responsavel": "João"
  },
  "message": "Relatório mensal de obras"
}
\`\`\`

## 🔒 Validações

### Obra
- **nome**: 3-200 caracteres, obrigatório
- **responsavel**: 3-100 caracteres, obrigatório
- **dataInicio**: Data válida, obrigatória
- **dataFim**: Data válida, posterior à data de início, obrigatória
- **localizacao.latitude**: -90 a 90, obrigatória
- **localizacao.longitude**: -180 a 180, obrigatória
- **descricao**: 10-1000 caracteres, obrigatória
- **foto**: Base64 ou URL, obrigatória
- **status**: Enum válido (opcional)
- **orcamento**: Valor positivo (opcional)
- **progresso**: 0-100 (opcional)

### Fiscalização
- **data**: Data válida (opcional, padrão: agora)
- **status**: "Em dia", "Atrasada", "Parada", "Concluída"
- **observacoes**: 10-2000 caracteres, obrigatórias
- **localizacao**: Latitude/longitude válidas, obrigatórias
- **foto**: Base64 ou URL, obrigatória
- **obra**: ID MongoDB válido, obrigatório
- **fiscal.nome**: 3-100 caracteres (opcional)
- **temperatura**: -50 a 60°C (opcional)
- **condicaoClimatica**: Enum válido (opcional)
- **nivelRisco**: Enum válido (opcional)

## 🛡️ Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para origens específicas
- **Rate Limiting**: 100 requests por 15 minutos por IP
- **Validação**: Todos os inputs são validados
- **Error Handling**: Tratamento seguro de erros

## 📊 Monitoramento

- **Health Check**: \`GET /health\`
- **Logging**: Morgan para logs HTTP
- **Error Tracking**: Logs detalhados de erros

## 🧪 Testes

\`\`\`bash
npm test
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── obraController.js
│   │   ├── fiscalizacaoController.js
│   │   └── emailController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   ├── Obra.js
│   │   └── Fiscalizacao.js
│   ├── routes/
│   │   ├── obraRoutes.js
│   │   ├── fiscalizacaoRoutes.js
│   │   └── emailRoutes.js
│   ├── scripts/
│   │   └── populateDatabase.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
\`\`\`

## 🚀 Deploy

### Heroku
1. Instale o Heroku CLI
2. Faça login: \`heroku login\`
3. Crie o app: \`heroku create nome-do-app\`
4. Configure as variáveis: \`heroku config:set MONGODB_URI=...\`
5. Deploy: \`git push heroku main\`

### Vercel
1. Instale o Vercel CLI: \`npm i -g vercel\`
2. Execute: \`vercel\`
3. Configure as variáveis de ambiente no dashboard

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: \`git checkout -b feature/nova-feature\`
3. Commit: \`git commit -m 'Add nova feature'\`
4. Push: \`git push origin feature/nova-feature\`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
\`\`\`
