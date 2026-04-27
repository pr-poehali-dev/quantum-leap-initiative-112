import { ArrowUpRight, Users, Copy, CheckCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const referrals = [
  { name: "Игорь М.", earned: "+3 200 ₽", status: "Активен", initials: "ИМ", color: "bg-violet-600" },
  { name: "Светлана К.", earned: "+1 800 ₽", status: "Активен", initials: "СК", color: "bg-teal-600" },
  { name: "Андрей В.", earned: "+950 ₽", status: "Ожидание", initials: "АВ", color: "bg-amber-600" },
]

export function PaymentRolesCard() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#2a2a2a]">
        <Users className="h-5 w-5 text-gray-400" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white">Реферальная программа</h3>
      <p className="mb-4 text-sm text-gray-400">Приглашайте друзей и получайте процент с каждого их пополнения на счёт</p>

      <a href="#" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        Подробнее <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>

      <div className="mt-auto space-y-4 rounded-xl bg-[#1a1a1a] border border-[#262626] p-4">
        <div>
          <p className="text-xs text-gray-400 mb-2">Ваша реферальная ссылка</p>
          <div className="flex items-center justify-between rounded-lg bg-[#0f0f0f] border border-[#262626] px-3 py-2.5">
            <span className="text-sm text-gray-300 truncate">finpotok.ru/ref/USER-7742</span>
            <button onClick={handleCopy} className="ml-2 text-violet-400 hover:text-violet-300 shrink-0">
              {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 bg-[#0f0f0f] rounded-lg px-3 py-2 border border-[#262626]">
          <span>Всего рефералов</span>
          <span className="text-white font-semibold">3 чел.</span>
          <span>Заработано</span>
          <span className="text-emerald-400 font-semibold">+5 950 ₽</span>
        </div>

        <div className="space-y-2">
          {referrals.map((ref, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className={`${ref.color} text-white text-xs`}>{ref.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-white">{ref.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${ref.status === "Активен" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {ref.status}
                </span>
                <span className="text-sm text-emerald-400 font-medium">{ref.earned}</span>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">Пригласить друга</Button>
      </div>
    </div>
  )
}
