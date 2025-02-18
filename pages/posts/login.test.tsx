import { getByRole, render, screen } from '@testing-library/react';
import Login from './login';
import userEvent from '@testing-library/user-event';

// できなくなった
// 理由：expect(...).HaveBeenCalledWith is not a function
test('ログインボタンの取得', () => {
  const { debug } = render(<Login />);
  const button = screen.getByRole('button');
  debug(button);
  expect(button).HaveBeenCalledWith();
});

// test('アドレスに不正の形式を入れたらエラーが出るか', () => {
//   const { debug } = render(<Login />);
//   const email = screen.getByPlaceholderText(
//     'メールアドレスを入力してください'
//   );
//   const emailErr = screen.getByTestId('emailErr');

//   expect(screen.getByText('メールアドレスの形式が不正です')).toBeInTheDocument()

// })

// // できない
// describe('onClick', () => {
//   it('should calls', () => {
//     const mockOnClick = jest.fn();
//     const wrapper = shallow(
//       <Login type="button" onClick={mockOnClick} />
//     );
//     wrapper.simulate('click');
//     expect(mockOnClick).toHaveBeenCalled();
//   });
// });

// // ページ遷移の書き方がわからない
// // next-page-testerのインストールができない
// test('ログインボタンが正常に動く', () => {
//   render(<Login />);
//   const loginButton = screen.getByTestId('loginButton');
//   const email = screen.getByPlaceholderText(
//     'メールアドレスを入力してください'
//   );
//   const password =
//     screen.getByPlaceholderText('パスワードを入力してください');

//   userEvent.type(email, 'tenjuhattori@gmail.com');
//   userEvent.type(password, 'wav_egk3e');

//   userEvent.click(loginButton);
//   // ページ遷移されるか
//   expect();
// });


// // 上の参考コード
// import '@testing-library/jest-dom/extend-expect';
// // next-page-testerからgetPageとinitTestHelpersをインポート
// import { getPage } from 'next-page-tester';
// import { initTestHelpers } from 'next-page-tester'; // 初期設定を行うもの

// // next-page-testerを使用するために実行しておく
// initTestHelpers();

// // Linkタグに対するページ遷移のテストを実施
// // describe でテストタイトルを設定
// describe('Navigation by Link', () => {
//   // next-page-testerを使うには、関数をasyncにする
//   it('Should route to selected page in navar', async () => {
//     const { page } = await getPage({
//       route: '/index', // 取得したいページのパス
//     });
//     render(page); // HTMLの構造を取得

//     // getByTestIdでテストIDを取得し、それに対しクリックのシミュレーションを実施
//     userEvent.click(screen.getByTestId('blog-nav'));
//     // 非同期の場合は、findByTextでテキストを検索
//     expect(await screen.findByText('Blog Page')).toBeInTheDocument();
//   });
// });


// // 参考URL
// // https://qiita.com/suzu1997/items/e4ee2fc1f52fbf505481


// // 解読不可
// expect.extend({
//   async toBeDivisibleByExternalValue(received) {
//     const externalValue = await getExternalValueFromRemoteSource();
//     const pass = received % externalValue == 0;
//     if (pass) {
//       return {
//         message: () =>
//           `expected ${received} not to be divisible by ${externalValue}`,
//         pass: true,
//       };
//     } else {
//       return {
//         message: () =>
//           `expected ${received} to be divisible by ${externalValue}`,
//         pass: false,
//       };
//     }
//   },
// });

// test('is divisible by external value', async () => {
//   await expect(100).toBeDivisibleByExternalValue();
//   await expect(101).not.toBeDivisibleByExternalValue();
// });
