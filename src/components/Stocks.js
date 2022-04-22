 import Stock from './Stock'

const Stocks = ({ stocks, onDelete }) => {
    
  return (
    <>
        {stocks.map((stock) => 
            <Stock key={stock.id} stock={stock} onDelete={onDelete} />)
        }
    </>
  )
}

export default Stocks