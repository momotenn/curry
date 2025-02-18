import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
  lists: {
    name: string;
    path?: string;
  }[];
};

export const BreadCrumb = (pageName: string) => {
  //引数にぱんくずリストに表示させるページ名を入れる
  const router = useRouter();
  let currentUrl = router.pathname;

  // ページ遷移するためのクリック時に現在のurlをsetする(onClick)
  localStorage.setItem(`${pageName}`, currentUrl);

  // mapでぱんくずリストを表示させる
  const lSArray = localStorage;
  const BCName = lSArray.map(
    ({ key, value }: { key: string; value: string }) => {
      return (
        <>
          &nbsp; &gt; &nbsp;
          <Link href={value}>{key}</Link>
        </>
      );
    }
  );

  return { BCName };
};
