'use client';
import styles from './NativePreview.module.css';
import type { Format } from './Generator';

export interface TextBlock {
  id: string;
  text: string;
  bgColor: string;
  position: 'top' | 'middle' | 'bottom';
}

interface Props {
  blocks: TextBlock[];
  bgImageUrl: string | null;
  format: Format;
  width: number;
}

function getHeight(format: Format, width: number) {
  if (format === '1:1') return width;
  if (format === '4:5') return Math.round(width * 5 / 4);
  return Math.round(width * 16 / 9);
}

function textColor(bgColor: string): string {
  if (bgColor === '#ffffff') return '#000000';
  try {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? '#000000' : '#ffffff';
  } catch {
    return '#ffffff';
  }
}

export default function NativePreview({ blocks, bgImageUrl, format, width }: Props) {
  const height = getHeight(format, width);

  const bgStyle = bgImageUrl
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: '#111' };

  const topBlocks    = blocks.filter(b => b.position === 'top');
  const middleBlocks = blocks.filter(b => b.position === 'middle');
  const bottomBlocks = blocks.filter(b => b.position === 'bottom');

  const renderBlocks = (list: TextBlock[]) =>
    list.map(block => (
      <div
        key={block.id}
        className={styles.textBlock}
        style={{ background: block.bgColor, color: textColor(block.bgColor) }}
      >
        {block.text || ' '}
      </div>
    ));

  return (
    <div className={styles.wrap} style={{ width, height, ...bgStyle }}>
      {!bgImageUrl && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🖼</span>
          <span className={styles.emptyText}>Adicione uma imagem de fundo</span>
        </div>
      )}

      {topBlocks.length > 0 && (
        <div className={`${styles.zone} ${styles.zoneTop}`}>
          {renderBlocks(topBlocks)}
        </div>
      )}

      {middleBlocks.length > 0 && (
        <div className={`${styles.zone} ${styles.zoneMiddle}`}>
          {renderBlocks(middleBlocks)}
        </div>
      )}

      {bottomBlocks.length > 0 && (
        <div className={`${styles.zone} ${styles.zoneBottom}`}>
          {renderBlocks(bottomBlocks)}
        </div>
      )}
    </div>
  );
}
