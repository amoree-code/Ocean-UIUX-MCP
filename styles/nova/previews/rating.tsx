import { Rating, RatingButton } from "@/components/kibo-ui/rating"

export default function RatingPreview() {
  return (
    <div className="flex w-full max-w-[280px] flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span>Support response</span>
        <Rating defaultValue={4}>
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} size={18} />
          ))}
        </Rating>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>Onboarding flow</span>
        <Rating defaultValue={5}>
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} size={18} />
          ))}
        </Rating>
      </div>
    </div>
  )
}
