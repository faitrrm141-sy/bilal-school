export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white font-sans" dir="rtl">
      {/* الهيدر */}
      <header className="flex justify-between items-center p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold">مدرسة بلال النموذجية</h1>
        <a href="/login" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition">
          تسجيل الدخول
        </a>
      </header>

      {/* القسم الرئيسي */}
      <section className="text-center py-16 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">بوابتك الذكية لتعليم متميز</h2>
        <p className="text-blue-200 max-w-xl mx-auto text-base mb-8">
          نظام متكامل يربط الإدارة والمعلمين وأولياء الأمور لمتابعة المسيرة التعليمية بكل سهولة واحترافية.
        </p>
      </section>

      {/* الإحصائيات الحية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 pb-16 text-center">
        <div className="bg-blue-900/40 border border-blue-700/50 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-3xl font-bold text-blue-300">150+</h3>
          <p className="text-gray-300 mt-1 text-sm">طالب وطالبة</p>
        </div>
        <div className="bg-blue-900/40 border border-blue-700/50 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-3xl font-bold text-blue-300">8</h3>
          <p className="text-gray-300 mt-1 text-sm">صفوف دراسية</p>
        </div>
        <div className="bg-blue-900/40 border border-blue-700/50 p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-3xl font-bold text-blue-300">12</h3>
          <p className="text-gray-300 mt-1 text-sm">كادر تعليمي وإداري</p>
        </div>
      </div>
    </div>
  );
}
