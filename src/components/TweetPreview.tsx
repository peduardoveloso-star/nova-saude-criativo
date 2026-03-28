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
  return dt.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' });
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
  none: '', blue: '#1d9bf0', gold: '#f4b400', gov: '#829aab',
};

export default function TweetPreview({ displayName, handle, photoUrl, tweetText, tweetImgUrl, dtMode, customDt, verify, tweetTheme, platform, showEng, replies, reposts, likes, views, bookmarks }: Props) {
  const themeClass = tweetTheme === 'dim' ? styles.dim : tweetTheme === 'light' ? styles.light : styles.dark;

  return (
    <div className={`${styles.wrap} ${themeClass}`}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.ava}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photoUrl && <img src={photoUrl} alt="avatar" />}
          </div>
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{displayName}</span>
              {verify !== 'none' && (
                <svg className={styles.badge} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill={BADGE_COLORS[verify]} />
                  <path d="M9.5 16.5l-3.5-3.5 1.4-1.4 2.1 2.1 5.1-5.1 1.4 1.4z" fill="white" />
                </svg>
              )}
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

        {/* Body */}
        <div className={styles.body}>{formatText(tweetText)}</div>

        {/* Tweet image */}
        {tweetImgUrl && (
          <div className={styles.tweetImg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tweetImgUrl} alt="tweet image" />
          </div>
        )}

        {/* Meta */}
        <div className={styles.border}>
          <div className={styles.meta}>{formatDate(dtMode, customDt)}</div>
          {showEng && (
            <div className={styles.engRow}>
              <span className={styles.engItem}><b>{bookmarks}</b> Bookmarks</span>
            </div>
          )}
        </div>

        <hr className={styles.divider} />

        {/* Engagement bar */}
        {showEng && (
          <div className={styles.bottom}>
            <div className={styles.engBar}>
              <span className={styles.engAction}>💬 {replies}</span>
              <span className={styles.engAction}>🔁 {reposts}</span>
              <span className={styles.engAction}>♡ {likes}</span>
              <span className={styles.engAction}>📊 {views}</span>
              <span className={styles.engAction}>🔖 {bookmarks}</span>
              <span className={styles.engAction} style={{marginLeft:'auto'}}>⬆</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
