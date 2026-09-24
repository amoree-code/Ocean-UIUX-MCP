import { FlipWords } from "@/components/ui/flip-words"

export default function FlipWordsPreview() {
  return (
    <div className="text-lg font-medium">
      Build
      <FlipWords words={["dashboards", "forms", "reports", "kanban boards"]} className="text-primary" />
    </div>
  )
}
