import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"

export default function StepperPreview() {
  return (
    <Stepper defaultValue="test" className="w-full max-w-[280px] gap-4">
      <StepperList>
        <StepperItem value="build" completed>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="test">
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="deploy">
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
        </StepperItem>
      </StepperList>
      <p className="text-center text-xs text-muted-foreground">
        Step 2 of 3 — Running test suite
      </p>
    </Stepper>
  )
}
