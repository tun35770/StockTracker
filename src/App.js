import Header from './components/Header'
import Stocks from './components/Stocks'
import AddStock from './components/AddStock'
import Footer from './components/Footer'
import About from './components/About'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
const HOME_PATH = window.location.pathname

function App() {
  
  const stockAPIKey = process.env.REACT_APP_STOCK_API_KEY
  const stockApiUrl = `https://www.finnhub.io/api/v1/quote?`
  const cryptoApiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids='
  const cryptoSearchApiUrl = 'https://api.coingecko.com/api/v3/search?query='
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

    
    const digits = Math.max(2, s.split('.')[1].length)
    return parseFloat(s).toFixed(digits)
  }

  //format date
  const formatDate = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    let day = date.getDate()
    day = day < 10 ? '0' + day : day

    return month + '/' + day + '/' + year
  }

  //format the time
  const formatTime = (date) => {
    let hours = date.getHours()
    hours = hours < 10 ? '0' + hours : hours
    let minutes = date.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    let seconds = date.getSeconds()
    seconds = seconds < 10 ? '0' + seconds : seconds

    return hours + ':' + minutes + ':' + seconds
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
    const url = stockApiUrl
    const res = await fetch(url + new URLSearchParams({
      symbol: stock.ticker.toUpperCase(),
      token: stockAPIKey
    }))
    const data = await res.json()

    console.log(url)
    console.log(data)
    return data
  }

  //Fetch Crypto
  const fetchCryptoDataFromAPI = async (stock) => {
    const searchUrl = `${cryptoSearchApiUrl}${stock.ticker}`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    const cryptoId = searchData['coins'][0].id
    const url = `${cryptoApiUrl}${cryptoId}&vs_currencies=usd&include_last_updated_at=true`
    const res = await fetch(url)
    const data = await res.json()
    data.ticker = stock.ticker;

    console.log(url)
    console.log(data)
    return data
  }

  //Create Stock Object From Crypto API Data
  const buildStockObjectFromCryptoData = (data, stock) => {
    const cryptoName = Object.keys(data)[0]
    let obj = data[cryptoName]
    if(!obj){
      return
    }

    let formattedPrice = parseFloat(obj['usd']).toFixed(4)
    let date = obj['last_updated_at']
    let localDate = new Date(date*1000)
    let formattedDate = formatDate(localDate)
               
    let formattedTime =  formatTime(localDate)

    const stockObj = {
      id: getNewStockID(),
      ticker: stock.ticker.toUpperCase(),
      name: cryptoName.toUpperCase(),
      price: trimZeros(formattedPrice),
      date: formattedDate,
      time: formattedTime,
      autoUpdate: false,
      isCrypto: true
    }

    return stockObj
  }

  //Create Stock Object From Stock API Data
  const buildStockObjectFromStockData = (data, stock) =>{
    let obj = data
    if(!obj){
      return
    }

    let symbol =stock.ticker.toUpperCase()
    let formattedPrice = parseFloat(obj['c']).toFixed(2)

    const now = new Date()
    let date = formatDate(now)
    let time = formatTime(now)

    let change = obj['d']
    let parsedChange = parseFloat(change).toFixed(2)
    let changePercent = obj['dp']
    let parsedChangePercent = parseFloat(changePercent).toFixed(2)

    const stockObj = {
      id: getNewStockID(),
      ticker: symbol,
      price: formattedPrice,
      date: date,
      time: time,
      change: parsedChange,
      changePercent: parsedChangePercent,
      formattedChange: `${parsedChange > 0 ? 'Up $' : parsedChange < 0 ? 'Down $' : ''}${Math.abs(parsedChange)} | ${parsedChangePercent}%`,
      autoUpdate: false,
      isCrypto: false
    }

    return stockObj
  }

  //Update saved stocks
  const updateStocks = async (storedStocks) => {
    if(!storedStocks) return
    for(let i = 0; i < storedStocks.length; i++){
        await addStock(storedStocks[i])
    }

  }

  const getStockData = async(stock) => {
    
    let data, stockObj;

    //Crypto
    if(stock.isCrypto){
      data = await fetchCryptoDataFromAPI(stock)
     
      if(!(Object.keys(data).length === 0)){
        stockObj = buildStockObjectFromCryptoData(data, stock)
      }
    }
    
    //Stock
    else {
      data = await fetchStockDataFromAPI(stock)
      if(data && data.hasOwnProperty('d')){
        stockObj = buildStockObjectFromStockData(data, stock)
      }
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

    if(stocksRef.current.length > 0){
      if(index === stocksRef.current.length)
        index = 0;

      if(stocksRef.current[index] && stocksRef.current[index].autoUpdate){
        const stockObj = await getStockData(stocksRef.current[index])
        if(stockObj){
          let tempStocks = [...stocksRef.current]
          stockObj.autoUpdate = true;
          if(tempStocks[index].isCrypto){
            stockObj.change = (stockObj.price - tempStocks[index].price).toFixed(4)
            stockObj.change = trimZeros(stockObj.change)
            stockObj.changePercent = (stockObj.change / tempStocks[index].price).toFixed(2)
            stockObj.formattedChange = `${stockObj.change > 0 ? 'Up $' : stockObj.change < 0 ? 'Down $' : tempStocks[index].formattedChange ? tempStocks[index].formattedChange : ''}`
            +`${stockObj.change < 0 || stockObj.change > 0 ? Math.abs(stockObj.change) : ''}`
            +`${stockObj.changePercent > 0 || stockObj.changePercent < 0 ? '| ' + stockObj.changePercent + '%': ''}`
          }
          stockObj.isCrypto = tempStocks[index].isCrypto
          stockObj.id = tempStocks[index].id

          tempStocks[index] = stockObj
          setStocks(tempStocks);
        }
      }
    }
    const nextIndex = (index === stocksRef.current.length-1 ? 0 : index+1)


    setTimeout(() => {autoUpdateStocks(nextIndex)}, 5000)  //wait 5 seconds for next fetch
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
                showAdd={showAddStock} homePath={HOME_PATH}/>
        
        <Routes>
          <Route exact path = {HOME_PATH} element={<Home />}/>
          <Route path='/about' element={<About homePath = {HOME_PATH}/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;