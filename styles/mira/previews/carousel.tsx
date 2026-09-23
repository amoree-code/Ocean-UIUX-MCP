import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/styles/mira/ui/carousel"

const slides = ["Traffic", "Revenue", "Signups"]

export default function CarouselPreview() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {slides.map((label) => (
          <CarouselItem key={label}>
            <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
              {label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
