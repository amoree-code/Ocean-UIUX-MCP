"use client"

import { useState } from "react"

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban"

const columns = [
  { id: "backlog", name: "Backlog" },
  { id: "progress", name: "In progress" },
  { id: "done", name: "Done" },
]

const initialData = [
  { id: "1", name: "Fix login redirect", column: "backlog" },
  { id: "2", name: "Design settings page", column: "progress" },
  { id: "3", name: "Ship v2.1 release", column: "done" },
]

export default function KanbanPreview() {
  const [data, setData] = useState(initialData)

  return (
    <KanbanProvider columns={columns} data={data} onDataChange={setData} className="h-48 gap-2">
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>{column.name}</KanbanHeader>
          <KanbanCards id={column.id}>
            {(item) => (
              <KanbanCard column={item.column} id={item.id} key={item.id} name={item.name} />
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  )
}
