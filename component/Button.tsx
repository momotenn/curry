import styles from '../component/items.module.css';
import { getStaticProps } from '../pages/posts/[id]';
import Items from '../component/jsonitems';

export const FormReset = (props: any) => {
  return (
    <button
      type="reset"
      value="クリア"
      className={styles.cannselBtn}
      onClick={props.onClick}
    >
      クリア
    </button>
  );
};

export const ClickSearch = (props: any) => {
  return (
    <button
      type="button"
      value="検索"
      className={styles.searchBtn}
      onClick={props.onClick}
    >
      検索
    </button>
  );
};
