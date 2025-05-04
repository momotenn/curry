import { Item } from '../../types/types';
import React, { useEffect, useState } from 'react';
import { Layout } from '../layout';
import styles from '../../styles/items.module.css';
import { ItemSearch } from '../molecules/ItemSearch';
import { ItemCard } from '../atoms/ItemCard';
import { SwiperAtom } from '../atoms/SwiperAtom';
import { useRouter } from 'next/router';

export const fetcher: (args: string) => Promise<any> = (...args) =>
  fetch(...args).then((res) => res.json());

export default function Items() {
  const router = useRouter();
  // 並び替え用のstate
  const [sortSelect, setSortSelect] = useState('up');
  const onChangeSortSelect = (event: any) =>
    setSortSelect(event.target.value);

  //該当する商品がありませんを表示するかどうか
  const [alertShow, setAlertShow] = useState(false);

  // 検索欄に入力された文字を含む商品だけをsetSearchDataに代入
  const [searchData, setSearchData]: any[] = useState([]);
  const [suggestData, setSuggestData]: any[] = useState([]);

  // selectが昇順と降順でfetchするdataを変更する

  // 検索欄に文字入力できるようにする
  const [nameText, setNameText] = useState('');
  const onChangeNameText = (event: any) => {
    setNameText(event.target.value);
    setAlertShow(false);
    setShowSug(true);
  };

  useEffect(() => {
    // nameTextに書かれた物と一致する名前のdataをfilterで抽出する関数
    // 抽出したdataをsetSearchDataに保管
    setSuggestData(
      data2.filter((e: any) => {
        return e.name.indexOf(nameText) >= 0;
      })
    );
  }, [nameText]);

  const onClickSuggest = (e: any) => {
    setShowSug(false);
    setNameText(e.target.value);
  };

  //検索サジェストを表示
  const [showSug, setShowSug] = useState(false);
  const onFocusShow = () => setShowSug(true);
  const onBlurShow = () => setShowSug(false);

  const onClickSearch = () => {
    setSearchData(
      data2.filter((e: any) => {
        return e.name.indexOf(nameText) >= 0;
      })
    );
    setAlertShow(true);
    setShowSug(false);
  };

  // クリアボタンを押した時setNameTextを空で返す
  const formReset = () => {
    setNameText('');
    setSearchData([]);
    setAlertShow(false);
    setShowSug(false);
  };

  const [nowNum, setNowNum] = useState(1);
  const currentPage = `/api/items?_page=${nowNum}&_limit=5&_sort=price&_order=asc`;
  const maxPageNumber = 'rel=prev';
  // const router = useRouter();
  const [get, setGet] = useState(
    `/api/items?_page=${nowNum}&_limit=5&_sort=price&_order=asc`
  );
  const [get2, setGet2] = useState(
    '/api/items?_sort=price&_order=asc'
  );

  const [totalItems, settotalItems] = useState<any>(0);
  const [totalPages, setTotalPages] = useState(0);

  // fetchで今のページに表示する分の商品を取ってくる
  fetch(currentPage, {
    method: 'GET',
  })
    // .then((res) => {
    //   res.headers.get('X-Total-Count');
    //   return res.json()
    // });
    .then((response) => response.headers)
    .then((headers) => {
      settotalItems(`${headers.get('X-Total-Count')}`);
    });

  useEffect(() => {
    setTotalPages(Math.round(totalItems / 5));
  }, [totalItems]);

  // ページ番号か表示順が変わるたびに商品一覧表示を変更させる
  useEffect(() => {
    if (sortSelect === 'up') {
      setGet(
        `/api/items?_page=${nowNum}&_limit=5&_sort=price&_order=asc`
      );
    } else if (sortSelect === 'down') {
      setGet(
        `/api/items?_page=${nowNum}&_limit=5&_sort=price&_order=desc`
      );
    }
  }, [nowNum, sortSelect]);

  useEffect(() => {
    if (sortSelect === 'up') {
      setGet2(`/api/items?_sort=price&_order=asc`);
    } else if (sortSelect === 'down') {
      setGet2(`/api/items?_sort=price&_order=desc`);
    }
  }, [sortSelect]);

  // これを書くとページ遷移後に上から表示され見やすくなる
  function onClickTopNum() {
    setNowNum(nowNum - 1);
  }

  function onClickPrevNum() {
    setNowNum(nowNum - 1);
  }

  function onClickNextNum() {
    setNowNum(nowNum + 1);
  }

  function onClickLastNum() {
    setNowNum(nowNum + 1);
  }

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    fetch(get)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [get]);

  useEffect(() => {
    fetch(get2)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => setData2(json));
  }, [get2]);

  return (
    <Layout show={true}>
      {/*@ts-ignore*/}
      <SwiperAtom />
      <div className={styles.aiBtnWrapper}>
        <button
          type="button"
          onClick={() => router.push('/ai')}
          className={styles.aiBtn}
        >
          AIセレクト
        </button>
      </div>
      <ItemSearch
        onChangeInput={onChangeNameText}
        onClickMain={() => onClickSearch()}
        onClickSub={() => formReset()}
        nameText={nameText}
        showSug={showSug}
        suggestData={suggestData}
        onClickSuggest={onClickSuggest}
        sortSelect={sortSelect}
        onChangeSortSelect={onChangeSortSelect}
        onChangeNameText={undefined}
        onClickSearch={undefined}
        formReset={undefined}
      />
      <div className={styles.itemWrapper}>
        {/* 条件分岐 */}
        {!alertShow && searchData.length == 0 ? (
          // 「？」はtrue、「:」はfalse
          // 検索テキストが空の場合
          data.map((item: Item) => {
            const { jsonId, name, price, imagepath } = item;
            return (
              // @ts-ignore
              <div key={jsonId}>
                <ItemCard
                  id={jsonId}
                  name={name}
                  price={price}
                  imagepath={imagepath}
                  type={''}
                  description={''}
                  delete={false}
                />
              </div>
            );
          })
        ) : // 検索テキストに入力した場合
        searchData.length == 0 ? (
          <p className={styles.p}>該当する商品がありません。</p>
        ) : (
          searchData.map((item: Item) => {
            const { jsonId, name, price, imagepath } = item;
            return (
              // @ts-ignore
              <div key={jsonId}>
                <ItemCard
                  id={jsonId}
                  name={name}
                  price={price}
                  imagepath={imagepath}
                  type={''}
                  description={''}
                  delete={false}
                />
              </div>
            );
          })
        )}
      </div>
      <div>
        <div className={styles.paginate}>
          {/* 今のページ番号が1じゃなければ前へボタンを置く */}
          <div className={styles.paginateWapp}>
            {nowNum > 1 && (
              <button
                className={styles.prevNextBtn}
                onClick={() => onClickTopNum()}
              >
                &lt;
              </button>
            )}

            {/* 今のページが2以上なら置く */}
            {/* {nowNum > 1 &&
        <button className={styles.befAfBtn} onClick={() => onClickPrevNum() }>{nowNum - 1}</button>} */}

            {/* 今のページ */}
            <p className={styles.nowPage}>{nowNum}</p>

            {/* 今のページが最後じゃなければ置く */}
            {/* {nowNum < 3 &&
        <button className={styles.befAfBtn} onClick={() => onClickNextNum() }>{nowNum + 1}</button>} */}

            {/* 今のページ番号が最後じゃなければ次へボタンを置く */}
            {nowNum !== 3 && (
              <button
                className={styles.prevNextBtn}
                onClick={() => onClickLastNum()}
              >
                &gt;
              </button>
            )}
          </div>
          <div className={styles.pageDisplay}>
            {nowNum} &nbsp; / &nbsp; {totalPages}ページ目
          </div>
        </div>
      </div>
    </Layout>
  );
}
