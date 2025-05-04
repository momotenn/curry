import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { parseAnswerToHtml } from '../utils/parseAnswerToHtml';

const mockStyles = {
  card: 'card',
  cardTitle: 'card-title',
  badge: 'badge',
  ul: 'ul',
  price: 'price',
  p: 'paragraph',
};

describe('parseAnswerToHtml', () => {
  it('正常なフォーマットのテキストを正しくパースしてカードを生成する', () => {
    const input = `
**パターン1**
* 商品: カレー
* サイズ: Mサイズ
* トッピング: チーズ
合計: 1000円
    `;
    const result = parseAnswerToHtml(input, mockStyles);

    const { container } = render(<>{result}</>);

    console.log('🍓', container.innerHTML);

    expect(container.querySelectorAll('.card')).toHaveLength(1);
    expect(container.querySelector('.card-title')).toHaveTextContent(
      'パターン1'
    );
    expect(container.querySelector('.ul')).toBeInTheDocument();
    expect(container.querySelector('.price')).toHaveTextContent(
      '合計: 1000円'
    );
  });

  it('複数パターンを含むテキストを正しく分割する', async () => {
    const input = `
    **パターン1**
    * 商品: カレー
    合計: 1000円
    
    **パターン2**
    * 商品: カツ丼
    合計: 1100円
    `;

    const result = parseAnswerToHtml(input, mockStyles);
    const { container } = render(<>{result}</>);

    expect(container.querySelectorAll('.card')).toHaveLength(2);
    expect(container).toHaveTextContent('パターン1');
    expect(container).toHaveTextContent('パターン2');
  });

  it('パターン開始がない場合でもテキストをレンダリングする', async () => {
    const input = `こんにちは！おすすめはこちらです。\nカツカレーが人気です。\n合計: 1490円`;

    const result = parseAnswerToHtml(input, mockStyles);
    const { container } = render(<>{result}</>);

    expect(container.querySelectorAll('.card')).toHaveLength(1);
    expect(container).toHaveTextContent('こんにちは');
    expect(container).toHaveTextContent('合計: 1490円');
  });
  it('空文字列を渡した場合は空の要素を返す', () => {
    const result = parseAnswerToHtml('', mockStyles);
    expect(result).toEqual([]);
  });

  it('className が styles に存在しなくても落ちない', () => {
    const brokenStyles = {};
    const input = '**パターン1**\n* 商品: カレー\n合計: 1000円';
    const result = parseAnswerToHtml(input, brokenStyles as any);

    const { container } = render(<>{result}</>);
    expect(container).toHaveTextContent('パターン1');
    expect(container).toHaveTextContent('カレー');
    expect(container).toHaveTextContent('合計: 1000円');
  });
  it('不正な形式でも段落として出力される', () => {
    const input =
      'これは不正な行です\n**パターン1\n* 商品: カレー\n合計: 1000円';
    const result = parseAnswerToHtml(input, mockStyles);
    const { container } = render(<>{result}</>);
    expect(container).toHaveTextContent('これは不正な行です');
    expect(container).toHaveTextContent('カレー');
  });
});
