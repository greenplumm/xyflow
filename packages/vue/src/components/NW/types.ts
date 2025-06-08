export interface NodeWrapperProps {
  nodeId: string
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  resizable?: boolean
  onResizeStart?: (event: MouseEvent) => void
  onResize?: (width: number, height: number) => void
  onResizeEnd?: (event: MouseEvent) => void
  children?: any
}