# A Nova Saúde — Gerador de Criativos

Gerador de posts estáticos estilo X/Twitter para Instagram, com IA integrada via Claude.

## Setup

### 1. Adicionar as imagens
Coloque os arquivos na pasta `public/`:
- `public/logo.png` — Logo da A Nova Saúde
- `public/dr-william.jpg` — Foto do Dr. William Araujo

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variável de ambiente
Crie o arquivo `.env.local` na raiz do projeto:
```
ANTHROPIC_API_KEY=sua_chave_aqui
```
Obtenha sua chave em: https://console.anthropic.com

### 4. Rodar localmente
```bash
npm run dev
```
Acesse http://localhost:3000

## Deploy no Vercel

1. Faça push para um repositório GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Adicione a variável de ambiente `ANTHROPIC_API_KEY` nas configurações do projeto
4. Deploy automático ✅

## Funcionalidades
- Preview ao vivo de post estilo X/Twitter
- Geração de copy com IA (Claude Sonnet)
- 6 temas baseados no Protocolo Zero Toxinas 21D
- Tom: Provocativo / Educativo / Direto
- Download em PNG e JPEG via html2canvas
- Formatos: 1:1 (Feed), 4:5 (Retrato), 9:16 (Stories/Reels)
- Verificação: Azul, Ouro, Gov
- Tema do tweet: Escuro, Dim, Claro
- Plataforma: X / Twitter
- Engajamento customizável

## Adicionando novos templates (futuro)
Cada template novo (bloco de notas, caixa de pergunta, etc.) pode ser criado como um componente separado em `src/components/` e adicionado ao seletor de templates no `Generator.tsx`.
