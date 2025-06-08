export interface MiniMapProps {
  nodeColor?: string
  maskColor?: string
  nodeStrokeColor?: string
  nodeBorderRadius?: number
  nodeClassName?: string
  nodeStrokeWidth?: number
}

export interface MiniMapNodeProps {
  x: number
  y: number
  width: number
  height: number
  borderRadius: number
  className: string
  color: string
  shapeRendering: string
  strokeColor: string
  strokeWidth: number
}