import { FaTimes } from 'react-icons/fa'

const Stock = ({ stock, onDelete, onToggle }) => {
  return (
    <div className={`stock ${stock.active ? 'active' : ''}`} 
        onDoubleClick={() => onToggle(stock.id)}>
        <h3>{stock.text} <FaTimes style={{color: 'red', 
                                        cursor: 'pointer' }} 
            onClick={() => onDelete(stock.id)}/></h3>
        <p>{stock.price}</p>
    </div>
  )
}

export default Stock