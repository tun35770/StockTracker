import { FaTimes } from 'react-icons/fa'

const Stock = ({ stock, onDelete, onDoubleClick }) => {
  return (
    <div className= {(stock.changePercent > 0 ? 'stock increase' : 
                      stock.changePercent < 0 ? 'stock decrease' : 
                      'stock') + (stock.autoUpdate ? ' auto-update' : '')}
                      onDoubleClick = {() => onDoubleClick(stock.id)} >
        <h3>{stock.ticker} <FaTimes style={{color: 'red', 
                                        cursor: 'pointer' }} 
            onClick={() => onDelete(stock.id)}/></h3>
        <h2>{stock.price}</h2>
        <p>{stock.date}</p>
        <p>{stock.formattedChangePercent}</p>
    </div>
  )
}

export default Stock