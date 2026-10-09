'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ParentDashboard() {
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    // جلب التقييمات المسجلة في النظام كنموذج عرض للمتابعة
    const { data } = await supabase
      .from('evaluations')
      .select(`
        *,
        profiles:student_id (full_name, grade_level)
      `)
      .order('created_at', { ascending: false })

    if (data) setEvaluations(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white p-4 font-sans" dir="rtl">
      {/* الهيدر */}
      <header className="flex justify-between items-center bg-blue-900/60 p-4 rounded-2xl border border-blue-800 mb-6">
        <h1 className="text-lg font-bold">بوابة ولي الأمر والطالب</h1>
        <button onClick={() => router.push('/login')} className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-xl text-xs font-semibold">
          تسجيل الخروج
        </button>
      </header>

      {/* قسم متابعة التقييمات والأداء */}
      <div className="max-w-xl mx-auto space-y-4">
        <h2 className="text-base font-bold text-blue-200 mb-2">تقييمات ومتابعة الطالب الأكاديمية</h2>

        {loading ? (
          <p className="text-center text-xs text-blue-300">جاري تحميل البيانات...</p>
        ) : evaluations.length === 0 ? (
          <div className="bg-blue-900/30 border border-blue-800 p-6 rounded-2xl text-center text-sm text-blue-300">
            لا توجد تقييمات مسجلة حتى الآن من المعلمين.
          </div>
        ) : (
          evaluations.map((item) => (
            <div key={item.id} className="bg-blue-900/40 border border-blue-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-blue-800/60 pb-2">
                <h3 className="font-bold text-sm text-yellow-300">{item.profiles?.full_name || 'الطالب'}</h3>
                <span className="text-xs text-blue-300">الصف: {item.profiles?.grade_level}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-blue-950 p-2 rounded-xl border border-blue-800">
                  <span className="block text-gray-400 text-[10px]">السلوك</span>
                  <span className="font-bold text-blue-200">{item.behavior_rating}</span>
                </div>
                <div className="bg-blue-950 p-2 rounded-xl border border-blue-800">
                  <span className="block text-gray-400 text-[10px]">التفاعل</span>
                  <span className="font-bold text-blue-200">{item.interaction_rating}</span>
                </div>
                <div className="bg-blue-950 p-2 rounded-xl border border-blue-800">
                  <span className="block text-gray-400 text-[10px]">الواجبات</span>
                  <span className="font-bold text-blue-200">{item.homework_rating}</span>
                </div>
              </div>

              {item.notes && (
                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-800 text-xs">
                  <span className="text-blue-300 font-bold block mb-1">ملاحظات المعلم:</span>
                  <p className="text-gray-200">{item.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
