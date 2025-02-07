"use client"

import { useRouter } from "next/navigation"

function useBack() {
  const router = useRouter()

  const goBack = (fallbackRoute = "/") => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackRoute) // Navigate to fallback
    }
  }

  return goBack
}

export default useBack
