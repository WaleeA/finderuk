import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from 'lucide-react'

interface NavbarProps {
  lineCount: number
  onLineCountChange: (count: number) => void
  onGeolocation: () => void
}

export default function Navbar({ lineCount, onLineCountChange, onGeolocation }: NavbarProps) {
  return (
    <nav className="h-16 border-b border-neutral-800 flex items-center px-4 bg-black/40 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
      <a href="https://www.linkedin.com/in/waleea" target="_blank" rel="noopener noreferrer">
        <h1 className="text-white font-semibold text-lg underline underline-offset-1 hover:bg-white/20">
          by Walee
        </h1>
      </a>
      <div className="ml-auto flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black border-neutral-700 hover:bg-white/20">
              <Settings className="mr-2 h-4 w-4" />
              Filter ({lineCount})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[1, 5, 10, 15].map((count) => (
              <DropdownMenuItem key={count} onSelect={() => onLineCountChange(count)}>
                {count} lines
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline" 
          className="text-black border-neutral-700 hover:bg-white/20"
          onClick={onGeolocation}
        >
          Use Current Location
        </Button>
      </div>
    </nav>
  )
}