import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/create.module.css';
import { Layout } from '../components/layout';
import Head from 'next/head';
import useSWR from 'swr';
import { set } from 'react-hook-form';
import { on } from 'events';

interface FormState {
  lastName: string;
  firstName: string;
  email: string;
  zipcode: string;
  address: string;
  tel: string;
  password: string;
  checkPassword: string;
}

export default function User() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    lastName: '',
    firstName: '',
    email: '',
    zipcode: '',
    address: '',
    tel: '',
    password: '',
    checkPassword: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: undefined,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newError: typeof errors = {};

    if (!form.lastName) {
      newError.lastName = '姓を入力してください';
    }
    if (!form.firstName) {
      newError.firstName = '名を入力してください';
    }
    if (!form.email) {
      newError.email = 'メールアドレスを入力してください';
    } else if (
      !form.email.match(
        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
      )
    ) {
      newError.email = 'メールアドレスの形式が不正です';
    }
    if (!form.zipcode) {
      newError.zipcode = '郵便番号を入力してください';
    } else if (!form.zipcode.match(/^\d{3}-\d{4}$/)) {
      newError.zipcode = '郵便番号はXXX-XXXXの形式で入力してください';
    }
    if (!form.address) {
      newError.address = '住所を入力してください';
    }
    if (!form.tel) {
      newError.tel = '電話番号を入力してください';
    } else if (
      !form.tel.match(
        /^(070|080|090)-\d{4}-\d{4}$|^0\d-\d{4}-\d{4}$|^0\d{3}-\d{2}-\d{4}$|^\(0\d\)\d{4}-\d{4}$|^\(0\d{3}\)\d{2}-\d{4}$|^050-\d{4}-\d{4}$|^0120-\d{3}-\d{3}$/
      )
    ) {
      newError.tel =
        '電話番号はXXX-XXXX-XXXXの形式で入力してください';
    }
    if (!form.password) {
      newError.password = 'パスワードを入力してください';
    } else if (
      form.password.length < 8 ||
      form.password.length > 16
    ) {
      newError.password =
        'パスワードは8文字以上16文字以下で入力してください';
    }
    if (!form.checkPassword) {
      newError.checkPassword = '確認用パスワードを入力してください';
    } else if (form.checkPassword !== form.password) {
      newError.checkPassword =
        'パスワードと確認用パスワードが不一致です';
    }

    if (Object.keys(newError).length > 0) {
      setErrors(newError);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'Eメールアドレスが既にあります。' });
        } else {
          alert(data.message || '登録に失敗しました');
        }
      } else {
        router.push('/posts/login');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('サーバーエラーが発生しました');
    }
  };

  const onCancel = () => {
    setForm({
      lastName: '',
      firstName: '',
      email: '',
      zipcode: '',
      address: '',
      tel: '',
      password: '',
      checkPassword: '',
    });
    setErrors({});
  };

  // const onClickAuto = () => {
  //   fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
  //   .then(res => res.json())
  //   .then(json => {
  //     console.log(json.results);
  //     const newAddress = json.results[0].address1 + json.results[0].address2 + json.results[0].address3;
  //     setAddress(newAddress);
  //   })
  //   // console.log(address);
  // }

  // const onClickRegister = () => {
  //   fetch('http://localhost:8000/users')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (
  //         !(
  //           //パスワードの長さが、8文字以上16文字以下
  //           (
  //             lastName &&
  //             firstName &&
  //             email.match(
  //               /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
  //             ) && //メールアドレスが正規表現と一致するか
  //             zipcode.match(/^\d{3}-\d{4}$/) && //郵便番号が正規表現と一致するか
  //             address &&
  //             tel.match(/^(0[5-9]0-[0-9]{4}-[0-9]{4})$/) && //電話番号が正規表現と一致するか。
  //             8 <= password.length &&
  //             password.length <= 16 &&
  //             checkPassword === password
  //           ) //パスワードと確認用パスワードが一致するか
  //         )
  //       ) {
  //         // alert('すべての全ての項目を正しく入力してください');
  //         setShowError(true);
  //       } else if (
  //         data.filter((el: any) => el.email === email).length > 0 //入力したEメールの値とfetchしたデータの中のEメールの値が一致しており、0以上の文字数があるとき
  //       ) {
  //         // alert('Eメールアドレスが既にあります');
  //         setShowExist(true);
  //       } else {
  //         router.push('/posts/login'); //登録内容が正しい場合、ボタンを押すと、ログイン画面に遷移。
  //         fetch('http://localhost:8000/users', {
  //           //全ての入力が正しかった場合、db.jsonのusersに値を追加。
  //           method: 'POST',
  //           headers: { 'Content-type': 'application/json' },
  //           body: JSON.stringify({
  //             name: `${lastName} ${firstName}`,
  //             email: email,
  //             zipcode: zipcode,
  //             address: address,
  //             tel: tel,
  //             password: password,
  //             checkPassword: checkPassword,
  //             history: [],
  //           }),
  //         });
  //       }
  //     });

  // if (
  //   !lastName ||
  //   !firstName ||
  //   !email ||
  //   !zipcode ||
  //   !address ||
  //   !tel ||
  //   !password ||
  //   !checkPassword
  // ) {
  //   alert('全ての項目を入力してください'); //一つでも項目の入力がされてなかったら、アラートを表示
  //   router.push('/create');
  // } else {
  //   alert('全ての項目を入力してください');

  //   return;
  // }
  //  if (!zipcode.match(/^\d{3}-\d{4}$/)) {
  //   alert('郵便番号はXXX-XXXXの形式で入力してください');
  // }

  // if (!tel.match(/^(0[5-9]0-[0-9]{4}-[0-9]{4})$/)) {
  //   alert('電話番号はXXX-XXXX-XXXXの形式で入力してください');
  // }

  return (
    <Layout show={false}>
      <Head>
        <title>会員登録</title>
      </Head>

      <fieldset className={styles.fieldset_style}>
        <p className={styles.form_title}>ユーザ登録</p>
        <form method="POST" onSubmit={onSubmit}>
          <div className={styles.title}>
            <label htmlFor="lastName">名前：</label>
            {errors.lastName && (
              <span className={styles.subTitle}>
                {errors.lastName}
              </span>
            )}{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {errors.firstName && (
              <span className={styles.subTitle}>
                {errors.firstName}
              </span>
            )}{' '}
            {/*入力されてない時だけ"名前を入力してください”を表示 以下全てのinputに同様の機能追加*/}
            <div>
              <label htmlFor="lastName">姓</label>

              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                placeholder="LastName"
                className={styles.form_name}
                onChange={onChange}
                required
              />

              <label htmlFor="firstName">
                &nbsp;&nbsp;&nbsp;&nbsp;名
              </label>

              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                placeholder="FirstName"
                className={styles.form_name}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className={styles.title}>
            <label htmlFor="email">メールアドレス:</label>
            {errors.email && (
              <span className={styles.subTitle}>{errors.email}</span>
            )}

            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              placeholder="Email"
              className={styles.form}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.title}>
            <label htmlFor="zipcode">郵便番号:</label>
            {errors.zipcode && (
              <span className={styles.subTitle}>
                {errors.zipcode}
              </span>
            )}

            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={form.zipcode}
              placeholder="Zipcode"
              className={styles.form}
              onChange={onChange}
              required
            />
            {/* <button type='button' onClick={() => onClickAuto()}>住所自動入力</button> */}
          </div>
          <div className={styles.title}>
            <label htmlFor="address">住所：</label>
            {errors.address && (
              <span className={styles.subTitle}>
                {errors.address}
              </span>
            )}
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              placeholder="Address"
              className={styles.form}
              onChange={onChange}
              required
            ></input>
          </div>
          <div className={styles.title}>
            <label htmlFor="tel">電話番号:</label>
            {errors.tel && (
              <span className={styles.subTitle}>{errors.tel}</span>
            )}

            <input
              type="tel"
              id="tel"
              name="tel"
              value={form.tel}
              placeholder="PhoneNumber"
              className={styles.form}
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.title}>
            <label htmlFor="password">パスワード:</label>
            {errors.password && (
              <span className={styles.subTitle}>
                {errors.password}
              </span>
            )}

            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              className={styles.form}
              placeholder="PassWord(8文字以上16文字以下)"
              onChange={onChange}
              required
            />
          </div>
          <div className={styles.title}>
            <label htmlFor="checkPassword">確認用パスワード:</label>
            {/* {showError===true &&checkPassword.length < 1 && (
              <span className={styles.subTitle}>
                確認用パスワードを入力してください
              </span>
            )} */}
            {errors.checkPassword && (
              <span className={styles.subTitle}>
                {errors.checkPassword}
              </span>
            )}
            {/*パスワードと確認用パスワードが違ったら表示される*/}
            <input
              type="password"
              id="checkPassword"
              name="checkPassword"
              value={form.checkPassword}
              placeholder="Comfirmaition Password"
              className={styles.form}
              onChange={onChange}
            />
          </div>
          <button type="submit" className={styles.button_style}>
            登録
          </button>
          <button
            type="button"
            className={styles.button_style}
            onClick={onCancel}
          >
            {/* キャンセルボタンが押されたときに、全ての値をリセットする*/}
            キャンセル
          </button>
        </form>
      </fieldset>
    </Layout>
  );
}
