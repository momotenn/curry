import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { prompt } = req.body as { prompt: string };

  console.log('prompt', prompt);

  if (typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Invalid prompt' });
    return;
  }

  try {
    const [itemsRes, sizesRes, toppingRes] = await Promise.all([
      fetch(`${BACKEND_BASE_URL}/items`),
      fetch(`${BACKEND_BASE_URL}/sizes`),
      fetch(`${BACKEND_BASE_URL}/toppings`),
    ]);

    const [items, sizes, toppings] = await Promise.all([
      itemsRes.json(),
      sizesRes.json(),
      toppingRes.json(),
    ]);

    const itemText = items
      .map((i: any) => `・${i.name}（${i.price}円）`)
      .join('\n');
    const sizeText = sizes
      .map((s: any) => `・${s.size}（+${s.extra_price}円）`)
      .join('\n');
    const toppingText = toppings
      .map((t: any) => `・${t.name}（${t.price}円）`)
      .join('\n');

    const formatHint = `
以下の形式で回答してください：

以下の形式で、会話っぽく丁寧に提案してください。
最初に「おすすめをご紹介しますね！」のような自然な導入文をつけてください。

**パターン1**
🍛 商品: カツカレー（1490円）
📏 サイズ: Mサイズ（+100円）
🧀 トッピング: チーズ（+150円）
💡 理由: ○○だからおすすめです
💰 合計: 1740円

`;
    const context = `
以下はお店で提供されているメニュー情報です。

【商品】
${itemText}

【サイズ】
${sizeText}

【トッピング】
${toppingText}


この情報を参考にして、次の質問に答えてください。
なお、パターンは複数提示してください
${formatHint}


質問: ${prompt}
`.trim();

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/gemini-2.0-flash', // ← 必須
          contents: [
            {
              parts: [
                {
                  text: context,
                },
              ],
            },
          ],
        }),
      }
    );
    if (!apiRes.ok) {
      const err = await apiRes.text();
      console.error('Gemini API error:', err);
      return res.status(502).json({ error: 'Gemini API error' });
    }
    const AnswerData = await apiRes.json();

    console.log('AnswerData', AnswerData);

    const answer =
      AnswerData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    res.status(200).json({ text: answer });
    console.log('text:', answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
