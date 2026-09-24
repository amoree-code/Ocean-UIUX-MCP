import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

const people = [
  {
    id: 1,
    name: "Amira K.",
    designation: "Product Designer",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Omar S.",
    designation: "Frontend Engineer",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Layla H.",
    designation: "Data Analyst",
    image: "https://i.pravatar.cc/150?img=32",
  },
]

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  )
}
