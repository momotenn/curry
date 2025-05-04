import styles from '../items.module.css';
import sugStyles from '../../styles/suggest.module.css';

type SubBtn = {
  type: any,
  value: string,
  onClick: any,
  className: string
}

export function SubBtn({
  type,
  value, 
  onClick,
  className
}: SubBtn) {
  return (
    <>
      <button 
      className={className}
      type={type} onClick={onClick}>{value}</button>
    </>
  )
}
