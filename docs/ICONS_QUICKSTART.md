# Guia Rápido - Ícones Heroicons

## 🚀 Como Adicionar Ícones em Novos Componentes

### 1. Importar no TypeScript

```typescript
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroHome,
  heroUser,
  heroPlusCircle 
} from '@ng-icons/heroicons/outline';

@Component({
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [
    provideIcons({ heroHome, heroUser, heroPlusCircle })
  ]
})
```

### 2. Usar no HTML

```html
<ng-icon name="heroHome" size="24"></ng-icon>
```

## 📋 Ícones Mais Usados

```typescript
// NAVEGAÇÃO
import {
  heroHome,
  heroArrowLeft,
  heroArrowRight,
  heroXMark
} from '@ng-icons/heroicons/outline';

// AÇÕES
import {
  heroPlusCircle,
  heroPencil,
  heroTrash,
  heroMagnifyingGlass,
  heroArrowPath
} from '@ng-icons/heroicons/outline';

// USUÁRIO
import {
  heroUser,
  heroEnvelope,
  heroLockClosed,
  heroArrowRightOnRectangle
} from '@ng-icons/heroicons/outline';

// STATUS
import {
  heroCheckCircle,
  heroExclamationCircle,
  heroInformationCircle
} from '@ng-icons/heroicons/outline';

// PROJETO/TAREFAS
import {
  heroFolderOpen,
  heroDocumentText,
  heroCalendar,
  heroClock
} from '@ng-icons/heroicons/outline';
```

## 🎨 Exemplo Completo

```typescript
// meu-componente.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlusCircle,
  heroTrash,
  heroPencil
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-meu-componente',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
    <button>
      <ng-icon name="heroPlusCircle" size="20"></ng-icon>
      Adicionar
    </button>
    
    <button>
      <ng-icon name="heroPencil" size="18"></ng-icon>
      Editar
    </button>
    
    <button>
      <ng-icon name="heroTrash" size="18"></ng-icon>
      Deletar
    </button>
  `,
  viewProviders: [
    provideIcons({ heroPlusCircle, heroTrash, heroPencil })
  ]
})
export class MeuComponente {}
```

## 💡 Dicas

1. **Sempre importe apenas os ícones que vai usar** - otimiza o bundle
2. **Use tamanhos consistentes**: 14-16 (pequeno), 18-20 (médio), 24-32 (grande)
3. **Para animação de loading**: use `heroArrowPath` com classe `spin-icon`
4. **Todos os nomes começam com `hero`** - exemplo: `heroHome`, `heroUser`

## 🔍 Buscar Ícones

Visite: https://heroicons.com/

Basta adicionar o prefixo `hero` e converter para camelCase:
- "arrow-right" → `heroArrowRight`
- "plus-circle" → `heroPlusCircle`
- "exclamation-circle" → `heroExclamationCircle`
