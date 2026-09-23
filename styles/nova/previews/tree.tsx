import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree"

export default function TreePreview() {
  return (
    <TreeProvider defaultExpandedIds={["components"]} className="w-full max-w-[280px]">
      <TreeView>
        <TreeNode nodeId="components" level={0}>
          <TreeNodeTrigger>
            <TreeExpander hasChildren />
            <TreeIcon hasChildren />
            <TreeLabel>components</TreeLabel>
          </TreeNodeTrigger>
          <TreeNodeContent hasChildren>
            <TreeNode nodeId="button" level={1} isLast={false}>
              <TreeNodeTrigger>
                <TreeExpander />
                <TreeIcon />
                <TreeLabel>button.tsx</TreeLabel>
              </TreeNodeTrigger>
            </TreeNode>
            <TreeNode nodeId="card" level={1} isLast>
              <TreeNodeTrigger>
                <TreeExpander />
                <TreeIcon />
                <TreeLabel>card.tsx</TreeLabel>
              </TreeNodeTrigger>
            </TreeNode>
          </TreeNodeContent>
        </TreeNode>
      </TreeView>
    </TreeProvider>
  )
}
