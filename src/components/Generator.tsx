'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Generator.module.css';
import TweetPreview from './TweetPreview';

// ── Types ─────────────────────────────────────────────────────────────────────
export type VerifyType = 'none' | 'blue' | 'gold' | 'gov';
export type TweetTheme = 'dark' | 'dim' | 'light';
export type Platform   = 'x' | 'twitter';
export type Format     = '1:1' | '4:5' | '9:16';
export type Tone       = 'provocativo' | 'educativo' | 'direto';
export type ThemeKey   = 'parasitas' | 'detox' | 'figado' | 'hormonios' | 'inflamacao' | 'rotina';

// ── Copy themes ────────────────────────────────────────────────────────────────
const THEMES: Record<ThemeKey, { name: string; desc: string; prompt: string }> = {
  parasitas:  { name: 'Parasitas ocultos',   desc: 'Sintomas silenciosos que você ignora',      prompt: 'parasitas intestinais ocultos e seus sintomas silenciosos: cansaço crônico, inchaço abdominal, compulsão por doces, baixa imunidade, dificuldade de emagrecer' },
  detox:      { name: 'Detox Hell',           desc: 'Reset metabólico profundo e agressivo',     prompt: 'o Detox Hell — reset metabólico agressivo que elimina toxinas, reduz inflamação e acelera o metabolismo em 21 dias' },
  figado:     { name: 'Saúde do fígado',      desc: 'Central de desintoxicação do corpo',        prompt: 'a importância crítica do fígado como central de desintoxicação e sinais de sobrecarga hepática que impactam energia, pele e humor' },
  hormonios:  { name: 'Hormônios & TPM',      desc: 'Toxinas, equilíbrio e saúde feminina',      prompt: 'a conexão direta entre acúmulo de toxinas, desequilíbrio hormonal, TPM intensa e menopausa precoce em mulheres' },
  inflamacao: { name: 'Anti-inflamatório',    desc: 'Alimentos que curam vs. que inflamam',      prompt: 'alimentos anti-inflamatórios que curam o corpo vs. alimentos ultra-processados que inflamam e sabotam o metabolismo' },
  rotina:     { name: 'Rotina Zero Toxinas',  desc: 'Hábitos sustentáveis no longo prazo',       prompt: 'como construir uma rotina sustentável Zero Toxinas com os 10 pilares diários de saúde sem viver em restrição' },
};

const CTAS = [
  'Acesse o Protocolo Zero Toxinas 21D no link da bio.',
  'Comece seu detox hoje. Link na bio.',
  'Conheça o protocolo completo. Link na bio.',
  'Salve esse post. Você vai precisar.',
];

const FORMAT_INFO: Record<Format, { px: string; label: string; width: number }> = {
  '1:1': { px: '1196 × 1196px · 2x · Feed quadrado',  label: '1:1', width: 460 },
  '4:5': { px: '960 × 1200px · 2x · Feed retrato',    label: '4:5', width: 380 },
  '9:16':{ px: '1080 × 1920px · 2x · Stories / Reels', label: '9:16', width: 300 },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Generator() {
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const tweetImgRef = useRef<HTMLInputElement>(null);

  // Profile
  const [displayName, setDisplayName] = useState('WILLIAM ARAUJO | Médico CRM-MG 76.962');
  const [handle,      setHandle]      = useState('drwilliamararujo');
  const [photoUrl,    setPhotoUrl]    = useState<string>('/dr-william.jpg');

  // Content
  const [tweetText,   setTweetText]   = useState('Enquanto você acumula toxinas sem saber, seu corpo vai mandando sinais. Cansaço sem motivo, inchaço, compulsão por doces. Não é frescura. É biologia. O Protocolo Zero Toxinas 21D foi criado para mudar isso. 🌿');
  const [tweetImgUrl, setTweetImgUrl] = useState<string | null>(null);

  // Settings
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

  // Copy panel
  const [copyTheme,   setCopyTheme]   = useState<ThemeKey>('parasitas');
  const [tone,        setTone]        = useState<Tone>('provocativo');
  const [cta,         setCta]         = useState(CTAS[0]);

  // UI state
  const [generating,  setGenerating]  = useState(false);
  const [downloading, setDownloading] = useState<'jpeg'|'png'|null>(null);
  const [toast,       setToast]       = useState('');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

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
    setDisplayName('WILLIAM ARAUJO | Médico CRM-MG 76.962');
    setHandle('drwilliamararujo');
    setTweetText('Enquanto você acumula toxinas sem saber, seu corpo vai mandando sinais. Cansaço sem motivo, inchaço, compulsão por doces. Não é frescura. É biologia. O Protocolo Zero Toxinas 21D foi criado para mudar isso. 🌿');
    setPhotoUrl('/dr-william.jpg');
  };

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

        {/* Format */}
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

        {/* Action buttons */}
        <div className={styles.actionBtns}>
          <button className={`${styles.actBtn} ${styles.actCopy}`} onClick={() => { navigator.clipboard.writeText(tweetText); showToast('✓ Texto copiado!'); }}>
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
        <div className={styles.previewTag}>
          <span className={styles.previewDot} /> PREVIEW · {format}
        </div>
        <div ref={previewRef} style={{width: FORMAT_INFO[format].width}}>
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
        </div>
        <div className={styles.pxInfo}>{FORMAT_INFO[format].px}</div>
        <div className={styles.hintBar}>
          Use <b>**texto**</b> para negrito · <span className={styles.blue}>@menções</span> e <span className={styles.blue}>#hashtags</span> ficam em azul
        </div>
      </main>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <aside className={styles.right}>
        <div className={styles.rightHeader}>
          <div className={styles.rightTitle}>ZERO TOXINAS COPY</div>
          <button style={{background:'none',border:'none',color:'var(--muted)',fontSize:18,cursor:'pointer'}}>×</button>
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
              <button key={t} className={`${styles.toneBtn} ${tone===t?styles.active:''}`} onClick={() => setTone(t)}>
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

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
