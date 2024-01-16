export interface CanvasObjects {
  id: string
  type?: string
  left?: number
  top?: number
  value: string
  scaleX?: number
  scaleY?: number
}

export interface CanvasElementProps {
  disabled: boolean
  value: string
  id: string
  type: string
}

export interface CanvasElementObjectProps {
  value: string
  id: string
  left: number
  top: number
  scaleX: number
  scaleY: number
  type: string
}

export interface CanvasForm {
  width: number
  height: number
  backgroundImageBase64: string
  elementList: CanvasElementObjectProps[]
}
