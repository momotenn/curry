import useSWR, { mutate, useSWRConfig } from 'swr';
import { Layout } from '../components/layout';
import styles from '../component/check.module.css';
import style from '../styles/order.module.css';
import Head from 'next/head';

export const fetcher: (args: string) => Promise<any> = (...args) =>
  fetch(...args).then((res) => res.json());

export default function History() {
  // if(typeof window == "undefined") return;
  //@ts-ignore
  const cookieId = document.cookie
    .split('; ')
    .find((row) => row.startsWith('id'))
    .split('=')[1];
  const { data, error } = useSWR(
    `http://localhost:8000/users/${cookieId}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <Layout show={true}>
      <Head>
        <title>注文履歴</title>
      </Head>
      <div>
        <h1 className={styles.title}>注文履歴</h1>
        {data.history.length === 0 ? (
          <p className={style.msg}>注文履歴がありません</p>
        ) : (
          <>
            <table className={styles.item} border={1}>
              <thead>
                <tr>
                  <th>商品名</th>
                  <th>価格（税抜）・数量</th>
                  <th>トッピング・価格（税抜）</th>
                  <th>小計</th>
                  <th>注文日時</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((e: any) => {
                  return (
                    <tr key={e.id}>
                      <td>
                        <img src={e.imagePath} width={100} />
                        <p>{e.name}</p>
                      </td>
                      <td>
                        数量：{e.count}個
                        <br />
                        単品価格：
                        {String(e.price).replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )}
                        円
                      </td>
                      <td>
                        {e.toppingList.map((topping: any) => (
                          <ul key={topping.id}>
                            <li className={styles.topping}>
                              {topping.name} 200円
                            </li>
                          </ul>
                        ))}
                      </td>
                      <td>
                        {String(e.TotalPrice).replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )}
                        円
                      </td>
                      <td>
                        {e.day} {e.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Layout>
  );
}
