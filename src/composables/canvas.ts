import { fabric } from 'fabric'
import { Message } from '@arco-design/web-vue'
import type { CanvasElementObjectProps, CanvasForm, CanvasObjects } from './types'

// methods
function _existCanvas() {
  if (!storeCanvas.value)
    Message.warning('没有找到画布')

  return storeCanvas.value
}
function _existWorkspace() {
  const canvas = _existCanvas()
  if (canvas) {
    const workspace = canvas.getObjects().find(item => item.id === WORKSPACE_ID)
    if (workspace)
      return { workspace, canvas }
  }
  Message.warning('没有找到工作区')
}
function _drawImg(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined,
) {
  if (angle === undefined)
    return
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(angle))
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize)
  ctx.restore()
}

// 删除
function _deleteControl(delCanvas: fabric.Canvas) {
  const deleteIcon
    = 'data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'utf-8\'%3F%3E%3C!DOCTYPE svg PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'%3E%3Csvg version=\'1.1\' id=\'Ebene_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' width=\'595.275px\' height=\'595.275px\' viewBox=\'200 215 230 470\' xml:space=\'preserve\'%3E%3Ccircle style=\'fill:%23F44336;\' cx=\'299.76\' cy=\'439.067\' r=\'218.516\'/%3E%3Cg%3E%3Crect x=\'267.162\' y=\'307.978\' transform=\'matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)\' style=\'fill:white;\' width=\'65.545\' height=\'262.18\'/%3E%3Crect x=\'266.988\' y=\'308.153\' transform=\'matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)\' style=\'fill:white;\' width=\'65.544\' height=\'262.179\'/%3E%3C/g%3E%3C/svg%3E'
  const delImg = document.createElement('img')
  delImg.src = deleteIcon

  function renderDelIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object,
  ) {
    _drawImg(ctx, left, top, delImg, 24, 24, fabricObject.angle)
  }

  // 删除选中元素
  function deleteObject(mouseEvent: MouseEvent, target: fabric.Transform) {
    if (target.action === 'rotate')
      return true
    const activeObject = delCanvas.getActiveObjects()
    if (activeObject) {
      activeObject.map(item => delCanvas.remove(item))
      delCanvas.requestRenderAll()
      delCanvas.discardActiveObject()
    }
    triggerRef(storeCanvas)
    return true
  }

  // 删除图标
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderDelIcon,
    // cornerSize: 24,
  })
}
/**
 * 置画布canvas动态大小
 */
function _autoSetCanvasWidthHeight(canvas: fabric.Canvas, wrapWidth: number, wrapHeight: number) {
  canvas.setWidth(wrapWidth)
  canvas.setHeight(wrapHeight)
}
/**
 * 无背景图片
 * @param canvas
 */
function _initBackground(canvas: fabric.Canvas) {
  canvas.backgroundImage = ''
}
/**
 * 在canvas中创建workspace白色矩形
 * @param canvas
 */
function _initWorkspace(canvas: fabric.Canvas) {
  const workspace = new fabric.Rect({
    fill: 'rgba(255,255,255,1)',
    width: storeCanvasProps.value.width,
    height: storeCanvasProps.value.height,
    left: (canvas.width! - storeCanvasProps.value.width) / 2,
    top: (canvas.height! - storeCanvasProps.value.height) / 2,
    id: WORKSPACE_ID,
  })
  workspace.set('selectable', false)
  workspace.set('hasControls', false)
  workspace.hoverCursor = 'default'
  canvas.add(workspace)
}
function _setWorkspaceSize(workspace: fabric.Object) {
  workspace.set('width', storeCanvasProps.value.width)
  workspace.set('height', storeCanvasProps.value.height)
}
/**
 * 获得缩放比例
 * @returns
 */
function _getWorkspaceScale(wrapWidth: number, wrapHeight: number) {
  // 按照宽度
  if (wrapWidth / wrapHeight < storeCanvasProps.value.width / storeCanvasProps.value.height)
    return wrapWidth / storeCanvasProps.value.width
    // 按照宽度缩放
  return wrapHeight / storeCanvasProps.value.height
}

/**
 * 设置画布中心到指定对象中心点上
 * @param {object} obj 指定的对象
 */
function _setCenterFromObject(canvas: fabric.Canvas, obj: fabric.Rect) {
  const objCenter = obj.getCenterPoint()
  const viewportTransform = canvas.viewportTransform
  if (canvas.width === undefined || canvas.height === undefined || !viewportTransform)
    return
  viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
  viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]
  canvas.setViewportTransform(viewportTransform)
  canvas.renderAll()
}
/**
 * 设置缩放
 * @param scale 缩放比例
 * @returns
 */
function _setWorkspaceZoom(canvas: fabric.Canvas, scale: number, wrapWidth: number, wrapHeight: number) {
  _autoSetCanvasWidthHeight(canvas, wrapWidth, wrapHeight)
  const center = canvas.getCenter()
  canvas.setViewportTransform(fabric.iMatrix.concat())
  canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
  // 居中画布
  const workspace = canvas.getObjects().find(item => item.id === WORKSPACE_ID)
  if (!workspace)
    return
  _setWorkspaceSize(workspace)
  _setCenterFromObject(canvas, workspace)
  // 超出画布不展示
  workspace.clone((cloned: fabric.Rect) => {
    canvas.clipPath = cloned
    canvas.requestRenderAll()
  })
}

export function canvasSetBackgroundByUrl(url: string): Promise<fabric.Image> {
  console.warn('[canvas.ts]:', 'canvasSetBackgroundByUrl')
  return new Promise((resolve, reject) => {
    url && fabric.Image.fromURL(url, (imgInstance) => {
      const res = _existWorkspace()
      if (res) {
        const { canvas, workspace } = res
        // 填充背景
        // 计算矩形和图片的宽高比
        const rectAspectRatio = workspace.width! / workspace.height!
        const imgAspectRatio = imgInstance.width! / imgInstance.height!

        // 根据宽高比调整图片尺寸和位置
        if (imgAspectRatio > rectAspectRatio) {
        // 图片的宽高比较大，以矩形的高度为基准进行缩放
          imgInstance.scaleToHeight(workspace.height!)
        }
        else {
        // 图片的宽高比较小，以矩形的宽度为基准进行缩放
          imgInstance.scaleToWidth(workspace.width!)
        }

        imgInstance.set({
          id: BACKGROUND_ID,
          name: '背景图片',
          left: workspace.left,
          top: workspace.top,
        })
        // 移除之前的背景图片
        if (storeCanvasBackgroundImage.value)
          canvas.remove(storeCanvasBackgroundImage.value)

        canvas.add(imgInstance)
        // 先放置在最底层
        canvas.sendToBack(imgInstance)
        // 再向上移动一层
        canvas.bringForward(imgInstance, false)
        // 更新背景图片变量
        storeCanvasBackgroundImage.value = imgInstance
        canvas.renderAll()
        resolve(imgInstance)
      }
      reject(new Error('没有找到工作区'))
    })
  })
}

/**
 * 初始化画布
 * @param canvas
 */
export function canvasInitWorkspace(canvas: fabric.Canvas, wrapWidth: number, wrapHeight: number) {
  console.warn('[canvas.ts]:', 'canvasInitWorkspace')
  _initBackground(canvas)
  _autoSetCanvasWidthHeight(canvas, wrapWidth, wrapHeight)
  // 添加删除图标
  _deleteControl(canvas)
  // 初始化画布
  _initWorkspace(canvas)
}
/**
 * 画布自动缩放
 * @param canvas
 */
export function canvasWorkspaceAutoZoom(canvas: fabric.Canvas, wrapWidth: number, wrapHeight: number) {
  console.warn('[canvas.ts]:', 'canvasWorkspaceAutoZoom')
  const scale = _getWorkspaceScale(wrapWidth, wrapHeight)
  _setWorkspaceZoom(canvas, scale - 0.1, wrapWidth, wrapHeight)
}
/**
 * 往画布上添加元素
 * @param record
 * @returns
 */
export function canvasAddElement(record: CanvasObjects) {
  const res = _existWorkspace()
  if (res) {
    const { canvas, workspace } = res
    if (record.type === 'text') {
      const text = new fabric.Text(record.value, {
        id: record.id,
        name: record.value,
        left: workspace.left! + (record.left ?? workspace.width! / 2), // left
        top: workspace.top! + (record.top ?? workspace.height! / 2), // bottom
        scaleX: record.scaleX ?? 1,
        scaleY: record.scaleY ?? 1,
        ...DEFAULT_TEXT_OPTIONS,
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
      triggerRef(storeCanvas)
    }
    if (record.type === 'image' && record.id === 'QR_CODE') {
      storeImageLoading.value = true
      fabric.Image.fromURL(QR_CODE_IMAGE_URL, (imgInstance) => {
        canvas.add(imgInstance.set({
          left: workspace.left! + (record.left ?? workspace.width! / 2), // left
          top: workspace.top! + (record.top ?? workspace.height! / 2), // bottom
          scaleX: record.scaleX ?? 1,
          scaleY: record.scaleY ?? 1,
          id: record.id,
          name: record.value,
          ...DEFAULT_IMAGE_OPTIONS,
        }))
        canvas.setActiveObject(imgInstance)
        canvas.renderAll()
        storeImageLoading.value = false
        triggerRef(storeCanvas)
      })
    }
  }
}
/**
 * 将当前画布中的工作区转为图片链接
 * @returns
 */
export function canvasToImageUrl() {
  const res = _existWorkspace()
  if (res) {
    const { canvas, workspace } = res
    const { width, height, left, top } = workspace
    const options = {
      ...PREVIEW_URL_OPTIONS,
      width,
      height,
      left,
      top,
    }
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    canvas.renderAll()
    const url = canvas.toDataURL(options)
    storeCanvasStatus.value = 'zooming'
    return url
  }
}

export function canvasSpliceElementListAndBackground(): CanvasForm | undefined {
  const res = _existWorkspace()
  if (res) {
    const { canvas, workspace } = res
    const workspaceLeft = workspace.left!
    const workspaceTop = workspace.top!
    const elementList: CanvasElementObjectProps[] = []

    canvas.getObjects().forEach((item) => {
      if (item.id !== WORKSPACE_ID && item.id !== BACKGROUND_ID) {
        item.visible = false
        elementList.push({
          id: item.id!,
          value: item.name!,
          left: item.left! - workspaceLeft,
          top: item.top! - workspaceTop,
          scaleX: item.scaleX!,
          scaleY: item.scaleY!,
          type: item.type!,
        })
      }
    })
    console.warn('[canvasSpliceElementListAndBackground]:', elementList)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    canvas.renderAll()
    const backgroundImageBase64 = canvasToImageUrl() ?? ''
    //
    canvas.getObjects().forEach((item) => {
      if (item.id !== WORKSPACE_ID && item.id !== BACKGROUND_ID)
        item.visible = true
    })
    storeCanvasStatus.value = 'zooming'
    return {
      elementList,
      backgroundImageBase64,
      width: storeCanvasProps.value.width!,
      height: storeCanvasProps.value.height!,
    }
  }
}
