'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (role === 'admin') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError('خطأ في البريد الإلكتروني أو كلمة المرور')
      } else {
        router.push('/admin-dashboard')
      }
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('access_code', accessCode)
        .eq('role', role)
        .single()

      if (error || !data) {
        setError('رمز الدخول غير صحيح')
      } else {
        if (role === 'teacher') router.push('/teacher-dashboard')
        else if (role === 'student' || role === 'parent') router.push('/parent-dashboard')
      }
    }
  }

  return (
    <main className="min-h-screen bg-blue-950 text-white flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-sm bg-blue-900/40 border border-blue-800 p-6 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight">مدرسة بلال</h1>
          <p className="text-xs text-blue-300">نظام الإدارة المدرسية السحابي</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="flex bg-blue-950 p-1 rounded-xl border border-blue-800 text-xs">
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === 'admin' ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
          >
            إدارة
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === 'teacher' ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
          >
            معلم
          </button>
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === 'student' || role === 'parent' ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
          >
            طالب/ولي أمر
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {role === 'admin' ? (
            <>
              <div>
                <label className="block text-xs text-blue-300 mb-1">البريد الإلكتروني للإدارة</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bilal.com"
                  required
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-300 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs text-blue-300 mb-1">رمز الدخول السري</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="أدخل رمز الدخول الخاص بك"
                required
                className="w-full bg-blue-950 border border-blue-800 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-600/30"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </main>
  )
}
