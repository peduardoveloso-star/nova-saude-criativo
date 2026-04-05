'use client';
import styles from './QuestionPreview.module.css';
import type { Format } from './Generator';

interface Props {
  questionLabel: string;
  answerText: string;
  bgColor: string;
  bgImageUrl: string | null;
  format: Format;
  width: number;
}

function getHeight(format: Format, width: number) {
  if (format === '1:1') return width;
  if (format === '4:5') return Math.round(width * 5 / 4);
  return Math.round(width * 16 / 9);
}

export default function QuestionPreview({ questionLabel, answerText, bgColor, bgImageUrl, format, width }: Props) {
  const height = getHeight(format, width);

  const bgStyle = bgImageUrl
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: bgColor };

  return (
    <div className={styles.wrap} style={{ width, height, ...bgStyle }}>
      <div className={styles.box}>
        {/* Sticker header */}
        <div className={styles.boxHeader}>
          <span className={styles.bubble}>💬</span>
          <span className={styles.label}>{questionLabel || 'FAÇA-ME UMA PERGUNTA'}</span>
        </div>

        <div className={styles.divider} />

        {/* Answer area */}
        <div className={styles.answer}>
          {answerText || <span className={styles.placeholder}>Toque para digitar...</span>}
        </div>
      </div>
    </div>
  );
}
