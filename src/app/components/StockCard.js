// import { useRouter } from "next/navigation"
// import React from "react"

// export default function StockCard({ stock, isInWatchlist, toggleWatchlist }) {
//   const { symbol, price, change, volume } = stock
//   const router = useRouter()
//   const changeColor = change >= 0 ? "text-green-500" : "text-red-500"

//   const handleToggle = async (symbol) => {
//     // 1️⃣ Check if logged in
//     const res = await fetch("http://localhost:3000/check-auth", { credentials: "include" })
//     const data = await res.json()
//     if (!data.isLoggedIn) {
//       router.push("/login")
//       return
//     }

//     // 2️⃣ Update backend
//     if (isInWatchlist) {
//     await fetch(`http://localhost:3000/watchlist/${symbol}`, {
//       method: "DELETE",
//       credentials: "include"
//     });
//   } else {
//     await fetch("http://localhost:3000/watchlist", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ symbol })
//     });
//   }

//     // 3️⃣ Update frontend state
//     toggleWatchlist(symbol)
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-start hover:shadow-lg transition relative">
//       <button
//         onClick={() => handleToggle(symbol)}
//         className="absolute top-3 right-3 text-2xl focus:outline-none transition"
//       >
//         {isInWatchlist ? "⭐" : "☆"}
//       </button>

//       <h2 className="text-lg font-semibold mt-6">{symbol}</h2>
//       <p className="text-2xl font-bold">${price ? price.toFixed(2) : "—"}</p>
//       <p className={`${changeColor} text-sm font-medium`}>
//         {change ? `${change >= 0 ? "+" : ""}${change}%` : "—"}
//       </p>
//       <p className="text-gray-500 text-sm">
//         Volume: {volume ? volume.toLocaleString() : "—"}
//       </p>
//     </div>
//   )
// }
