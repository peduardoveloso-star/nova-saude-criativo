'use client';
import { useState } from 'react';
import styles from './VideoGenerator.module.css';
import type { ThemeKey, Tone } from './Generator';

type VideoTab = 'scripts' | 'hooks' | 'angulos' | 'edicao';

interface Props {
  onClose: () => void;
  displayName: string;
  copyTheme: ThemeKey;
  themePrompt: string;
  themeName: string;
  tone: Tone;
}

const TAB_CONFIG: { key: VideoTab; label: string; desc: string; btnLabel: string }[] = [
  { key: 'scripts', label: 'Scripts', desc: 'Script completo com intro, desenvolvimento e CTA', btnLabel: 'Script' },
  { key: 'hooks',   label: 'Hooks',   desc: '5 ganchos de abertura ultra-impactantes (máx. 3s de leitura)', btnLabel: 'Hooks' },
  { key: 'angulos', label: 'Ângulos', desc: '5 ângulos estratégicos para abordar o tema de formas diferentes', btnLabel: 'Ângulos' },
  { key: 'edicao',  label: 'Edição',  desc: 'Estilo de edição, ritmo de cortes e referências visuais', btnLabel: 'Edição' },
];

function buildPrompt(tab: VideoTab, themePrompt: string, themeName: string, displayName: string, tone: string): string {
  const toneMap: Record<Tone, string> = {
    provocativo: 'provocativo e urgente, criando senso de perigo ou perda',
    educativo:   'educativo e acessível, com empatia e clareza',
    direto:      'direto e objetivo, sem rodeios',
  };
  const toneStr = toneMap[tone as Tone] || tone;
  const audience = 'mulheres de 31-50 anos (donas de casa, empresárias, funcionárias públicas) com cansaço extremo, barriga estufada, dificuldade de emagrecer, intestino preso e enxaqueca. Já tentaram dietas, nutricionistas e medicamentos sem resultado. Confiam muito no Dr. William há mais de 1 ano.';

  switch (tab) {
    case 'scripts':
      return `Crie um script de vídeo completo para ${displayName} sobre o tema: "${themeName}" (${themePrompt}).

Público: ${audience}
Tom: ${toneStr}

Estrutura obrigatória:
**[INTRO — 0-15s]**
(hook fortíssimo que prende imediatamente, cita a dor do público)

**[DESENVOLVIMENTO — 15-90s]**
(aprofunda o problema, apresenta a causa raiz: toxinas acumuladas, cita dados ou estudos breves, histórias reais)

**[SOLUÇÃO — 90-105s]**
(apresenta o Protocolo Zero Toxinas 21D como a solução, menciona transformação em 21 dias)

**[CTA — 105-120s]**
(chamada para ação clara, urgente e direta)

Escreva o script completo com as falas na íntegra, como se fosse ler na câmera.`;

    case 'hooks':
      return `Crie 5 hooks (ganchos de abertura) para vídeo sobre "${themeName}" para ${displayName}.

Público: ${audience}
Tom: ${toneStr}

Regras dos hooks:
- Máximo 2-3 segundos de leitura (15-20 palavras)
- Devem parar imediatamente o scroll
- Começar com uma afirmação chocante, pergunta ou dado surpreendente
- Não revelar a solução, apenas criar curiosidade máxima
- Usar linguagem do público feminino brasileiro

Numere de 1 a 5 e explique brevemente (1 linha) o mecanismo psicológico de cada hook.`;

    case 'angulos':
      return `Gere 5 ângulos criativos para criar conteúdo sobre "${themeName}" para ${displayName}.

Público: ${audience}
Tom: ${toneStr}

Para cada ângulo, forneça:
**Ângulo [N]: [Nome do Ângulo]**
- Premissa: (a ideia central)
- Hook de abertura: (como começar)
- Ponto de virada: (o momento que surpreende)
- Por que funciona: (mecanismo psicológico)

Os 5 ângulos obrigatórios: Dor Aguda, Curiosidade Científica, Autoridade Médica, Transformação Real, Urgência Temporal.`;

    case 'edicao':
      return `Sugira um guia completo de edição de vídeo para conteúdo sobre "${themeName}" do ${displayName}.

Público: ${audience}

Inclua:

**Ritmo e Cortes**
(ritmo ideal, frequência de cortes, como evitar perda de atenção)

**B-roll e Imagens**
(tipos de cenas de apoio que reforçam a mensagem)

**Legendas**
(estilo, tamanho, posição, cor — otimizado para visualização sem áudio)

**Trilha Sonora**
(mood, BPM sugerido, referências de estilo musical)

**Efeitos e Transições**
(quais usar e quais evitar para credibilidade médica)

**Referências Visuais**
(contas, canais ou estilos de edição que funcionam bem para esse tipo de conteúdo)

**Elementos de Retenção**
(técnicas específicas para manter o espectador até o final)`;
  }
}

export default function VideoGenerator({ onClose, displayName, copyTheme, themePrompt, themeName, tone }: Props) {
  const [activeTab, setActiveTab] = useState<VideoTab>('scripts');
  const [generating, setGenerating] = useState(false);
  const [outputs, setOutputs] = useState<Record<VideoTab, string>>({
    scripts: '', hooks: '', angulos: '', edicao: '',
  });
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setGenerating(true);
    const prompt = buildPrompt(activeTab, themePrompt, themeName, displayName, tone);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Você é especialista em criação de conteúdo de vídeo para saúde e detox no Instagram e TikTok. Trabalha com ${displayName} e conhece profundamente o produto Protocolo Zero Toxinas 21D. Escreva sempre em português brasileiro, de forma clara, persuasiva e com autoridade médica. Formate bem a resposta usando markdown com negrito e seções.`,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b: { text?: string }) => b.text || '').join('') || 'Erro ao gerar.';
      setOutputs(prev => ({ ...prev, [activeTab]: text }));
    } catch {
      setOutputs(prev => ({ ...prev, [activeTab]: 'Erro ao gerar. Tente novamente.' }));
    }
    setGenerating(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(outputs[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentConfig = TAB_CONFIG.find(t => t.key === activeTab)!;
  const hasOutput = !!outputs[activeTab];

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.icon}>🎬</span>
            <div>
              <div className={styles.title}>GERADOR DE VÍDEO</div>
              <div className={styles.sub}>Tema: {themeName}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TAB_CONFIG.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {outputs[t.key] && <span className={styles.tabDot} />}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.topBar}>
            <p className={styles.desc}>{currentConfig.desc}</p>
            <button
              className={styles.genBtn}
              onClick={generate}
              disabled={generating}
            >
              {generating ? (
                <><span className={styles.spinner} /> Gerando...</>
              ) : (
                `✦ Gerar ${currentConfig.btnLabel}`
              )}
            </button>
          </div>

          <div className={styles.outputWrap}>
            {hasOutput ? (
              <pre className={styles.output}>{outputs[activeTab]}</pre>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  {activeTab === 'scripts' ? '📝' : activeTab === 'hooks' ? '⚡' : activeTab === 'angulos' ? '🎯' : '🎞'}
                </div>
                <div className={styles.emptyTitle}>Nenhum conteúdo gerado ainda</div>
                <div className={styles.emptyDesc}>Clique em &ldquo;Gerar {currentConfig.btnLabel}&rdquo; acima</div>
              </div>
            )}
          </div>

          {hasOutput && (
            <div className={styles.footer}>
              <button className={styles.copyBtn} onClick={copyOutput}>
                {copied ? '✓ Copiado!' : '📋 Copiar tudo'}
              </button>
              <button className={styles.regenBtn} onClick={generate} disabled={generating}>
                ↺ Regenerar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
