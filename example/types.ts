export interface IPoint {
  x: number
  y: number
}

export interface IPointer extends IPoint {
  dx: number
  dy: number
}

export interface ISize {
  width: number
  height: number
}

export interface IBrush {
  x0: number
  y0: number
  x1: number
  y1: number
}

export interface IFrame extends IPoint, ISize {}

export interface IBounds extends IPoint, ISize {
  maxX: number
  maxY: number
}

export interface IBox extends IFrame {
  id: string
  label: string
  color: string
  z: number
}

export interface IBoxSnapshot extends IFrame {
  id: string
  nx: number
  ny: number
  nmx: number
  nmy: number
  nw: number
  nh: number
}

export enum IArrowType {
  BoxToBox = "box-to-box",
  BoxToPoint = "box-to-point",
  PointToBox = "point-to-box",
  PointToPoint = "point-to-point",
}

export interface IArrowBase {
  type: IArrowType
  id: string
  flip: boolean
  label: string
  from: string | IPoint
  to: string | IPoint
}

export interface BoxToBox extends IArrowBase {
  type: IArrowType.BoxToBox
  from: string
  to: string
}

export interface BoxToPoint extends IArrowBase {
  type: IArrowType.BoxToPoint
  from: string
  to: IPoint
}

export interface PointToBox extends IArrowBase {
  type: IArrowType.PointToBox
  from: IPoint
  to: string
}

export interface PointToPoint extends IArrowBase {
  type: IArrowType.PointToPoint
  from: IPoint
  to: IPoint
}

export type IArrow = BoxToBox | BoxToPoint | PointToBox | PointToPoint
