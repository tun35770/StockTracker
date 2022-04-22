 import Stock from './Stock'

const Stocks = ({ stocks, onDelete, onToggle }) => {
    
  return (
    <>
        {stocks.map((stock) => 
            <Stock key={stock.id} 
                    stock={stock} 
                    onDelete={onDelete} 
                    onToggle={onToggle}/>)
        }
    </>
  )
}

export default Stocks