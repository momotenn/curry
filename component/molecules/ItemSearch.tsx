import { Item } from "../../types/types";
import { InputText } from "../atoms/InputText";
import { MainBtn } from "../atoms/MainBtn";
import { SubBtn } from "../atoms/SubBtn";
import styles from '../items.module.css';
import sugStyles from '../../styles/suggest.module.css';

type ItemSearchProps = { 
  onChangeInput: any, 
  onClickMain: any, 
  onClickSub: any,
  nameText: string,
  onChangeNameText: any,
  showSug: boolean,
  suggestData: string[],
  onClickSuggest: any,
  onClickSearch: any,
  formReset: any,
  sortSelect: any,
  onChangeSortSelect: any
}

export function ItemSearch({
    onChangeInput, 
    onClickMain, 
    onClickSub, 
    nameText, 
    showSug,
    suggestData,
    onClickSuggest,
    sortSelect,
    onChangeSortSelect
}: ItemSearchProps) {
  return (
    <>
      <div className={styles.searchWrapper}>
        <p>
          <span className={styles.serchTitle}>商品を検索する</span>
        </p>
        <div>
          <form
            name="form1"
            method="post"
            action="#"
            className={`${styles.searchForm}`}
          >
            <label htmlFor="name">商品名</label>
            <span className={`${sugStyles.span}`}>
              <InputText
                type="text"
                id="name"
                name="name"
                value={nameText}
                placeholder={'商品名で検索する'}
                onChange={onChangeInput}
                //@ts-ignore
                // onFocus={onFocusShow}
                // onBlur={onBlurShow}
                className={`${styles.searchNameInput} ${sugStyles.form}`}
              />
              {showSug && (
                <div className={sugStyles.suggest}>
                  {suggestData.map(
                    //@ts-ignore
                    ({ name, id }: Item, index: number) => {
                      if (index >= 3) return;
                      return (
                        <button
                          type="button"
                          value={name}
                          onClick={(event) => onClickSuggest(event)}
                          key={id}
                        >
                          {name}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </span>

            <span className={styles.buttonWrapper}>
              <MainBtn
                type="button"
                value="検索"
                onClick={onClickMain}
                className={styles.searchBtn}
              />

              <SubBtn
                type="reset"
                value="クリア"
                onClick={onClickSub}
                className={styles.cannselBtn}
              />
            </span>
            <br />
            <select
              name="sort"
              size={1}
              className={styles.select}
              value={sortSelect}
              onChange={onChangeSortSelect}
            >
              <option value="up">価格[安い順]</option>
              <option value="down">価格[高い順]</option>
            </select>
          </form>
        </div>
      </div>
    </>
  )
}
