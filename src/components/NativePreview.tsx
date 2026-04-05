'use client';
import styles from './NativePreview.module.css';
import type { Format } from './Generator';

interface Props {
  text: string;
  bgImageUrl: string | null;
  textBg: string;
  format: Format;
  width: number;
}

function getHeight(format: Format, width: number) {
  if (format === '1:1') return width;
  if (format === '4:5') return Math.round(width * 5 / 4);
  return Math.round(width * 16 / 9);
}

function textColor(bg: string) {
  if (bg === 'transparent') return '#fff';
  if (bg === '#ffffff' || bg === 'white') return '#000';
  // For custom colors, detect brightness
  try {
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
  } catch {
    return '#fff';
  }
}

export default function NativePreview({ text, bgImageUrl, textBg, format, width }: Props) {
  const height = getHeight(format, width);
  const color = textColor(textBg);

  const bgStyle = bgImageUrl
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: '#1a1a1a' };

  return (
    <div className={styles.wrap} style={{ width, height, ...bgStyle }}>
      {!bgImageUrl && (
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🖼</span>
          <span className={styles.placeholderText}>Adicione uma imagem de fundo</span>
        </div>
      )}

      <div
        className={styles.caption}
        style={{
          background: textBg === 'transparent' ? 'transparent' : textBg,
          color,
        }}
      >
        <p className={styles.captionText} style={{ color }}>
          {text || 'Seu texto aparece aqui...'}
        </p>
      </div>
    </div>
  );
}
