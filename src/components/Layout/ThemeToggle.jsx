import {Moon, Sun} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeProvider'


export default function ThemeToggle() {
  const {theme, setTheme} = useTheme()

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }
  return (
    <label className="relative cursor-target cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isDark}/>
        <div 
        className="w-11 h-6 bg-gray-300 peer-checked:bg-[#3f3f3f] rounded-full transition duration-300"
        onClick={toggleTheme}
        ></div>
        <div 
        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-300"
        onClick={toggleTheme}
        ></div>
        <div className="absolute top-[2px] left-[2px] w-5 h-5 flex items-center justify-center text-sm dark:text-black pointer-events-none peer-checked:translate-x-5 transition duration-300">
          {isDark ? <Moon size={12}/> : <Sun size={12} />}
        </div>
    </label>
  )
}
