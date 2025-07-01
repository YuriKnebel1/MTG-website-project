# MTG Manager 🎴

Sistem### 🔄 EM ANDAMENTO

5. **Integração com APIs de preços reais** - Estrutura preparada
6. **Sistema de completude de coleção** - Modelos de dados prontos
7. **Importação/exportação de decklists** - Planejado

### 🧪 TESTES REALIZADOS

- **✅ Registro de usuários** - Criação funcionando via API e interface
- **✅ Login com credenciais** - Autenticação validada e funcionando
- **✅ Proteção de rotas** - Middleware bloqueando acessos não autorizados
- **✅ Persistência de sessão** - JWT funcionando corretamente
- **✅ Hash de senhas** - bcrypt implementado com segurança
- **✅ Interface responsiva** - Design funcional em diferentes telas

### 🎮 Status Atual: SISTEMA PRONTO PARA USO! 🚀pleto para gerenciamento de coleção de Magic: The Gathering desenvolvido com Next.js, TypeScript, Prisma e NextAuth.

## 🎯 Status do Projeto

### ✅ CONCLUÍDO - Design e Autenticação (100% Funcional)

- **✅ Design moderno das páginas de login e registro** com UI polida, gradientes, feedbacks visuais
- **✅ Sistema de autenticação funcional** com NextAuth, hash de senha, proteção de rotas
- **✅ Login automático após registro** com redirecionamento para dashboard
- **✅ Proteção de rotas** via middleware - usuários só acessam páginas protegidas se autenticados
- **✅ Salvamento correto no banco** - usuários, senhas hasheadas, sessões funcionando
- **✅ Página home informativa** com credenciais de teste visíveis
- **✅ Feedback de erros e loading** em todas as operações de autenticação
- **✅ Testes automatizados** confirmando funcionamento completo

### 🎯 OBJETIVOS INICIAIS - STATUS

1. ✅ **Design para páginas de login e registro** - ✨ CONCLUÍDO COM SUCESSO
2. ✅ **Sistema de login e registro organizado** - ✨ FUNCIONANDO PERFEITAMENTE
3. ✅ **Proteção de páginas e login automático** - ✨ IMPLEMENTADO E TESTADO
4. ✅ **Salvamento no banco de dados** - ✨ FUNCIONANDO PARA AUTH

### � EM ANDAMENTO

5. **Integração com APIs de preços reais** - Estrutura preparada
6. **Sistema de completude de coleção** - Modelos de dados prontos
7. **Importação/exportação de decklists** - Planejado

## 🎮 Como Testar

### Credenciais de Teste

- **Email:** `admin@teste.com`
- **Senha:** `123456`

### Fluxo de Teste

1. Acesse `http://localhost:3000`
2. Use as credenciais de teste OU registre uma nova conta
3. Após login, será redirecionado para `/dashboard`
4. Teste navegação entre páginas protegidas

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Backend**: Next.js API Routes, NextAuth
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: NextAuth com provider de credenciais + bcrypt
- **APIs**: Integração com Scryfall para dados de cartas

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd mgt-website
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados**

```bash
npx prisma db push
npx prisma generate
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

6. **Acesse o sistema**

Abra `http://localhost:3000` no navegador.

## 📱 Funcionalidades Implementadas

### 🔐 Autenticação

- [x] Registro de usuários com validação
- [x] Login com email/senha
- [x] Hash seguro de senhas (bcrypt)
- [x] Sessões JWT persistentes
- [x] Proteção de rotas via middleware
- [x] Logout funcional
- [x] Redirecionamento automático

### 🎨 Interface

- [x] Design moderno e responsivo
- [x] Gradientes e animações
- [x] Feedback visual (loading, erros, sucesso)
- [x] Tema escuro/claro
- [x] Componentes reutilizáveis (Radix UI)

### 📊 Dashboard e Navegação

- [x] Dashboard protegido
- [x] Navbar com status de login
- [x] Páginas de coleção, decks, meta, preços
- [x] Busca de cartas (Scryfall)

## 🗄️ Estrutura do Banco

### Modelos Implementados

- **User**: usuários do sistema
- **Card**: cartas do MTG
- **UserCard**: cartas na coleção do usuário
- **Deck**: decks criados
- **DeckCard**: cartas nos decks
- **PriceHistory**: histórico de preços
- **MetaDeck**: decks populares do meta

## 🔧 Endpoints API

### Autenticação

- `POST /api/auth/register` - Registro de usuários
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/auth/session` - Sessão atual

### Debug/Teste

- `GET /api/health` - Status do sistema + usuário teste
- `GET /api/test` - Criar usuário de teste

## 📋 Próximos Passos

### 🎯 Fase 2 - Funcionalidades Core

- [ ] **Busca de cartas**: Melhorar integração Scryfall
- [ ] **Adicionar cartas à coleção**: Interface para gerenciar cartas
- [ ] **Sistema de decks**: Construtor de decks funcional
- [ ] **Dashboard**: Estatísticas da coleção

### 🎯 Fase 3 - Integrações

- [ ] **APIs de preços**: Liga Magic, TCGPlayer
- [ ] **Importação de decklists**: MTGGoldfish, EDHRec
- [ ] **Completude de coleções**: Por set/bloco
- [ ] **Alertas de preços**: Notificações

### 🎯 Fase 4 - Avançado

- [ ] **Análise de meta**: Comparar com coleção
- [ ] **Relatórios**: Valor total, estatísticas
- [ ] **Exportação**: CSV, JSON, decklists
- [ ] **API pública**: Para desenvolvedores

## 🐛 Debug e Troubleshooting

### Problemas Comuns

1. **Erro de autenticação**

   - Verifique se `NEXTAUTH_SECRET` está definido
   - Confirme se o banco está sincronizado: `npx prisma db push`

2. **Erro de banco de dados**

   - Execute: `npx prisma generate`
   - Verifique se `DATABASE_URL` está correto

3. **Erro de dependências**
   - Execute: `npm install`
   - Limpe cache: `npm run clean` (se disponível)

### Logs Úteis

- NextAuth debug está habilitado em desenvolvimento
- Logs de autenticação aparecem no terminal
- Erros de API estão no console do navegador

## 🔒 Segurança

- [x] Senhas hasheadas com bcrypt (salt 12)
- [x] Sessões JWT com expiração (30 dias)
- [x] Validação de entrada em todos endpoints
- [x] Proteção CSRF (NextAuth)
- [x] Variáveis de ambiente para secrets

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

**Desenvolvido com ❤️ para a comunidade MTG**

````

2. **Instale as dependências**

```bash
npm install
````

3. **Configure o banco de dados**

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrações
npx prisma migrate dev --name init
```

4. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

5. **Execute o projeto**

```bash
npm run dev
```

6. **Acesse o site**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                      # App Router do Next.js
│   ├── api/                  # API Routes
│   │   ├── auth/            # Autenticação NextAuth
│   │   └── collection/      # Endpoints da coleção
│   ├── cards/               # Páginas de cartas
│   ├── collection/          # Páginas da coleção
│   ├── decks/              # Páginas de decks
│   ├── meta/               # Páginas de meta decks
│   ├── prices/             # Páginas de preços
│   ├── dashboard/          # Dashboard principal
│   ├── login/              # Página de login
│   ├── register/           # Página de cadastro
│   └── layout.tsx          # Layout principal
├── components/             # Componentes React
│   ├── ui/                # Componentes de UI base
│   ├── navbar.tsx         # Navegação
│   └── footer.tsx         # Rodapé
├── lib/                   # Utilitários
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Utilitários gerais
└── prisma/               # Schema e migrações do banco
```

## 🎮 Como usar

### 1. Criar uma conta

- Acesse a página inicial
- Clique em "Cadastrar"
- Preencha nome, email e senha
- Faça login com suas credenciais

### 2. Adicionar cartas à coleção

- Vá para "Buscar Cartas" no menu
- Digite o nome da carta que possui
- Clique em "Adicionar à Coleção"
- A carta será salva em sua coleção pessoal

### 3. Visualizar sua coleção

- Acesse "Minha Coleção" no menu
- Veja todas suas cartas organizadas
- Controle quantidades e visualize detalhes

### 4. Explorar meta decks

- Vá para "Meta Decks"
- Veja os decks mais populares
- Compare com sua coleção pessoal

### 5. Monitorar preços

- Acesse "Preços" no menu
- Busque cartas específicas
- Acompanhe variações (recursos em desenvolvimento)

## 🗄️ Banco de Dados

O projeto usa SQLite com Prisma. O schema inclui:

- **Users**: Usuários do sistema
- **Cards**: Catálogo de cartas MTG
- **UserCards**: Cartas na coleção dos usuários
- **Decks**: Decks criados pelos usuários
- **DeckCards**: Cartas em cada deck
- **MetaDecks**: Decks populares no meta
- **PriceHistory**: Histórico de preços

## 🔌 APIs Integradas

### Scryfall API

- Busca de cartas completa
- Dados oficiais e atualizados
- Imagens de alta qualidade
- Informações detalhadas (tipo, custo, poder, etc.)

### APIs de Preços (Planejadas)

- Liga Magic (Brasil)
- TCGPlayer (Internacional)
- CardMarket (Europa)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Próximos Passos

- [ ] Implementar integração real com APIs de preços
- [ ] Sistema avançado de deck building
- [ ] Análise de completude de decks vs coleção
- [ ] Sistema de alertas de preços
- [ ] Importação de decklists de sites populares
- [ ] Relatórios detalhados da coleção
- [ ] Sistema de backup e sincronização
- [ ] App mobile com React Native

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Disclaimer

Este projeto não é afiliado à Wizards of the Coast. Magic: The Gathering é uma marca registrada da Wizards of the Coast LLC.

---

Desenvolvido com ❤️ para a comunidade MTG
