import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Layout } from '../../component/layout';
import styles from '../../styles/login.module.css';
import { useRouter } from 'next/router';

// html
export default function Login() {
  const [mailText, setMailText] = useState<any>('');
  const [passText, setPassText] = useState<any>('');
  const [ok, setOk] = useState(false);
  const [dataId, setDataId] = useState(0);
  const [dataName, setDataName] = useState('');
  const router = useRouter();
  const [errShow, setErrShow] = useState(false);

  const onChangeMail = (e: any) => setMailText(e.target.value);
  const onChangePass = (e: any) => setPassText(e.target.value);

  // データ取得

  fetch(
    `http://localhost:8000/users?email=${mailText}&password=${passText}`,
    {
      method: 'GET',
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 1) {
        setOk(true);
        setDataId(data[0].id);
        setDataName(data[0].name);
      } else {
        setOk(false);
      }
    });

  // ページ遷移
  const handleClick = () => {
    // console.log(ok);
    if (ok === false) {
      setErrShow(true);
    } else if (router.query.currentUrl) {
      router.push('/order');
      document.cookie = `id=${dataId}; max-age=86400`;
      document.cookie = `name=${dataName}; max-age=86400`;
    } else {
      router.push('/');
      document.cookie = `id=${dataId}; max-age=86400`;
      document.cookie = `name=${dataName}; max-age=86400`;
      // ログイン時(ショッピングカート以外から遷移してきた場合)にローカルストレージにホームurlをセットしておく
      localStorage.setItem('home', '/');
    }
  };

  return (<>
    <Head>
      <title>ログイン画面</title>
    </Head>
    <Layout show={false}>
      <form className={styles.formContainer}>
        <h1 className={styles.h1}>ログイン</h1>
        {errShow === true && (
          <div>
            <p className={styles.inputErr}>
              メールアドレス、またはパスワードが間違っています
            </p>
          </div>
        )}

        <div>
          <div>
            <div className={styles.labelError}>
              <label htmlFor="email" className={styles.label}>
                メールアドレス：
              </label>
              {errShow === true &&
                !mailText.match(
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
                ) &&
                mailText.length >= 1 && (
                  <p
                    className={styles.mailErr}
                    data-testid="emailErr"
                  >
                    メールアドレスの形式が不正です
                  </p>
                )}
            </div>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              name="mail"
              id="email"
              value={mailText}
              onChange={onChangeMail}
              data-testid="emailInput"
            />
          </div>

          <div>
            <div className={styles.labelError}>
              <label htmlFor="password" className={styles.label}>
                パスワード：
              </label>
            </div>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              name="pass"
              id="password"
              value={passText}
              onChange={onChangePass}
            />
          </div>

          <button
            type="button"
            className={styles.loginBtn}
            onClick={() => handleClick()}
            data-testid="loginButton"
          >
            ログイン
          </button>
        </div>
      </form>

      <Link href="../create" className={styles.forCreate}>
        ユーザー登録はこちら
      </Link>
    </Layout>
  </>);
}
