import detailStyle from "../../component/details.module.css"

type MainBtn = {
  type: any,
  value: string,
  onClick: any,
  className: string
}

export function MainBtn({
  type,
  value, 
  onClick,
  className
}: MainBtn): JSX.Element {
  return (
    <>
      <button 
      className={className}
      type={type} onClick={onClick}>{value}</button>
    </>
  )
}
