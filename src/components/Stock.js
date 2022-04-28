import { FaTimes } from 'react-icons/fa'



const Stock = ({ stock, onDelete, onDoubleClick }) => {
  const getDivClasses = (stock) => {
    let classNames = 'stock';
    classNames += stock.changePercent > 0 ? ' increase' : 
    stock.changePercent < 0 ? ' decrease' : ''

    classNames += stock.autoUpdate ? ' auto-update' : ''
  
    classNames += stock.isCrypto ? ' type-crypto' : ' type-stock'

    return classNames
  }

  return (
    <div className= {getDivClasses(stock)}
                      onDoubleClick = {() => onDoubleClick(stock.id)} >
        <h3>{stock.ticker} <FaTimes style={{color: 'red', 
                                        cursor: 'pointer' }} 
            onClick={() => onDelete(stock.id)}/></h3>
        <h2>{'$' + stock.price}</h2>
        <p>{stock.date}</p>
        <p>{stock.time ? ('Last Updated ' + stock.time) : ''}</p>
        <p>{stock.formattedChange}</p>
    </div>
  )
}

export default Stock