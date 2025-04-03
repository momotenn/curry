import { Pool } from 'pg';
import { privateDecrypt } from 'crypto';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../../component/templates/jsonitems';
import { Layout } from '../../component/layout';
import { getAllJsonIds, getJsonData } from '../../lib/json';
import { Item, Topping } from '../../types/types';
import detailStyle from '../../component/details.module.css';
import Head from 'next/head';
import { MainBtn } from '../../component/atoms/MainBtn';
import { useRouter } from 'next/router';

//posts/1などのpathを用意する
export async function getStaticPaths() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    // items テーブルから id のみ取得
    const res = await pool.query('SELECT id FROM items');
    console.log('✅ DB接続成功 paths:', res.rows);

    const paths = res.rows.map((row) => ({
      params: { id: row.id.toString() },
    }));
    console.log('paths', paths);
    await pool.end();
    return {
      paths,
      //idがない場合は404になるようにfalse
      fallback: false,
    };
  } catch (error) {
    console.error('❌ getStaticPathsでDB接続失敗:', error);
    throw error;
  }
}

//上のpathから拾ってきたデータをpropsとして下のコンポーネントに渡す。
export async function getStaticProps({
  params,
}: {
  params: { id: string };
}) {
  try {
    const host = process.env.NEXT_PUBLIC_HOST;

    const url = `${host}/api/items/${params.id}?size=S&toppingId=`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const { item: jsonData } = await res.json();

    if (jsonData.created_at instanceof Date) {
      jsonData.created_at = jsonData.created_at.toISOString();
    }

    if (jsonData.updated_at instanceof Date) {
      jsonData.updated_at = jsonData.updated_at.toISOString();
    }

    if (jsonData.deleted_at instanceof Date) {
      jsonData.deleted_at =
        jsonData.deleted_at?.toISOString() || null;
    }

    console.log('📝jsonData', jsonData);
    return {
      props: {
        jsonData,
      },
      revalidate: 10, // ISRを使う場合
    };
  } catch (error) {
    console.error('❌Error fetching item:', error);
    return {
      notFound: true,
    };
  }
}

export default function Details({ jsonData }: { jsonData: Item }) {
  //toppingを拾ってきてCSRで表示

  const router = useRouter();

  const { id } = router.query;
  // console.log('😃id', id);

  const { data: toppings, error } = useSWR('/api/toppings', fetcher);

  const { data: sizes } = useSWR('/api/sizes', fetcher);

  //初期値ではトッピングは何も選ばれていない状態

  const [checkedToppingsArray, setCheckedToppingsArray] = useState<
    boolean[]
  >(Array(toppings?.length).fill(false));

  const [selectedSize, setSelectedSize] = useState<string | null>(
    null
  );

  //注文個数のstate
  const [count, setCount] = useState(1);
  //追加されたtoppingのstate
  const [toppingList, setToppingList] = useState([]);

  const [itemDetail, setItemDetail] = useState<any>(null);

  useEffect(() => {
    if (!id || !selectedSize || !toppings) {
      console.log('🧪 useEffect 条件未達成:', {
        id,
        typeofId: typeof id,
        selectedSize,
        toppings,
      });
      return;
    }
    console.log('🧪 useEffect 発火:', { id, selectedSize, toppings });

    const selectedToppingIds = toppings
      .map((t: Topping, idx: number) =>
        checkedToppingsArray[idx] ? t.id : null
      )
      .filter((id: number | null) => id !== null);

    const fetchDetail = async () => {
      const toppingParam = selectedToppingIds.join(',');
      const res = await fetch(
        `/api/items/${id}?size=${selectedSize}&toppingId=${toppingParam}`
      );
      const text = await res.text();

      try {
        const result = JSON.parse(text); // ここでパースできなければ catch される
        console.log('🟢 正常に受け取ったデータ:', result);
        setItemDetail(result.item);
      } catch (err) {
        console.error('❌ JSONパース失敗。レスポンス:', text);
      }
    };

    fetchDetail();

    fetch('/api/test');
  }, [id, selectedSize, checkedToppingsArray, toppings]);

  //クリックされたときにtrueとfalseが入れ替わる
  if (error) return <div>Failed to load</div>;
  if (!toppings || !sizes) return <div>Loading...</div>;

  const onChangeCheck = (index: number) => {
    const newCheck = [...checkedToppingsArray];
    newCheck[index] = !newCheck[index];
    setCheckedToppingsArray(newCheck);
  };

  let totalToppingPrice = 0;
  checkedToppingsArray.forEach(
    (checkedTopping: boolean, index: number) => {
      if (checkedTopping) {
        return (totalToppingPrice += toppings[index].price);
      } else return;
    }
  );

  let selectedSizeExtraPrice = 0;
  if (sizes && selectedSize) {
    const found = sizes.find(
      (size: any) => size.id.toString() === selectedSize
    );
    if (found) {
      selectedSizeExtraPrice = parseInt(found.extra_price, 10);
    }
  }

  function onClickDec() {
    //toppingにcheckedToppingsArrayのtrue, falseを割り当てる
    toppings.map(
      (el: any, index: number) =>
        (el.checkedToppingsArray = checkedToppingsArray[index])
    );

    //toppingがtrueになっているものだけを集める
    let newToppingList = [...toppingList];
    newToppingList = toppings.filter(
      (el: any) => el.checkedToppingsArray == true
    );
    setToppingList(newToppingList);

    setItemDetail(false);
  }

  const arr = [];
  for (let i = 1; i < 13; i++) {
    arr.push(i);
  }

  //注文個数を代入
  const onChangeCount = (event: any) => {
    setItemDetail(true);
    setCount(event.target.value);
  };

  const { jsonId, name, imagepath, description, price } = jsonData;
  const onClickCart = () => {
    // //@ts-ignore
    //     const cookieName = document.cookie.split('; ')
    //     .find(row=>row.startsWith('name')).split('=')[1];

    //dbJsonのorderItemsに反映させる
    fetch('/api/orderItems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        price: price,
        imagePath: imagepath,
        toppingList: toppingList,
        size: selectedSize,
        count: Number(count),
        TotalPrice:
          (price + selectedSizeExtraPrice + totalToppingPrice) *
          count,
      }),
    });
  };

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <Layout show={true}>
        {/* ぱんくずリスト */}
        <Link href="/">商品一覧</Link>
        &nbsp; &gt; &nbsp;
        <span>{name}</span>
        <div className={detailStyle.item}>
          <img
            src={imagepath}
            width={300}
            className={detailStyle.itemImg}
          />
          <div className={detailStyle.itemDetail}>
            <h2>{name}</h2>
            <p>{description}</p>
          </div>
        </div>
        <div className={detailStyle.option}>
          <h3 className={detailStyle.optionTitle}>
            サイズ選択:
            <br />
            S:0円 M:100円 L:300円
          </h3>
          <div className={detailStyle.optionTag}>
            {sizes.map((size: any) => (
              <div key={size.id}>
                {/* チェックボックス（単一選択：選択されたサイズのみ true にする） */}
                <input
                  type="checkbox"
                  id={`size-${size.id}`}
                  name="size"
                  checked={selectedSize === size.id.toString()}
                  onChange={() => {
                    // すでに選択されている場合は解除、未選択の場合は選択
                    if (selectedSize === size.id.toString()) {
                      setSelectedSize(null);
                    } else {
                      setSelectedSize(size.id.toString());
                    }
                  }}
                />
                <label htmlFor={`size-${size.id}`}>{size.size}</label>
              </div>
            ))}
          </div>

          {/* <h3 className={detailStyle.optionTitle}>
            ライス大盛り: 300円
          </h3>
          <div className={detailStyle.optionTag}>
            {
              //toppingのデータを一つ一つ表示
              data.map(({ name, price, id }: Topping, index: any) => {
                if (price !== 300) return;
                return (
                  <>
                    <input
                      type="checkbox"
                      id={name}
                      name={name}
                      checked={checkedToppingsArray[index]}
                      onChange={() => onChangeCheck(index)}
                    />
                    <label htmlFor={name}>{name}</label>
                  </>
                );
              })
            }
          </div> */}
          <h3 className={detailStyle.optionTitle}>
            トッピング: 1つにつき100円（税抜）
          </h3>
          <div className={detailStyle.optionTag}>
            {
              //toppingのデータを一つ一つ表示
              toppings.map(
                ({ name, price, id }: Topping, index: any) => {
                  if (price !== 100) return;
                  return (
                    <>
                      <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={!!checkedToppingsArray[index]}
                        onChange={() => onChangeCheck(index)}
                      />
                      <label htmlFor={name}>{name}</label>
                    </>
                  );
                }
              )
            }
          </div>
          <h3 className={detailStyle.optionTitle}>
            トッピング: 1つにつき200円（税抜）
          </h3>
          <div className={detailStyle.optionTag}>
            {
              //toppingのデータを一つ一つ表示
              toppings.map(
                ({ name, price, id }: Topping, index: any) => {
                  if (price !== 200) return;
                  return (
                    <>
                      <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={checkedToppingsArray[index]}
                        onChange={() => onChangeCheck(index)}
                      />
                      <label htmlFor={name}>{name}</label>
                    </>
                  );
                }
              )
            }
          </div>
          <h3 className={detailStyle.quantity}>数量:</h3>
          <select
            name="count"
            id="count"
            className={detailStyle.select}
            value={count}
            onChange={onChangeCount}
          >
            {arr.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>
        <p className={detailStyle.total}>
          この商品金額:{' '}
          {String(
            (price + selectedSizeExtraPrice + totalToppingPrice) *
              count
          ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
          円（税抜）
        </p>
        {itemDetail === true ? (
          <MainBtn
            className={detailStyle.Btn}
            onClick={(): any => onClickDec()}
            value={'確定'}
            type={undefined}
          />
        ) : (
          <Link href="/" legacyBehavior>
            <MainBtn
              className={detailStyle.Btn}
              onClick={() => onClickCart()}
              value={'カートに追加'}
              type={undefined}
            />
            {/* <button className={detailStyle.Btn} onClick={() => onClickCart()}>カートに追加</button> */}
          </Link>
        )}
      </Layout>
    </>
  );
}
