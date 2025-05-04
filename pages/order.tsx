import useSWR from 'swr';
import { Layout } from '../components/layout';
import styles from '../styles/order.module.css';
import Link from 'next/link';
import utilStyles from '../styles/utils.module.css';
import checkStyles from '../styles/check.module.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Cart {
  name: string;
  id: number;
  TotalPrice: number;
  price: number;
  imagePath: string;
  quantity: number;
  size: string;
  size_price: number;

  toppingList: {
    name: string;
    checked: boolean;
    id: number;
    price: number;
  }[];
}

export default function Order() {
  const router = useRouter();

  //クライアントかどうかの判定
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetcher = async (url: string) => {
    let token = '';
    if (typeof window !== 'undefined') {
      token =
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

      if (token?.startsWith('Bearer ')) {
        token = token.replace(/^Bearer\s/, '');
        console.log('Bearerトークン', token);
      }
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const rawData = await res.json(); // 👈 ここで受け取った data の中身を確認
    console.log('✅ APIからのレスポンス:', rawData);

    // ここで必要な配列だけ返す
    const formatData = rawData.map((item: any) => {
      const toppingList = item.toppings?.map((topping: any) => ({
        name: topping.f1,
        price: topping.f2,
        checked: true,
        id: 0,
      }));

      return {
        id: item.id,
        name: item.item_name,
        price: item.item_price,
        imagePath: item.item_imagepath,
        quantity: item.quantity,
        size: item.size,
        size_price: item.size_price,
        TotalPrice:
          (item.item_price + item.size_price) * item.quantity +
          toppingList.reduce(
            (sum: number, topping: any) => sum + topping.price,
            0
          ),
        toppingList: toppingList,
      };
    });

    return formatData;
  };
  //クッキーからトークンを取得する関数(クライアントかつisClientがtrueの時のみ実行)
  const getToken = () => {
    if (isClient && typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      return token;
    }
    return null;
  };
  const token = getToken();

  const hasToken = Boolean(token);

  const swrKey = !isClient
    ? null
    : hasToken
    ? '/api/carts'
    : '/api/public_carts';
  const { data: apiCartData, error: apiError } = useSWR<Cart[]>(
    swrKey,
    fetcher
  );

  const [localCartData, setLocalCartData] = useState<Cart[]>([]);

  useEffect(() => {
    if (isClient && !hasToken) {
      const stored = localStorage.getItem('guest_cart');
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          console.log('guest_cartの中身:', parsedData);
          setLocalCartData(parsedData);
        } catch (error) {
          console.error('guest_cartのパースに失敗しました:', error);
          setLocalCartData([]);
        }
      } else {
        setLocalCartData([]);
      }
    }
  }, [isClient, hasToken]);
  const cartData: Cart[] = hasToken
    ? apiCartData || []
    : localCartData;

  // const { mutate } = useSWRConfig();
  // const [showBtn, setShowBtn] = useState(false);

  if (apiError) {
    console.error('❌ SWRエラー:', apiError?.message || apiError);
    return <div>Failed to load</div>;
  }
  if (!isHydrated) {
    return <div>Loading...</div>; // Hydrationが完了するまで何も表示しない
  }

  if (!isClient) {
    return <div>Loading...</div>;
  }

  // const onClickOrder = () => {
  //   cartData.map((el: any) => {
  //     fetch('/api/carts', {
  //       method: 'POST',
  //       headers: { 'Content-type': 'application/json' },
  //       //@ts-ignore
  //       body: JSON.stringify(el),
  //     });
  //   });
  // };

  const totalAmount = cartData?.reduce(
    (sum, item) => sum + item.TotalPrice,
    0
  );

  const tax = Math.floor(totalAmount / 10);
  const totalWithTax = Math.floor(totalAmount * 1.1);

  const onClickDelete = async (id: number, index: number) => {
    if (!confirm('本当に削除しますか？')) return;

    if (hasToken) {
      const res = await fetch(`/api/carts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error(
          '❌ カートの削除に失敗しました',
          await res.text()
        );
        return;
      }
      router.reload();
    } else {
      const updatedData = JSON.parse(
        localStorage.getItem('guest_cart') || '[]'
      ) as Cart[];

      console.log('updatedData:', updatedData);
      console.log('index:', index);

      if (index < 0 || index >= updatedData.length) {
        console.error('対象商品が見つかりません:', index);
        return;
      }

      updatedData.splice(index, 1);

      localStorage.setItem('guest_cart', JSON.stringify(updatedData));
      setLocalCartData(updatedData);
    }
  };
  return (
    <>
      <Head>
        <title>ショッピングカート</title>
      </Head>
      <Layout show={true}>
        <div>
          <h1 className={styles.h1_style}>ショッピングカート</h1>
          {cartData?.length === 0 ? (
            <p className={styles.msg}>商品が登録されていません</p>
          ) : (
            <>
              <table className={styles.table_style}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th_style}>商品名</th>
                    <th className={styles.th_style}>
                      価格（税抜）、数量、サイズ
                    </th>
                    <th className={styles.th_style}>
                      トッピング、価格（税抜）
                    </th>
                    <th className={styles.th_style}>小計</th>
                    <th className={styles.th_style}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartData?.map(
                    (
                      {
                        name,
                        id,
                        TotalPrice,
                        price,
                        imagePath,
                        quantity,
                        toppingList,
                        size,
                        size_price,
                      }: Cart,
                      index: number
                    ) => (
                      <tr key={id} className={styles.tr}>
                        <td className={styles.td}>
                          <img src={imagePath} width={100} />
                          <p className={styles.itemName}>{name}</p>
                        </td>
                        <td className={styles.td}>
                          数量：{quantity}個 <br />
                          単品価格：
                          {String(price).replace(
                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                            '$1,'
                          )}
                          円<br />
                          サイズ(価格)：{`${size}(${size_price}円)`}
                        </td>
                        <td className={styles.td}>
                          {toppingList?.map(
                            (topping: {
                              name: string;
                              checked: boolean;
                              id: number;
                              price: number;
                            }) => (
                              <ul key={id} className={styles.ul}>
                                <li className={styles.list}>
                                  {topping.name}
                                </li>
                              </ul>
                            )
                          )}
                          価格：
                          {toppingList?.reduce(
                            (sum, topping) => sum + topping.price,
                            0
                          )}
                          円
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
                            type="button"
                            className={styles.btn}
                            onClick={() => onClickDelete(id, index)}
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
                <p>
                  消費税：
                  {tax.toLocaleString()}円
                </p>
                <p>
                  ご注文金額合計：
                  {totalWithTax.toLocaleString()}円（税込） 円（税込）
                </p>
              </div>

              <div>
                {hasToken ? (
                  <Link href="/ordercheck" legacyBehavior>
                    <button
                      // onClick={onClickOrder}
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
                    legacyBehavior
                  >
                    <button className={utilStyles.mt}>
                      注文へ進む
                    </button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
