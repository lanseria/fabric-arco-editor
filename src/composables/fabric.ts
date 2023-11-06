import { fabric } from 'fabric'

export function useFabric(options: {
  WrapRef: Ref<HTMLDivElement>
}) {
  //
  const { WrapRef } = options
  // use hooks
  const { WORKSPACE_ID, canvas, workspaceProps } = useFabricStore()
  const { width: wrapWidth, height: wrapHeight } = useElementSize(WrapRef)
  // ref
  const isLoad = ref(false)

  // methods
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
      triggerRef(canvas)
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
  function _autoSetCanvasWidthHeight(canvas: fabric.Canvas) {
    canvas.setWidth(wrapWidth.value)
    canvas.setHeight(wrapHeight.value)
  }/**
    * 无背景图片
    */
  function _initBackground(canvas: fabric.Canvas) {
    canvas.backgroundImage = ''
  }
  function _initWorkspace(canvas: fabric.Canvas) {
    const workspace = new fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width: workspaceProps.value.width,
      height: workspaceProps.value.height,
      left: (canvas.width! - workspaceProps.value.width) / 2,
      top: (canvas.height! - workspaceProps.value.height) / 2,
      id: WORKSPACE_ID,
    })
    workspace.set('selectable', false)
    workspace.set('hasControls', false)
    workspace.hoverCursor = 'default'
    canvas.add(workspace)
  }
  function _initCanvasWorkspace(canvas: fabric.Canvas) {
    _initBackground(canvas)
    _autoSetCanvasWidthHeight(canvas)
    // ADD 删除图标
    _deleteControl(canvas)
    // 初始化画布
    _initWorkspace(canvas)
  }
  /**
   * 获得缩放比例
   * @returns
   */
  function _getWorkspaceScale() {
    // 按照宽度
    if (wrapWidth.value / wrapHeight.value < workspaceProps.value.width / workspaceProps.value.height)
      return wrapWidth.value / workspaceProps.value.width
    // 按照宽度缩放
    return wrapHeight.value / workspaceProps.value.height
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
  function _setWorkspaceZoom(canvas: fabric.Canvas, scale: number) {
    _autoSetCanvasWidthHeight(canvas)
    const center = canvas.getCenter()
    canvas.setViewportTransform(fabric.iMatrix.concat())
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
    // 居中画布
    const workspace = canvas.getObjects().find(item => item.id === 'workspace')
    if (!workspace)
      return
    _setCenterFromObject(canvas, workspace)
    // 超出画布不展示
    workspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned
      canvas.requestRenderAll()
    })
  }
  function _workspaceAutoZoom(canvas: fabric.Canvas) {
    const scale = _getWorkspaceScale()
    _setWorkspaceZoom(canvas, scale - 0.1)
  }
  // hooks
  onMounted(() => {
    watchDebounced([wrapWidth, wrapHeight], () => {
      console.warn('[watchDebounced] width, height', wrapWidth.value, wrapHeight.value)
      if (wrapHeight.value && wrapWidth.value && canvas.value) {
        if (!isLoad.value) {
          _initCanvasWorkspace(canvas.value)
          _workspaceAutoZoom(canvas.value)
          isLoad.value = true
          // _addPendingElementList()
        }
        else {
          _workspaceAutoZoom(canvas.value)
        }
      }
    }, { debounce: 500, maxWait: 1000 })
  })
  return {

  }
}
