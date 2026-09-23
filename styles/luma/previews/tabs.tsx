import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/luma/ui/tabs"

export default function TabsPreview() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <div className="rounded-lg border p-3 text-sm text-muted-foreground">
        <TabsContent value="overview">
          Key metrics and performance indicators.
        </TabsContent>
        <TabsContent value="analytics">
          Detailed analytics and user insights.
        </TabsContent>
        <TabsContent value="reports">Generate and view reports.</TabsContent>
      </div>
    </Tabs>
  )
}
