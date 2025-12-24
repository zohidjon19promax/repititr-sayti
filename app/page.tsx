"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { 
  GraduationCap, Users, Lock, LayoutDashboard, 
  Settings, LogOut, Sun, Moon, ClipboardCheck, 
  Eye, EyeOff, Plus, Search, Trash2, CheckCircle2,
  XCircle, Filter, ChevronRight, UserPlus, Mail, Phone,
  BookOpen, Calendar, CreditCard, Bell, Activity,
  MoreVertical, Download, Clock, MapPin, Award,
  Star, MessageSquare, TrendingUp, ShieldCheck
} from "lucide-react"

// --- TYPES & INTERFACES ---
type UserRole = 'teacher' | 'student' | 'parent';

interface UserProfile {
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  stats: {
    completedTasks: number;
    rating: number;
    attendance: string;
  };
}

interface Student {
  _id?: string;
  name: string;
  phone: string;
  group: string;
  status: 'active' | 'inactive';
  addedDate: string;
  balance: number;
}

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  type: 'online' | 'offline';
}

// --- MAIN COMPONENT ---
export default function EduPortalPro() {
  // --- CORE STATES ---
  const [step, setStep] = useState<'role' | 'login' | 'register' | 'dashboard'>('role');
  const [role, setRole] = useState<UserRole>('teacher');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  
  // Auth & Profile
  const [authForm, setAuthForm] = useState({ name: '', phone: '+998', password: '' });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '+998', group: '' });

  // --- PHONE HANDLER ---
  const handlePhoneInput = (value: string, setter: any, state: any) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 12) {
        const formatted = digits.startsWith('998') ? '+' + digits : '+998' + digits.slice(3);
        setter({ ...state, phone: formatted });
    }
  };

  // --- MONGODB API SIMULATION & FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Real backendda: const res = await fetch('/api/students')
      // Hozirgi simulyatsiya:
      setTimeout(() => {
        setStudents([
          { _id: '1', name: 'Alisher Qodirov', phone: '+998901234567', group: 'Frontend 01', status: 'active', addedDate: '2024-12-21', balance: 500000 },
          { _id: '2', name: 'Malika Ergasheva', phone: '+998935552233', group: 'UI/UX Design', status: 'active', addedDate: '2024-12-20', balance: 0 },
        ]);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Ma'lumot olishda xato:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'dashboard') fetchData();
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [step, isDarkMode]);

  // --- AUTH HANDLERS ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.phone.length !== 13) return alert("Raqamni to'liq kiriting");
    setLoading(true);

    // Kirgan foydalanuvchining real obyektini yaratish
    setTimeout(() => {
      const mockProfile: UserProfile = {
        name: authForm.name || "Azizbek Temirov",
        role: role,
        phone: authForm.phone,
        email: "contact@edupro.uz",
        joinedDate: "Dekabr, 2024",
        stats: {
          completedTasks: 24,
          rating: 4.9,
          attendance: "98%"
        }
      };
      setUserProfile(mockProfile);
      setStep('dashboard');
      setLoading(false);
    }, 1200);
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.phone.length !== 13) return;
    setLoading(true);
    // Real Post Request bu yerda boladi
    const newEntry: Student = {
      ...newStudent,
      _id: Math.random().toString(),
      status: 'active',
      addedDate: new Date().toISOString(),
      balance: 0
    };
    setStudents([newEntry, ...students]);
    setIsModalOpen(false);
    setNewStudent({ name: '', phone: '+998', group: '' });
    setLoading(false);
  };

  // --- ROLE BASED RENDERER ---
  const renderDashboard = () => {
    switch (role) {
      case 'teacher':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Jami O'quvchilar" value={students.length} icon={<Users/>} color="blue" trend="+12%" />
              <StatCard label="Bugungi Darslar" value="6" icon={<Calendar/>} color="emerald" trend="Aktiv" />
              <StatCard label="Oylik Daromad" value="12.4M" icon={<CreditCard/>} color="purple" trend="+5%" />
              <StatCard label="Reyting" value="4.9" icon={<Star/>} color="orange" trend="A'lo" />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-2xl shadow-blue-500/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white italic">O'quvchilar Boshqaruvi</h3>
                    <p className="text-slate-400 text-sm">Guruhlar va to'lovlar nazorati</p>
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <Plus size={20}/> Qo'shish
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b dark:border-white/5">
                        <th className="pb-4 pl-4">Ism-familiya</th>
                        <th className="pb-4">Guruh</th>
                        <th className="pb-4">Holat</th>
                        <th className="pb-4 text-right pr-4">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-white/5">
                      {students.map((s) => (
                        <tr key={s._id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-4">
                            <div className="font-bold dark:text-white">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.phone}</div>
                          </td>
                          <td className="py-4 font-medium text-slate-600 dark:text-slate-300 text-sm">{s.group}</td>
                          <td className="py-4">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase">Aktiv</span>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <button className="p-2 text-slate-400 hover:text-blue-500"><MoreVertical size={18}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h4 className="font-black text-xl mb-4 italic">Eslatma</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">Frontend 01 guruhi uchun bugun yangi dars materiallarini yuklashingiz kerak.</p>
                    <button className="mt-6 w-full bg-white/20 backdrop-blur-md py-3 rounded-xl font-bold hover:bg-white/30 transition-all">Vazifani ochish</button>
                 </div>
                 <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                    <h4 className="font-black dark:text-white mb-4 italic">Bildirishnomalar</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500"><Bell size={18}/></div>
                        <div>
                          <p className="text-xs font-bold dark:text-white">To'lov muddati</p>
                          <p className="text-[10px] text-slate-500">3 ta o'quvchida qarzdorlik bor</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'student':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl">
                <h3 className="text-3xl font-black dark:text-white italic mb-8">Dars Jadvaling</h3>
                <div className="space-y-4">
                  <ScheduleCard subject="Advanced React Patterns" teacher="John Doe" time="14:00 - 15:30" room="Online" active />
                  <ScheduleCard subject="UI/UX Architecture" teacher="Sarah Smith" time="16:00 - 17:30" room="402-xona" active={false} />
                  <ScheduleCard subject="Node.js Security" teacher="Mike Wilson" time="Ertaga 10:00" room="Online" active={false} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                <TrendingUp size={32} className="mb-4 opacity-50"/>
                <h4 className="text-2xl font-black italic">O'zlashtirish</h4>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-black">88</span>
                  <span className="text-xl font-bold opacity-60 mb-2">%</span>
                </div>
                <p className="text-emerald-100 text-sm mt-2">O'tgan oyga nisbatan +4% o'sish</p>
              </div>
              <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                <h4 className="font-black dark:text-white mb-4 italic">Uy Vazifalari</h4>
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-20"/>
                  <p className="text-slate-500 font-medium">Barcha vazifalar topshirilgan!</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Farzand Davomati" value="98%" icon={<ClipboardCheck/>} color="emerald" trend="A'lo" />
              <StatCard label="To'lov Holati" value="To'langan" icon={<CreditCard/>} color="blue" trend="Yanvar uchun" />
              <StatCard label="O'rtacha Baho" value="4.8" icon={<Award/>} color="orange" trend="+0.2" />
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black dark:text-white italic mb-6">O'qituvchi bilan muloqot</h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white"><MessageSquare size={20}/></div>
                <div className="flex-1">
                  <p className="text-sm font-bold dark:text-white">Matematika o'qituvchisi</p>
                  <p className="text-xs text-slate-500">Farzandingiz bugun darsda juda faol bo'ldi.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black">Yozish</button>
              </div>
            </div>
          </div>
        );
    }
  };

  // --- CORE UI SCREENS ---

  if (step === 'role') {
    return (
      <div className="fixed inset-0 bg-[#020617] overflow-hidden flex items-center justify-center p-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-6xl w-full z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
            <h1 className="text-8xl md:text-[10rem] font-black text-white mb-6 tracking-tighter italic">
              EDU<span className="text-blue-500">.</span>PRO
            </h1>
            <p className="text-slate-400 text-xl uppercase tracking-[0.5em] font-light">Kelajak ta'lim ekotizimi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard icon={<GraduationCap size={48} />} title="O'qituvchi" desc="Guruhlarni boshqarish va dars berish" color="blue" onClick={() => {setRole('teacher'); setStep('login')}} />
            <RoleCard icon={<Users size={48} />} title="Talaba" desc="Bilim olish va natijalarni kuzatish" color="emerald" onClick={() => {setRole('student'); setStep('login')}} />
            <RoleCard icon={<Users size={48} />} title="Ota-ona" desc="Monitoring va moliyaviy nazorat" color="purple" onClick={() => {setRole('parent'); setStep('login')}} />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'login' || step === 'register') {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
         <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Lock size={120} className="dark:text-white text-slate-900"/>
            </div>
            <div className="relative z-10">
              <div className="mb-12">
                <h2 className="text-4xl font-black dark:text-white text-slate-800 italic">
                  {step === 'login' ? 'Xush kelibsiz' : "Ro'yxatdan o'tish"}
                </h2>
                <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-500"/> Xavfsiz tizim • {role}
                </p>
              </div>
              <form onSubmit={handleAuth} className="space-y-6">
                {step === 'register' && (
                  <InputGroup label="Ism Familiya" placeholder="Ali Valiyev" value={authForm.name} onChange={(v:string) => setAuthForm({...authForm, name: v})} />
                )}
                <InputGroup label="Telefon raqam" placeholder="+998" type="tel" value={authForm.phone} onChange={(v:string) => handlePhoneInput(v, setAuthForm, authForm)} />
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Maxfiy Parol</label>
                  <input required type={showPass ? "text" : "password"} className="w-full p-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 rounded-[1.5rem] outline-none dark:text-white font-bold transition-all mt-1" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-12 text-slate-400 hover:text-blue-500 transition-colors">
                    {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                <button className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-3">
                   {loading ? "Kirilmoqda..." : step === 'login' ? "Kirish" : "Yaratish"} <ChevronRight size={24}/>
                </button>
                <button type="button" onClick={() => setStep(step === 'login' ? 'register' : 'login')} className="w-full text-slate-500 font-bold text-sm hover:text-blue-500 transition-colors">
                    {step === 'login' ? "Hali hisobingiz yo'qmi? Ochish" : "Hisobingiz bormi? Kirish"}
                </button>
              </form>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-[#020617] transition-all duration-700 p-4 gap-4 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-900 rounded-[3rem] hidden lg:flex flex-col p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="py-8 mb-12 relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter">EDU<span className="text-blue-500">.</span>PRO</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Management Suite</p>
        </div>
        <nav className="flex-1 space-y-3 relative z-10">
          <SidebarItem active={activeTab === 'dashboard'} icon={<LayoutDashboard/>} label="Boshqaruv" onClick={() => setActiveTab('dashboard')} />
          {role === 'teacher' && <SidebarItem active={activeTab === 'students'} icon={<Users/>} label="O'quvchilar" onClick={() => setActiveTab('students')} />}
          <SidebarItem active={activeTab === 'schedule'} icon={<Calendar/>} label="Dars jadvali" onClick={() => setActiveTab('schedule')} />
          <SidebarItem active={activeTab === 'settings'} icon={<Settings/>} label="Sozlamalar" onClick={() => setActiveTab('settings')} />
        </nav>
        <div className="pt-8 border-t border-white/5 relative z-10">
          <button onClick={() => setStep('role')} className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black uppercase text-xs tracking-widest">
            <LogOut size={20}/> Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col gap-4 overflow-hidden">
        <header className="h-28 bg-white dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-slate-200 dark:border-white/5 flex items-center justify-between px-12 shadow-sm relative z-[100]">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{activeTab}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">Tizim Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all">
              {isDarkMode ? <Sun size={22}/> : <Moon size={22}/>}
            </button>
            
            <div className="relative">
              <button onClick={() => setShowProfileCard(!showProfileCard)} className="flex items-center gap-5 pl-8 border-l dark:border-white/5 group transition-all">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black dark:text-white text-slate-800 group-hover:text-blue-500 transition-colors">{userProfile?.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{userProfile?.role} Account</p>
                 </div>
                 <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-[2px] shadow-xl group-hover:rotate-6 transition-all">
                    <div className="w-full h-full bg-slate-900 rounded-[1.4rem] flex items-center justify-center font-black text-white text-xl">
                      {userProfile?.name[0]}
                    </div>
                 </div>
              </button>

              {/* REAL PROFILE DROPDOWN / CARD */}
              {showProfileCard && (
                <div className="absolute top-24 right-0 w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black text-white mb-4 shadow-2xl shadow-blue-600/20">
                      {userProfile?.name[0]}
                    </div>
                    <h4 className="text-xl font-black dark:text-white">{userProfile?.name}</h4>
                    <p className="text-blue-500 text-xs font-bold uppercase mb-6 tracking-widest">{userProfile?.role}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Reyting</p>
                      <p className="text-sm font-black dark:text-white">{userProfile?.stats.rating}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Davomat</p>
                      <p className="text-sm font-black dark:text-white">{userProfile?.stats.attendance}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 dark:text-white font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">Profilni tahrirlash</button>
                    <button onClick={() => setStep('role')} className="w-full py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all">Chiqish</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {activeTab === 'dashboard' ? renderDashboard() : (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                  <Activity size={80} className="dark:text-white mb-4"/>
                  <h3 className="text-3xl font-black dark:text-white italic uppercase tracking-widest">{activeTab} bo'limi ishlab chiqilmoqda</h3>
              </div>
            )}
        </div>
      </main>

      {/* MODAL: MODERN ADD STUDENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
           <form onSubmit={addStudent} className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] max-w-xl w-full shadow-2xl animate-in zoom-in-90 duration-300 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              <h3 className="text-3xl font-black dark:text-white mb-2 italic">Talaba Qo'shish</h3>
              <p className="text-slate-500 text-sm mb-10">Ma'lumotlar bazasiga avtomatik integratsiya qilinadi.</p>
              <div className="space-y-6">
                <InputGroup label="To'liq Ism" placeholder="Talaba F.I.O" value={newStudent.name} onChange={(v:string) => setNewStudent({...newStudent, name:v})} />
                <InputGroup label="Guruhni Tanlang" placeholder="Masalan: Frontend 01" value={newStudent.group} onChange={(v:string) => setNewStudent({...newStudent, group:v})} />
                <InputGroup label="Telefon Aloqasi" placeholder="+998" type="tel" value={newStudent.phone} onChange={(v:string) => handlePhoneInput(v, setNewStudent, newStudent)} />
                <div className="flex gap-6 pt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black text-slate-400 uppercase tracking-widest text-xs hover:text-red-500 transition-colors">Bekor qilish</button>
                  <button className="flex-[2] bg-blue-600 text-white rounded-[1.5rem] font-black py-5 shadow-2xl shadow-blue-600/30 active:scale-95 transition-all">Saqlash</button>
                </div>
              </div>
           </form>
        </div>
      )}
    </div>
  );
}

// --- MODERN HELPER COMPONENTS ---

function SidebarItem({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.5rem] transition-all duration-300 group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </span>
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
      {active && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
    </button>
  );
}

function RoleCard({ icon, title, desc, color, onClick }: any) {
    const colors: any = {
        blue: 'hover:border-blue-500 text-blue-500 shadow-blue-500/5',
        emerald: 'hover:border-emerald-500 text-emerald-500 shadow-emerald-500/5',
        purple: 'hover:border-purple-500 text-purple-500 shadow-purple-500/5'
    }
    return (
        <button onClick={onClick} className={`bg-white/5 backdrop-blur-2xl p-12 rounded-[4rem] border-2 border-white/5 transition-all duration-700 hover:-translate-y-4 hover:bg-white/10 group ${colors[color]}`}>
            <div className="mb-8 p-6 bg-white/5 rounded-[2.5rem] w-fit group-hover:rotate-12 transition-all">{icon}</div>
            <h3 className="text-3xl font-black text-white mb-4 italic text-left">{title}</h3>
            <p className="text-slate-500 text-sm text-left leading-relaxed font-medium">{desc}</p>
        </button>
    );
}

function StatCard({ label, value, icon, color, trend }: any) {
    const colors: any = {
        blue: 'text-blue-500 bg-blue-500/10',
        emerald: 'text-emerald-500 bg-emerald-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
        orange: 'text-orange-500 bg-orange-500/10'
    }
    return (
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                  {React.cloneElement(icon as React.ReactElement, { size: 28 })}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${colors[color]}`}>{trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-4xl font-black dark:text-white italic tracking-tighter">{value}</h4>
        </div>
    );
}

function ScheduleCard({ subject, teacher, time, room, active }: any) {
  return (
    <div className={`p-6 rounded-3xl border transition-all ${active ? 'bg-blue-600 border-transparent text-white shadow-xl shadow-blue-600/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-800 dark:text-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-black text-lg italic">{subject}</h5>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${active ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>{room}</div>
      </div>
      <div className="flex items-center gap-6 opacity-80">
        <div className="flex items-center gap-2 text-xs font-bold"><Clock size={14}/> {time}</div>
        <div className="flex items-center gap-2 text-xs font-bold"><Users size={14}/> {teacher}</div>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">{label}</label>
      <input 
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder} 
        className="w-full p-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 rounded-[1.5rem] outline-none dark:text-white font-bold transition-all text-sm" 
      />
    </div>
  );
}