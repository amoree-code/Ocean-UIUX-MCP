import { Badge } from "@/styles/maia/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/maia/ui/table"

const rows = [
  { name: "Sara Ahmed", status: "Active", visits: 1240 },
  { name: "Mohammed Ali", status: "Active", visits: 980 },
  { name: "Layla Kareem", status: "Pending", visits: 512 },
  { name: "Omar Hassan", status: "Inactive", visits: 87 },
]

export default function TablePreview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Visits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>
              <Badge
                variant={row.status === "Inactive" ? "outline" : "secondary"}
              >
                {row.status}
              </Badge>
            </TableCell>
            <TableCell className="text-end">{row.visits}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
