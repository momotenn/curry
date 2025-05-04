import { useState } from 'react';
import styles from '../pages/ai/ai.module.css';
import { parseAnswerToHtml } from '../utils/parseAnswerToHtml';
import LoadingDots from './LoadingDots';

export default function AiPage() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setAnswer(data.text);
    setLoading(false);
  };

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>🍛 おすすめセット相談</h3>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={prompt}
            placeholder="ここにテキストを入力してください"
            onChange={(e) => setPrompt(e.target.value)}
            className={styles.input}
          />

          {loading ? (
            <div className={styles.loading}>
              <LoadingDots />
            </div>
          ) : (
            <button
              onClick={handleSearch}
              className={styles.submitButton}
            >
              検索
            </button>
          )}
        </div>
        <div className={styles.hintCard}>
          💡 例：カツカレーに合うトッピングは？
        </div>

        {answer && (
          <>
            <div className={styles.title}>💬 回答</div>
            <div className={styles.answerArea}>
              {parseAnswerToHtml(answer, styles)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
