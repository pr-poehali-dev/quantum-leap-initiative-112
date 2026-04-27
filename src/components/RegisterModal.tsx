import { useState } from "react"
import { X, Eye, EyeOff, ArrowUpRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import func2url from "../../backend/func2url.json"

interface RegisterModalProps {
  open: boolean
  onClose: () => void
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [mode, setMode] = useState<"register" | "login">("register")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch(func2url.auth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Что-то пошло не так")
      } else {
        localStorage.setItem("session_token", data.session_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setSuccess(mode === "register" ? `Добро пожаловать, ${data.user.name}! 🎉` : `С возвращением, ${data.user.name}!`)
        setTimeout(() => {
          onClose()
          setSuccess("")
          setForm({ name: "", email: "", password: "" })
        }, 1500)
      }
    } catch {
      setError("Ошибка соединения. Попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-[#141414] border border-[#262626] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Icon name="Wallet" size={18} className="text-violet-400" fallback="Star" />
          </div>
          <span className="text-lg font-semibold text-white">ФинПоток</span>
        </div>

        <div className="flex gap-1 mb-8 bg-[#1a1a1a] rounded-xl p-1">
          <button
            onClick={() => { setMode("register"); setError("") }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${mode === "register" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            Регистрация
          </button>
          <button
            onClick={() => { setMode("login"); setError("") }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${mode === "login" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            Войти
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Ваше имя</label>
              <input
                type="text"
                placeholder="Иван Иванов"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="ivan@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Минимум 8 символов"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                className="w-full rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3 pr-12 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3">
              <p className="text-xs text-violet-300">
                🎁 Бонус новичка — <span className="font-semibold">+500 ₽</span> на баланс при первом пополнении от 5 000 ₽
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
              <p className="text-xs text-emerald-400">{success}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-6 text-base font-medium mt-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === "register" ? (
              <>Создать аккаунт <ArrowUpRight className="ml-2 h-4 w-4" /></>
            ) : (
              <>Войти в кабинет <ArrowUpRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Регистрируясь, вы соглашаетесь с{" "}
          <a href="#" className="text-violet-400 hover:text-violet-300">условиями использования</a>
        </p>
      </div>
    </div>
  )
}
