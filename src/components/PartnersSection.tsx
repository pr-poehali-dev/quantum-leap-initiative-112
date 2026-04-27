import Icon from "@/components/ui/icon"

const features = [
  { name: "О компании", icon: "Building2" },
  { name: "Операции по счёту", icon: "ReceiptText" },
  { name: "Мой баланс", icon: "Wallet" },
  { name: "Рефералы", icon: "Users" },
  { name: "Пополнение", icon: "CreditCard" },
  { name: "Вывод дивидендов", icon: "ArrowDownToLine" },
  { name: "Криптовалюта", icon: "Bitcoin" },
]

export function PartnersSection() {
  return (
    <section className="flex flex-wrap items-center justify-center gap-6 md:gap-10 px-4 py-8">
      {features.map((item) => (
        <div key={item.name} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors cursor-default">
          <Icon name={item.icon} size={16} fallback="Circle" />
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      ))}
    </section>
  )
}