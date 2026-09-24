import { HighlightText } from "@/components/animate-ui/primitives/texts/highlight"

export default function HighlightTextPreview() {
  return (
    <p className="text-lg">
      Ships with{" "}
      <HighlightText
        text="RTL built in"
        style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.5), hsl(var(--primary)/0.5))" }}
      />
      , not bolted on.
    </p>
  )
}
