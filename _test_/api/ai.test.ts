import handler from '../../pages/api/ai'; // パスに応じて修正
import { createMocks } from 'node-mocks-http';
import fetchMock from 'jest-fetch-mock';
import type { NextApiRequest, NextApiResponse } from 'next';
beforeAll(() => {
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.NEXT_PUBLIC_BACKEND_URL = 'https://mock-backend.com';
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('POST/api/ai', () => {
  it('成功した場合は、200と生成されたテキストを返す', async () => {
    // モックデータ
    const mockItems = [{ name: 'カツカレー', price: 1490 }];
    const mockSizes = [{ size: 'Mサイズ', extra_price: 100 }];
    const mockToppings = [{ name: 'チーズ', price: 150 }];
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'おすすめをご紹介しますね！\n\n**パターン1** ...',
              },
            ],
          },
        },
      ],
    };
    fetchMock
      .mockResponseOnce(JSON.stringify(mockItems))
      .mockResponseOnce(JSON.stringify(mockSizes))
      .mockResponseOnce(JSON.stringify(mockToppings))
      .mockResponseOnce(JSON.stringify(mockGeminiResponse));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: '1000円以内でおすすめセットは？',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.text).toContain('おすすめをご紹介しますね');
  });

  it('promptが空文字なら400を返す', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: '' },
    });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid prompt',
    });
  });
  it('promptが空文字なら400を返す', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid prompt',
    });
  });

  it('Gemini APIが失敗した場合、502エラーを返す', async () => {
    fetchMock
      .mockResponseOnce(
        JSON.stringify([{ name: 'カレー', price: 1000 }])
      ) // items
      .mockResponseOnce(
        JSON.stringify([{ size: 'M', extra_price: 100 }])
      ) // sizes
      .mockResponseOnce(
        JSON.stringify([{ name: 'チーズ', price: 150 }])
      ) // toppings
      .mockResponseOnce('', { status: 500 });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'おすすめは？',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(502);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Gemini API error',
    });
  });

  it('予期しないエラーの場合、500を返す', async () => {
    fetchMock.mockRejectOnce(new Error('network error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'おすすめは？',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error',
    });
  });
  it('Geminiのテキストが存在しない場合', async () => {
    const mockItems = [{ name: 'カツカレー', price: 1490 }];
    const mockSizes = [{ size: 'Mサイズ', extra_price: 100 }];
    const mockToppings = [{ name: 'チーズ', price: 150 }];
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [{}],
          },
        },
      ],
    };
    fetchMock
      .mockResponseOnce(JSON.stringify(mockItems))
      .mockResponseOnce(JSON.stringify(mockSizes))
      .mockResponseOnce(JSON.stringify(mockToppings))
      .mockResponseOnce(JSON.stringify(mockGeminiResponse));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'おすすめは？',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );
    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.text).toBe('');
  });
});
