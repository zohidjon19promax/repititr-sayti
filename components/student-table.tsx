import React from "react"

/** * Shadcn UI komponentlarini inline (ichki) e'lon qilamiz. 
 * Bu import xatolarini butunlay yo'qotadi va kodni ochirmasdan ishlashini ta'minlaydi.
 */
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border bg-white dark:bg-slate-900 shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 flex flex-col space-y-1.5 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Badge = ({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) => {
  const variantStyles = variant === "default" 
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantStyles} ${className}`}>
      {children}
    </span>
  )
}

// O'quvchilar ma'lumotlari
const students = [
  { id: 1, name: "Aziz Rahimov", subject: "Matematika", progress: "85%", status: "Faol" },
  { id: 2, name: "Malika Yusupova", subject: "Ingliz tili", progress: "92%", status: "Faol" },
  { id: 3, name: "Jasur Olimov", subject: "Fizika", progress: "78%", status: "Kutilmoqda" },
  { id: 4, name: "Nozima Karimoava", subject: "Ona tili", progress: "95%", status: "Faol" },
  { id: 5, name: "Sardor Ahmedov", subject: "Kimyo", progress: "64%", status: "Faol" },
]

export function StudentTable() {
  return (
    <Card className="bg-card border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">O'quvchilar ro'yxati</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-sm uppercase tracking-wider">
                <th className="pb-3 font-medium">Ism-sharif</th>
                <th className="pb-3 font-medium">Fan</th>
                <th className="pb-3 font-medium text-center">O'zlashtirish</th>
                <th className="pb-3 font-medium text-right">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 font-medium text-slate-700 dark:text-slate-200">{student.name}</td>
                  <td className="py-4 text-slate-500">{student.subject}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-500" 
                          style={{ width: student.progress }} 
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600">{student.progress}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <Badge
                      variant={student.status === "Faol" ? "default" : "secondary"}
                      className="text-[10px] uppercase px-3"
                    >
                      {student.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}