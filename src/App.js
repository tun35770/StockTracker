import Header from './components/Header'
import Stocks from './components/Stocks'
import AddStock from './components/AddStock'
import { useState } from 'react'


function App() {
  const [showAddStock, setShowAddStock] = useState(false)
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

  //Add Stock
  const addStock = (stock) => {
    const id = Math.floor(Math.random() * 10000) + 1
    const newStock = { id, ...stock }
    setStocks([...stocks, newStock])
  }

  //Delete Stock
  const deleteStock = (id) => {
    setStocks(stocks.filter((stock) => 
      stock.id !== id
    ))
  }

  //Toggle Active Status
  const toggleActive = (id) => {
    setStocks(stocks.map((stock => stock.id === id ? { ...stock, active: !stock.active} : stock)))
  }

  return (
    <div className="container">
      <Header onAdd={() => setShowAddStock(!showAddStock)}
              showAdd={showAddStock}/>
      {showAddStock && <AddStock onAdd={addStock}/>}
      {stocks.length > 0 ? <Stocks stocks={stocks} onDelete=
      {deleteStock} onToggle={toggleActive} /> : 'No Stocks To Show'}
    </div>
  );
}

export default App;
