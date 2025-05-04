import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './check.module.css';

export default function CheckUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const router = useRouter();

  //  @ts-ignore
  const cookieName = document.cookie
    .split('; ')
    .find((row) => row.startsWith('name'))
    .split('=')[1];
  fetch(`http://localhost:8000/users?name=${cookieName}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      setName(data[0].name), setEmail(data[0].email);
    });

  const onClickSync = () => {
    fetch(`http://localhost:8000/users?name=${name}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setZipcode(data[0].zipcode),
          setAddress(data[0].address),
          setTel(data[0].tel);
      });
  };

  // 現在日時の取得
  const date = new Date();
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');

  // 日にちの最小値を現在にする
  const ymd = `${date.getFullYear()}-${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

  // 日にちの最大値を指定
  const ymd2 = `${date.getFullYear()}-${(
    '0' +
    (date.getMonth() + 3)
  ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

  // 現在時刻から3時間を足す
  const hs = date.getHours() + 3;
  // 入力された時刻の時間だけを取り出してnumber型にする
  const hour = Number(time.slice(0, 2));

  useEffect(() => {
    if (21 < hour) {
      return setTime('');
    } else if (hour < hs) {
      return setTime('');
    } else if (hour < 9) {
      return setTime('');
    }
  }, [time]);
  return (
    (<div>
      <h2 className={styles.title}>お届け先情報</h2>
      <button
        name="sync"
        className={styles.sync}
        onClick={() => onClickSync()}
      >
        自動入力
      </button>
      <form action="post">
        <table className={styles.userTitle}>
          <tr>
            <td className={styles.td}>
              <label htmlFor="name">お名前：</label>
              {name.length < 1 && (
                <span>名前を入力してください</span>
              )}{' '}
              {/*入力されてない時だけ"名前を入力してください”を表示 以下全てのinputに同様の機能追加*/}
            </td>
            <td>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.input}
                value={name}
                placeholder="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td className={styles.td}>
              <label htmlFor="email">メールアドレス：</label>
              {email.length < 1 && (
                <span>メールアドレスを入力してください</span>
              )}
              {!email.match(
                /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
              ) &&
                email.length >= 1 && (
                  <span>メールアドレスの形式が不正です</span>
                )}
            </td>
            <td>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                value={email}
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td className={styles.td}>
              <label htmlFor="zipcode">郵便番号：</label>
              {zipcode.length < 1 && (
                <span className={styles.alert}>
                  郵便番号を(-)を付けて入力してください
                </span>
              )}
            </td>
            <td>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                className={styles.input}
                value={zipcode}
                placeholder="Zipcode"
                onChange={(e) => {
                  setZipcode(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td className={styles.td}>
              <label htmlFor="address">住所：</label>
              {address.length < 1 && (
                <span className={styles.alert}>
                  住所を入力してください
                </span>
              )}
            </td>
            <td>
              <input
                type="text"
                id="address"
                name="address"
                className={styles.input}
                value={address}
                placeholder="Address"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td className={styles.td}>
              <label htmlFor="tel">電話番号：</label>
              {tel.length === 0 && (
                <span className={styles.alert}>
                  電話番号を(-)を付けて入力してください
                </span>
              )}
            </td>
            <td>
              <input
                type="tel"
                id="tel"
                name="tel"
                className={styles.input}
                value={tel}
                placeholder="PhoneNumber"
                onChange={(e) => {
                  setTel(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="day" className={styles.td}>
                配達日時：
              </label>
              {day.length === 0 || time.length === 0 ? (
                <span className={styles.alert}>
                  配達日時を選択して下さい。
                </span>
              ) : (
                ''
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
          </tr>
        </table>

        <div>
          <h2 className={styles.credit}>お支払い方法</h2>
          <div className={styles.creditTd}>
            <input
              type="radio"
              id="money"
              name="credit"
              className={styles.cred}
            />
            <label htmlFor="money" className={styles.cred}>
              代金引換
            </label>

            <input
              type="radio"
              id="card"
              name="credit"
              className={styles.cred}
            />
            <label htmlFor="card" className={styles.cred}>
              クレジットカード決済
            </label>
          </div>
        </div>
      </form>
    </div>)
  );
}
