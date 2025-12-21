import React from "react"
// Ikonkalar (npm install lucide-react qilingan bo'lishi kerak)
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, CheckSquare } from "lucide-react"

/** * Shadcn-ning 'cn' funksiyasi o'rniga oddiy klass birlashtiruvchi.
 * Bu loyihada utils.ts fayli bo'lmasa ham kodni xatosiz ishlashini ta'minlaydi.
 */
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const menuItems = [
  { icon: LayoutDashboard, label: "Bosh sahifa", active: true },
  { icon: Users, label: "O'quvchilar", active: false },
  { icon: CheckSquare, label: "Vazifalar", active: false },
  { icon: BookOpen, label: "Darslar", active: false },
  { icon: Settings, label: "Sozlamalar", active: false },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        {/* Logo qismi */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">TutorCenter</span>
        </div>

        {/* Navigatsiya qismi */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={classNames(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium",
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Chiqish tugmasi pastda */}
      <div className="mt-auto p-6 border-t border-slate-100">
        <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors w-full px-3 py-2 group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </aside>
  )
}