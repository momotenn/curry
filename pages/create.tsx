import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/create.module.css';
import { Layout } from '../component/layout';
import Head from 'next/head';
export default function User() {
  const [lastName, setlastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [showExist,setShowExist ] = useState(false);

  const onClickAuto = () => {
    fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
    .then(res => res.json())
    .then(json => {
      console.log(json.results);
      const newAddress = json.results[0].address1 + json.results[0].address2 + json.results[0].address3;
      setAddress(newAddress);
    })
    // console.log(address);
  }

  const onClickRegister = () => {
    fetch('http://localhost:8000/users')
      .then((res) => res.json())
      .then((data) => {
        if (
          !(
            (//パスワードの長さが、8文字以上16文字以下
            lastName &&
            firstName &&
            email.match(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/) && //メールアドレスが正規表現と一致するか
            zipcode.match(/^\d{3}-\d{4}$/) &&//郵便番号が正規表現と一致するか
            address &&
            tel.match(/^(0[5-9]0-[0-9]{4}-[0-9]{4})$/) &&//電話番号が正規表現と一致するか。
            8 <= password.length &&
            password.length <= 16 && checkPassword === password) //パスワードと確認用パスワードが一致するか 
          )
        ) {
          // alert('すべての全ての項目を正しく入力してください');
          setShowError(true);
        } else if (
          data.filter((el: any) => el.email === email).length > 0 //入力したEメールの値とfetchしたデータの中のEメールの値が一致しており、0以上の文字数があるとき
        ) {
          // alert('Eメールアドレスが既にあります');
          setShowExist(true);
        } else {
          router.push('/posts/login');//登録内容が正しい場合、ボタンを押すと、ログイン画面に遷移。
          fetch('http://localhost:8000/users', { //全ての入力が正しかった場合、db.jsonのusersに値を追加。
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              name: `${lastName} ${firstName}`,
              email: email,
              zipcode: zipcode,
              address: address,
              tel: tel,
              password: password,
              checkPassword: checkPassword,
              history: []
            }),
          });
        }
      });

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
  };


  return (
    (<Layout show={false}>
      <Head><title>会員登録</title></Head>
      <fieldset className={styles.fieldset_style}>
        <p className={styles.form_title}>ユーザ登録</p>
        <form  method="POST">
          <div className={styles.title}>
            <label htmlFor="lastName">名前：</label>
            {showError === true && lastName.length < 1 && (
              <span className={styles.subTitle}>
                姓を入力してください
              </span>
            )}{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {showError === true && firstName.length < 1 && (
              <span className={styles.subTitle}>
                名を入力してください
              </span>
            )}{' '}
            {/*入力されてない時だけ"名前を入力してください”を表示 以下全てのinputに同様の機能追加*/}
            <div>
              <label htmlFor="lastName">姓</label>

              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                placeholder="LastName"
                className={styles.form_name}
                onChange={(e) => {
                  setlastName(e.target.value);
                }}
              />

              <label htmlFor="firstName">
                &nbsp;&nbsp;&nbsp;&nbsp;名
              </label>

              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                placeholder="FirstName"
                className={styles.form_name}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.title}>
            <label htmlFor="email">メールアドレス:</label>
            {showError === true && email.length < 1 && (
              <span className={styles.subTitle}>
                メールアドレスを入力してください
              </span>
            )}
            {showError === true && !email.match(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/) && email.length >= 1 && (<span className={styles.subTitle}>メールアドレスの形式が不正です</span>)}
            {showExist ===true &&(<span className={styles.subTitle}>Eメールアドレスが既にあります。</span>)}
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Email"
              className={styles.form}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className={styles.title}>
            <label htmlFor="zipcode">郵便番号:</label>
            {showError === true && zipcode.length < 1 && (
              <span className={styles.subTitle}>
                郵便番号を入力してください
              </span>
            )}
            {showError === true && !zipcode.match(/^\d{3}-\d{4}$/) &&
              zipcode.length >= 1 && (
                <span className={styles.subTitle}>
                  郵便番号はXXX-XXXXの形式で入力してください
                </span>
              )}
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={zipcode}
              placeholder="Zipcode"
              className={styles.form}
              onChange={(e) => {
                setZipcode(e.target.value);
              }}
            />
            <button type='button' onClick={() => onClickAuto()}>住所自動入力</button>
          </div>
          <div className={styles.title}>
            <label htmlFor="address">住所：</label>
            {showError === true && address.length < 1 && (
              <span className={styles.subTitle}>
                住所を入力してください
              </span>
            )}
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              placeholder="Address"
              className={styles.form}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            ></input>
          </div>
          <div className={styles.title}>
            <label htmlFor="tel">電話番号:</label>
            {showError === true && tel.length === 0 && (
              <span className={styles.subTitle}>
                電話を入力してください
              </span>
            )}
            {showError === true &&
             !tel.match(/^(070|080|090)-\d{4}-\d{4}$/) &&
             !tel.match(/^0\d-\d{4}-\d{4}$/)&&
             !tel.match(/^0\d{3}-\d{2}-\d{4}$/)&&
             !tel.match(/^\(0\d\)\d{4}-\d{4}$/)&&
             !tel.match(/^\(0\d{3}\)\d{2}-\d{4}$/)&&
             !tel.match(/^050-\d{4}-\d{4}$/)&&
             !tel.match(/^0120-\d{3}-\d{3}$/)&&

              tel.length >= 1 && (
                <span className={styles.subTitle}>
                  電話番号はXXX-XXXX-XXXXの形式で入力してください
                </span>
              )}

            <input
              type="tel"
              id="tel"
              name="tel"
              value={tel}
              placeholder="PhoneNumber"
              className={styles.form}
              onChange={(e) => {
                setTel(e.target.value);
              }}
            />
          </div>
          <div className={styles.title}>
            <label htmlFor="password">パスワード:</label>
            {showError === true && password.length < 1 && (
              <span className={styles.subTitle}>
                パスワードを入力してください
              </span>
            )}
            {showError === true && password.length < 8 && password.length >= 1 && (
              <span className={styles.subTitle}>
                パスワードは8文字以上16文字以下で入力してください
              </span>
            )}
            {showError === true && password.length > 16 && (
              <span className={styles.subTitle}>
                パスワードは8文字以上16文字以下で入力してください
              </span>
            )}
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              className={styles.form}
              placeholder="PassWord(8文字以上16文字以下)"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className={styles.title}>
            <label htmlFor="checkPassword">確認用パスワード:</label>
            {/* {showError===true &&checkPassword.length < 1 && (
              <span className={styles.subTitle}>
                確認用パスワードを入力してください
              </span>
            )} */}
            {showError === true && checkPassword !== password && (
              <span className={styles.subTitle}>
                パスワードと確認用パスワードが不一致です。
              </span>
            )}
            {/*パスワードと確認用パスワードが違ったら表示される*/}
            <input
              type="password"
              id="checkPassword"
              name="checkPassword"
              value={checkPassword}
              placeholder="Comfirmaition Password"
              className={styles.form}
              onChange={(e) => {
                setCheckPassword(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            data-testid="button"
            className={styles.button_style}
            onClick={() => onClickRegister()}
          >
            登録
          </button>
          <button
            type="reset"
            className={styles.button_style}
            onClick={() => {
              setAddress(''),
                setlastName(''),
                setFirstName(''),
                setTel(''),
                setZipcode(''),
                setEmail(''),
                setPassword(''),
                setCheckPassword('');
            }}
          >
            {/* キャンセルボタンが押されたときに、全ての値をリセットする*/}
            キャンセル
          </button>
        </form>
      </fieldset>
    </Layout>)
  );
}
