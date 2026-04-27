import Icon from "@/components/ui/icon"

const steps = [
  {
    icon: "CreditCard",
    title: "Пополните баланс",
    desc: "Через банковскую карту или криптовалюту — быстро и безопасно",
  },
  {
    icon: "MonitorPlay",
    title: "Запустите показ рекламы",
    desc: "Наш сервис автоматически размещает рекламу и начисляет доход",
  },
  {
    icon: "TrendingUp",
    title: "Получайте до 10% дивидендов",
    desc: "Выплаты два раза в неделю — на карту или криптокошелёк",
  },
]

const stats = [
  { value: "10%", label: "Дивиденды с показов" },
  { value: "2×", label: "Выплаты в неделю" },
  { value: "24/7", label: "Работа сервиса" },
  { value: "100%", label: "Прозрачность операций" },
]

export function AboutSection() {
  return (
    <section id="about" className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <span className="inline-block rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400 mb-4">
            О компании
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Зарабатывайте на рекламе — просто и прозрачно
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            Мы — рекламный сервис нового поколения. Наши пользователи получают дивиденды с каждого показа рекламы, которую мы размещаем через платформу.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Всё просто: пополняете баланс, запускаете показы — и получаете до <span className="text-violet-400 font-semibold">10% дивидендами</span> дважды в неделю. Никаких скрытых схем, только реальный рекламный доход.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl bg-[#141414] border border-[#262626] p-6 text-center">
              <p className="text-3xl font-bold text-violet-400 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="rounded-2xl bg-[#141414] border border-[#262626] p-6 flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Icon name={step.icon} size={22} className="text-violet-400" fallback="Star" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-violet-400 bg-violet-500/10 rounded-full px-2 py-0.5">
                  Шаг {i + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
