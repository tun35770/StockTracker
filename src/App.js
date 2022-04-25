import Header from './components/Header'
import Stocks from './components/Stocks'
import AddStock from './components/AddStock'
import Footer from './components/Footer'
import About from './components/About'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { useState, useEffect, useRef } from 'react'


function App() {
  const alphaVantageKey = 'JSYIR6DEN0QWF8IT'
  const stockApiUrl = `https://www.alphavantage.co/query?`
  const [showAddStock, setShowAddStock] = useState(false)
  const [stocks, setStocks] = useState([])
  const stocksRef = useRef({})
  stocksRef.current = stocks

  useEffect(() => {
    const storedStocks = JSON.parse(localStorage.getItem('stocks'))
    updateStocks(storedStocks).then(() => {
      autoUpdateStocks(0)
    })

    
  }, [])

  //save to localStorage
  useEffect(() => {
    localStorage.setItem('stocks', JSON.stringify(stocks))

    //getStocks()
  }, [stocks])


  // //Fetch Stocks
  // const fetchStocks = async () => {
  //   const res = await fetch('http://localhost:5000/stocks')
  //   const data = await res.json()
    
  //   return data
  // }

  //Trims the zeros off of currency
  const trimZeros = (num) => {
    let s = num.toString();

    for(let i = s.length-1; i >= 0; i--){
      if(s.charAt(i) === '0')
        s = s.slice(0, i)
      else break
    }
    return parseFloat(s).toFixed(2)
  }

  //Set a Stock's ID
  const getNewStockID = () => {
    let newID = 0;
    if(stocksRef.current.length > 0)
      newID = stocksRef.current[stocksRef.current.length-1].id + 1

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

  //Create Stock Object From Crypto API Data
  const buildStockObjectFromCryptoData = (data) => {
    let obj = data['Realtime Currency Exchange Rate']
    if(!obj){
      return
    }

    let from = obj['1. From_Currency Code']
    let formattedPrice = parseFloat(obj['5. Exchange Rate']).toFixed(4)
    formattedPrice = trimZeros(formattedPrice)
    let date = obj['6. Last Refreshed']
    let localDate = new Date(date)
    
    const stock = {
      id: getNewStockID(),
      ticker: from,
      price: formattedPrice,
      formattedPrice: `$${formattedPrice}`,
      date: localDate.toString(),
      autoUpdate: false,
      type: 'crypto'
    }

    return stock
  }

  //Create Stock Object From Stock API Data
  const buildStockObjectFromStockData = (data) =>{
    let obj = data['Global Quote']
    if(!obj){
      return
    }

    let symbol = obj['01. symbol']
    let formattedPrice = parseFloat(obj['05. price']).toFixed(2)
    let date = obj['07. latest trading day']
    let change = obj['09. change']
    let parsedChange = parseFloat(change).toFixed(2)
    let changePercent = obj['10. change percent']
    let parsedChangePercent = parseFloat(changePercent.replace('%', '')).toFixed(2)

    const stock = {
      id: getNewStockID(),
      ticker: symbol,
      price: formattedPrice,
      formattedPrice: `$${formattedPrice}`,
      date: date,
      change: parsedChange,
      changePercent: parsedChangePercent,
      formattedChange: `${parsedChange > 0 ? 'Up $' : parsedChange < 0 ? 'Down $' : ''}${Math.abs(parsedChange)} | ${parsedChangePercent}%`,
      autoUpdate: false,
      type: 'stock'
    }

    return stock
  }

  //Update saved stocks
  const updateStocks = async (storedStocks) => {
    for(let i = 0; i < storedStocks.length; i++){
        await addStock(storedStocks[i])
    }

  }

  const getStockData = async(stock) => {
    
    let data = await fetchStockDataFromAPI(stock)
    let stockObj
    //Stock
    if(data['Global Quote'] && data['Global Quote'].hasOwnProperty('01. symbol')){
      stockObj = buildStockObjectFromStockData(data)
    }
    //Crypto
    else{
      data = await fetchCryptoDataFromAPI(stock)
      if(!data['Error Message'])
        stockObj = buildStockObjectFromCryptoData(data)
    }

    return stockObj
  }

  //Add Stock
  const addStock = async (stock) => {
    if(tickerIncluded(stock)){
      alert("Stock/Crypto is already added")
      return
    }
    const stockObj = await getStockData(stock)
    
    if(stockObj)
      setStocks([...stocksRef.current, stockObj])
    else
      alert("Failed to fetch data")

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newStock = { id, ...stock }
    // setStocks([...stocks, newStock])
  }

  //Delete Stock
  const deleteStock = async (id) => {

    setStocks(stocksRef.current.filter((stock) => 
      stock.id !== id
    ))
  }

  //invert autoUpdate field
  const setAutoUpdate = (id) => {
    setStocks(stocks.map(stock => stock.id === id ? {...stock, autoUpdate: !stock.autoUpdate} : stock))
  }

  //Automatically update stocks
  const autoUpdateStocks = async (index) => {
 
    let autoStocks = 0;
    for(let i = 0; i < stocks.length; i++){
      if(stocks[i].autoUpdate){
        if(stocks[i].type === 'stock')
          autoStocks++
        else
          autoStocks += 2
      }
    }

    if(stocksRef.current.length > 0){
      if(index === stocksRef.current.length)
        index = 0;

      if(stocksRef.current[index].autoUpdate){
        const stockObj = await getStockData(stocksRef.current[index])
        if(stockObj){
          let tempStocks = [...stocksRef.current]
          stockObj.autoUpdate = true;
          if(tempStocks[index].type === 'crypto'){
            stockObj.change = (stockObj.price - tempStocks[index].price).toFixed(4)
            stockObj.change = trimZeros(stockObj.change)
            stockObj.changePercent = (stockObj.change / tempStocks[index].price).toFixed(2)
            
          }
          tempStocks[index] = stockObj
          setStocks(tempStocks);
        }
      }
    }
    setTimeout(() => {autoUpdateStocks(index+1)}, (autoStocks < 5 ? 30000 : 15000))  //wait 12 seconds for next fetch
  }

  const Home = () => {
    return(
      <>
        {showAddStock && <AddStock onAdd={addStock}/>}
        {stocks.length > 0 ? <Stocks stocks={stocks} onDelete=
          {deleteStock} onDoubleClick = {setAutoUpdate}/> : 'No Stocks To Show'}
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