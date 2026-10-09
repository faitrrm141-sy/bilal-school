'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (isAdminMode) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('role', 'admin')
        .single()

      if (error || !data) setError('بيانات الإدارة غير صحيحة')
      else router.push('/admin-dashboard')
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('access_code', accessCode)
        .single()

      if (error || !data) setError('كود الدخول غير صحيح')
      else {
        if (data.role === 'teacher') router.push('/teacher-dashboard')
        else if (data.role === 'student') router.push('/parent-dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="bg-blue-900/80 border border-blue-700 p-6 rounded-3xl shadow-2xl w-full max-w-md text-white backdrop-blur-md">
        <h2 className="text-xl font-bold text-center mb-6">تسجيل الدخول - مدرسة بلال</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl mb-4 text-xs text-center">{error}</div>}

        <div className="flex justify-center mb-6 gap-2">
          <button type="button" onClick={() => setIsAdminMode(false)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${!isAdminMode ? 'bg-blue-600' : 'bg-blue-950 text-blue-300'}`}>
            كود الكادر والطلاب
          </button>
          <button type="button" onClick={() => setIsAdminMode(true)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${isAdminMode ? 'bg-blue-600' : 'bg-blue-950 text-blue-300'}`}>
            دخول الإدارة
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {!isAdminMode ? (
            <div>
              <label className="block text-xs text-blue-200 mb-2">كود الدخول الموحد (يصدر من الإدارة)</label>
              <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="مثال: STU-1024" required className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs text-blue-200 mb-2">البريد الإلكتروني للإدارة</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bilal.com" required className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-blue-200 mb-2">الرقم السري</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400" />
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition shadow-lg text-sm mt-4">
            دخول للنظام
          </button>
        </form>
      </div>
    </div>
  );
}
