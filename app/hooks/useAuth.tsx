"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const useAuth = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const courierId = localStorage.getItem("courier_id")

    if (!token || !courierId) {
      router.push('/login')
    }
  }, [router])
}

export default useAuth
