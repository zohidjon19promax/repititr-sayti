"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { 
  TrendingUp, Users, GraduationCap, Clock, LayoutDashboard, 
  BookOpen, Settings, LogOut, CheckSquare, Plus, Calendar, 
  BookCheck, Sun, Moon, Menu, X 
} from "lucide-react"

// --- MUSTAQIL KOMPONENTLAR ---

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors ${className}`}>{children}</div>
)

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const Badge = ({ children, variant }: { children: React.ReactNode, variant?: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${variant === 'default' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
    {children}
  </span>
)

// --- REJIMNI O'ZGARTIRISH TUGMASI ---
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-blue-500 transition-all"
    >
      {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
    </button>
  )
}

// --- SIDEBAR KOMPONENTI ---
function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Bosh sahifa", active: true },
    { icon: Users, label: "O'quvchilar", active: false },
    { icon: CheckSquare, label: "Vazifalar", active: false },
    { icon: BookOpen, label: "Darslar", active: false },
    { icon: Settings, label: "Sozlamalar", active: false },
  ]

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-xl font-bold tracking-tight dark:text-white">TutorCenter</span>
            </div>
            <button className="lg:hidden dark:text-white" onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${item.active ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => window.location.reload()} className="flex items-center gap-3 text-slate-500 hover:text-red-600 w-full px-3 py-2 transition-colors">
            <LogOut size={18} />
            <span className="font-medium text-sm">Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// --- ASOSIY DASHBOARD ---
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  
  const [students, setStudents] = useState<any[]>([])
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDate, setTaskDate] = useState("")
  const [taskClass, setTaskClass] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Bazadan ma'lumotlarni yuklash
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks'); 
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ma'lumot yuklashda xato:", err);
    }
  }

  useEffect(() => {
    if (isLoggedIn) fetchStudents();
  }, [isLoggedIn])

  // --- LOGIN FUNKSIYASI ---
  const handleLogin = async () => {
    const phone = window.prompt("Telefon raqamingizni kiriting (masalan: 998901234567):")
    const code = window.prompt("Parolingizni kiriting:")

    if (phone && code) {
      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, code, name: "Ustoz" })
        })
        const data = await res.json()
        if (res.ok) {
          setIsLoggedIn(true)
          setCurrentUser(data.user)
        } else {
          alert("Xato: " + data.message)
        }
      } catch (err) {
        alert("Server bilan aloqa yo'q! Python server ishlayotganini tekshiring.")
      }
    }
  }

  // 2. O'quvchi qo'shish
  const addStudent = async () => {
    const name = window.prompt("O'quvchi ismini kiriting:")
    const subject = window.prompt("Fanni kiriting:")
    
    if (name && subject) {
      const newObj = { name, subject, progress: "0%", status: "Faol", type: "student" };
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newObj)
        });
        if (res.ok) fetchStudents();
      } catch (err) {
        alert("Serverga ulanishda xato!");
      }
    }
  }

  // 3. Vazifa yuborish
  const sendTask = async () => {
    if (!taskTitle || !taskDate || !taskClass) {
      return alert("Barcha maydonlarni to'ldiring!");
    }
    const newTask = { title: taskTitle, date: taskDate, group: taskClass, type: "task_assignment" };
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        alert("Vazifa bazaga saqlandi!");
        setTaskTitle(""); setTaskDate(""); setTaskClass("");
        fetchStudents();
      }
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  }

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl mb-4 flex items-center justify-center font-bold text-2xl">T</div>
        <h1 className="text-2xl font-bold mb-6">TutorCenter-ga xush kelibsiz</h1>
        <button 
          onClick={handleLogin}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          Tizimga kirish (Serverga ulanish)
        </button>
      </div>
    )
  }

  const stats = [
    { label: "Jami o'quvchilar", value: students.filter(s => s.type === 'student').length.toString(), icon: Users, color: "text-blue-500" },
    { label: "Vazifalar", value: students.filter(s => s.type === 'task_assignment').length.toString(), icon: BookCheck, color: "text-green-500" },
    { label: "O'rtacha ball", value: "88.5", icon: TrendingUp, color: "text-blue-600" },
    { label: "O'tilgan soatlar", value: "450h", icon: Clock, color: "text-orange-500" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 p-4 lg:p-8 space-y-8 overflow-hidden">
        <header className="flex justify-between items-center lg:items-end">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight">Xush kelibsiz, {currentUser?.name || 'Ustoz'}!</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm hidden md:block">Backend holati: <span className="text-green-500 font-bold">Online (JSON)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">21 Dekabr, 2025</div>
              <button onClick={() => fetchStudents()} className="text-[10px] text-blue-500 underline">Yangilash</button>
            </div>
          </div>
        </header>

        {/* Statistikalar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="p-4 lg:pt-6 flex items-center gap-4">
                <div className={`p-2 lg:p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg lg:text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Asosiy kontent */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold">O'quvchilar ro'yxati (Bazadan)</h3>
                <button onClick={addStudent} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  <Plus size={16} />
                </button>
              </div>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-50 dark:border-slate-800">
                        <th className="p-6 pb-3">O'quvchi</th>
                        <th className="p-6 pb-3 text-center">Progress</th>
                        <th className="p-6 pb-3 text-right">Holat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(item => item.type === 'student').length > 0 ? (
                        students.filter(item => item.type === 'student').map((s, idx) => (
                          <tr key={s.id || idx} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-6 py-4">
                              <p className="font-semibold text-slate-700 dark:text-slate-200">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.subject}</p>
                            </td>
                            <td className="p-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600" style={{ width: s.progress || '0%' }} />
                                </div>
                                <span className="text-[10px] font-bold">{s.progress || '0%'}</span>
                              </div>
                            </td>
                            <td className="p-6 py-4 text-right"><Badge variant={s.status === 'Faol' ? 'default' : 'secondary'}>{s.status || 'Nomalum'}</Badge></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-10 text-center text-slate-500 italic">Hozircha o'quvchilar yo'q.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm">Yangi vazifa yuborish</h3>
                  <BookCheck className="text-blue-600 w-4 h-4" />
                </div>
                <input 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Mavzu nomi" 
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:text-white" 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md text-sm outline-none dark:text-white" 
                  />
                  <input 
                    placeholder="Sinf" 
                    value={taskClass}
                    onChange={(e) => setTaskClass(e.target.value)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md text-sm outline-none dark:text-white" 
                  />
                </div>
                <button 
                  onClick={sendTask}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus size={16} /> Saqlash
                </button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-bold text-sm mb-4">Bugungi darslar</h3>
                <div className="space-y-3">
                  {[
                    { time: "15:00", subject: "Algebra", group: "9-B" },
                    { time: "16:30", subject: "Geometriya", group: "10-A" },
                  ].map((lesson, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                      <div className="text-xs font-bold text-blue-600 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-sm">{lesson.time}</div>
                      <div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{lesson.subject}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase">{lesson.group} sinf</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}