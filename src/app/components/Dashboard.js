"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [stocks, setStocks] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [displayCount, setDisplayCount] = useState(8)
  const observerRef = useRef(null)
  const lastStockRef = useRef(null)
  const router = useRouter()

  const SYMBOLS = ["AAPL", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "MSFT", "DIS", "INTC", "BABA"]

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    const subset = SYMBOLS.slice(0, displayCount)
    const results = await Promise.all(subset.map(async (symbol) => {
      try {
        const res = await fetch(`/api/stock?symbol=${symbol}`)
        const data = await res.json()
        const quote = data["Global Quote"]
        return {
          symbol,
          price: quote ? parseFloat(quote["05. price"]) : 0,
          change: quote ? parseFloat(quote["10. change percent"]) : 0,
          volume: quote ? parseInt(quote["06. volume"]) : 0,
        }
      } catch {
        return { symbol, price: 0, change: 0, volume: 0 }
      }
    }))
    setStocks(results)
  }, [displayCount])

  useEffect(() => { fetchStockData() }, [fetchStockData])

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (displayCount < SYMBOLS.length) setDisplayCount(prev => Math.min(prev + 4, SYMBOLS.length))
  }, [displayCount])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore())
    if (lastStockRef.current) observerRef.current.observe(lastStockRef.current)
    return () => observerRef.current?.disconnect()
  }, [loadMore])

  // Fetch watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch("http://localhost:3000/watchlist", { credentials: "include" })
        const data = await res.json()
        setWatchlist(data.watchlist || [])
      } catch (err) { console.error(err) }
    }
    fetchWatchlist()
  }, [])

  // Toggle watchlist
  const handleToggle = async (symbol) => {
    if (!symbol) {
  console.error("handleToggle called with undefined symbol");
  return;
}

    try {
      const auth = await fetch("http://localhost:3000/check-auth", { credentials: "include" })
      const data = await auth.json()
      if (!data.isLoggedIn) return router.push("/login")
        console.log("Toggling watchlist for symbol:", symbol);
      const isInList = watchlist.includes(symbol)
      const url = isInList ? `http://localhost:3000/watchlist/${symbol}` : "http://localhost:3000/watchlist"
      await fetch(url, {
        method: isInList ? "DELETE" : "POST",
        credentials: "include",
        headers: !isInList ? { "Content-Type": "application/json" } : {},
        body: !isInList ? JSON.stringify({ symbol }) : null,
      })
      setWatchlist(prev => isInList ? prev.filter(s => s !== symbol) : [...prev, symbol])
    } catch (err) { console.error(err) }
  }

  // StockCard component inline
  const StockCard = ({ stock, isInWatchlist }) => {
    const { symbol, price, change, volume } = stock
    const changeColor = change >= 0 ? "text-green-500" : "text-red-500"
    return (
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-start hover:shadow-lg transition relative">
        <button
          onClick={() => handleToggle(symbol)}
          className="absolute top-3 right-3 text-2xl focus:outline-none transition"
        >
          {isInWatchlist ? "⭐" : "☆"}
        </button>
        <h2 className="text-lg font-semibold mt-6">{symbol}</h2>
        <p className="text-2xl font-bold">${price?.toFixed(2) || "—"}</p>
        <p className={`${changeColor} text-sm font-medium`}>
          {change ? `${change >= 0 ? "+" : ""}${change}%` : "—"}
        </p>
        <p className="text-gray-500 text-sm">Volume: {volume?.toLocaleString() || "—"}</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Stocks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {stocks.map((stock, i) => (
          <div ref={i === stocks.length - 1 ? lastStockRef : null} key={stock.symbol}>
            <StockCard stock={stock} isInWatchlist={watchlist.includes(stock.symbol)} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">⭐ Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-gray-500">No stocks added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stocks.filter(s => watchlist.includes(s.symbol)).map(stock => (
            <StockCard key={stock.symbol} stock={stock} isInWatchlist={true} />
          ))}
        </div>
      )}
    </div>
  )
}
