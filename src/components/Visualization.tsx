import React from 'react'
import Tree from 'react-d3-tree'
import { SegmentTree } from '../utils/SegmentTree'
import './Visualization.css'

interface SegmentTreeVisualizationProps {
  segmentTree: SegmentTree
  queryRange: { start: number; end: number } | null
  highlightPath: boolean
}

const SegmentTreeVisualization: React.FC<SegmentTreeVisualizationProps> = ({
  segmentTree,
  queryRange,
  highlightPath
}) => {
  const treeData = segmentTree.getTreeVisualization()

  // Получаем все узлы на пути запроса и узлы, которые используются для вычисления суммы
  const allPathNodes = highlightPath && queryRange
    ? segmentTree.getQueryPath(queryRange.start, queryRange.end)
    : []

  const usedNodes = highlightPath && queryRange
    ? segmentTree.getUsedNodesInQuery(queryRange.start, queryRange.end)
    : []

  // Функция для определения класса для пути (стрелки между узлами)
  const pathClassFunc = (linkData: any) => {
    if (highlightPath && allPathNodes.includes(linkData.source.data.attributes.nodeId) &&
      allPathNodes.includes(linkData.target.data.attributes.nodeId)) {
      return 'link-highlighted'
    }
    return 'link-default'
  };

  // Функция для кастомного рендеринга узла
  const renderCustomNodeElement = ({ nodeDatum }: any) => {
    const nodeId = nodeDatum.attributes.nodeId
    const isPathNode = highlightPath && allPathNodes.includes(nodeId)
    const isUsedNode = highlightPath && usedNodes.includes(nodeId)

    let fillColor = "#8ec5ff"

    if (isUsedNode) {
      fillColor = "#7bf1a8"
    }
    else if (isPathNode) {
      fillColor = "#ffa2a2"
    }

    return (
      <g>
        <circle
          r={isUsedNode ? 25 : 20}
          fill={fillColor}
          className={isPathNode ? "node-highlighted" : ""}
        />

        <text fill="white" strokeWidth="1" x="0" y="0" textAnchor="middle" dominantBaseline="middle">
          {nodeDatum.attributes.value}
        </text>

        <text fill="black" x="0" y="35" textAnchor="middle" dominantBaseline="middle">
          {nodeDatum.attributes.range}
        </text>
      </g>
    )
  }

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 250, y: 50 }}
        collapsible={false}
        nodeSize={{ x: 200, y: 100 }}
        separation={{ siblings: 1, nonSiblings: 2 }}
        pathClassFunc={pathClassFunc}
        renderCustomNodeElement={renderCustomNodeElement}
      />
    </div>
  )
}

export default SegmentTreeVisualization
