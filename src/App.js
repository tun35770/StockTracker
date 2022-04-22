import Header from './components/Header'
import Stocks from './components/Stocks'
import AddStock from './components/AddStock'
import Footer from './components/Footer'
import About from './components/About'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { useState, useEffect } from 'react'


function App() {
  const [showAddStock, setShowAddStock] = useState(false)
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    const getStocks = async () => {
      const stocksFromServer = await fetchStocks()
      setStocks(stocksFromServer)
    }

    getStocks()
  }, [])

  //Fetch Stocks
  const fetchStocks = async () => {
    const res = await fetch('http://localhost:5000/stocks')
    const data = await res.json()
    
    return data
  }

   //Fetch Stock
   const fetchStock = async (id) => {
    const res = await fetch(`http://localhost:5000/stocks/${id}`)
    const data = await res.json()
    
    return data
  }

  //Add Stock
  const addStock = async (stock) => {
    const res = await fetch('http://localhost:5000/stocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stock)
    })

    const data = await res.json()

    setStocks([...stocks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newStock = { id, ...stock }
    // setStocks([...stocks, newStock])
  }

  //Delete Stock
  const deleteStock = async (id) => {
    await fetch(`http://localhost:5000/stocks/${id}`, {
      method: 'DELETE'
    })

    setStocks(stocks.filter((stock) => 
      stock.id !== id
    ))
  }

  //Toggle Active Status
  const toggleActive = async (id) => {
    const stockToToggle = await fetchStock(id)
    const updatedStock = { ...stockToToggle,
                          active: !stockToToggle.active}

                          const res = await fetch(`http://localhost:5000/stocks/${id}`,{
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(updatedStock)
                        })


    const data = await res.json()

    setStocks(
      stocks.map((stock => 
        stock.id === id ? { ...stock, active: data.active} : stock)
      )
    )
  }

  const Home = () => {
    return(
      <>
        {showAddStock && <AddStock onAdd={addStock}/>}
        {stocks.length > 0 ? <Stocks stocks={stocks} onDelete=
          {deleteStock} onToggle={toggleActive} /> : 'No Stocks To Show'}
      </>
    )
  }


  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddStock(!showAddStock)}
                showAdd={showAddStock}/>
        
        <Routes>
          <Route exact path='/' element={<Home />}/>
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
