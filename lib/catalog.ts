export type CatalogEntry = {
  slug: string
  title: string
  category: string
  /** registry item this demo exercises; null for multi-component overviews */
  ui: string | null
}

export const catalog: CatalogEntry[] = [
  { slug: "demo", title: "Kitchen Sink", category: "Overview", ui: null },
  { slug: "component-example", title: "Components Overview", category: "Overview", ui: null },
  { slug: "button", title: "Button", category: "Forms & Inputs", ui: "button" },
  { slug: "button-group", title: "Button Group", category: "Forms & Inputs", ui: "button-group" },
  { slug: "checkbox", title: "Checkbox", category: "Forms & Inputs", ui: "checkbox" },
  { slug: "combobox", title: "Combobox", category: "Forms & Inputs", ui: "combobox" },
  { slug: "field", title: "Field", category: "Forms & Inputs", ui: "field" },
  { slug: "input", title: "Input", category: "Forms & Inputs", ui: "input" },
  { slug: "input-group", title: "Input Group", category: "Forms & Inputs", ui: "input-group" },
  { slug: "input-otp", title: "Input Otp", category: "Forms & Inputs", ui: "input-otp" },
  { slug: "label", title: "Label", category: "Forms & Inputs", ui: "label" },
  { slug: "native-select", title: "Native Select", category: "Forms & Inputs", ui: "native-select" },
  { slug: "radio-group", title: "Radio Group", category: "Forms & Inputs", ui: "radio-group" },
  { slug: "select", title: "Select", category: "Forms & Inputs", ui: "select" },
  { slug: "slider", title: "Slider", category: "Forms & Inputs", ui: "slider" },
  { slug: "switch", title: "Switch", category: "Forms & Inputs", ui: "switch" },
  { slug: "textarea", title: "Textarea", category: "Forms & Inputs", ui: "textarea" },
  { slug: "toggle", title: "Toggle", category: "Forms & Inputs", ui: "toggle" },
  { slug: "toggle-group", title: "Toggle Group", category: "Forms & Inputs", ui: "toggle-group" },
  { slug: "calendar", title: "Calendar", category: "Forms & Inputs", ui: "calendar" },
  { slug: "questionnaire", title: "Questionnaire", category: "Forms & Inputs", ui: "questionnaire" },
  { slug: "attachment", title: "Attachment", category: "Forms & Inputs", ui: "attachment" },
  { slug: "alert-dialog", title: "Alert Dialog", category: "Overlays", ui: "alert-dialog" },
  { slug: "context-menu", title: "Context Menu", category: "Overlays", ui: "context-menu" },
  { slug: "dialog", title: "Dialog", category: "Overlays", ui: "dialog" },
  { slug: "drawer", title: "Drawer", category: "Overlays", ui: "drawer" },
  { slug: "dropdown-menu", title: "Dropdown Menu", category: "Overlays", ui: "dropdown-menu" },
  { slug: "hover-card", title: "Hover Card", category: "Overlays", ui: "hover-card" },
  { slug: "menubar", title: "Menubar", category: "Overlays", ui: "menubar" },
  { slug: "popover", title: "Popover", category: "Overlays", ui: "popover" },
  { slug: "sheet", title: "Sheet", category: "Overlays", ui: "sheet" },
  { slug: "tooltip", title: "Tooltip", category: "Overlays", ui: "tooltip" },
  { slug: "command", title: "Command", category: "Overlays", ui: "command" },
  { slug: "sonner", title: "Sonner", category: "Overlays", ui: "sonner" },
  { slug: "breadcrumb", title: "Breadcrumb", category: "Navigation", ui: "breadcrumb" },
  { slug: "navigation-menu", title: "Navigation Menu", category: "Navigation", ui: "navigation-menu" },
  { slug: "pagination", title: "Pagination", category: "Navigation", ui: "pagination" },
  { slug: "tabs", title: "Tabs", category: "Navigation", ui: "tabs" },
  { slug: "sidebar", title: "Sidebar", category: "Navigation", ui: "sidebar" },
  { slug: "sidebar-icon", title: "Sidebar Icon", category: "Navigation", ui: "sidebar" },
  { slug: "sidebar-inset", title: "Sidebar Inset", category: "Navigation", ui: "sidebar" },
  { slug: "sidebar-floating", title: "Sidebar Floating", category: "Navigation", ui: "sidebar" },
  { slug: "accordion", title: "Accordion", category: "Data Display", ui: "accordion" },
  { slug: "avatar", title: "Avatar", category: "Data Display", ui: "avatar" },
  { slug: "badge", title: "Badge", category: "Data Display", ui: "badge" },
  { slug: "card", title: "Card", category: "Data Display", ui: "card" },
  { slug: "carousel", title: "Carousel", category: "Data Display", ui: "carousel" },
  { slug: "chart", title: "Chart", category: "Data Display", ui: "chart" },
  { slug: "collapsible", title: "Collapsible", category: "Data Display", ui: "collapsible" },
  { slug: "empty", title: "Empty", category: "Data Display", ui: "empty" },
  { slug: "item", title: "Item", category: "Data Display", ui: "item" },
  { slug: "kbd", title: "Kbd", category: "Data Display", ui: "kbd" },
  { slug: "table", title: "Table", category: "Data Display", ui: "table" },
  { slug: "marker", title: "Marker", category: "Data Display", ui: "marker" },
  { slug: "bubble", title: "Bubble", category: "Data Display", ui: "bubble" },
  { slug: "aspect-ratio", title: "Aspect Ratio", category: "Data Display", ui: "aspect-ratio" },
  { slug: "scroll-area", title: "Scroll Area", category: "Data Display", ui: "scroll-area" },
  { slug: "resizable", title: "Resizable", category: "Data Display", ui: "resizable" },
  { slug: "separator", title: "Separator", category: "Data Display", ui: "separator" },
  { slug: "alert", title: "Alert", category: "Feedback", ui: "alert" },
  { slug: "progress", title: "Progress", category: "Feedback", ui: "progress" },
  { slug: "skeleton", title: "Skeleton", category: "Feedback", ui: "skeleton" },
  { slug: "spinner", title: "Spinner", category: "Feedback", ui: "spinner" },
]

export const categories = [...new Set(catalog.map((e) => e.category))]

export function findEntry(slug: string) {
  return catalog.find((e) => e.slug === slug)
}
