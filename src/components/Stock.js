import { FaTimes } from 'react-icons/fa'

const Stock = ({ stock, onDelete }) => {
  return (
    <div className='stock'>
        <h3>{stock.ticker} <FaTimes style={{color: 'red', 
                                        cursor: 'pointer' }} 
            onClick={() => onDelete(stock.id)}/></h3>
        <p>{stock.price}</p>
        <p>{stock.date}</p>
    </div>
  )
}

export default Stock