'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          secret: formData.email, 
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert('Registration successful!')
        router.push('/') // go to profile page
      } else {
        alert(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-[Lora]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Register
        </h2>

        <div>
          <label className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            name="username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="secret"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}
