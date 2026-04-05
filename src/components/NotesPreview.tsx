'use client';
import styles from './NotesPreview.module.css';
import type { Format } from './Generator';

interface Props {
  text: string;
  authorName: string;
  dtMode: 'now' | 'custom';
  customDt: string;
  format: Format;
  width: number;
}

function getHeight(format: Format, width: number) {
  if (format === '1:1') return width;
  if (format === '4:5') return Math.round(width * 5 / 4);
  return Math.round(width * 16 / 9);
}

function formatDate(dtMode: 'now' | 'custom', customDt: string) {
  const d = dtMode === 'custom' && customDt ? new Date(customDt) : new Date();
  return {
    date: d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function NotesPreview({ text, authorName, dtMode, customDt, format, width }: Props) {
  const height = getHeight(format, width);
  const { date, time } = formatDate(dtMode, customDt);

  return (
    <div className={styles.wrap} style={{ width, height }}>
      {/* iOS-style header */}
      <div className={styles.header}>
        <span className={styles.back}>‹ Notas</span>
        <span className={styles.done}>Concluído</span>
      </div>

      {/* Date + time */}
      <div className={styles.meta}>
        <span className={styles.metaDate}>{date}</span>
        <span className={styles.metaTime}>{time}</span>
      </div>

      {/* Ruled content area */}
      <div className={styles.noteBody}>
        <div className={styles.ruled}>
          {text.split('\n').map((line, i) => (
            <div key={i} className={styles.ruleLine}>{line || '\u00A0'}</div>
          ))}
        </div>
      </div>

      {/* Author footer */}
      <div className={styles.footer}>— {authorName}</div>
    </div>
  );
}
