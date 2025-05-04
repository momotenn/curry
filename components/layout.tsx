import styles from './layout.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '../types/types';
import { userAgent } from 'next/server';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BreadCrumb } from './Breadcrumb';

export function Layout({
  children,
  show,
}: {
  children: any;
  show: boolean;
}) {
  // const [show, setShow] = useState("");
  // const onClickShow = () => {
  //   if (show === "") {
  //     setShow("show");
  //   } else {
  //     setShow("");
  //   }
  // }
  const [userName, setUserName] = useState('');
  const [loginShow, setLoginShow] = useState<null | boolean>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🍪クッキー:', document.cookie);
      const cookieNameRow = document.cookie
        .split('; ')
        .find((row) => row.startsWith('name='));

      console.log('クッキーname:', cookieNameRow);
      const name = cookieNameRow
        ? decodeURIComponent(cookieNameRow.split('=')[1])
        : '';

      console.log('name:', name);
      setUserName(name);
      setLoginShow(name !== '');
    }
  }, []);

  useEffect(() => {
    console.log('loginShow', loginShow);
  }, [loginShow]);

  // ログアウトボタンのクッキー削除
  function onClickLogout() {
    // クッキーのid削除
    document.cookie = `token=; max-age=0; path=/`;
    document.cookie = `name=; max-age=0; path=/`;
    localStorage.clear();
    setUserName('');
    setLoginShow(false);
  }
  // 現在のURLを宣言
  const router = useRouter();
  let currentUrl = router.pathname;

  //クリックするとレスポンシブ用のnavが表示される
  const [isActive, setIsActive] = useState(false);
  const onClickAddClass = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      {/* <BreadCrumb /> */}
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/">
            <Image
              src="/img_curry/header_logo.png"
              height={35}
              width={160}
              alt="logo"
            />
          </Link>
          {/* ハンバーガーメニュー */}
          <button
            className={styles.hamburgerMenu}
            onClick={() => onClickAddClass()}
          >
            <span></span>
          </button>

          {/* ハンバーガーメニューをクリックしたときに表示されるnav */}
          <nav
            className={`${styles.menuNav} ${
              isActive && styles.showNav
            }`}
          >
            <ul>
              <Link href="/">
                <li>HOME</li>
              </Link>
              <Link href="/order">
                <li>ショッピングカート</li>
              </Link>
              {/* ログイン状態をチェック */}
              {loginShow === null && <></>}{' '}
              {/* 判定中（何も表示しない） */}
              {loginShow === false && (
                <Link href="/posts/login">
                  <li>ログイン</li>
                </Link>
              )}
              {loginShow === true && (
                <>
                  <Link href="/history">
                    <li>注文履歴</li>
                  </Link>
                  <li>{decodeURIComponent(userName)}さん</li>
                  <Link href="/">
                    <li>
                      <button
                        className={styles.logout}
                        onClick={() => onClickLogout()}
                      >
                        ログアウト
                      </button>
                    </li>
                  </Link>
                </>
              )}
            </ul>
          </nav>

          <div className={styles.pcHeaderNav}>
            <ul>
              <Link href="/order">
                <li>ショッピングカート</li>
              </Link>
              {/* ログイン状態をチェック */}
              {loginShow === null && <></>}{' '}
              {/* 判定中（何も表示しない） */}
              {loginShow === false && (
                <Link href="/posts/login">
                  <li>ログイン</li>
                </Link>
              )}
              {loginShow === true && (
                <>
                  <Link href="/history">
                    <li>注文履歴</li>
                  </Link>
                  <li>{decodeURIComponent(userName)}さん</li>
                  <Link href="/">
                    <li>
                      <button
                        className={styles.logout}
                        onClick={() => onClickLogout()}
                      >
                        ログアウト
                      </button>
                    </li>
                  </Link>
                </>
              )}
            </ul>
          </div>
        </header>
        {/* <nav id="headerNav" className={`${styles.headerNav} ${show}`}>
      <ul>
        <li>ショッピングカート</li>
        <li>注文履歴</li>
        <li>ログイン</li>
        <li>ログアウト</li>
      </ul>
    </nav> */}
        {children}
      </div>
    </>
  );
}
