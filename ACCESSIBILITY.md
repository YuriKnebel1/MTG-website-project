# Guia de Acessibilidade - MTG Manager

Este documento descreve as práticas de acessibilidade implementadas no projeto e como mantê-las.

## 🎯 Objetivos de Acessibilidade

O MTG Manager segue as diretrizes WCAG 2.1 nível AA para garantir que a aplicação seja acessível para todos os usuários, incluindo pessoas com deficiências.

## ✅ Implementações de Acessibilidade

### 1. **Navegação por Teclado**

- **Tab navigation**: Todos os elementos interativos são acessíveis via teclado
- **Focus management**: Estados de foco visíveis e lógicos
- **Escape key**: Fecha modais e dropdowns
- **Enter/Space**: Ativa botões e links

```tsx
// Exemplo: Botão com foco adequado
<Button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-label="Fazer login"
>
  Entrar
</Button>
```

### 2. **ARIA Labels e Landmarks**

- **Semantic HTML**: Uso correto de elementos semânticos
- **ARIA roles**: Role definidos para componentes customizados
- **ARIA labels**: Descrições claras para elementos
- **Landmarks**: Navegação estruturada

```tsx
// Exemplo: Navegação com landmarks
<nav role="navigation" aria-label="Navegação principal">
  <ul role="menubar">
    <li role="menuitem">
      <Link aria-label="Ir para dashboard">Dashboard</Link>
    </li>
  </ul>
</nav>
```

### 3. **Formulários Acessíveis**

- **Labels explícitos**: Todos os campos têm labels associados
- **Validation feedback**: Mensagens de erro claras
- **Required fields**: Indicação clara de campos obrigatórios
- **Input types**: Tipos apropriados para diferentes dados

```tsx
// Exemplo: Campo de formulário acessível
<div className="space-y-2">
  <Label htmlFor="email" className="text-sm font-medium">
    Email *
  </Label>
  <Input
    id="email"
    name="email"
    type="email"
    required
    aria-describedby="email-error"
    aria-invalid={hasError ? 'true' : 'false'}
  />
  {hasError && (
    <div id="email-error" role="alert" aria-live="assertive">
      Por favor, insira um email válido
    </div>
  )}
</div>
```

### 4. **Modais e Overlays**

- **Focus trapping**: Foco mantido dentro do modal
- **Escape handling**: Fechar com ESC
- **Backdrop clicks**: Fechar clicando fora
- **ARIA modal**: Propriedades aria-modal e role="dialog"

```tsx
// Exemplo: Modal acessível
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Título do Modal</h2>
  <p id="modal-description">Descrição do conteúdo</p>
</div>
```

### 5. **Feedback e Estados**

- **Live regions**: Atualizações dinâmicas anunciadas
- **Loading states**: Indicadores de carregamento
- **Error messages**: Mensagens de erro claras
- **Success feedback**: Confirmações de ações

```tsx
// Exemplo: Live region para feedback
<div
  role="status"
  aria-live="polite"
  className="sr-only"
>
  {statusMessage}
</div>

<div
  role="alert"
  aria-live="assertive"
>
  {errorMessage}
</div>
```

### 6. **Imagens e Mídia**

- **Alt text**: Descrições significativas para imagens
- **Decorative images**: aria-hidden="true" para imagens decorativas
- **Icons**: Textos alternativos apropriados

```tsx
// Exemplo: Uso correto de imagens
<Image
  src="/card-image.jpg"
  alt="Lightning Bolt - Carta de mágica instantânea que causa 3 pontos de dano"
  width={300}
  height={400}
/>

<Sparkles className="h-5 w-5" aria-hidden="true" />
```

## 🛠️ Ferramentas de Teste

### 1. **Testes Automatizados**

```bash
# Executar testes de acessibilidade
npm run test:a11y

# Verificar com axe-core
npm run test:axe
```

### 2. **Ferramentas do Navegador**

- **Chrome DevTools**: Lighthouse Accessibility Audit
- **Firefox DevTools**: Accessibility Inspector
- **WAVE**: Web Accessibility Evaluation Tool
- **axe DevTools**: Extension para Chrome/Firefox

### 3. **Testes Manuais**

- Navegação apenas com teclado (Tab, Shift+Tab, Enter, Escape)
- Teste com leitores de tela (NVDA, JAWS, VoiceOver)
- Verificação de contraste de cores
- Teste em diferentes tamanhos de tela

## 📋 Checklist de Acessibilidade

### ✅ **Estrutura e Navegação**

- [ ] Hierarquia de headings lógica (h1, h2, h3...)
- [ ] Landmarks semânticos (nav, main, aside, footer)
- [ ] Ordem de tabulação lógica
- [ ] Skip links implementados
- [ ] Breadcrumbs quando apropriado

### ✅ **Formulários**

- [ ] Labels associados a todos os inputs
- [ ] Mensagens de erro claras e específicas
- [ ] Campos obrigatórios indicados
- [ ] Validação em tempo real acessível
- [ ] Instruções claras para preenchimento

### ✅ **Interatividade**

- [ ] Todos os elementos interativos acessíveis por teclado
- [ ] Estados de foco visíveis
- [ ] Feedback adequado para ações
- [ ] Timeouts configuráveis quando necessário
- [ ] Confirmações para ações destrutivas

### ✅ **Conteúdo**

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande
- [ ] Texto redimensionável até 200%
- [ ] Sem dependência apenas de cor para informação
- [ ] Animações podem ser pausadas/desabilitadas

### ✅ **Mídia**

- [ ] Alt text descritivo para imagens informativas
- [ ] aria-hidden para imagens decorativas
- [ ] Legendas para vídeos
- [ ] Transcrições para áudio

## 🔄 Processo de Desenvolvimento

### 1. **Durante o Desenvolvimento**

- Usar semantic HTML sempre que possível
- Testar navegação por teclado em cada componente
- Verificar contraste de cores no design
- Implementar ARIA apenas quando necessário

### 2. **Code Review**

- Verificar se novos componentes seguem padrões de acessibilidade
- Testar com lighthouse/axe
- Validar HTML semantic
- Revisar labels e descriptions

### 3. **Antes do Deploy**

- Executar audit completo de acessibilidade
- Testar com leitores de tela
- Verificar em diferentes dispositivos
- Validar performance de acessibilidade

## 📚 Recursos Adicionais

### **Documentação**

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### **Ferramentas**

- [axe-core](https://github.com/dequelabs/axe-core)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### **Testes com Leitores de Tela**

- **Windows**: NVDA (gratuito), JAWS
- **macOS**: VoiceOver (built-in)
- **Mobile**: TalkBack (Android), VoiceOver (iOS)

## 🎯 Metas Futuras

- [ ] Implementar modo de alto contraste
- [ ] Adicionar suporte para preferências de movimento reduzido
- [ ] Melhorar feedback tátil em dispositivos móveis
- [ ] Implementar navegação por voz
- [ ] Adicionar suporte para múltiplos idiomas
- [ ] Certificação WCAG 2.1 AA completa

---

**Nota**: A acessibilidade é um processo contínuo. Este guia deve ser atualizado conforme novas funcionalidades são adicionadas ao projeto.
