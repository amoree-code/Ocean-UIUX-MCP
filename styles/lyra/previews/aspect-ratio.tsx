import { AspectRatio } from "@/styles/lyra/ui/aspect-ratio"

export default function AspectRatioPreview() {
  return (
    <div className="w-full max-w-xs">
      <AspectRatio ratio={16 / 9}>
        <div className="size-full rounded-lg bg-gradient-to-br from-primary/70 to-primary/20" />
      </AspectRatio>
    </div>
  )
}
