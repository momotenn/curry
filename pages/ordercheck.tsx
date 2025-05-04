import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import styles from '../styles/check.module.css';
import React from 'react';
// import StripeApi from '../lib/stripe';
import OrderCheck from '../components/Cluculate';

type CartItem = {
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

    price: number;
  }[];
};
type User = {
  id: number;
  name: string;
  email: string;
  zipcode: string;
  address: string;
  tel: string;
};

const fetcher = async (url: string) => {
  const token =
    typeof window !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((c) => c.startsWith('token='))
          ?.split('=')[1]
      : null;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  console.log('ステータス', res.status);

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function CheckUser() {
  const router = useRouter();

  const { data, error: userError } = useSWR<{
    userData: { user: User };
  }>('/api/orders/users/me', fetcher);
  const { data: cartsRes, error: cartsError } = useSWR<{
    cartData: CartItem[];
  }>('/api/orders/carts', fetcher);

  const user = data?.userData.user;
  const carts = cartsRes?.cartData ?? [];

  // 編集用のローカル state もトップレベルで宣言
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingZip, setIsEditingZip] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingTel, setIsEditingTel] = useState(false);

  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftZipcode, setDraftZipcode] = useState('');
  const [draftAddress, setDraftAddress] = useState('');
  const [draftTel, setDraftTel] = useState('');

  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    setDraftName(user.name);
    setDraftEmail(user.email);
    setDraftZipcode(user.zipcode);
    setDraftAddress(user.address);
    setDraftTel(user.tel);
  }, [user]);

  if (userError || cartsError) return <div>Failed to load</div>;

  if (!data || !cartsRes) return <div>Loading…</div>;

  // // 現在日時の取得
  // const date = new Date();
  // const [time, setTime] = useState('');

  // // 日にちの最小値を現在にする
  // const ymd = `${date.getFullYear()}-${(
  //   '0' +
  //   (date.getMonth() + 1)
  // ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

  // // 日にちの最大値を指定
  // const ymd2 = `${date.getFullYear()}-${(
  //   '0' +
  //   (date.getMonth() + 3)
  // ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

  // // 現在時刻から3時間を足す
  // const hs = date.getHours() + 3;
  // // 入力された時刻の時間だけを取り出してnumber型にする
  // const hour = Number(time.slice(0, 2));

  // useEffect(() => {
  //   if (21 < hour) {
  //     return setTime('');
  //   } else if (hour < hs) {
  //     return setTime('');
  //   } else if (hour < 9) {
  //     return setTime('');
  //   }
  // }, [time]);

  // useEffect(() => {
  //   if (!carts) return;
  //   fetch('/api/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ order: carts }),
  //   })
  //     .then((r) => r.json())
  //     .then((j) => setClientSecret(j.clientSecret));
  // }, [carts]);

  // 3. さらに内部プロパティも確認
  if (!user?.name) return <div>ユーザー情報を取得中…</div>;

  if (!carts) return <div>カート情報を情報を取得中…</div>;

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const saveField = async (field: keyof User, value: string) => {
    try {
      await fetch('/api/orders/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      // サーバー反映後、ローカルの SWR キャッシュを更新
      mutate(
        '/api/orders/users/me',
        { userData: { user: { ...user, [field]: value } } },
        false
      );
    } catch {
      alert('保存に失敗しました');
    }
  };

  const enrichedCarts = carts.map((item) => {
    const toppingsTotal =
      item.toppingList?.reduce(
        (sum, topping) => sum + topping.price,
        0
      ) ?? 0;
    console.log('toppingList', item.toppingList);
    console.log('toppingsTotal', toppingsTotal);
    const TotalPrice =
      (item.price + item.size_price + toppingsTotal) * item.quantity;
    console.log('👀TotalPrice', TotalPrice);

    return { ...item, TotalPrice };
  });

  const subTotal: number = enrichedCarts.reduce(
    (sum, i) => sum + i.TotalPrice,
    0
  );

  console.log('👀subTotal', subTotal);

  // const appearance: StripeElementsOptions['appearance'] = { theme: 'stripe' };
  // const options: StripeElementsOptions = {
  //   clientSecret,
  //   appearance,
  // };
  // const appearance: {
  //   theme: 'stripe' | 'night' | 'flat' | 'none' | undefined;
  // } = {
  //   theme: 'stripe',
  // };
  // const options: StripeElementsOptions = {
  //   clientSecret,
  //   appearance,
  // };

  // //  @ts-ignore
  // const cookieName = document.cookie
  //   .split('; ')
  //   .find((row) => row.startsWith('name'))
  //   .split('=')[1];
  // fetch(`http://localhost:8000/users?name=${cookieName}`, {
  //   method: 'GET',
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     setName(data[0].name), setEmail(data[0].email);
  //   });

  // const onClickSync = () => {
  //   fetch(`http://localhost:8000/users?name=${name}`, {
  //     method: 'GET',
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setZipcode(data[0].zipcode),
  //         setAddress(data[0].address),
  //         setTel(data[0].tel);
  //     });
  // };

  // const onClickCheck = () => {
  //   if (
  //     !(
  //       name &&
  //       email &&
  //       zipcode &&
  //       address &&
  //       tel &&
  //       day &&
  //       time &&
  //       creditVal
  //     )
  //   ) {
  //     setErrorShow(true);
  //   } else {
  //     //@ts-ignore
  //     const cookieId = document.cookie
  //       .split('; ')
  //       .find((row) => row.startsWith('id'))
  //       .split('=')[1];

  //     console.log(day);

  //     const firstPut = () => {
  //       fetch(`http://localhost:8000/order`) //注文確定のタイミングでorderdayを含む新しいオブジェクトに
  //         .then((res) => res.json())
  //         .then((json) => {
  //           console.log(day);
  //           json.map((e: any) => {
  //             fetch(`http://localhost:8000/order/${e.id}`, {
  //               method: 'put',
  //               headers: { 'content-type': 'application/json' },
  //               body: JSON.stringify({
  //                 name: e.name,
  //                 price: e.price,
  //                 imagePath: e.imagePath,
  //                 toppingList: e.toppingList,
  //                 count: e.count,
  //                 TotalPrice: e.TotalPrice,
  //                 userName: e.cookieName,
  //                 day: day,
  //                 time: time,
  //               }),
  //             });
  //           });
  //         })
  //         .then(() => {
  //           //awaitでは、fetchまでしか待ってくれないので、.thenで繋げる。
  //           fetch(`http://localhost:8000/order`) //日付の入っているorederをfetch
  //             .then((res) => res.json())
  //             .then((data2) => {
  //               console.log('data2', data2);
  //               fetch(`http://localhost:8000/users/${cookieId}`) //userを更新＋historyにdataを追加する
  //                 .then((res) => res.json())
  //                 .then((json) => {
  //                   console.log('data', json);
  //                   fetch(`http://localhost:8000/users/${cookieId}`, {
  //                     method: 'put',
  //                     headers: { 'content-type': 'application/json' },
  //                     body: JSON.stringify({
  //                       name: json.name,
  //                       email: json.email,
  //                       zipcode: json.zipcode,
  //                       address: json.address,
  //                       tel: json.tel,
  //                       password: json.password,
  //                       checkPassword: json.checkPassword,
  //                       history: [...json.history, ...data2],
  //                     }),
  //                   })
  //                     .then(() => {
  //                       fetch('http://localhost:8000/order/')
  //                         .then((res) => res.json())
  //                         .then((json) => {
  //                           json.map((item: any) => {
  //                             fetch(
  //                               `http://localhost:8000/order/${item.id}`,
  //                               {
  //                                 method: 'DELETE',
  //                               }
  //                             );
  //                           });
  //                         });
  //                     })
  //                     .catch((error) => console.error(error));
  //                 });
  //             });
  //         });
  //     };
  //     firstPut();
  //     fetch('http://localhost:8000/orderItems/')
  //       .then((res) => res.json())
  //       .then((json) => {
  //         json.map((item: any) => {
  //           fetch(`http://localhost:8000/orderItems/${item.id}`, {
  //             method: 'DELETE',
  //           });
  //         });
  //       });
  //   }
  // };

  return (
    <div>
      <OrderCheck carts={enrichedCarts} subTotal={subTotal} />
      <h2 className={styles.title}>お届け先情報</h2>
      <button
        name="sync"
        className={styles.sync}
        // onClick={() => onClickSync()}
      >
        自動入力
      </button>
      <form method="post" onSubmit={handleSubmit}>
        <table className={styles.userTitle}>
          <tbody>
            <tr>
              <td className={styles.td}>
                <label htmlFor="name">お名前：</label>
                {/* {errorShow === true && name.length < 1 && (
                  <span>名前を入力してください</span>
                )}{' '} */}
                {/*入力されてない時だけ"名前を入力してください”を表示 以下全てのinputに同様の機能追加*/}
              </td>
              <td>
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={styles.input}
                      value={draftName}
                      placeholder="name"
                      onChange={(e) => setDraftName(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        saveField('name', draftName);
                        setIsEditingName(false);
                      }}
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setDraftName(user.name);
                        setIsEditingName(false);
                      }}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                    >
                      編集
                    </button>
                  </>
                )}
              </td>
            </tr>

            <tr>
              <td className={styles.td}>
                <label htmlFor="email">メールアドレス：</label>
                {/* {errorShow === true && email.length < 1 && (
                  <span>メールアドレスを入力してください</span>
                )}
                {!email.match(
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
                ) &&
                  email.length >= 1 && (
                    <span>メールアドレスの形式が不正です</span>
                  )} */}
              </td>
              <td>
                {isEditingEmail ? (
                  <>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className={styles.input}
                      value={draftEmail}
                      placeholder="email"
                      onChange={(e) => setDraftEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        saveField('email', draftEmail);
                        setIsEditingEmail(false);
                      }}
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftEmail(user.email);
                        setIsEditingEmail(false);
                      }}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <span>{user.email}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                    >
                      編集
                    </button>
                  </>
                )}
              </td>
            </tr>

            <tr>
              <td className={styles.td}>
                <label htmlFor="zipcode">郵便番号：</label>
                {/* {errorShow === true && zipcode.length < 1 && (
                  <span className={styles.alert}>
                    郵便番号を(-)を付けて入力してください
                  </span>
                )} */}
              </td>
              <td>
                {isEditingZip ? (
                  <>
                    <input
                      type="text"
                      id="zipcode"
                      name="zipecode"
                      className={styles.input}
                      value={draftZipcode}
                      placeholder="Zipcode"
                      onChange={(e) =>
                        setDraftZipcode(e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        saveField('zipcode', draftZipcode);
                        setIsEditingZip(false);
                      }}
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftZipcode(user.zipcode);
                        setIsEditingZip(false);
                      }}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <span>{user.zipcode}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingZip(true)}
                    >
                      編集
                    </button>
                  </>
                )}
              </td>
            </tr>

            <tr>
              <td className={styles.td}>
                <label htmlFor="address">住所：</label>
                {/* {errorShow === true && address.length < 1 && (
                  <span className={styles.alert}>
                    住所を入力してください
                  </span>
                )} */}
              </td>
              <td>
                {isEditingAddress ? (
                  <>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className={styles.input}
                      value={draftAddress}
                      placeholder="address"
                      onChange={(e) => {
                        setDraftAddress(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        saveField('address', draftAddress);
                        setIsEditingAddress(false);
                      }}
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftAddress(user.address);
                        setIsEditingAddress(false);
                      }}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <span>{user.address}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      編集
                    </button>
                  </>
                )}
              </td>
            </tr>

            <tr>
              <td className={styles.td}>
                <label htmlFor="tel">電話番号：</label>
                {/* {errorShow === true && tel.length === 0 && (
                  <span className={styles.alert}>
                    電話番号を(-)を付けて入力してください
                  </span>
                )} */}
              </td>
              <td>
                {isEditingTel ? (
                  <>
                    <input
                      type="text"
                      id="tel"
                      name="tel"
                      className={styles.input}
                      value={draftTel}
                      placeholder="phone number"
                      onChange={(e) => setDraftTel(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        saveField('tel', draftTel);
                        setIsEditingTel(false);
                      }}
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftTel(user.tel);
                        setIsEditingTel(false);
                      }}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <span>{user.tel}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingTel(true)}
                    >
                      編集
                    </button>
                  </>
                )}
              </td>
            </tr>

            {/* <tr>
              <td>
                <label htmlFor="day" className={styles.td}>
                  配達日時：
                </label>
                {errorShow === true &&
                  day.length === 0 &&
                  time.length === 0 && (
                    <span className={styles.alert}>
                      配達日時を選択して下さい。
                    </span>
                  )}
              </td>
              <td>
                <input
                  type="date"
                  name="day"
                  id="today"
                  min={ymd}
                  max={ymd2}
                  className={styles.input}
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value);
                  }}
                />
                <br />
                <input
                  type="time"
                  name="time"
                  id="time"
                  min="09:00"
                  max="15:00"
                  className={styles.input}
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                />
              </td>
            </tr> */}
          </tbody>
        </table>

        {/* <div>
          <h2 className={styles.credit}>お支払い方法</h2>
          <div className={styles.creditTd}>
            <input
              type="radio"
              id="money"
              name="credit"
              value="money"
              checked={creditVal === 'money'}
              className={styles.cred}
              onChange={(e) => setCreditVal(e.target.value)}
            />
            <label htmlFor="money" className={styles.cred}>
              代金引換
            </label>

            <input
              type="radio"
              id="card"
              name="credit"
              value="card"
              checked={creditVal === 'card'}
              className={styles.cred}
              onChange={(e) => setCreditVal(e.target.value)}
            />
            <label htmlFor="card" className={styles.cred}>
              クレジットカード決済
            </label>

            {errorShow === true && creditVal === '' && (
              <div className={styles.alert}>
                支払い方法を選択してください
              </div>
            )}
          </div>

          {name &&
            email &&
            zipcode &&
            address &&
            tel &&
            day &&
            time &&
            creditVal &&
            creditVal === 'money' && (
              <button
                type="button"
                className={styles.btn}
                onClick={() => {
                  onClickCheck();
                  router.push('/thankyou');
                }}
              >
                この内容で注文する
              </button>
            )}
        </div> */}
      </form>
      {/* {creditVal === 'card' && (
        <div className="App">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                name={name}
                email={email}
                zipcode={zipcode}
                address={address}
                tel={tel}
                day={day}
                time={time}
                creditVal={creditVal}
                onClickCheck={onClickCheck}
              />
            </Elements>
          )}
        </div>
      )} */}
    </div>
  );
}
