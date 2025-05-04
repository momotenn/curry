import styles from '../items.module.css';
import sugStyles from '../../styles/suggest.module.css';

type InputText = {
  type: string,
  id: string,
  name: string,
  value: string,
  placeholder: string,
  onChange: any,
}

export function InputText(
  {
    type,
    id,
    name,
    value,
    placeholder,
    onChange
  }: InputText) {
    return (
      <>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${styles.searchNameInput} ${sugStyles.form}`} 
        />
      </>
    )
}
