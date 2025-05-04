import useSWR from 'swr';
import { Layout } from './layout';
import { OrderItem } from '../types/types';
import Customer from './Cluculate';
import styles from '../component/check.module.css';
import Link from 'next/link';
import { json } from 'stream/consumers';
import { CartItem } from '../types/cart';

type OrderCheckProps = {
  carts: CartItem[];
  subTotal: number;
};

export default function OrderCheck({
  carts,
  subTotal,
}: OrderCheckProps) {
  if (carts.length === 0) return <div>カートが空です</div>;

  console.log('subTotal', subTotal);
  console.log('carts', carts);

  // 合計計算ロジックは親から `subTotal` 等を渡してもいい

  const tax = Math.floor(subTotal * 0.1);
  const totalWithTax = subTotal + tax;

  if (!carts || carts.length === 0) return <div>カートが空です</div>;
  if (isNaN(subTotal)) return <div>合計金額の計算に失敗しました</div>;

  // const onClickCheck = () => {
  //   //@ts-ignore
  //   const cookieId = document.cookie
  //     .split('; ')
  //     .find((row) => row.startsWith('id'))
  //     .split('=')[1];
  //   fetch(`http://localhost:8000/users/${cookieId}`)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       fetch(`http://localhost:8000/users/${cookieId}`, {
  //         method: 'put',
  //         headers: { 'content-type': 'application/json' },
  //         body: JSON.stringify({
  //           name: json.name,
  //           email: json.email,
  //           zipcode: json.zipcode,
  //           address: json.address,
  //           tel: json.tel,
  //           password: json.password,
  //           checkPassword: json.checkPassword,
  //           history: [...json.history, ...data],
  //         }),
  //       });
  //     });
  //   fetch('http://localhost:8000/orderItems/')
  //     .then((res) => res.json())
  //     .then((json) => {
  //       json.map((item: any) => {
  //         fetch(`http://localhost:8000/orderItems/${item.id}`, {
  //           method: 'DELETE',
  //         });
  //       });
  //     });

  //     fetch('http://localhost:8000/order/')
  //     .then((res) => res.json())
  //     .then((json) => {
  //       json.map((item: any) => {
  //         fetch(`http://localhost:8000/order/${item.id}`, {
  //           method: 'DELETE',
  //         });
  //       });
  //     });

  // };

  //　中身がtotalPriceだけの配列をpushする

  return (
    <Layout show={true}>
      <div>
        <h1 className={styles.title}>注文内容確認</h1>
        <table className={styles.item} border={1}>
          <thead>
            <tr>
              <th>商品名</th>
              <th>価格（税抜）・数量</th>
              <th>トッピング・価格（税抜）</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            {carts.map(
              ({
                name,
                id,
                TotalPrice,
                price,
                imagePath,
                quantity,
                toppingList,
              }: CartItem) => {
                return (
                  <tr key={id}>
                    <td>
                      <img src={imagePath} width={100} />
                      <p>{name}</p>
                    </td>
                    <td>
                      数量：{quantity}個
                      <br />
                      単品価格：
                      {price.toLocaleString()}円
                    </td>
                    <td>
                      {toppingList.map((topping) => (
                        <ul key={id}>
                          <li className={styles.topping}>
                            {topping.name} 200円
                          </li>
                        </ul>
                      ))}
                    </td>
                    <td>{TotalPrice.toLocaleString()}円</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>

        <div className={styles.total}>
          <p>
            消費税：
            {tax.toLocaleString()}円
          </p>
          <p>
            ご注文金額合計：
            {totalWithTax.toLocaleString()}
            円（税込）
          </p>
        </div>

        {/* <div>
          <Customer></Customer>
        </div> */}
        {/* <Link href="/thankyou">
          <button
            className={styles.btn}
            onClick={() => onClickCheck()}
          >
            この内容で注文する
          </button>
        </Link> */}
      </div>
    </Layout>
  );
}
