"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import StockCard from "./StockCard"

export default function Dashboard() {
  const [stocks, setStocks] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [displayCount, setDisplayCount] = useState(8)
  const observerRef = useRef(null)
  const lastStockRef = useRef(null)

  // Define which stock symbols you want to show
  const SYMBOLS = [
    "AAPL", "GOOGL", "AMZN", "TSLA", "META",
    "NVDA", "MSFT", "DIS", "INTC", "BABA"
  ]

  // Fetch stock data from your API route
  const fetchStockData = useCallback(async () => {
    const subset = SYMBOLS.slice(0, displayCount)
    const results = await Promise.all(
      subset.map(async (symbol) => {
        const res = await fetch(`/api/stock?symbol=${symbol}`)
        
        const data = await res.json()
        
        const quote = data["Global Quote"]

        // Protect against invalid responses
        if (!quote) return { symbol, price: 0, change: 0, volume: 0 }

        return {
          symbol,
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["10. change percent"]),
          volume: parseInt(quote["06. volume"]),
        }
      })
    )
    setStocks(results)
  }, [displayCount])

  useEffect(() => {
    fetchStockData()
  }, [fetchStockData])

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (displayCount < SYMBOLS.length) {
      setDisplayCount((prev) => Math.min(prev + 4, SYMBOLS.length))
    }
  }, [displayCount])

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore()
    })
    if (lastStockRef.current) observerRef.current.observe(lastStockRef.current)
    return () => observerRef.current?.disconnect()
  }, [loadMore])

  // Watchlist toggle
  const toggleWatchlist = (symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    )
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Stocks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {stocks.map((stock, i) => (
          <div
            ref={i === stocks.length - 1 ? lastStockRef : null}
            key={stock.symbol}
          >
            <StockCard
              stock={stock}
              isInWatchlist={watchlist.includes(stock.symbol)}
              toggleWatchlist={toggleWatchlist}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">⭐ Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-gray-500">No stocks added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stocks
            .filter((s) => watchlist.includes(s.symbol))
            .map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                isInWatchlist={true}
                toggleWatchlist={toggleWatchlist}
              />
            ))}
        </div>
      )}
    </div>
  )
}
