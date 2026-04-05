'use client';
import { useState, useRef, useCallback } from 'react';
import styles from './Generator.module.css';
import TweetPreview from './TweetPreview';
import NotesPreview from './NotesPreview';
import QuestionPreview from './QuestionPreview';
import NativePreview from './NativePreview';
import VideoGenerator from './VideoGenerator';

// ── Types ─────────────────────────────────────────────────────────────────────
export type VerifyType    = 'none' | 'blue' | 'gold' | 'gov';
export type TweetTheme    = 'dark' | 'dim' | 'light';
export type Platform      = 'x' | 'twitter';
export type Format        = '1:1' | '4:5' | '9:16';
export type Tone          = 'provocativo' | 'educativo' | 'direto';
export type ThemeKey      = 'cansaco' | 'inchaço' | 'emagrecer' | 'hormonios' | 'cancer' | 'gravidez' | 'menopausa' | 'intestino';
export type TemplateType  = 'twitter' | 'notes' | 'question' | 'native';

// ── Copy themes ────────────────────────────────────────────────────────────────
const THEMES: Record<ThemeKey, { name: string; desc: string; prompt: string }> = {
  cansaco:   { name: 'Cansaço ao acordar',      desc: 'Acorda exausta mesmo dormindo horas',        prompt: 'cansaço extremo ao acordar — mulheres que dormem 8h e acordam exaustas, sem energia para trabalhar ou cuidar dos filhos, já testaram de tudo sem resultado. A causa real é o acúmulo de toxinas que sobrecarregam o fígado e impedem a recuperação celular durante o sono' },
  inchaço:   { name: 'Inchaço & Barriga',       desc: 'Barriga estufada mesmo comendo bem',         prompt: 'inchaço abdominal crônico, barriga estufada, gases, retenção de líquido nas mãos e pés — mulheres que se alimentam bem mas continuam inchadas, pois a raiz do problema é inflamação intestinal e toxinas acumuladas, não a dieta' },
  emagrecer: { name: 'Dificuldade de emagrecer', desc: 'Faz tudo certo e a balança não mexe',        prompt: 'dificuldade crônica de emagrecer mesmo com dieta e exercício — mulheres que já tentaram tudo: nutricionistas, dietas, shakes, medicamentos, mas o peso não sai. O motivo real é que o corpo intoxicado bloqueia o metabolismo e a queima de gordura' },
  hormonios: { name: 'Hormônios desregulados',  desc: 'TPM intensa, ciclo irregular, humor',        prompt: 'desregulação hormonal causada por acúmulo de toxinas — TPM intensa, ciclo irregular, humor instável, dores de cabeça hormonais, menopausa antecipada. As toxinas ambientais agem como disruptores endócrinos e sabotam o equilíbrio hormonal feminino' },
  cancer:    { name: 'Medo de adoecer',         desc: 'Medo de câncer, envelhecer doente',          prompt: 'medo real de desenvolver doenças graves como câncer, Alzheimer e doenças autoimunes — mulheres com histórico familiar ou que sentem que o corpo está pedindo socorro. O acúmulo silencioso de toxinas ao longo dos anos é um dos principais fatores de risco ignorados pela medicina tradicional' },
  gravidez:  { name: 'Fertilidade & Gestação',  desc: 'Querendo engravidar com saúde',              prompt: 'mulheres que querem engravidar ou ter uma gestação saudável e descobriram que toxinas acumuladas no corpo comprometem a fertilidade, a qualidade dos óvulos e a saúde do bebê. A desintoxicação antes da gestação é fundamental e ignorada pela maioria dos médicos' },
  menopausa: { name: 'Menopausa & Longevidade', desc: 'Envelhecer com saúde e disposição',          prompt: 'mulheres na perimenopausa e menopausa que querem envelhecer com saúde, disposição e autonomia — sem depender de remédios, sem engordar, sem perder a energia. A desintoxicação nessa fase potencializa os hormônios remanescentes e melhora drasticamente a qualidade de vida' },
  intestino: { name: 'Intestino & Digestão',    desc: 'Preso, gases, digestão lenta',               prompt: 'intestino preso, gases crônicos, digestão lenta, permeabilidade intestinal — mulheres que já foram a médicos e nutricionistas sem solução. O intestino inflamado por toxinas é a raiz de mais de 70% dos sintomas que as mulheres relatam: cansaço, inchaço, queda de cabelo, enxaqueca e até depressão' },
};

const CTAS = [
  'Clique em Saiba Mais e conheça o Protocolo Zero Toxinas 21D.',
  'Acesse o Protocolo Zero Toxinas 21D no link da bio.',
  'Comece seu detox hoje. Link na bio.',
  'Salve esse post — você vai precisar.',
  'Manda pra uma amiga que precisa ver isso.',
  'Conheça o protocolo completo. Link na bio.',
];

const FORMAT_INFO: Record<Format, { px: string; label: string; width: number }> = {
  '1:1':  { px: '1196 × 1196px · 2x · Feed quadrado',   label: '1:1',  width: 460 },
  '4:5':  { px: '960 × 1200px · 2x · Feed retrato',     label: '4:5',  width: 380 },
  '9:16': { px: '1080 × 1920px · 2x · Stories / Reels', label: '9:16', width: 300 },
};

const TEMPLATE_OPTIONS: { key: TemplateType; icon: string; label: string }[] = [
  { key: 'twitter',  icon: '𝕏',  label: 'X / Twitter'    },
  { key: 'notes',    icon: '📝', label: 'Bloco de Notas' },
  { key: 'question', icon: '💬', label: 'Pergunta'       },
  { key: 'native',   icon: '🖼', label: 'Nativo'         },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Generator() {
  const previewRef      = useRef<HTMLDivElement>(null);
  const fileRef         = useRef<HTMLInputElement>(null);
  const tweetImgRef     = useRef<HTMLInputElement>(null);
  const questionBgRef   = useRef<HTMLInputElement>(null);
  const nativeBgRef     = useRef<HTMLInputElement>(null);

  // Template
  const [templateType,  setTemplateType]  = useState<TemplateType>('twitter');

  // Profile
  const [displayName, setDisplayName] = useState('Dr. William Araujo');
  const [handle,      setHandle]      = useState('drwilliamararujo');
  const [photoUrl,    setPhotoUrl]    = useState<string>('/dr-william.jpg');

  // Content (shared across templates)
  const [tweetText,   setTweetText]   = useState('Enquanto você acumula toxinas sem saber, seu corpo vai mandando sinais. Cansaço sem motivo, inchaço, compulsão por doces. Não é frescura. É biologia. O Protocolo Zero Toxinas 21D foi criado para mudar isso. 🌿');
  const [tweetImgUrl, setTweetImgUrl] = useState<string | null>(null);

  // Twitter settings
  const [dtMode,      setDtMode]      = useState<'now'|'custom'>('now');
  const [customDt,    setCustomDt]    = useState('');
  const [verify,      setVerify]      = useState<VerifyType>('none');
  const [tweetTheme,  setTweetTheme]  = useState<TweetTheme>('dark');
  const [platform,    setPlatform]    = useState<Platform>('x');
  const [showEng,     setShowEng]     = useState(true);
  const [replies,     setReplies]     = useState('847');
  const [reposts,     setReposts]     = useState('2.341');
  const [likes,       setLikes]       = useState('18,4K');
  const [views,       setViews]       = useState('1,2M');
  const [bookmarks,   setBookmarks]   = useState('3,1K');
  const [format,      setFormat]      = useState<Format>('1:1');

  // Question template
  const [questionLabel,  setQuestionLabel]  = useState('FAÇA-ME UMA PERGUNTA');
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [questionBg,     setQuestionBg]     = useState('#000000');
  const [questionBgImg,  setQuestionBgImg]  = useState<string | null>(null);

  // Native template
  const [nativeBgImg,  setNativeBgImg]  = useState<string | null>(null);
  const [nativeTextBg, setNativeTextBg] = useState('#000000cc');

  // Copy panel
  const [copyTheme, setCopyTheme] = useState<ThemeKey>('cansaco');
  const [tone,      setTone]      = useState<Tone>('provocativo');
  const [cta,       setCta]       = useState(CTAS[0]);

  // UI state
  const [generating,    setGenerating]    = useState(false);
  const [downloading,   setDownloading]   = useState<'jpeg'|'png'|null>(null);
  const [toast,         setToast]         = useState('');
  const [showVideoGen,  setShowVideoGen]  = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  // ── File handlers ────────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTweetImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setTweetImgUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleQuestionBgImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setQuestionBgImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleNativeBgImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNativeBgImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Download ─────────────────────────────────────────────────────────────────
  const downloadImg = async (fmt: 'jpeg' | 'png') => {
    if (!previewRef.current) return;
    setDownloading(fmt);
    showToast('Gerando imagem...');
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false,
      });
      const mimeType = fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality  = fmt === 'jpeg' ? 0.95 : undefined;
      const dataUrl  = canvas.toDataURL(mimeType, quality);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `criativo-zerotoxinas.${fmt}`;
      a.click();
      showToast('✓ Download concluído!');
    } catch {
      showToast('Erro ao gerar imagem.');
    }
    setDownloading(null);
  };

  // ── Generate copy ─────────────────────────────────────────────────────────────
  const generateCopy = async () => {
    setGenerating(true);
    const toneMap: Record<Tone, string> = {
      provocativo: 'provocativo e urgente, criando senso de perigo ou perda',
      educativo:   'educativo e acessível, explicando com clareza e empatia',
      direto:      'direto e objetivo, sem rodeios',
    };
    const system = `Você é especialista em copywriting para saúde e detox no Instagram. Crie posts no estilo de prints de tweet para o "Protocolo Zero Toxinas 21D" do ${displayName}.\n\nRetorne APENAS JSON válido, sem markdown:\n{"tweet":"texto (máx 280 chars, quebras de linha, emojis, **negrito**, @menções, #hashtags)"}`;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system,
          messages: [{ role: 'user', content: `Tema: ${THEMES[copyTheme].prompt}\nTom: ${toneMap[tone]}\nCTA: "${cta}"\nAutor: ${displayName}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b: { text?: string }) => b.text || '').join('').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(text);
      setTweetText(parsed.tweet);
    } catch {
      showToast('Erro ao gerar. Tente novamente.');
    }
    setGenerating(false);
  };

  const reset = () => {
    setDisplayName('Dr. William Araujo');
    setHandle('drwilliamararujo');
    setTweetText('Enquanto você acumula toxinas sem saber, seu corpo vai mandando sinais. Cansaço sem motivo, inchaço, compulsão por doces. Não é frescura. É biologia. O Protocolo Zero Toxinas 21D foi criado para mudar isso. 🌿');
    setPhotoUrl('/dr-william.jpg');
    setTweetImgUrl(null);
    setQuestionAnswer('');
    setQuestionBgImg(null);
    setNativeBgImg(null);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const copyText = () => {
    const text = templateType === 'question' ? questionAnswer : tweetText;
    navigator.clipboard.writeText(text);
    showToast('✓ Texto copiado!');
  };

  const previewWidth = FORMAT_INFO[format].width;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.app}>
      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <aside className={styles.left}>
        <div className={styles.logoBar}>
          <div className={styles.logoWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="A Nova Saúde" className={styles.logoImg} />
            <div>
              <div className={styles.logoName}>A NOVA SAÚDE</div>
              <div className={styles.logoSub}>Gerador de criativos</div>
            </div>
          </div>
          <button className={styles.resetBtn} onClick={reset}>Resetar</button>
        </div>

        {/* ── TWITTER-specific sections ──────────────────────────────────── */}
        {templateType === 'twitter' && (
          <>
            {/* Profile quick */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Perfil Rápido</div>
              <div className={styles.profileRow}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className={styles.pAva}><img src={photoUrl} alt="avatar" /></div>
                <div>
                  <div className={styles.pName}>Dr. William Araujo</div>
                  <div className={styles.pHandle}>@drwilliamararujo</div>
                </div>
                <div className={styles.pDot} />
              </div>
              <div className={styles.hint}>Passe o mouse no avatar para trocar a foto</div>
            </section>

            {/* Profile edit */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Perfil</div>
              <label className={styles.fieldLabel}>Avatar</label>
              <div className={styles.avatarRow}>
                <div className={styles.avatarPreview} onClick={() => fileRef.current?.click()}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="avatar" />
                </div>
                <div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>WA</div>
                  <div className={styles.removePhoto} onClick={() => setPhotoUrl('')}>Remover foto</div>
                </div>
              </div>
              <input type="file" ref={fileRef} accept="image/*" onChange={handlePhotoChange} />

              <label className={styles.fieldLabel}>Nome de exibição</label>
              <input className={styles.inp} value={displayName} onChange={e => setDisplayName(e.target.value)} />

              <label className={styles.fieldLabel} style={{marginTop:10}}>@ Handle</label>
              <div className={styles.handleRow}>
                <span className={styles.atSign}>@</span>
                <input className={styles.inp} style={{borderRadius:'0 8px 8px 0'}} value={handle} onChange={e => setHandle(e.target.value)} />
              </div>
            </section>

            {/* Content */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Conteúdo</div>
              <label className={styles.fieldLabel}>Texto do tweet</label>
              <textarea className={styles.inp} style={{minHeight:100,resize:'vertical',lineHeight:1.5}} value={tweetText} onChange={e => setTweetText(e.target.value)} />
              <div className={styles.charCount} style={{color: tweetText.length > 280 ? '#e0243a' : 'var(--muted)'}}>
                {tweetText.length} / 280
              </div>

              <label className={styles.fieldLabel} style={{marginTop:10}}>Imagem no tweet (opcional)</label>
              <div className={styles.imgDrop} onClick={() => tweetImgRef.current?.click()}>+ Adicionar imagem</div>
              <input type="file" ref={tweetImgRef} accept="image/*" onChange={handleTweetImg} />
              {tweetImgUrl && (
                <div style={{position:'relative',marginTop:8}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tweetImgUrl} alt="tweet img" style={{width:'100%',borderRadius:8,maxHeight:110,objectFit:'cover'}} />
                  <button onClick={() => setTweetImgUrl(null)} style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,.7)',border:'none',color:'#fff',borderRadius:'50%',width:22,height:22,cursor:'pointer',fontSize:13}}>×</button>
                </div>
              )}
            </section>

            {/* Date/time */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Data e Hora</div>
              <div className={styles.seg}>
                <button className={`${styles.segBtn} ${dtMode==='now'?styles.active:''}`} onClick={() => setDtMode('now')}>Agora</button>
                <button className={`${styles.segBtn} ${dtMode==='custom'?styles.active:''}`} onClick={() => setDtMode('custom')}>Personalizado</button>
              </div>
              {dtMode === 'custom' && (
                <input type="datetime-local" className={styles.inp} style={{marginTop:8}} value={customDt} onChange={e => setCustomDt(e.target.value)} />
              )}
            </section>

            {/* Verification */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Verificação</div>
              <div className={styles.verifyRow}>
                {(['none','blue','gold','gov'] as VerifyType[]).map(v => (
                  <button key={v} className={`${styles.vBtn} ${verify===v?styles.active:''}`} onClick={() => setVerify(v)}>
                    {v !== 'none' && <span className={styles.vDot} style={{background:v==='blue'?'#1d9bf0':v==='gold'?'#f4b400':'#829aab'}} />}
                    {v==='none'?'Nenhum':v.charAt(0).toUpperCase()+v.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            {/* Tweet theme */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Tema</div>
              <div className={styles.seg}>
                {(['light','dim','dark'] as TweetTheme[]).map(t => (
                  <button key={t} className={`${styles.segBtn} ${tweetTheme===t?styles.active:''}`} onClick={() => setTweetTheme(t)}>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            {/* Platform */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Plataforma</div>
              <div className={styles.seg}>
                <button className={`${styles.segBtn} ${platform==='x'?styles.active:''}`} onClick={() => setPlatform('x')}>X (atual)</button>
                <button className={`${styles.segBtn} ${platform==='twitter'?styles.active:''}`} onClick={() => setPlatform('twitter')}>Twitter</button>
              </div>
            </section>

            {/* Engagement */}
            <section className={styles.section}>
              <div className={styles.secTitle}>Engajamento</div>
              <div className={styles.toggleRow}>
                <span style={{fontSize:13}}>Mostrar barra de ações</span>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={showEng} onChange={e => setShowEng(e.target.checked)} />
                  <span className={styles.tslider} />
                </label>
              </div>
              <div className={styles.fieldRow}>
                <div><label className={styles.fieldLabel}>Replies</label><input className={styles.inp} value={replies} onChange={e => setReplies(e.target.value)} /></div>
                <div><label className={styles.fieldLabel}>Reposts</label><input className={styles.inp} value={reposts} onChange={e => setReposts(e.target.value)} /></div>
              </div>
              <div className={styles.fieldRow} style={{marginTop:8}}>
                <div><label className={styles.fieldLabel}>Likes</label><input className={styles.inp} value={likes} onChange={e => setLikes(e.target.value)} /></div>
                <div><label className={styles.fieldLabel}>Views</label><input className={styles.inp} value={views} onChange={e => setViews(e.target.value)} /></div>
              </div>
              <div style={{maxWidth:140,marginTop:8}}><label className={styles.fieldLabel}>Bookmarks</label><input className={styles.inp} value={bookmarks} onChange={e => setBookmarks(e.target.value)} /></div>
            </section>
          </>
        )}

        {/* ── NOTES-specific sections ────────────────────────────────────── */}
        {templateType === 'notes' && (
          <>
            <section className={styles.section}>
              <div className={styles.secTitle}>Autor</div>
              <label className={styles.fieldLabel}>Nome do autor (rodapé)</label>
              <input className={styles.inp} value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </section>

            <section className={styles.section}>
              <div className={styles.secTitle}>Conteúdo</div>
              <label className={styles.fieldLabel}>Texto da nota</label>
              <textarea className={styles.inp} style={{minHeight:140,resize:'vertical',lineHeight:1.6}} value={tweetText} onChange={e => setTweetText(e.target.value)} />
            </section>

            <section className={styles.section}>
              <div className={styles.secTitle}>Data e Hora</div>
              <div className={styles.seg}>
                <button className={`${styles.segBtn} ${dtMode==='now'?styles.active:''}`} onClick={() => setDtMode('now')}>Agora</button>
                <button className={`${styles.segBtn} ${dtMode==='custom'?styles.active:''}`} onClick={() => setDtMode('custom')}>Personalizado</button>
              </div>
              {dtMode === 'custom' && (
                <input type="datetime-local" className={styles.inp} style={{marginTop:8}} value={customDt} onChange={e => setCustomDt(e.target.value)} />
              )}
            </section>
          </>
        )}

        {/* ── QUESTION-specific sections ─────────────────────────────────── */}
        {templateType === 'question' && (
          <>
            <section className={styles.section}>
              <div className={styles.secTitle}>Caixa de Pergunta</div>
              <label className={styles.fieldLabel}>Label do topo</label>
              <input className={styles.inp} value={questionLabel} onChange={e => setQuestionLabel(e.target.value)} placeholder="FAÇA-ME UMA PERGUNTA" />

              <label className={styles.fieldLabel} style={{marginTop:4}}>Resposta / texto central</label>
              <textarea className={styles.inp} style={{minHeight:100,resize:'vertical',lineHeight:1.6}} value={questionAnswer} onChange={e => setQuestionAnswer(e.target.value)} placeholder="Digite a sua resposta aqui..." />
            </section>

            <section className={styles.section}>
              <div className={styles.secTitle}>Fundo</div>

              <label className={styles.fieldLabel}>Cor de fundo</label>
              <div className={styles.colorRow}>
                {['#000000','#ffffff','#1a1a2e','#0d47a1','#880e4f','#1b5e20'].map(c => (
                  <button
                    key={c}
                    className={`${styles.colorSwatch} ${questionBg===c && !questionBgImg ? styles.swatchActive : ''}`}
                    style={{background:c, border: c === '#ffffff' ? '1px solid #ccc' : 'none'}}
                    onClick={() => { setQuestionBg(c); setQuestionBgImg(null); }}
                  />
                ))}
                <label className={styles.colorPickerLabel}>
                  <span className={styles.colorPickerIcon}>🎨</span>
                  <input type="color" value={questionBg} onChange={e => { setQuestionBg(e.target.value); setQuestionBgImg(null); }} className={styles.colorPickerInput} />
                </label>
              </div>

              <label className={styles.fieldLabel} style={{marginTop:10}}>Ou imagem de fundo</label>
              <div className={styles.imgDrop} onClick={() => questionBgRef.current?.click()}>
                {questionBgImg ? '✓ Imagem adicionada — trocar' : '+ Adicionar imagem de fundo'}
              </div>
              <input type="file" ref={questionBgRef} accept="image/*" onChange={handleQuestionBgImg} />
              {questionBgImg && (
                <button className={styles.removeImgBtn} onClick={() => setQuestionBgImg(null)}>× Remover imagem</button>
              )}
            </section>
          </>
        )}

        {/* ── NATIVE-specific sections ───────────────────────────────────── */}
        {templateType === 'native' && (
          <>
            <section className={styles.section}>
              <div className={styles.secTitle}>Conteúdo</div>
              <label className={styles.fieldLabel}>Texto sobreposto</label>
              <textarea className={styles.inp} style={{minHeight:120,resize:'vertical',lineHeight:1.6}} value={tweetText} onChange={e => setTweetText(e.target.value)} />
            </section>

            <section className={styles.section}>
              <div className={styles.secTitle}>Imagem de Fundo</div>
              <div className={styles.imgDrop} onClick={() => nativeBgRef.current?.click()}>
                {nativeBgImg ? '✓ Imagem adicionada — trocar' : '+ Adicionar imagem de fundo'}
              </div>
              <input type="file" ref={nativeBgRef} accept="image/*" onChange={handleNativeBgImg} />
              {nativeBgImg && (
                <button className={styles.removeImgBtn} onClick={() => setNativeBgImg(null)}>× Remover imagem</button>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.secTitle}>Fundo do Texto</div>
              <div className={styles.colorRow}>
                {[
                  { label: 'Transp.',  value: 'transparent' },
                  { label: 'Preto',    value: '#000000cc'   },
                  { label: 'Branco',   value: '#ffffffcc'   },
                ].map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.textBgBtn} ${nativeTextBg===opt.value ? styles.active : ''}`}
                    onClick={() => setNativeTextBg(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
                <label className={styles.colorPickerLabel} title="Cor personalizada">
                  <span className={styles.colorPickerIcon}>🎨</span>
                  <input type="color" value={nativeTextBg.replace(/cc$/, '')} onChange={e => setNativeTextBg(e.target.value + 'cc')} className={styles.colorPickerInput} />
                </label>
              </div>
            </section>
          </>
        )}

        {/* ── Format (all templates) ─────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.secTitle}>Formato</div>
          <div className={styles.fmtGrid}>
            {(['1:1','4:5','9:16'] as Format[]).map(f => (
              <div key={f} className={`${styles.fmtCard} ${format===f?styles.active:''}`} onClick={() => setFormat(f)}>
                <div className={styles.fmtIcon}>{f==='1:1'?'⬛':f==='4:5'?'▬':'▮'}</div>
                <div className={styles.fmtName}>{f}</div>
                <div className={styles.fmtSub}>{FORMAT_INFO[f].px.split('·').pop()?.trim()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Action buttons ─────────────────────────────────────────────── */}
        <div className={styles.actionBtns}>
          <button className={`${styles.actBtn} ${styles.actCopy}`} onClick={copyText}>
            📋 Copiar
          </button>
          <button className={`${styles.actBtn} ${styles.actJpeg}`} onClick={() => downloadImg('jpeg')} disabled={downloading==='jpeg'}>
            {downloading==='jpeg' ? '...' : '⬆ JPEG'}
          </button>
          <button className={`${styles.actBtn} ${styles.actPng}`} onClick={() => downloadImg('png')} disabled={downloading==='png'}>
            {downloading==='png' ? '...' : '⬆ PNG'}
          </button>
        </div>
      </aside>

      {/* ── CENTER ──────────────────────────────────────────────────────── */}
      <main className={styles.center}>
        {/* Template selector */}
        <div className={styles.templateSelector}>
          {TEMPLATE_OPTIONS.map(t => (
            <button
              key={t.key}
              className={`${styles.templateBtn} ${templateType===t.key ? styles.templateActive : ''}`}
              onClick={() => setTemplateType(t.key)}
            >
              <span className={styles.templateIcon}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.previewTag}>
          <span className={styles.previewDot} /> PREVIEW · {format}
        </div>

        <div ref={previewRef} style={{width: previewWidth}}>
          {templateType === 'twitter' && (
            <TweetPreview
              displayName={displayName}
              handle={handle}
              photoUrl={photoUrl}
              tweetText={tweetText}
              tweetImgUrl={tweetImgUrl}
              dtMode={dtMode}
              customDt={customDt}
              verify={verify}
              tweetTheme={tweetTheme}
              platform={platform}
              showEng={showEng}
              replies={replies}
              reposts={reposts}
              likes={likes}
              views={views}
              bookmarks={bookmarks}
            />
          )}
          {templateType === 'notes' && (
            <NotesPreview
              text={tweetText}
              authorName={displayName}
              dtMode={dtMode}
              customDt={customDt}
              format={format}
              width={previewWidth}
            />
          )}
          {templateType === 'question' && (
            <QuestionPreview
              questionLabel={questionLabel}
              answerText={questionAnswer}
              bgColor={questionBg}
              bgImageUrl={questionBgImg}
              format={format}
              width={previewWidth}
            />
          )}
          {templateType === 'native' && (
            <NativePreview
              text={tweetText}
              bgImageUrl={nativeBgImg}
              textBg={nativeTextBg}
              format={format}
              width={previewWidth}
            />
          )}
        </div>

        <div className={styles.pxInfo}>{FORMAT_INFO[format].px}</div>

        {templateType === 'twitter' && (
          <div className={styles.hintBar}>
            Use <b>**texto**</b> para negrito · <span className={styles.blue}>@menções</span> e <span className={styles.blue}>#hashtags</span> ficam em azul
          </div>
        )}
      </main>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <aside className={styles.right}>
        <div className={styles.rightHeader}>
          <div className={styles.rightTitle}>ZERO TOXINAS COPY</div>
          <button
            className={styles.videoGenTrigger}
            onClick={() => setShowVideoGen(true)}
            title="Abrir Gerador de Vídeo"
          >
            🎬 Vídeo
          </button>
        </div>

        <div className={styles.sectionR}>
          <div className={styles.secTitle}>Tema</div>
          <div className={styles.themeList}>
            {(Object.keys(THEMES) as ThemeKey[]).map(key => (
              <div key={key} className={`${styles.themeCard} ${copyTheme===key?styles.active:''}`} onClick={() => setCopyTheme(key)}>
                <div className={styles.tcName}>{THEMES[key].name}</div>
                <div className={styles.tcDesc}>{THEMES[key].desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionR}>
          <div className={styles.secTitle}>Tom</div>
          <div className={styles.toneSeg}>
            {(['provocativo','educativo','direto'] as Tone[]).map(t => (
              <button key={t} className={`${styles.toneBtn} ${tone===t ? styles.active : ''}`} onClick={() => setTone(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sectionR}>
          <div className={styles.secTitle}>CTA</div>
          <div className={styles.ctaList}>
            {CTAS.map(c => (
              <div key={c} className={`${styles.ctaItem} ${cta===c?styles.active:''}`} onClick={() => setCta(c)}>{c}</div>
            ))}
          </div>
        </div>

        <div className={styles.sectionR}>
          <button className={styles.genBtn} onClick={generateCopy} disabled={generating}>
            {generating ? 'Gerando...' : 'Gerar Copy'}
          </button>
        </div>
      </aside>

      {/* ── VIDEO GENERATOR MODAL ──────────────────────────────────────── */}
      {showVideoGen && (
        <VideoGenerator
          onClose={() => setShowVideoGen(false)}
          displayName={displayName}
          copyTheme={copyTheme}
          themePrompt={THEMES[copyTheme].prompt}
          themeName={THEMES[copyTheme].name}
          tone={tone}
        />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
