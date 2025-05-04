import Head from 'next/head';
import Items from '../components/templates/jsonitems';
import styles from '../styles/Home.module.css';

const Home = ({
  allpostData,
}: {
  allpostData: { id: number; title: string; data: string };
}) => {
  return (
    <div>
      <Head>
        <title className={styles.title}>カレー屋のネット注文</title>
        <link
          href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <Items></Items>
    </div>
  );
};
export default Home;
