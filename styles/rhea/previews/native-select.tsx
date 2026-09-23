import { NativeSelect, NativeSelectOption } from "@/styles/rhea/ui/native-select"

export default function NativeSelectPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <NativeSelect defaultValue="7d">
        <NativeSelectOption value="24h">Last 24 hours</NativeSelectOption>
        <NativeSelectOption value="7d">Last 7 days</NativeSelectOption>
        <NativeSelectOption value="30d">Last 30 days</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
