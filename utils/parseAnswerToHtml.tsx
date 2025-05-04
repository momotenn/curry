import React from 'react';

// styles は ai.module.css の import 結果が渡される
export function parseAnswerToHtml(
  answer: string,
  styles: { [key: string]: string }
): JSX.Element[] {
  const lines = answer.split('\n');
  const elements: JSX.Element[] = [];

  let currentCard: JSX.Element[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const cleaned = trimmed.replace(/\*\*/g, '');

    // 新しいパターン（カード）開始
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      if (currentCard.length > 0) {
        elements.push(
          <div key={`card-${index}`} className={styles.card}>
            {currentCard}
          </div>
        );
        currentCard = [];
      }

      currentCard.push(
        <div key={`h4-${index}`} className={styles.cardTitle}>
          <span className={styles.badge}>パターン</span>
          {cleaned}
        </div>
      );
    } else if (cleaned.includes('合計')) {
      currentCard.push(
        <p key={`price-${index}`} className={styles.price}>
          {cleaned}
        </p>
      );
    } else if (cleaned.startsWith('*')) {
      const text = cleaned.replace(/^\*+\s*/, '');
      currentCard.push(
        <ul key={`ul-${index}`} className={styles.ul}>
          <li>{text}</li>
        </ul>
      );
    } else if (cleaned !== '') {
      currentCard.push(
        <p key={`p-${index}`} className={styles.p}>
          {cleaned}
        </p>
      );
    }
  });

  // 最後のカードを push
  if (currentCard.length > 0) {
    elements.push(
      <div key={`card-end`} className={styles.card}>
        {currentCard}
      </div>
    );
  }
  return elements;
}
