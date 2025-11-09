'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push('/')}>
        📈 Stock Dashboard
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/register')}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition"
        >
          Register
        </button>
      </div>
    </nav>
  )
}
