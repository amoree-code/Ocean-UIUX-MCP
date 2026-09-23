import { Badge } from "@/styles/nova/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/nova/ui/card"

export default function CardPreview() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
        <CardAction>
          <Badge variant="secondary">+12.4%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">$48,320</p>
      </CardContent>
    </Card>
  )
}
