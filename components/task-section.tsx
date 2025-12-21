import React from "react"
// Ikonkalar importi (npm install lucide-react qilingan bo'lishi kerak)
import { Plus, Calendar, BookCheck } from "lucide-react"

// Shadcn UI komponentlarini qo'lda yozib chiqamiz (Shunda import xatosi bo'lmaydi)
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border bg-white text-card-foreground shadow-lg ${className}`}>{children}</div>
)

const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

const Button = ({ children, className, variant, ...props }: any) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
)

export function TaskSection() {
  return (
    <Card className="bg-card border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">Yangi vazifa tayinlash</CardTitle>
        <BookCheck className="text-blue-600 w-5 h-5" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mavzu nomi qismi */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Mavzu nomi
          </label>
          <Input 
            placeholder="Masalan: Kvadrat tenglamalar" 
            className="bg-gray-100 border-none focus-visible:ring-blue-500" 
          />
        </div>

        {/* Muddati va Sinf qismi */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Muddati
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 z-10" />
              <Input 
                type="date" 
                className="bg-gray-100 border-none pl-10 focus-visible:ring-blue-500 w-full" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Sinf
            </label>
            <Input 
              placeholder="9-A" 
              className="bg-gray-100 border-none focus-visible:ring-blue-500" 
            />
          </div>
        </div>

        {/* Yuborish tugmasi */}
        <Button className="w-full gap-2 mt-4 hover:opacity-90 transition-all">
          <Plus size={18} />
          Vazifani yuborish
        </Button>
      </CardContent>
    </Card>
  )
}