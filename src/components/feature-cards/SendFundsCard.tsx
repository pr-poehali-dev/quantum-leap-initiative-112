import { ArrowUpRight, Wallet, CreditCard, ArrowDownToLine } from "lucide-react"
import { useState } from "react"
import Icon from "@/components/ui/icon"

export function SendFundsCard() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit")
  const [method, setMethod] = useState<"card" | "crypto">("card")

  return (
    <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#2a2a2a]">
        <Wallet className="h-5 w-5 text-gray-400" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white">Баланс и переводы</h3>
      <p className="mb-4 text-sm text-gray-400">Пополняйте через карту или крипту, выводите дивиденды удобным способом</p>

      <a href="#" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        Подробнее <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>

      <div className="mt-auto space-y-4 rounded-xl bg-[#1a1a1a] border border-[#262626] p-4">
        <div className="flex items-center justify-between rounded-lg bg-[#0f0f0f] border border-[#262626] px-4 py-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Доступный баланс</p>
            <p className="text-xl font-bold text-white">128 450 ₽</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Дивиденды</p>
            <p className="text-sm font-semibold text-emerald-400">+12 300 ₽</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "deposit" ? "bg-violet-600 text-white" : "bg-[#0f0f0f] text-gray-400 hover:text-white border border-[#262626]"}`}
          >
            <CreditCard className="h-4 w-4" /> Пополнить
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "withdraw" ? "bg-violet-600 text-white" : "bg-[#0f0f0f] text-gray-400 hover:text-white border border-[#262626]"}`}
          >
            <ArrowDownToLine className="h-4 w-4" /> Вывести
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMethod("card")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors border ${method === "card" ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-[#262626] text-gray-500 hover:text-white bg-[#0f0f0f]"}`}
          >
            <Icon name="CreditCard" size={14} fallback="CreditCard" /> Банковская карта
          </button>
          <button
            onClick={() => setMethod("crypto")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors border ${method === "crypto" ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-[#262626] text-gray-500 hover:text-white bg-[#0f0f0f]"}`}
          >
            <Icon name="Bitcoin" size={14} fallback="Coins" /> Криптовалюта
          </button>
        </div>

        <div className="flex items-center rounded-lg bg-[#0f0f0f] border border-[#262626] px-3 py-2.5">
          <span className="text-gray-500 mr-2 text-sm">₽</span>
          <input
            type="text"
            placeholder="Введите сумму..."
            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
          />
        </div>

        <button className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 text-white py-2.5 text-sm font-medium transition-colors">
          {activeTab === "deposit" ? "Пополнить баланс" : "Вывести средства"}
        </button>
      </div>
    </div>
  )
}
