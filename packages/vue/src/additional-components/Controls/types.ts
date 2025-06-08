export interface ControlProps {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactive: boolean) => void;
}

export interface ControlButtonProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
}