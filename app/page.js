'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center text-white font-sans" dir="rtl">
      <p className="text-sm">جاري تحويلك إلى بوابة مدرسة بلال...</p>
    </div>
  )
}
