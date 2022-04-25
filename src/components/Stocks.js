 import Stock from './Stock'

const Stocks = ({ stocks, onDelete, onDoubleClick }) => {
    
  return (
    <>
        {stocks.map((stock) => 
            <Stock key={stock.id} 
                    stock={stock} 
                    onDelete={onDelete} 
                    onDoubleClick = {onDoubleClick} />)
        }
    </>
  )
}

export default Stocks