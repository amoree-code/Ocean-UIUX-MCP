import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "@/components/kibo-ui/color-picker"

export default function ColorPickerPreview() {
  return (
    <ColorPicker defaultValue="#7c3aed" className="w-full max-w-[240px] gap-3">
      <ColorPickerSelection className="h-24 rounded-md" />
      <ColorPickerHue />
      <div className="flex items-center gap-2">
        <ColorPickerEyeDropper />
        <ColorPickerFormat />
      </div>
    </ColorPicker>
  )
}
