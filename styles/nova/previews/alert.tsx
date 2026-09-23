import { Alert, AlertDescription, AlertTitle } from "@/styles/nova/ui/alert"
import { CircleAlertIcon } from "lucide-react"

export default function AlertPreview() {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertTitle>Sync failed</AlertTitle>
      <AlertDescription>
        Could not refresh dashboard data. Try again in a moment.
      </AlertDescription>
    </Alert>
  )
}
