'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([])
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('student')
  const [gradeLevel, setGradeLevel] = useState('الأول الابتدائي')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setProfiles(data)
  }

  const generateAccessCode = (role) => {
    const prefix = role === 'teacher' ? 'TCH' : 'STU'
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNum}`
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const accessCode = generateAccessCode(role)

    const { error } = await supabase.from('profiles').insert([
      {
        full_name: fullName,
        role: role,
        grade_level: gradeLevel,
        access_code: accessCode,
      }
    ])

    if (error) {
      setMessage('حدث خطأ أثناء إضافة المستخدم')
    } else {
      setMessage(`تمت الإضافة بنجاح! كود الدخول هو: ${accessCode}`)
      setFullName('')
      fetchProfiles()
    }
    setLoading(false)
  }

  const handleDeleteUser = async (id) => {
    if (confirm('هل أنت تأكد من حذف هذا الحساب؟')) {
      await supabase.from('profiles').delete().eq('id', id)
      fetchProfiles()
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white p-4 font-sans" dir="rtl">
      {/* الهيدر */}
      <header className="flex justify-between items-center bg-blue-900/60 p-4 rounded-2xl border border-blue-800 mb-6">
        <h1 className="text-lg font-bold">لوحة تحكم الإدارة</h1>
        <button onClick={() => router.push('/login')} className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-xl text-xs font-semibold">
          تسجيل الخروج
        </button>
      </header>

      {/* استمارة إضافة مستخدم جديد */}
      <div className="bg-blue-900/40 border border-blue-800 p-5 rounded-2xl mb-8 max-w-xl mx-auto">
        <h2 className="text-base font-bold mb-4 text-blue-200">إضافة مستخدم جديد (معلم / طالب)</h2>
        {message && <div className="bg-blue-600/30 border border-blue-500 text-blue-200 p-3 rounded-xl mb-4 text-xs">{message}</div>}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs text-blue-300 mb-1">الاسم الكامل</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="مثال: أحمد محمد" className="w-full bg-blue-950 border border-blue-700 rounded-xl px-3 py-2 text-sm focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-blue-300 mb-1">نوع الحساب</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-blue-950 border border-blue-700 rounded-xl px-3 py-2 text-sm">
                <option value="student">طالب</option>
                <option value="teacher">معلم</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-blue-300 mb-1">الصف الدراسي</label>
              <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className="w-full bg-blue-950 border border-blue-700 rounded-xl px-3 py-2 text-sm">
                <option value="الأول الابتدائي">الأول الابتدائي</option>
                <option value="الثاني الابتدائي">الثاني الابتدائي</option>
                <option value="الثالث الابتدائي">الثالث الابتدائي</option>
                <option value="الرابع الابتدائي">الرابع الابتدائي</option>
                <option value="الخامس الابتدائي">الخامس الابتدائي</option>
                <option value="السادس الابتدائي">السادس الابتدائي</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-sm transition">
            {loading ? 'جاري الإضافة...' : 'إنشاء الحساب وتوليد الكود'}
          </button>
        </form>
      </div>

      {/* قائمة الحسابات المضافة */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-base font-bold mb-4 text-blue-200">قائمة المستخدِمين والأكواد</h2>
        <div className="space-y-3">
          {profiles.filter(p => p.role !== 'admin').map((profile) => (
            <div key={profile.id} className="bg-blue-900/30 border border-blue-800/60 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{profile.full_name}</p>
                <p className="text-xs text-blue-300 mt-0.5">
                  النوع: {profile.role === 'teacher' ? 'معلم' : 'طالب'} | الصف: {profile.grade_level}
                </p>
                <p className="text-xs text-yellow-400 font-mono mt-1">كود الدخول: {profile.access_code}</p>
              </div>
              <button onClick={() => handleDeleteUser(profile.id)} className="bg-red-500/20 text-red-300 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs transition">
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
