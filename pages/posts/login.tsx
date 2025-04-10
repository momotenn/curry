import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Layout } from '../../component/layout';
import styles from '../../styles/login.module.css';
import { useRouter } from 'next/router';

// html
export default function Login() {
  const [mailText, setMailText] = useState<any>('');
  const [passText, setPassText] = useState<any>('');

  const router = useRouter();
  const [errShow, setErrShow] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const onChangeMail = (e: any) => setMailText(e.target.value);
  const onChangePass = (e: any) => setPassText(e.target.value);

  const [formURL, setFormURL] = useState('/');

  useEffect(() => {
    if (typeof router.query.form === 'string') {
      setFormURL(router.query.form);
    }
  }, [router.query.form]);

  // ページ遷移
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: mailText,
        password: passText,
      }),
      credentials: 'include',
    });

    const data = await res.json();
    console.log('📃data', data);

    if (res.ok) {
      if (formURL === '/order') {
        router.push('/order');
        console.log('✅カートに遷移');
      } else {
        router.push('/');
        console.log('✅ホームに遷移');
      }
    } else {
      console.log('❌ログイン失敗', data.message);
      // setErrShow(true);
      setErrMessage(data.message || 'ログインにしっぱいしました');
    }
  };

  return (
    <>
      <Head>
        <title>ログイン画面</title>
      </Head>
      <Layout show={false}>
        <form className={styles.formContainer} onSubmit={handleClick}>
          <h1 className={styles.h1}>ログイン</h1>
          {errMessage && (
            <div>
              <p className={styles.inputErr}>{errMessage}</p>
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
              type="submit"
              className={styles.loginBtn}
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
    </>
  );
}
