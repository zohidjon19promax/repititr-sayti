"use client"
import React from "react"
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, CheckSquare } from "lucide-react"

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const menuItems = [
  { icon: LayoutDashboard, label: "Bosh sahifa", id: 'dashboard' },
  { icon: Users, label: "O'quvchilar", id: 'students' },
  { icon: CheckSquare, label: "Vazifalar", id: 'tasks' },
  { icon: BookOpen, label: "Darslar", id: 'schedule' },
  { icon: Settings, label: "Sozlamalar", id: 'settings' },
]

export function Sidebar({ activeTab, setActiveTab }: any) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="text-xl font-bold tracking-tight text-slate-800">TutorCenter</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={classNames(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium",
                activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors w-full px-3 py-2">
          <LogOut size={20} />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </aside>
  )
}