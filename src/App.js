import Header from './components/Header'
import Stocks from './components/Stocks'
import AddStock from './components/AddStock'
import Footer from './components/Footer'
import About from './components/About'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { useState, useEffect } from 'react'


function App() {
  const alphaVantageKey = 'JSYIR6DEN0QWF8IT'
  const stockApiUrl = `https://www.alphavantage.co/query?`
  const [showAddStock, setShowAddStock] = useState(false)
  const [stocks, setStocks] = useState([])

  // useEffect(() => {
  //   const getStocks = async () => {
  //     const stocksFromServer = await fetchStocks()
  //     setStocks(stocksFromServer)
  //   }

  //   getStocks()
  // }, [])

  // //Fetch Stocks
  // const fetchStocks = async () => {
  //   const res = await fetch('http://localhost:5000/stocks')
  //   const data = await res.json()
    
  //   return data
  // }

  //Set a Stock's ID
  const getNewStockID = () => {
    let newID = 0;
    if(stocks.length > 0)
      newID = stocks[stocks.length-1].id + 1

    return newID;
  }

  //Check if stock is already added
  const tickerIncluded = (stock) => {
    let flag = false
    stocks.forEach(thisStock => {
      if(stock.ticker === thisStock.ticker)
        flag = true
        return
    })
    return flag
  }

  //Fetch Stock
  const fetchStockDataFromAPI = async (stock) => {
    const url = `${stockApiUrl}function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${alphaVantageKey}`
    const res = await fetch(url)
    const data = await res.json()

    console.log(url)
    console.log(data)
    return data
  }

  //Fetch Crypto
  const fetchCryptoDataFromAPI = async (stock) => {
    const url = `${stockApiUrl}function=CURRENCY_EXCHANGE_RATE&from_currency=${stock.ticker}&to_currency=USD&apikey=${alphaVantageKey}`
    const res = await fetch(url)
    const data = await res.json()
    
    console.log(url)
    console.log(data)
    return data
  }

  //Create Stock Object From API Data
  const buildStockObjectFromCryptoData = (data) => {
    let obj = data['Realtime Currency Exchange Rate']
    if(!obj){
      return
    }

    let from = obj['1. From_Currency Code']
    let formattedPrice = parseFloat(obj['5. Exchange Rate']).toFixed(4)
    let date = obj['6. Last Refreshed']

    
    const stock = {
      id: getNewStockID(),
      ticker: from,
      price: `$${formattedPrice}`,
      date: date
    }

    return stock
  }

  const buildStockObjectFromStockData = (data) =>{
    let obj = data['Global Quote']
    if(!obj){
      return
    }

    let symbol = obj['01. symbol']
    let formattedPrice = parseFloat(obj['05. price']).toFixed(2)
    let date = obj['07. latest trading day']

    
    const stock = {
      id: getNewStockID(),
      ticker: symbol,
      price: `$${formattedPrice}`,
      date: date
    }

    return stock
  }

  //Add Stock
  const addStock = async (stock) => {
    if(tickerIncluded(stock)){
      alert("Stock/Crypto is already added")
      return
    }
    let data = await fetchStockDataFromAPI(stock)
    let stockObj
    //Stock
    if(data['Global Quote']['01. symbol']){
      stockObj = buildStockObjectFromStockData(data)
    }
    //Crypto
    else{
      data = await fetchCryptoDataFromAPI(stock)
      if(!data['Error Message'])
        stockObj = buildStockObjectFromCryptoData(data)
    }
    

    if(stockObj)
      setStocks([...stocks, stockObj])
    else
      alert("Failed to fetch data")

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newStock = { id, ...stock }
    // setStocks([...stocks, newStock])
  }

  //Delete Stock
  const deleteStock = async (id) => {

    setStocks(stocks.filter((stock) => 
      stock.id !== id
    ))
  }



  const Home = () => {
    return(
      <>
        {showAddStock && <AddStock onAdd={addStock}/>}
        {stocks.length > 0 ? <Stocks stocks={stocks} onDelete=
          {deleteStock} /> : 'No Stocks To Show'}
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
