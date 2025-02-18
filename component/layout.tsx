import styles from './layout.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '../types/types';
import { userAgent } from 'next/server';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BreadCrumb } from './Breadcrumb';

export function Layout({ children, show }: { children: any; show: boolean }) {
  // const [show, setShow] = useState("");
  // const onClickShow = () => {
  //   if (show === "") {
  //     setShow("show");
  //   } else {
  //     setShow("");
  //   }
  // }
  const [loginShow, setLoginShow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoginShow(true)
    }
  }, [])
  
  // ログアウトボタンのクッキー削除
  function onClickLogout() {
    // クッキーのid削除
    const cookieId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('id'));
    console.log(cookieId); //id=1
    document.cookie = `${cookieId}; max-age=0`;

    // クッキーのname削除
    const cookieName = document.cookie;
    console.log(cookieName);
    document.cookie = `${cookieName}; max-age=0`;
    console.log(loginShow);

    // ぱんくずリストの削除(リセット)
    localStorage.clear();

  }
  // 現在のURLを宣言
  const router = useRouter();
  let currentUrl = router.pathname;

  //クリックするとレスポンシブ用のnavが表示される
  const [isActive, setIsActive] = useState(false);
  const onClickAddClass = () => {
    setIsActive(!isActive);
  }

  return (<>
    {/* <BreadCrumb /> */}
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">

          <Image src="/img_curry/header_logo.png" height={35} width={160} alt='logo' />

        </Link>
        {/* ハンバーガーメニュー */}
        <button className={styles.hamburgerMenu} onClick={() => onClickAddClass()}>
          <span></span>
        </button>

        {/* ハンバーガーメニューをクリックしたときに表示されるnav */}
        <nav className={`${styles.menuNav} ${isActive && styles.showNav}`}>
          <ul>
            <Link href="/">

              <li>HOME</li>

            </Link>
            <Link href="/order">

              <li>ショッピングカート</li>

            </Link>
            {show === true && loginShow ?
              <>
                <Link href="/history">

                  {document.cookie && (<li>注文履歴</li>)}

                </Link>
                {/*ログイン状態なら、ログインの代わりにユーザー名を表示 */}
                {loginShow && document.cookie &&
                  <li>{
                    //@ts-ignore
                    document.cookie.split('; ').find(row => row.startsWith('name')).split('=')[1]
                  }さん</li>
                }
                {loginShow && !(document.cookie) &&
                  <Link href="/posts/login">

                    <li>ログイン</li>

                  </Link>
                }
                {document.cookie &&
                  <Link href="/">

                    <li>
                      <button className={styles.logout} onClick={() => onClickLogout()}>
                        ログアウト
                      </button>
                    </li>

                  </Link>}
              </> :
              <></>
            }
          </ul>
        </nav>


        <div className={styles.pcHeaderNav}>
          <ul>
            <Link href="/order">

              <li>ショッピングカート</li>

            </Link>


            {show === true && loginShow ?
              <>
                <Link href="/history">

                  {document.cookie && (<li>注文履歴</li>)}

                </Link>
                {/*ログイン状態なら、ログインの代わりにユーザー名を表示 */}
                {loginShow && document.cookie &&
                  <li>{
                    //@ts-ignore
                    document.cookie.split('; ').find(row => row.startsWith('name')).split('=')[1]
                  }さん</li>
                }
                {loginShow && !(document.cookie) &&
                  <Link href="/posts/login">

                    <li>ログイン</li>

                  </Link>
                }
                {document.cookie &&
                  <Link href="/">

                    <li>
                      <button className={styles.logout} onClick={() => onClickLogout()}>
                        ログアウト
                      </button>
                    </li>

                  </Link>}
              </> :
              <></>
            }
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
  </>);
}
