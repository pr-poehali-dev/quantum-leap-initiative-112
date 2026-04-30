import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, TrendingUp, TrendingDown, CreditCard, ArrowDownToLine, Users, Copy, CheckCheck, Wallet, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"
import func2url from "../../backend/func2url.json"

interface User {
  id: number
  name: string
  email: string
  balance: number
  referral_code: string
  created_at: string
}

interface Transaction {
  type: string
  amount: number
  description: string
  created_at: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "operations" | "deposit" | "withdraw" | "referral">("overview")
  const [depositAmount, setDepositAmount] = useState("")
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("session_token")
    if (!token) { navigate("/"); return }

    fetch(func2url.user, {
      headers: { "X-Session-Token": token }
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) { navigate("/"); return }
        setUser(data.user)
        setTransactions(data.transactions)
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("session_token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (!amount || amount < 100) return
    const token = localStorage.getItem("session_token")
    if (!token) return
    setPaymentLoading(true)
    try {
      const res = await fetch(func2url.payment, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Token": token },
        body: JSON.stringify({ amount, return_url: window.location.href }),
      })
      const data = await res.json()
      console.log("Payment response:", data)
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url
      } else {
        toast.error(data.error || "Ошибка при создании платежа")
      }
    } catch (e) {
      console.error("Payment error:", e)
      toast.error("Не удалось подключиться к серверу оплаты")
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleCopy = () => {
    if (user) {
      navigator.clipboard.writeText(`https://finpotok.ru/ref/${user.referral_code}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { id: "overview", label: "Обзор", icon: "LayoutDashboard" },
    { id: "operations", label: "Операции", icon: "ReceiptText" },
    { id: "deposit", label: "Пополнение", icon: "CreditCard" },
    { id: "withdraw", label: "Вывод", icon: "ArrowDownToLine" },
    { id: "referral", label: "Рефералы", icon: "Users" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Icon name="Wallet" size={16} className="text-violet-400" fallback="Star" />
          </div>
          <span className="font-semibold text-white">ФинПоток</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                activeTab === item.id
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <Icon name={item.icon} size={16} fallback="Circle" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-[#1a1a1a] pt-4 mt-4">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-500 hover:text-red-400 hover:bg-[#1a1a1a] rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Добро пожаловать, {user.name.split(" ")[0]}!</h1>
              <p className="text-gray-500 text-sm">Ваш финансовый кабинет</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/20 p-6">
                <p className="text-sm text-gray-400 mb-2">Баланс</p>
                <p className="text-3xl font-bold text-white">{user.balance.toLocaleString("ru-RU")} ₽</p>
                <p className="text-xs text-violet-400 mt-2">Доступно для вывода</p>
              </div>
              <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6">
                <p className="text-sm text-gray-400 mb-2">Дивиденды</p>
                <p className="text-3xl font-bold text-emerald-400">до 10%</p>
                <p className="text-xs text-gray-500 mt-2">Выплаты 2 раза в неделю</p>
              </div>
              <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6">
                <p className="text-sm text-gray-400 mb-2">Реферальный код</p>
                <p className="text-xl font-bold text-white font-mono">{user.referral_code}</p>
                <p className="text-xs text-gray-500 mt-2">Приглашайте — зарабатывайте</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6">
              <h2 className="text-base font-semibold text-white mb-4">Последние операции</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="ReceiptText" size={40} className="text-gray-700 mx-auto mb-3" fallback="List" />
                  <p className="text-gray-500 text-sm">Операций пока нет</p>
                  <p className="text-gray-600 text-xs mt-1">Пополните баланс, чтобы начать</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === "deposit" || t.type === "dividend" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                          {t.type === "deposit" || t.type === "dividend"
                            ? <TrendingUp className="h-4 w-4 text-emerald-400" />
                            : <TrendingDown className="h-4 w-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm text-white">{t.description}</p>
                          <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString("ru-RU")}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${t.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* OPERATIONS */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Операции по счёту</h1>
            <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="ReceiptText" size={48} className="text-gray-700 mx-auto mb-4" fallback="List" />
                  <p className="text-gray-400 text-base">Операций пока нет</p>
                  <p className="text-gray-600 text-sm mt-2">После пополнения баланса здесь появится история</p>
                  <Button onClick={() => setActiveTab("deposit")} className="mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                    Пополнить баланс
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((t, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-[#0f0f0f] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${t.type === "deposit" || t.type === "dividend" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                          {t.type === "deposit" || t.type === "dividend"
                            ? <TrendingUp className="h-4 w-4 text-emerald-400" />
                            : <TrendingDown className="h-4 w-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{t.description}</p>
                          <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString("ru-RU")}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${t.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEPOSIT */}
        {activeTab === "deposit" && (
          <div className="space-y-6 max-w-lg">
            <h1 className="text-2xl font-bold text-white">Пополнение баланса</h1>
            <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-400 mb-3">Способ пополнения</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "card", label: "Банковская карта", icon: "CreditCard" },
                    { id: "crypto", label: "Криптовалюта", icon: "Bitcoin" },
                  ].map(m => (
                    <div key={m.id} className="rounded-xl border border-[#262626] bg-[#0f0f0f] p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-violet-500/50 transition-colors">
                      <Icon name={m.icon} size={24} className="text-violet-400" fallback="Coins" />
                      <span className="text-sm text-white">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Сумма пополнения</label>
                <div className="flex items-center rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3 focus-within:border-violet-500 transition-colors">
                  <span className="text-gray-500 mr-2">₽</span>
                  <input type="number" placeholder="0" min="100" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-lg font-semibold" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Минимум 100 ₽</p>
              </div>
              <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3">
                <p className="text-xs text-violet-300">🎁 Бонус новичка +500 ₽ при первом пополнении от 5 000 ₽</p>
              </div>
              <Button onClick={handleDeposit} disabled={paymentLoading || !depositAmount || parseFloat(depositAmount) < 100} className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-6 text-base disabled:opacity-50">
                <CreditCard className="mr-2 h-5 w-5" /> {paymentLoading ? "Загрузка..." : "Перейти к оплате"}
              </Button>
            </div>
          </div>
        )}

        {/* WITHDRAW */}
        {activeTab === "withdraw" && (
          <div className="space-y-6 max-w-lg">
            <h1 className="text-2xl font-bold text-white">Вывод дивидендов</h1>
            <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 space-y-5">
              <div className="flex items-center justify-between rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-4">
                <div>
                  <p className="text-xs text-gray-500">Доступно для вывода</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{user.balance.toLocaleString("ru-RU")} ₽</p>
                </div>
                <Wallet className="h-8 w-8 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-3">Способ вывода</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "card", label: "На карту", icon: "CreditCard" },
                    { id: "crypto", label: "Крипто-кошелёк", icon: "Bitcoin" },
                  ].map(m => (
                    <div key={m.id} className="rounded-xl border border-[#262626] bg-[#0f0f0f] p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-violet-500/50 transition-colors">
                      <Icon name={m.icon} size={24} className="text-violet-400" fallback="Coins" />
                      <span className="text-sm text-white">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Реквизиты</label>
                <input type="text" placeholder="Номер карты или адрес кошелька" className="w-full rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Сумма вывода</label>
                <div className="flex items-center rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3 focus-within:border-violet-500 transition-colors">
                  <span className="text-gray-500 mr-2">₽</span>
                  <input type="number" placeholder="0" className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-lg font-semibold" />
                </div>
              </div>
              <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-6 text-base">
                <ArrowDownToLine className="mr-2 h-5 w-5" /> Вывести средства
              </Button>
            </div>
          </div>
        )}

        {/* REFERRAL */}
        {activeTab === "referral" && (
          <div className="space-y-6 max-w-lg">
            <h1 className="text-2xl font-bold text-white">Реферальная программа</h1>
            <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 space-y-5">
              <div className="rounded-xl bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/20 p-5 text-center">
                <p className="text-4xl font-bold text-violet-400 mb-1">5%</p>
                <p className="text-sm text-gray-300">с каждого пополнения вашего реферала</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Ваша реферальная ссылка</p>
                <div className="flex items-center gap-2 rounded-xl bg-[#0f0f0f] border border-[#262626] px-4 py-3">
                  <span className="flex-1 text-sm text-gray-300 truncate font-mono">finpotok.ru/ref/{user.referral_code}</span>
                  <button onClick={handleCopy} className="text-violet-400 hover:text-violet-300 shrink-0 transition-colors">
                    {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#0f0f0f] border border-[#262626] p-4 text-center">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-gray-500 mt-1">Рефералов</p>
                </div>
                <div className="rounded-xl bg-[#0f0f0f] border border-[#262626] p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">0 ₽</p>
                  <p className="text-xs text-gray-500 mt-1">Заработано</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Как это работает</p>
                {[
                  "Скопируйте вашу реферальную ссылку",
                  "Поделитесь с друзьями и знакомыми",
                  "Получайте 5% с каждого их пополнения",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400 shrink-0">{i + 1}</span>
                    <p className="text-sm text-gray-400">{step}</p>
                  </div>
                ))}
              </div>
              <Button onClick={handleCopy} className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-6 text-base">
                <Users className="mr-2 h-5 w-5" /> {copied ? "Ссылка скопирована!" : "Скопировать ссылку"}
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}