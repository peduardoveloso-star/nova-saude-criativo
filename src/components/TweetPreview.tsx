'use client';
import styles from './TweetPreview.module.css';
import type { VerifyType, TweetTheme, Platform } from './Generator';

interface Props {
  displayName: string;
  handle: string;
  photoUrl: string;
  tweetText: string;
  tweetImgUrl: string | null;
  dtMode: 'now' | 'custom';
  customDt: string;
  verify: VerifyType;
  tweetTheme: TweetTheme;
  platform: Platform;
  showEng: boolean;
  replies: string;
  reposts: string;
  likes: string;
  views: string;
  bookmarks: string;
}

function formatDate(dtMode: 'now'|'custom', customDt: string) {
  const dt = dtMode === 'custom' && customDt ? new Date(customDt) : new Date();
  return dt.toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatText(raw: string) {
  return raw
    .split('\n')
    .map(line => {
      const parts: React.ReactNode[] = [];
      const regex = /(\*\*(.+?)\*\*)|(@\w+)|(#\w+)/g;
      let last = 0; let m; let i = 0;
      while ((m = regex.exec(line)) !== null) {
        if (m.index > last) parts.push(<span key={i++}>{line.slice(last, m.index)}</span>);
        if (m[1]) parts.push(<strong key={i++}>{m[2]}</strong>);
        else if (m[3]) parts.push(<span key={i++} className={styles.blue}>{m[3]}</span>);
        else if (m[4]) parts.push(<span key={i++} className={styles.blue}>{m[4]}</span>);
        last = regex.lastIndex;
      }
      if (last < line.length) parts.push(<span key={i++}>{line.slice(last)}</span>);
      return parts;
    })
    .reduce((acc: React.ReactNode[], line, i, arr) => {
      acc.push(...(line as React.ReactNode[]));
      if (i < arr.length - 1) acc.push(<br key={`br-${i}`} />);
      return acc;
    }, []);
}

const BADGE_COLORS: Record<VerifyType, string> = {
  none: '#1d9bf0', blue: '#1d9bf0', gold: '#f4b400', gov: '#829aab',
};

function IconReply() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 7.501 3.58 7.501 8 0 4.27-2.93 7.67-7.05 8.18l.024.82H12.7c-.57 0-1.053-.402-1.172-.96l-.133-.62c-.108-.508.245-1 .764-1.083C15.226 16.67 17.623 13.6 17.623 10c0-2.96-2.13-6-5.501-6H9.756C6.505 4 3.751 6.92 3.751 10c0 2.99 1.965 5.42 4.703 6.18-.196.34-.308.73-.308 1.14v.68H7.11c-3.63-.5-5.36-3.71-5.36-8z"/></svg>;
}
function IconRepost() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>;
}
function IconLike() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>;
}
function IconViews() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>;
}
function IconBookmark() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/></svg>;
}
function IconShare() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.12 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>;
}

export default function TweetPreview({ displayName, handle, photoUrl, tweetText, tweetImgUrl, dtMode, customDt, verify, tweetTheme, platform, showEng, replies, reposts, likes, views, bookmarks }: Props) {
  const themeClass = tweetTheme === 'dim' ? styles.dim : tweetTheme === 'light' ? styles.light : styles.dark;

  return (
    <div className={`${styles.wrap} ${themeClass}`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.ava}>
            {photoUrl && <img src={photoUrl} alt="avatar" />}
          </div>
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{displayName}</span>
              <svg className={styles.badge} viewBox="0 0 24 24">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.441c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.437 1.69-.882.445-.47.749-1.055.878-1.688.13-.633.08-1.29-.144-1.896.587-.274 1.087-.705 1.443-1.245.356-.54.555-1.17.574-1.817zm-6.8 2.794l-3.4 3.399-2-2 .8-.8 1.2 1.2 2.6-2.6.8.801z" fill={BADGE_COLORS[verify]}/>
              </svg>
            </div>
            <div className={styles.handleText}>@{handle}</div>
          </div>
          {platform === 'x' ? (
            <svg className={styles.logo} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          ) : (
            <svg className={styles.logo} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          )}
        </div>

        <div className={styles.body}>{formatText(tweetText)}</div>

        {tweetImgUrl && (
          <div className={styles.tweetImg}>
            <img src={tweetImgUrl} alt="tweet image" />
          </div>
        )}

        <div className={styles.meta}>{formatDate(dtMode, customDt)}</div>
        <hr className={styles.divider} />

        {showEng && (
          <div className={styles.engBar}>
            <div className={styles.engAction}><IconReply /><span>{replies}</span></div>
            <div className={styles.engAction}><IconRepost /><span>{reposts}</span></div>
            <div className={styles.engAction}><IconLike /><span>{likes}</span></div>
            <div className={styles.engAction}><IconViews /><span>{views}</span></div>
            <div className={styles.engAction}><IconBookmark /><span>{bookmarks}</span></div>
            <div className={styles.engAction} style={{marginLeft:'auto'}}><IconShare /></div>
          </div>
        )}
      </div>
    </div>
  );
}
