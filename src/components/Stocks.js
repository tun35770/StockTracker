 import Stock from './Stock'

const Stocks = ({ stocks }) => {
    
  return (
    <>
        {stocks.map((stock) => 
            <Stock key={stock.id} stock={stock} />)
        }
    </>
  )
}

export default Stocks