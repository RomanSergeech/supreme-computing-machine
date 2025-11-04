'use client';

import { useMemo, useState } from 'react';
import styles from './ItemListModal.module.css';

// Примерные длинные списки
const SITES = [
  'youtube.com','github.com','stackoverflow.com','twitter.com','instagram.com','facebook.com','medium.com','reddit.com',
  'news.ycombinator.com','npmjs.com','dev.to','linkedin.com','netflix.com','spotify.com','hulu.com'
];

const PROGRAMS = [
  'Visual Studio Code','IntelliJ IDEA','Terminal','Slack','Discord','Spotify','Chrome','Firefox','Steam','Minecraft','OBS Studio','Notion','Figma'
];

export default function ItemListModal({ mode = 'sites', onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const list = mode === 'sites' ? SITES : PROGRAMS;

  const filtered = useMemo(() => {
    return list.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
  }, [list, query]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{mode === 'sites' ? 'Sites' : 'Programs'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.controls}>
          <input className={styles.search} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className={styles.listWrap}>
          {filtered.map((name) => (
            <div key={name} className={styles.itemRow}>
              <div>{name}</div>
              <div>
                <button className={styles.selectBtn} onClick={() => onSelect({ name, pattern: name })}>Select</button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && <div className={styles.empty}>No results</div>}
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
