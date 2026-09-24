import { WobbleCard } from "@/components/ui/wobble-card"

export default function WobbleCardPreview() {
  return (
    <WobbleCard containerClassName="h-48 max-w-sm">
      <div className="text-white">
        <h3 className="text-lg font-semibold">Revenue this quarter</h3>
        <p className="mt-1 text-sm text-white/70">$482,300 · up 12% from Q2</p>
      </div>
    </WobbleCard>
  )
}
