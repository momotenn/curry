import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import AiPage from '../components/AiPage';
import '@testing-library/jest-dom';

test('renders AiPage', () => {
  render(<AiPage />);
  expect(screen.getByText(/おすすめセット相談/)).toBeInTheDocument();
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));
// fetch モック化
global.fetch = jest.fn();

describe('AiPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();

    (global.fetch as jest.Mock).mockClear();
  });

  it('初期レンダリングで入力欄と検索ボタンが表示される', () => {
    render(<AiPage />);
    expect(
      screen.getByPlaceholderText('ここにテキストを入力してください')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '検索' })
    ).toBeInTheDocument();
  });

  it('検索ボタン押下でAPI呼び出し→回答が表示される（正常系）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        text: '**パターン1**\n* 商品: カレー\n合計: 1000円',
      }),
    });

    render(<AiPage />);
    fireEvent.change(screen.getByPlaceholderText(/テキストを入力/), {
      target: { value: 'おすすめ教えて' },
    });
    fireEvent.click(screen.getByRole('button', { name: '検索' }));

    await waitFor(() => {
      expect(screen.getByText(/パターン1/)).toBeInTheDocument();
      expect(screen.getByText(/カツカレー/)).toBeInTheDocument();
      expect(screen.getByText(/1000円/)).toBeInTheDocument();
    });
  });

  it('APIが500を返した場合、回答は表示されない（異常系）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Gemini API error' }),
    });

    render(<AiPage />);
    fireEvent.change(screen.getByPlaceholderText(/テキストを入力/), {
      target: { value: '失敗させて' },
    });
    fireEvent.click(screen.getByRole('button', { name: '検索' }));

    await waitFor(() => {
      expect(screen.queryByText(/回答/)).not.toBeInTheDocument();
    });
  });

  it('空の回答が返ってきた場合、回答は表示されない（異常系）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: '' }),
    });

    render(<AiPage />);
    fireEvent.change(screen.getByPlaceholderText(/テキストを入力/), {
      target: { value: '空の返答' },
    });
    fireEvent.click(screen.getByRole('button', { name: '検索' }));

    await waitFor(() => {
      expect(screen.queryByText(/回答/)).not.toBeInTheDocument();
    });
  });
});
