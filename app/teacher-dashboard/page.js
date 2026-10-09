'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TeacherDashboard() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [behavior, setBehavior] = useState('ممتاز')
  const [interaction, setInteraction] = useState('ممتاز')
  const [homework, setHomework] = useState('مكتمل')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'student')
    if (data) setStudents(data)
  }

  const handleAddEvaluation = async (e) => {
    e.preventDefault()
    if (!selectedStudent) return

    const { error } = await supabase.from('evaluations').insert([
      {
        student_id: selectedStudent.id,
        behavior_rating: behavior,
        interaction_rating: interaction,
        homework_rating: homework,
        notes: notes,
      }
    ])

    if (error) {
      setMessage('حدث خطأ أثناء حفظ التقييم')
    } else {
      setMessage(`تم حفظ تقييم الطالب ${selectedStudent.full_name} بنجاح!`)
      setSelectedStudent(null)
      setNotes('')
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 text-white p-4 font-sans" dir="rtl">
      {/* الهيدر */}
      <header className="flex justify-between items-center bg-blue-900/60 p-4 rounded-2xl border border-blue-800 mb-6">
        <h1 className="text-lg font-bold">لوحة تحكم المعلم</h1>
        <button onClick={() => router.push('/login')} className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-xl text-xs font-semibold">
          تسجيل الخروج
        </button>
      </header>

      {/* قائمة الطلاب والتقييم */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-blue-900/40 border border-blue-800 p-5 rounded-2xl">
          <h2 className="text-base font-bold mb-4 text-blue-200">قائمة الطلاب لتسجيل التقييم</h2>
          {message && <div className="bg-blue-600/30 border border-blue-500 text-blue-200 p-3 rounded-xl mb-4 text-xs">{message}</div>}

          <div className="space-y-3 mb-6">
            {students.map((student) => (
              <div key={student.id} className="bg-blue-950/60 border border-blue-800 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{student.full_name}</p>
                  <p className="text-xs text-blue-300">الصف: {student.grade_level}</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  تقييم الطالب
                </button>
              </div>
            ))}
          </div>

          {/* استمارة إضافة التقييم */}
          {selectedStudent && (
            <form onSubmit={handleAddEvaluation} className="bg-blue-950 p-4 rounded-xl border border-blue-700 space-y-4">
              <h3 className="text-sm font-bold text-yellow-300">تقييم الطالب: {selectedStudent.full_name}</h3>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-blue-300 mb-1">السلوك</label>
                  <select value={behavior} onChange={(e) => setBehavior(e.target.value)} className="w-full bg-blue-900 border border-blue-700 rounded-lg p-2 text-xs">
                    <option value="ممتاز">ممتاز</option>
                    <option value="جيد جداً">جيد جداً</option>
                    <option value="يحتاج تحسين">يحتاج تحسين</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-blue-300 mb-1">التفاعل</label>
                  <select value={interaction} onChange={(e) => setInteraction(e.target.value)} className="w-full bg-blue-900 border border-blue-700 rounded-lg p-2 text-xs">
                    <option value="ممتاز">ممتاز</option>
                    <option value="متوسط">متوسط</option>
                    <option value="ضعيف">ضعيف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-blue-300 mb-1">الواجبات</label>
                  <select value={homework} onChange={(e) => setHomework(e.target.value)} className="w-full bg-blue-900 border border-blue-700 rounded-lg p-2 text-xs">
                    <option value="مكتمل">مكتمل</option>
                    <option value="غير مكتمل">غير مكتمل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-blue-300 mb-1">ملاحظات للمعلم</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أكتب ملاحظاتك لولي الأمر هنا..." className="w-full bg-blue-900 border border-blue-700 rounded-lg p-2 text-xs h-20 focus:outline-none"></textarea>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold text-xs transition">
                  حفظ التقييم
                </button>
                <button type="button" onClick={() => setSelectedStudent(null)} className="bg-gray-700 px-3 rounded-lg text-xs">
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
