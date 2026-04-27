import { ArrowUpRight, Plus, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

const operations = [
  { type: "in", label: "Пополнение баланса", method: "Visa •• 4321", amount: "+25 000 ₽", time: "Сегодня, 14:32", color: "text-emerald-400" },
  { type: "out", label: "Вывод дивидендов", method: "USDT TRC-20", amount: "-8 500 ₽", time: "Вчера, 09:15", color: "text-red-400" },
  { type: "in", label: "Реферальный бонус", method: "Программа лояльности", amount: "+1 200 ₽", time: "25 апр, 18:00", color: "text-emerald-400" },
  { type: "out", label: "Вывод на карту", method: "Mastercard •• 7788", amount: "-15 000 ₽", time: "24 апр, 11:45", color: "text-red-400" },
]

export function LinkAccountsCard() {
  return (
    <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#2a2a2a]">
        <Icon name="ReceiptText" size={20} className="text-gray-400" fallback="List" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white">Операции по счёту</h3>
      <p className="mb-4 text-sm text-gray-400">Полная история пополнений, выводов и реферальных начислений в реальном времени</p>

      <a href="#" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        Все операции <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>

      <div className="mt-auto space-y-2 rounded-xl bg-[#1a1a1a] border border-[#262626] p-3">
        {operations.map((op, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg bg-[#0f0f0f] px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                {op.type === "in"
                  ? <TrendingUp className="h-4 w-4 text-emerald-400" />
                  : <TrendingDown className="h-4 w-4 text-red-400" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-white">{op.label}</p>
                <p className="text-xs text-gray-500">{op.method}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${op.color}`}>{op.amount}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1 justify-end"><Clock className="h-3 w-3" />{op.time}</p>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-center text-gray-500 hover:text-white hover:bg-[#1f1f1f] mt-2"
        >
          <Plus className="mr-2 h-4 w-4" /> Загрузить ещё
        </Button>
      </div>
    </div>
  )
}
