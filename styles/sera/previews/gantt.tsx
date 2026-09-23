import {
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
} from "@/components/kibo-ui/gantt"

const features = [
  {
    id: "design",
    name: "Design review",
    startAt: new Date(2025, 0, 1),
    endAt: new Date(2025, 0, 10),
    status: { id: "todo", name: "To do", color: "#f59e0b" },
  },
  {
    id: "build",
    name: "Build feature",
    startAt: new Date(2025, 0, 8),
    endAt: new Date(2025, 0, 22),
    status: { id: "progress", name: "In progress", color: "#3b82f6" },
  },
]

export default function GanttPreview() {
  return (
    <div className="h-48 w-full overflow-hidden rounded-md border">
      <GanttProvider range="monthly" zoom={100} className="h-48">
        <GanttSidebar>
          <GanttSidebarGroup name="Launch">
            {features.map((feature) => (
              <GanttSidebarItem key={feature.id} feature={feature} />
            ))}
          </GanttSidebarGroup>
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            <GanttFeatureListGroup>
              <GanttFeatureRow features={features} />
            </GanttFeatureListGroup>
          </GanttFeatureList>
        </GanttTimeline>
      </GanttProvider>
    </div>
  )
}
