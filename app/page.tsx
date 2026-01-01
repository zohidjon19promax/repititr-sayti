"use client"

import React, { useState, useEffect } from "react"
import { 
  GraduationCap, Users, Lock, LayoutDashboard, 
  Settings, LogOut, Sun, Moon, ClipboardCheck, 
  Eye, EyeOff, Plus, Search, Trash2, CheckCircle2,
  XCircle, Filter, ChevronRight, UserPlus, Mail, Phone,
  BookOpen, Calendar, CreditCard, Bell, Activity,
  MoreVertical, Download, Clock, MapPin, Award,
  Star, MessageSquare, TrendingUp, ShieldCheck, Save
} from "lucide-react"

// --- TYPES & INTERFACES ---
type UserRole = 'teacher' | 'student' | 'parent';

interface UserProfile {
  id?: string;
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
  _id: string;
  name: string;
  phone: string;
  group: string;
  status: 'active' | 'inactive';
  addedDate: string;
  balance: number;
  attendanceRecords?: string[]; // Sanalar massivi
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
  const [childData, setChildData] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]); // Jadval uchun
  const [isModalOpen, setIsModalOpen] = useState(false); // O'quvchi qo'shish oynasi
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); // Dars qo'shish oynasi
  
  // Yangi o'quvchi (ota-ona telefoni bilan)
  const [newStudent, setNewStudent] = useState({ 
    name: '', 
    phone: '+998', 
    group: '', 
    parentPhone: '+998' 
  });

  // Yangi dars qo'shish uchun
  const [newLesson, setNewLesson] = useState({
    subject: '',
    time: '',
    room: '',
    group: '',
    dayOfWeek: 'Dushanba'
  });

  const [searchQuery, setSearchQuery] = useState("");
  const fetchSchedules = async () => {
  if (!userProfile) return;
  
  // Masalan: /api/schedule?role=teacher&userId=123
// fetchSchedules ichidagi url qatorini shunday yozing:
const url = `/api/schedule?role=${role}&userId=${userProfile?.id}&group=${(userProfile as any)?.group || ''}`;  const res = await fetch(url);
  const result = await res.json();
  
  if (result.success) {
    setSchedules(result.data); // 'schedules' state-ni yangilaydi
  }
};
const addLesson = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newLesson,
        teacher: userProfile?.name || userProfile?.name,
        teacherId: userProfile?.id
      }),
    });

    const data = await res.json();
    if (data.success) {
      setSchedules([...schedules, data.data]); // Jadvalni yangilash
      setIsScheduleModalOpen(false); // Oynani yopish
      setNewLesson({ subject: '', time: '', room: '', group: '', dayOfWeek: 'Dushanba' }); // Formani tozalash
      alert("Dars qo'shildi!");
    }
  } catch (err) {
    alert("Xatolik yuz berdi");
  }
};
  // --- PHONE HANDLER ---
  const handlePhoneInput = (value: string, setter: any, state: any) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 12) {
        const formatted = digits.startsWith('998') ? '+' + digits : '+998' + digits.slice(3);
        setter({ ...state, phone: formatted });
    }
  };
  
  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (role === 'teacher') {
        const res = await fetch('/api/students');
        const result = await res.json();
        if (result.success) setStudents(result.data);
      } 
      else if (role === 'parent' && userProfile?.phone) {
        const res = await fetch(`/api/parent/child-info?phone=${encodeURIComponent(userProfile.phone)}`);
        const result = await res.json();
        if (result.success) setChildData(result.data);
      }
    } catch (err) {
      console.error("Ma'lumot olishda xato:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchChildData = async () => {
  // Foydalanuvchi roli 'parent' bo'lsa va telefoni bo'lsa ishlaydi
  if (role === 'parent' && userProfile?.phone) {
    try {
      const res = await fetch(`/api/parent/child?phone=${userProfile.phone}`);
      const data = await res.json();
      if (data.success) {
        setChildData(data.child);
      }
    } catch (err) {
      console.error("Farzand ma'lumotini yuklashda xato:", err);
    }
  }
};
useEffect(() => {
  // 1. Dashboardga o'tganda ma'lumotlarni yuklash
  if (step === 'dashboard') {
    fetchData();      // O'quvchilar va umumiy ma'lumotlar uchun
    fetchSchedules(); // Dars jadvalini yuklash uchun (yangi qo'shildi)
  }

  // 2. Dark mode (Tungi rejim) sozlamasi
  document.documentElement.classList.toggle('dark', isDarkMode);

  // 3. Ota-ona uchun maxsus yuklash (agar kerak bo'lsa)
  if (step === 'dashboard' && role === 'parent') {
    // fetchChildData() kabi funksiyalarni ham shu yerda chaqirish mumkin
  }

}, [step, isDarkMode, role, userProfile]); // userProfile qo'shildi, chunki ma'lumot unga bog'liq

const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const isLogin = step === 'login';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // API ga yuboriladigan ma'lumotlarni tayyorlash
    const payload = isLogin 
      ? { phone: authForm.phone, password: authForm.password, role: role }
      : { fullName: authForm.name, phone: authForm.phone, password: authForm.password, role: role };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      // Profil ma'lumotlarini o'rnatish
      setUserProfile({
        id: data.user?.id || data.id,
        // Agar login bo'lsa backenddan kelgan ismni, agar register bo'lsa formadagi ismni olamiz
        name: data.user?.fullName || authForm.name,
        role: role,
        phone: authForm.phone,
        joinedDate: data.user?.createdAt 
          ? new Date(data.user.createdAt).toLocaleDateString('uz-UZ') 
          : new Date().toLocaleDateString('uz-UZ'),
        stats: { completedTasks: 0, rating: 5.0, attendance: "100%" }
      });
      
      setStep('dashboard');
    } else {
      // Backenddan kelgan aniq xabarni ko'rsatish (masalan: "Parol noto'g'ri")
      alert(data.message);
    }
  } catch (err) {
    console.error("Auth error:", err);
    alert("Server bilan aloqa uzildi yoki internetda xatolik!");
  } finally {
    setLoading(false);
  }
};

  // --- STUDENT ACTIONS (Real working buttons) ---
  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);}
    } catch (err) { alert("Xato yuz berdi"); }
    finally { setLoading(false); }
  };

  const handleAttendance = async (studentId: string) => {
    // Real vaqtda davomatni DB ga yozish
    try {
      await fetch(`/api/students/${studentId}/attendance`, { method: 'POST' });
      alert("Davomat belgilandi!");
      fetchData();
    } catch (err) { console.error(err); }
  };

 const deleteStudent = async (id: string) => {
  // Foydalanuvchidan tasdiqlash so'raymiz
  if (!confirm("Haqiqatan ham bu o'quvchini o'chirmoqchimisiz?")) return;

  try {
    // Backend API ga o'chirish so'rovini yuboramiz
    const res = await fetch(`/api/students?id=${id}`, { 
      method: 'DELETE' 
    });

    const result = await res.json();

    if (result.success) {
      // Agar bazadan o'chsa, ekrandagi ro'yxatdan ham olib tashlaymiz
      setStudents(prev => prev.filter(s => s._id !== id));
      alert("O'quvchi muvaffaqiyatli o'chirildi");
    } else {
      alert("Xatolik: " + result.error);
    }
  } catch (err) {
    alert("Server bilan bog'lanishda xato yuz berdi");
  }
};

  const updateProfile = async (newName: string) => {
    try {
        const res = await fetch(`/api/users/${userProfile?.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        if(res.ok) setUserProfile(prev => prev ? {...prev, name: newName} : null);
    } catch (err) { alert("Yangilashda xato"); }
  }

// --- RENDER COMPONENTS ---
  const renderDashboard = () => {
    switch (role) {
      case 'teacher':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* students.length - bazadagi o'quvchilar sonini chiqaradi */}
              <StatCard label="Jami O'quvchilar" value={students.length} icon={<Users/>} color="blue" trend="+12%" />

              {/* schedules.length - bugungi darslar sonini bazadan oladi */}
              <StatCard label="Bugungi Darslar" value={schedules.length || "0"} icon={<Calendar/>} color="emerald" trend="Aktiv" />
              
              {/* Balansi 0 dan kichik (qarzi bor) o'quvchilarni sanaydi */}
              <StatCard label="Qarzdorlar" value={students.filter(s => s.balance < 0).length} icon={<CreditCard/>} color="purple" trend="Moliyaviy" />
              
              <StatCard label="Reyting" value="4.9" icon={<Star/>} color="orange" trend="A'lo" />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-2xl shadow-blue-500/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white italic text-blue-500">So'nggi O'quvchilar</h3>
                    <p className="text-slate-400 text-sm">Guruhlar va davomat nazorati</p>
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2">
                    <Plus size={20}/> Yangi o'quvchi </button>
                 // teacher panelining yuqori qismiga (Yangi o'quvchi tugmasi yoniga)
                  <button onClick={() => setIsScheduleModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
>                   <Calendar size={20}/> Dars Qo'shish </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b dark:border-white/5">
                        <th className="pb-4 pl-4">Ism / Tel</th>
                        <th className="pb-4">Guruh</th>
                        <th className="pb-4">Davomat</th>
                        <th className="pb-4 text-right pr-4">Boshqaruv</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-white/5">
                      {/* students massividan ma'lumotlarni chiqarish */}
                      {students.length > 0 ? students.slice(0, 5).map((s) => (
                        <tr key={s._id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-4">
                            <div className="font-bold dark:text-white">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.phone}</div>
                          </td>
                          <td className="py-4 font-medium text-slate-600 dark:text-slate-300 text-sm">{s.group}</td>
                          <td className="py-4">
                            <button onClick={() => handleAttendance(s._id)} className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black hover:bg-emerald-500 hover:text-white transition-all">
                              <CheckCircle2 size={12}/> KELDI
                            </button>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <button onClick={() => deleteStudent(s._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="py-10 text-center text-slate-500">O'quvchilar topilmadi</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h4 className="font-black text-xl mb-4 italic flex items-center gap-2"><Bell size={20}/> Eslatma</h4>
                    <p className="text-blue-100 text-sm leading-relaxed mb-6">Bugun soat 18:00 da barcha o'qituvchilar uchun "AI in Education" mavzusida seminar bo'lib o'tadi.</p>
                    <button className="w-full bg-white/20 backdrop-blur-md py-3 rounded-xl font-bold hover:bg-white/30 transition-all uppercase text-xs tracking-widest">Qatnashish</button>
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
                  {/* Bazadan kelgan darslarni chiqarish */}
                  {schedules.length > 0 ? schedules.map((item, index) => (
                    <ScheduleCard 
                      key={index}
                      subject={item.subject} 
                      teacher={item.teacher} 
                      time={item.time} 
                      room={item.room} 
                      active={index === 0} 
                    />
                  )) : (
                    <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
                       Hozircha darslar belgilanmagan
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* childData ichidagi real davomatni chiqaradi */}
              <StatCard label="Farzand Davomati" value={childData?.attendance || "0%"} icon={<ClipboardCheck/>} color="emerald" trend="Yaxshi" />
              <StatCard label="To'lov Holati" value={childData?.balance < 0 ? "Qarz" : "To'langan"} icon={<CreditCard/>} color="blue" trend="Monitoring" />
              <StatCard label="Reyting" value={childData?.rating || "0.0"} icon={<Award/>} color="orange" trend="Top 5" />
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
               <h3 className="text-xl font-black dark:text-white mb-6 italic">Farzand: {childData?.fullName || "Yuklanmoqda..."}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                     <p className="text-xs font-bold text-blue-500 uppercase mb-2">Joriy Holat</p>
                     <h4 className="font-black dark:text-white uppercase">{childData?.status || "Aktiv"}</h4>
                  </div>
                  <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                     <p className="text-xs font-bold text-emerald-500 uppercase mb-2">Balans</p>
                     <h4 className="font-black dark:text-white">{(childData?.balance || 0).toLocaleString()} so'm</h4>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };
  // --- SUB-PAGES ---
  const renderStudentsPage = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                <input 
                    type="text" 
                    placeholder="O'quvchi qidirish..." 
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 outline-none focus:border-blue-500 dark:text-white"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 w-full md:w-auto">
                <UserPlus size={20}/> YANGI QO'SHISH
            </button>
        </div>
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5">
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <th className="p-6">O'quvchi</th>
                        <th className="p-6">Guruh</th>
                        <th className="p-6">Balans</th>
                        <th className="p-6">Holat</th>
                        <th className="p-6 text-right">Amal</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5">
                    {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                        <tr key={s._id} className="dark:text-white hover:bg-blue-500/5 transition-colors">
                            <td className="p-6">
                                <p className="font-bold">{s.name}</p>
                                <p className="text-xs text-slate-500">{s.phone}</p>
                            </td>
                            <td className="p-6 text-sm font-medium">{s.group}</td>
                            <td className={`p-6 text-sm font-black ${s.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {s.balance.toLocaleString()} UZS
                            </td>
                            <td className="p-6">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black">FAOL</span>
                            </td>
                            <td className="p-6 text-right space-x-2">
                                <button className="p-2 text-slate-400 hover:text-blue-500"><MessageSquare size={18}/></button>
                                <button onClick={() => deleteStudent(s._id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-10">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5">
            <h3 className="text-2xl font-black dark:text-white italic mb-8">Profil Sozlamalari</h3>
            <div className="space-y-6">
                <InputGroup 
                    label="To'liq Ismingiz" 
                    value={userProfile?.name} 
                    onChange={(v:string) => setUserProfile(prev => prev ? {...prev, name: v} : null)} 
                />
                <InputGroup label="Telefon" value={userProfile?.phone} disabled />
                <div className="pt-6">
                    <button 
                        onClick={() => updateProfile(userProfile?.name || "")}
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                    >
                        <Save size={20}/> O'ZGARISHLARNI SAQLASH
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  // --- MAIN LAYOUT ---
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
            <div className="relative z-10">
              <div className="mb-12">
                <h2 className="text-4xl font-black dark:text-white text-slate-800 italic uppercase">
                  {step === 'login' ? 'Kirish' : "Registratsiya"}
                </h2>
                <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-500"/> {role} paneli
                </p>
              </div>
              <form onSubmit={handleAuth} className="space-y-6">
                {step === 'register' && (
                  <InputGroup label="To'liq Ism" placeholder="F.I.O" value={authForm.name} onChange={(v:string) => setAuthForm({...authForm, name: v})} />
                )}
                <InputGroup label="Telefon" placeholder="+998" type="tel" value={authForm.phone} onChange={(v:string) => handlePhoneInput(v, setAuthForm, authForm)} />
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Parol</label>
                  <input 
                    required 
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    type={showPass ? "text" : "password"} 
                    className="w-full p-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 rounded-[1.5rem] outline-none dark:text-white font-bold transition-all mt-1" 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-12 text-slate-400 hover:text-blue-500 transition-colors">
                    {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                >
                   {loading ? "Yuklanmoqda..." : "Davom etish"} <ChevronRight size={24}/>
                </button>
                <button type="button" onClick={() => setStep(step === 'login' ? 'register' : 'login')} className="w-full text-slate-500 font-bold text-sm">
                    {step === 'login' ? "Hisob ochish" : "Kirishga qaytish"}
                </button>
              </form>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-[#020617] transition-all duration-700 p-4 gap-4 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 rounded-[3rem] hidden lg:flex flex-col p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="py-8 mb-12 relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter">EDU<span className="text-blue-500">.</span>PRO</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Suite Premium</p>
        </div>
        <nav className="flex-1 space-y-3 relative z-10">
          <SidebarItem active={activeTab === 'dashboard'} icon={<LayoutDashboard/>} label="Bosh sahifa" onClick={() => setActiveTab('dashboard')} />
          {role === 'teacher' && <SidebarItem active={activeTab === 'students'} icon={<Users/>} label="O'quvchilar" onClick={() => setActiveTab('students')} />}
          <SidebarItem active={activeTab === 'schedule'} icon={<Calendar/>} label="Jadval" onClick={() => setActiveTab('schedule')} />
          <SidebarItem active={activeTab === 'settings'} icon={<Settings/>} label="Sozlamalar" onClick={() => setActiveTab('settings')} />
        </nav>
        <div className="pt-8 border-t border-white/5 relative z-10">
          <button onClick={() => setStep('role')} className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-xs">
            <LogOut size={20}/> CHIQISH
          </button>
        </div>
      </aside>
      {/* DARS QO'SHISH MODAL OYNASI */}
{isScheduleModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
      <h3 className="text-2xl font-black mb-6 italic dark:text-white">Yangi Dars Qo'shish</h3>
      
      <form onSubmit={addLesson} className="space-y-4">
        <input
          placeholder="Fan nomi (masalan: Matematika)"
          className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-white/10 dark:text-white"
          value={newLesson.subject}
          onChange={e => setNewLesson({...newLesson, subject: e.target.value})}
          required
        />
        <input
          placeholder="Vaqt (masalan: 14:00 - 15:30)"
          className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-white/10 dark:text-white"
          value={newLesson.time}
          onChange={e => setNewLesson({...newLesson, time: e.target.value})}
          required
        />
        <input
          placeholder="Xona yoki Online"
          className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-white/10 dark:text-white"
          value={newLesson.room}
          onChange={e => setNewLesson({...newLesson, room: e.target.value})}
          required
        />
        <input
          placeholder="Guruh nomi"
          className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-white/10 dark:text-white"
          value={newLesson.group}
          onChange={e => setNewLesson({...newLesson, group: e.target.value})}
          required
        />
        
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => setIsScheduleModalOpen(false)}
            className="flex-1 p-4 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          >
            Bekor qilish
          </button>
          <button 
            type="submit"
            className="flex-1 p-4 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all"
          >
            Saqlash
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 overflow-hidden">
        <header className="h-28 bg-white dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-slate-200 dark:border-white/5 flex items-center justify-between px-12 shadow-sm relative z-[100]">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{activeTab}</h2>
          
          <div className="flex items-center gap-8">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-yellow-400 transition-all">
              {isDarkMode ? <Sun size={22}/> : <Moon size={22}/>}
            </button>
            
            <div className="relative">
              <button onClick={() => setShowProfileCard(!showProfileCard)} className="flex items-center gap-5 pl-8 border-l dark:border-white/5">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black dark:text-white">{userProfile?.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{userProfile?.role}</p>
                  </div>
                  <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30">
                    {userProfile?.name ? userProfile.name[0] : "U"}
                  </div>
              </button>

              {showProfileCard && (
                <div className="absolute top-24 right-0 w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-8 animate-in slide-in-from-top-4 duration-300 z-[101]">
                  <div className="text-center">
                    <h4 className="text-xl font-black dark:text-white">{userProfile?.name}</h4>
                    <p className="text-blue-500 text-xs font-bold uppercase mb-6">{userProfile?.role}</p>
                    <div className="space-y-2">
                        <button onClick={() => setActiveTab('settings')} className="w-full py-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:text-white font-bold text-xs uppercase">Profil</button>
                        <button onClick={() => setStep('role')} className="w-full py-3 rounded-xl text-red-500 font-bold text-xs uppercase hover:bg-red-500/10 transition-all">Chiqish</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'students' && renderStudentsPage()}
            {activeTab === 'settings' && renderSettings()}
            {['schedule'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                  <Activity size={80} className="dark:text-white mb-4 animate-pulse"/>
                  <h3 className="text-3xl font-black dark:text-white italic uppercase">{activeTab} bo'limi tayyorlanmoqda</h3>
              </div>
            )}
        </div>
      </main>
      );
{/* Modal only for Teacher */}
{isModalOpen && role === 'teacher' && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
    <form onSubmit={addStudent} className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] max-w-xl w-full border border-white/10 shadow-2xl">
      <h3 className="text-3xl font-black dark:text-white mb-6 italic text-blue-500 uppercase">Talaba Qo'shish</h3>
      
      <div className="space-y-6">
        {/* 1. To'liq Ism */}
        <InputGroup 
          label="To'liq Ism" 
          placeholder="Ismingizni kiriting" 
          value={newStudent.name} 
          onChange={(v:string) => setNewStudent({...newStudent, name:v})} 
        />
        
        {/* 2. O'quvchi telefoni */}
        <InputGroup 
          label="O'quvchi Telefoni" 
          placeholder="+998" 
          type="tel" 
          value={newStudent.phone} 
          onChange={(v:string) => handlePhoneInput(v, setNewStudent, newStudent)} 
        />

        {/* 3. Ota-ona telefoni */}
        <InputGroup 
          label="Ota-ona Telefoni" 
          placeholder="+998" 
          type="tel"
          value={newStudent.parentPhone} 
          onChange={(v:string) => setNewStudent({...newStudent, parentPhone: v})} 
        />

        {/* 4. Guruh nomi */}
        <InputGroup 
          label="Guruh" 
          placeholder="Guruh nomi" 
          value={newStudent.group} 
          onChange={(v:string) => setNewStudent({...newStudent, group:v})} 
        />

        {/* Tugmalar */}
        <div className="flex gap-6 pt-10">
          <button 
            type="button" 
            onClick={() => setIsModalOpen(false)} 
            className="flex-1 font-black text-slate-400 uppercase text-xs hover:text-red-500 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            type="submit" 
            className="flex-[2] bg-blue-600 text-white rounded-[1.5rem] font-black py-5 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all uppercase text-sm"
          >
            Saqlash
          </button>
        </div>
      </div>
    </form>
  </div>
)} 
    </div>
  );
}
function SidebarItem({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.5rem] transition-all group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 translate-x-2' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
      <span>{React.cloneElement(icon as React.ReactElement, { size: 24 })}</span>
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
function RoleCard({ icon, title, desc, color, onClick }: any) {
    const colors: any = {
        blue: 'hover:border-blue-500 text-blue-500',
        emerald: 'hover:border-emerald-500 text-emerald-500',
        purple: 'hover:border-purple-500 text-purple-500'
    }
    return (
        <button onClick={onClick} className={`bg-white/5 backdrop-blur-2xl p-12 rounded-[4rem] border-2 border-white/5 transition-all duration-700 hover:-translate-y-4 hover:bg-white/10 group ${colors[color]}`}>
            <div className="mb-8 p-6 bg-white/5 rounded-[2.5rem] w-fit shadow-inner">{icon}</div>
            <h3 className="text-3xl font-black text-white mb-4 italic text-left">{title}</h3>
            <p className="text-slate-500 text-sm text-left leading-relaxed">{desc}</p>
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
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all">
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
    <div className={`p-8 rounded-[2rem] border transition-all ${active ? 'bg-blue-600 border-transparent text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-800 dark:text-white'}`}>
      <h5 className="font-black text-xl italic mb-4">{subject}</h5>
      <div className="flex flex-wrap items-center gap-6 opacity-80">
        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg"><Clock size={14}/> {time}</div>
        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg"><Users size={14}/> {teacher}</div>
        <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg"><MapPin size={14}/> {room}</div>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text", disabled = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">{label}</label>
      <input 
        required
        disabled={disabled}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        type={type}
        placeholder={placeholder} 
        className={`w-full p-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 rounded-[1.5rem] outline-none dark:text-white font-bold transition-all text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      />
    </div>
  );
}