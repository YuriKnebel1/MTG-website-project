# Guia de Contribuição

Obrigado por seu interesse em contribuir com o MTG Manager! Este guia irá ajudá-lo a começar.

## 🚀 Como Contribuir

### 1. Configuração do Ambiente

```bash
# Clone o repositório
git clone <repository-url>
cd MTG-website

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Configure o banco de dados
npm run db:generate
npm run db:migrate

# Inicie o servidor de desenvolvimento
npm run dev
```

### 2. Fluxo de Desenvolvimento

1. **Fork** o repositório
2. **Crie uma branch** para sua feature: `git checkout -b feature/nova-feature`
3. **Faça suas alterações** seguindo os padrões do projeto
4. **Execute os testes**: `npm test`
5. **Commit suas mudanças**: `git commit -m 'feat: adiciona nova feature'`
6. **Push para sua branch**: `git push origin feature/nova-feature`
7. **Abra um Pull Request**

## 📋 Padrões de Código

### TypeScript
- Use TypeScript para todos os arquivos
- Defina tipos explícitos quando necessário
- Evite `any` - prefira `unknown` ou tipos específicos

### Componentes React
```tsx
// ✅ Bom
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  return <div>{title}</div>;
}

// ❌ Evitar
export function Component(props: any) {
  return <div>{props.title}</div>;
}
```

### Estilização
- Use Tailwind CSS para estilos
- Prefira classes utilitárias
- Use o sistema de design existente (components/ui)

### APIs
- Sempre inclua tratamento de erros com try/catch
- Use status codes HTTP apropriados
- Retorne respostas consistentes

```typescript
// ✅ Bom
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
```

## 🧪 Testes

### Executando Testes
```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage

# Testes end-to-end
npm run test:e2e

# Testes em modo watch
npm run test:watch
```

### Escrevendo Testes

**Testes de Componentes:**
```tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

**Testes de API:**
```typescript
import { GET } from '../api/route';

describe('/api/endpoint', () => {
  it('returns correct data', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
  });
});
```

## 📝 Convenções de Commit

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Mudanças que não afetam o significado do código
- `refactor`: Mudança de código que não corrige bug nem adiciona feature
- `test`: Adicionando ou corrigindo testes
- `chore`: Mudanças no processo de build ou ferramentas auxiliares

### Exemplos
```
feat(auth): adiciona autenticação com Google
fix(api): corrige erro de timeout na busca de cartas
docs: atualiza README com instruções de setup
test(collection): adiciona testes para componente de coleção
```

## 🎯 Áreas para Contribuição

### 🚀 Prioridade Alta
- [ ] Testes automatizados (unitários e e2e)
- [ ] Melhorias de acessibilidade (a11y)
- [ ] Otimizações de performance
- [ ] Documentação de componentes

### 🔄 Funcionalidades
- [ ] Sistema de deck building
- [ ] Integração com mais APIs de preços
- [ ] Sistema de wishlist
- [ ] Notificações de preço
- [ ] Import/export de listas

### 🎨 UI/UX
- [ ] Modo escuro completo
- [ ] Animações e transições
- [ ] Responsividade mobile
- [ ] Componentes de filtros avançados

### 🔧 Infraestrutura
- [ ] Setup de staging environment
- [ ] Monitoring e logging
- [ ] Backup de banco de dados
- [ ] Deploy automatizado

## 🐛 Reportando Bugs

Use o template de issue para reportar bugs:

```markdown
**Descreva o bug**
Uma descrição clara do que está acontecendo.

**Para Reproduzir**
Passos para reproduzir:
1. Vá para '...'
2. Clique em '....'
3. Scroll down para '....'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara do que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots do problema.

**Ambiente:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

## 💡 Sugestões de Features

Para sugerir novas funcionalidades:

1. Verifique se já não existe uma issue similar
2. Descreva claramente o problema que a feature resolve
3. Explique como a feature funcionaria
4. Adicione mockups ou exemplos se possível

## 📞 Comunicação

- **Issues**: Para bugs e feature requests
- **Discussions**: Para perguntas e discussões gerais
- **Pull Requests**: Para contribuições de código

## 🎖️ Reconhecimento

Todos os contribuidores serão reconhecidos no README e releases.

Obrigado por contribuir! 🚀
