import Header from './components/Header'
import Stocks from './components/Stocks'
import { useState } from 'react'

function App() {
  const [stocks, setStocks] = useState([
    {
        id:1,
        text: 'AAPL',
        price: '$109.27',
        active: true
    },
    {
        id:2,
        text: 'FB',
        price: '$221.55',
        active: true
    },
    {
        id:3,
        text: 'GME',
        price: '$7.98',
        active: true
    }
])

  //Delete Stock
  const deleteStock = (id) => {
    setStocks(stocks.filter((stock) => 
      stock.id !== id
    ))
  }

  return (
    <div className="container">
      <Header />
      {stocks.length > 0 ? <Stocks stocks={stocks} onDelete=
      {deleteStock} /> : 'No Stocks To Show'}
    </div>
  );
}

export default App;
