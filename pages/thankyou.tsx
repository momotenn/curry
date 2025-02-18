import Link from 'next/link';
import { Layout } from '../component/layout';
import styles from '../styles/thankyou.module.css';
import Head from 'next/head';


export default function Thankyou() {
  //CheckoutFormからのリクエストが届いているssrで確認する。
  return (<>
    <Head>
      <title>注文完了</title>
    </Head>
    <Layout show={true}>
      <h1 className={styles.title}>ご注文ありがとうございます</h1>
      <div className={styles.text}>
        <p>
          ご登録いただきましたメールアドレス宛にご注文確認メールをお送りさせていただきましたのでご確認お願いいたします。
        </p>
        <p>
          また、ご注文内容に誤りがある、確認メールが届かない場合にはお手数ですが当店までご連絡をお願い申し上げます。
        </p>
      </div>
      <Link href="/" className={styles.forHome}>
        ホームへ
      </Link>
    </Layout>
  </>);
}
