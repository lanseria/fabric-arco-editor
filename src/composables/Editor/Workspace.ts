import { fabric } from 'fabric'

export function useFabricWorkspace(options: {
  WorkspaceRef: Ref<HTMLDivElement>
}) {
  const { WorkspaceRef } = options
  const { width, height } = useElementSize(WorkspaceRef)
  const isLoad = ref(false)
  function _autoSetCanvasWidthHeight() {
    const { canvas } = window
    if (canvas) {
      // 设置画布canvas动态大小
      canvas.setWidth(width.value)
      canvas.setHeight(height.value)
    }
  }
  /**
   * 设置画布中心到指定对象中心点上
   * @param {object} obj 指定的对象
   */
  function _setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = window
    if (canvas) {
      const objCenter = obj.getCenterPoint()
      const viewportTransform = canvas.viewportTransform
      if (canvas.width === undefined || canvas.height === undefined || !viewportTransform)
        return
      viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
      viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]
      canvas.setViewportTransform(viewportTransform)
      canvas.renderAll()
    }
  }
  /**
   * 获得缩放比例
   * @returns
   */
  function _getScale() {
    const viewPortWidth = width.value
    const viewPortHeight = height.value
    // 按照宽度
    if (viewPortWidth / viewPortHeight < storeWorkspacePropsForm.value.width / storeWorkspacePropsForm.value.height)
      return viewPortWidth / storeWorkspacePropsForm.value.width
    // 按照宽度缩放
    return viewPortHeight / storeWorkspacePropsForm.value.height
  }
  /**
   * 设置缩放
   * @param scale 缩放比例
   * @returns
   */
  function _setScale(scale: number) {
    if (window.canvas) {
      const { canvas } = window
      _autoSetCanvasWidthHeight()
      const center = canvas.getCenter()
      canvas.setViewportTransform(fabric.iMatrix.concat())
      canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
      // 居中画布
      const workspace = canvas.getObjects().find(item => item.id === 'workspace')
      if (!workspace)
        return
      _setCenterFromObject(workspace)
      // 超出画布不展示
      workspace.clone((cloned: fabric.Rect) => {
        canvas.clipPath = cloned
        canvas.requestRenderAll()
      })
    }
  }
  /**
   * 自动缩放
   */
  function _autoScale() {
    const scale = _getScale()
    _setScale(scale - 0.1)
  }
  function _initBackground(canvas: fabric.Canvas) {
    canvas.backgroundImage = ''
    _autoSetCanvasWidthHeight()
  }
  function _initWorkspace(canvas: fabric.Canvas) {
    _initBackground(canvas)
    const workspace = new fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width: storeWorkspacePropsForm.value.width,
      height: storeWorkspacePropsForm.value.height,
      left: (canvas.width! - storeWorkspacePropsForm.value.width) / 2,
      top: (canvas.height! - storeWorkspacePropsForm.value.height) / 2,
      id: 'workspace',
    })
    workspace.set('selectable', false)
    workspace.set('hasControls', false)
    workspace.hoverCursor = 'default'
    canvas.add(workspace)
  }
  function _setWorkspaceSize(canvas: fabric.Canvas) {
    const workspace = canvas.getObjects().find(item => item.id === 'workspace')
    if (!workspace)
      return
    workspace.set({ width: storeWorkspacePropsForm.value.width, height: storeWorkspacePropsForm.value.height })
    _autoScale()
  }
  onMounted(() => {
    watchDebounced([storeWorkspacePropsForm.value], () => {
      console.warn('watchDebounced', storeWorkspacePropsForm.value)
      if (width.value && height.value && window.canvas) {
        console.warn('resize workspace')
        _setWorkspaceSize(window.canvas)
      }
    }, { debounce: 500, maxWait: 1000 })

    watchDebounced([width, height], () => {
      console.warn('watchDebounced', width.value, height.value)
      if (height.value && width.value && window.canvas) {
        if (!isLoad.value) {
          _initBackground(window.canvas)
          _initWorkspace(window.canvas)
          _autoScale()
          isLoad.value = true
        }
        else {
          _autoScale()
        }
      }
    }, { debounce: 500, maxWait: 1000 })
  })
  return {
  }
}
