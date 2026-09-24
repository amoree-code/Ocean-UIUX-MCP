import { TypingText, TypingTextCursor } from "@/components/animate-ui/primitives/texts/typing"

export default function TypingTextPreview() {
  return (
    <TypingText
      text={["Search 79 components…", "Install with one call.", "Ship it in Arabic too."]}
      loop
      className="text-lg font-medium"
    >
      <TypingTextCursor />
    </TypingText>
  )
}
