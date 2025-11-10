'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../components/Navbar"
import StockCard from "../components/StockCard"

export default function WatchlistPage() {
  const [isAuth, setIsAuth] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const router = useRouter()

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:3000/check-auth", {
        credentials: "include"
      });
      const data = await res.json();

      if (!data.isLoggedIn) { // user is NOT logged in
        router.push("/login");
      } else {
        setIsAuth(true); // user is logged in, allow watchlist
        // fetch watchlist from backend
        const res2 = await fetch("http://localhost:3000/watchlist", {
          credentials: "include"
        });
        const data2 = await res2.json();
        setWatchlist(data2.watchlist || []);
      }
    } catch (error) {
      router.push("/login");
    }
  }
  checkAuth();
}, [router]);


  if (isAuth === null) return <p className="text-center mt-20">Loading...</p>

  const removeFromWatchlist = async (symbol) => {
    const res = await fetch(`http://localhost:3000/watchlist/${symbol}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (res.ok) {
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol))
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No stocks in your watchlist yet.
          </p>
        ) : (
          watchlist.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              isInWatchlist={true}
              toggleWatchlist={removeFromWatchlist}
            />
          ))
        )}
      </div>
    </>
  )
}
