import { fireEvent, getByTestId, render, screen } from "@testing-library/react"
import Order, { onClickDelete } from "./order";
import renderer from 'react-test-renderer'
import useSWR, { Middleware, SWRConfig, SWRResponse } from "swr"
//CSRのデータを仮置きする変数
const testMiddleware: Middleware = () => {
  return (): SWRResponse<any, any> => {
    return {
      data: [{
        "name": "ポークポークカレー・ミート",
        "price": 1490,
        "imagePath": "/img_curry/2.jpg",
        "toppingList": [
          {
            "name": "ロースハム",
            "id": 4,
            "checked": true
          },
          {
            "name": "ほうれん草",
            "id": 5,
            "checked": true
          },
          {
            "name": "ナス",
            "id": 6,
            "checked": true
          }
        ],
        "count": 1,
        "TotalPrice": 2090,
        "id": 1
      }],
      error: undefined,
      mutate: (_) => Promise.resolve(),
      isValidating: false
    }
  }
}

//できた
test("fetchから取ってきた商品名が表示される", () => {
  render(
    //仮置きデータを入れる
    <SWRConfig value={{ use: [testMiddleware] }}>
      <Order />
    </SWRConfig>
  );
  const linkElement = screen.getByText(/ポークポークカレー・ミート/);
  expect(linkElement).toBeInTheDocument();
})

test("fetchから取ってきた価格が表示される", () => {
  render(
    <SWRConfig value={{ use: [testMiddleware] }}>
      <Order />
    </SWRConfig>
  );
  const linkElement = screen.getByText(/2090/i);
  expect(linkElement).toBeInTheDocument();
})

test("ボタンが商品の個数分だけある", async () => {
  render(
    <SWRConfig value={{ use: [testMiddleware] }}>
      <Order />
    </SWRConfig>
  );
  const buttonList = await screen.findAllByRole("button");
  expect(buttonList).toHaveLength(3);
})

jest.mock('./order', () => {
  const originalModule = jest.requireActual('./order');
  return {
    __esModule: true,
    ...originalModule,
    onClickDelete: jest.fn((id, mutate) => console.log("呼ばれた")),
  };
});


test("削除ボタンを押したときにonClickDeleteが機能する", async () => {
  const testString = (x: string) => {
    console.log(x)
  }
  render(
    <SWRConfig value={{ use: [testMiddleware] }}>
      <Order />
    </SWRConfig>
  );
  screen.debug();
  const deleteButton = await screen.findByTestId('delete');
  console.log(deleteButton);
  fireEvent.click(deleteButton);
  onClickDelete(1, testString);
})
