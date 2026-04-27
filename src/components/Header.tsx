import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <ФинПотокLogo />
        <span className="text-lg font-semibold text-white">
          ФинПоток<sup className="text-xs">™</sup>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#about" className="text-sm text-gray-300 hover:text-white transition-colors">
          О компании
        </a>
        <a href="#operations" className="text-sm text-gray-300 hover:text-white transition-colors">
          Операции
        </a>
        <a href="#balance" className="text-sm text-gray-300 hover:text-white transition-colors">
          Баланс
        </a>
        <a href="#referral" className="text-sm text-gray-300 hover:text-white transition-colors">
          Рефералы
        </a>
        <a href="#deposit" className="text-sm text-gray-300 hover:text-white transition-colors">
          Пополнение
        </a>
        <a href="#withdraw" className="text-sm text-gray-300 hover:text-white transition-colors">
          Вывод
        </a>
      </nav>

      <Button
        variant="outline"
        className="rounded-full border-violet-500 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 bg-transparent"
      >
        Войти в кабинет
      </Button>
    </header>
  )
}

function ФинПотокLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3" fill="#8B5CF6" />
      <circle cx="16" cy="8" r="3" fill="#8B5CF6" opacity="0.6" />
      <circle cx="8" cy="16" r="3" fill="#8B5CF6" opacity="0.6" />
      <circle cx="16" cy="16" r="3" fill="#8B5CF6" opacity="0.4" />
    </svg>
  )
}