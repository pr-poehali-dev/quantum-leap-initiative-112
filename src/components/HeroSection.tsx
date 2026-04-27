import { useState } from "react"
import { ArrowUpRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterModal } from "@/components/RegisterModal"

export function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] py-2 text-sm px-2">
          <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">НОВИНКА</span>
          <span className="text-gray-300">Пополнение через карту и криптовалюту</span>
          <ArrowUpRight className="h-4 w-4 text-gray-400" />
        </div>

        <h1 className="mb-4 max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
          Управляйте финансами и получайте дивиденды
        </h1>

        <p className="mb-8 max-w-xl text-gray-400">Баланс, операции, реферальная программа и вывод средств на карту или криптокошелёк — всё в одном месте.</p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-violet-600 px-8 py-6 text-base hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
          >
            Начать зарабатывать <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" className="rounded-full border-gray-700 bg-transparent text-white hover:bg-gray-800">
            <Play className="mr-2 h-4 w-4 fill-violet-500 text-violet-500" /> Как это работает
          </Button>
        </div>
      </section>

      <RegisterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
