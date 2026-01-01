import React from "react"
import { Clock, Users, MapPin } from "lucide-react"

export function StatCard({ label, value, icon, color, trend }: any) {
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
    )
}

export function InputGroup({ label, placeholder, value, onChange, type = "text", disabled = false }: any) {
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
    )
}