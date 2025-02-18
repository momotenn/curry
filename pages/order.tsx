import { json } from 'stream/consumers';
import useSWR, { useSWRConfig } from 'swr';
import { Layout } from '../component/layout';
import { Item, OrderItem } from '../types/types';
import styles from '../styles/order.module.css';
import Link from 'next/link';
import utilStyles from '../styles/utils.module.css';
import checkStyles from '../component/check.module.css';
import { useState } from 'react';
import Head from 'next/head';
import { SwiperAtom } from '../component/atoms/SwiperAtom';


export const fetcher: (args: string) => Promise<any> = (...args) =>
  fetch(...args).then((res) => res.json());
//削除ボタンの機能
export function onClickDelete(id: number, mutate: Function) {
  console.log('aaaaaaaaa');
  fetch(`http://localhost:8000/orderItems/${id}`, {
    method: 'DELETE',
  });
  mutate('http://localhost:8000/orderItems');
}

export default function Order() {
  const { data, error } = useSWR(
    'http://localhost:8000/orderItems',
    fetcher
  );
  const { mutate } = useSWRConfig();
  const [showBtn, setShowBtn] = useState(false);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const onClickConfirm = () => {
    fetch(`http://localhost:8000/order`)
      .then((res) => res.json())
      .then((json) => {
        json.map((e: any, index: number) => {
          console.log(e);
          fetch(`http://localhost:8000/order/${e.id}`, {
            method: 'delete',
          });
        });
      });
    setShowBtn(true);
  };

  const onClickOrder = () => {
    data.map((el: any) => {
      fetch('http://localhost:8000/order', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        //@ts-ignore
        body: JSON.stringify(el),
      });
    });
  };

  let total: number[] = [];

  return (<>
    <Head>
      <title>ショッピングカート</title>
    </Head>
    <Layout show={true}>
      <div>
        <h1 className={styles.h1_style}>ショッピングカート</h1>
        {data.length === 0 ? (
          <p className={styles.msg}>商品が登録されていません</p>
        ) : (
          <>
            <table className={styles.table_style}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th_style}>商品名</th>
                  <th className={styles.th_style}>
                    価格（税抜）、数量
                  </th>
                  <th className={styles.th_style}>
                    トッピング、価格（税抜）
                  </th>
                  <th className={styles.th_style}>小計</th>
                  <th className={styles.th_style}></th>
                </tr>
              </thead>
              <tbody>
                {data.map(
                  ({
                    name,
                    id,
                    TotalPrice,
                    price,
                    imagePath,
                    count,
                    toppingList,
                  }: any) => (
                    <tr key={id} className={styles.tr}>
                      <td className={styles.td}>
                        <img src={imagePath} width={100} />
                        <p className={styles.itemName}>{name}</p>
                      </td>
                      <td className={styles.td}>
                        数量：{count}個 <br />
                        単品価格：
                        {String(price).replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )}
                        円
                      </td>
                      <td className={styles.td}>
                        {toppingList.map(
                          (topping: {
                            name: string;
                            checked: boolean;
                            id: number;
                          }) => (
                            <ul key={id} className={styles.ul}>
                              <li className={styles.list}>{topping.name}</li>
                            </ul>
                          )
                        )}
                        価格：{toppingList.length * 200}円
                      </td>
                      <td className={styles.td}>
                        {String(TotalPrice).replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )}
                        円
                      </td>
                      <td className={styles.td}>
                        <button
                          data-testid="delete"
                          className={styles.btn}
                          onClick={() => onClickDelete(id, mutate)}
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div className={checkStyles.total}>
              {data.map(({ TotalPrice }: any) => {
                total.push(TotalPrice);
              })}
              <p>
                消費税：
                {String(
                  Math.floor(
                    total.reduce(function (sum, element) {
                      return sum + element;
                    }, 0) / 10
                  )
                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                円
              </p>
              <p>
                ご注文金額合計：
                {String(
                  Math.floor(
                    total.reduce(function (sum, element) {
                      return sum + element;
                    }, 0) * 1.1
                  )
                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                円（税込）
              </p>
            </div>

            <div>
              {showBtn ? (
                <div>
                  {document.cookie ? (
                    <Link href="/ordercheck" legacyBehavior>
                      <button
                        onClick={onClickOrder}
                        className={utilStyles.mt}
                      >
                        注文へ進む
                      </button>
                    </Link>
                  ) : (
                    <Link
                      href={{
                        pathname: '/posts/login',
                        query: { currentUrl: true },
                      }}
                      legacyBehavior>
                      <button
                        className={utilStyles.mt}
                      >
                        注文へ進む
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  onClick={onClickConfirm}
                  className={utilStyles.addCss}
                >
                  確定
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  </>);
}
