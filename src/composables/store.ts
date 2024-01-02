import type { IDataURLOptions } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import { cloneDeep } from 'lodash-es'

interface CanvasObjects {
  id: string
  type: string
  left: number
  top: number
  value: string
}
export const useFabricStore = createGlobalState(() => {
  // mock data
  const mockData = {
    width: 1200,
    height: 876,
    backgroundImageBase64: imageBase64,
  }
  // constants
  const PREVIEW_URL_OPTIONS = {
    format: 'png',
    quality: 0.8,
    multiplier: 1,
  }
  const FABRIC_WIDTH = 1200
  const FABRIC_HEIGHT = 876
  const WORKSPACE_ID = 'workspace'
  const ELEMENT_LIST = [
    {
      label: '{{姓名}}',
      value: 'USER_NAME',
    },
    {
      label: '{{培训名称}}',
      value: 'COURSE_NAME',
    },
    {
      label: '{{考试名称}}',
      value: 'EXAM_NAME',
    },
    {
      label: '{{颁发日期}}',
      value: 'ISSUE_DATE',
    },
    {
      label: '{{二维码}}',
      value: 'QR_CODE',
    },
  ]

  // shallowRef
  const canvas = shallowRef<fabric.Canvas>()
  const canvasBackgroundUrl = shallowRef<string>('')
  const canvasBackgroundImage = shallowRef<fabric.Image>()
  const workspaceProps = ref({
    width: FABRIC_WIDTH,
    height: FABRIC_HEIGHT,
  })

  // ref
  const canvasObjectsToBeAdded = ref<CanvasObjects[]>([])
  const formData = ref({
    width: FABRIC_WIDTH,
    height: FABRIC_HEIGHT,
  })

  // computed
  const canvasTemplateTextValues = computed(() => {
    if (!canvas.value)
      return []
    return canvas.value.getObjects().filter(item => item.type === 'text').map(item => item.id)
  })

  const elementList = computed(() => {
    return ELEMENT_LIST.map((item) => {
      return {
        ...item,
        disabled: canvasTemplateTextValues.value.includes(item.value),
      }
    })
  })

  // methods
  function getDataURLOptions(): IDataURLOptions {
    const workspace = canvas.value?.getObjects().find(item => item.id === 'workspace')
    if (!workspace)
      return PREVIEW_URL_OPTIONS
    const { width, height, left, top } = workspace
    console.warn('getDataURLOptions', width, height, left, top)
    return {
      ...PREVIEW_URL_OPTIONS,
      width,
      height,
      left,
      top,
    }
  }

  function _base64ToBlobUrl(base64: string): string {
    // 删除数据类型和编码信息
    const base64WithoutInfo = base64.split(',')[1]

    // 解码 base64 数据
    const decodedData = atob(base64WithoutInfo)

    // 将解码后的数据转换为 Uint8Array
    const dataArray = new Uint8Array(decodedData.length)
    for (let i = 0; i < decodedData.length; i++)
      dataArray[i] = decodedData.charCodeAt(i)

    // 创建 Blob 对象
    const blob = new Blob([dataArray], { type: 'application/octet-stream' })

    // 创建 Blob URL
    const blobUrl = URL.createObjectURL(blob)

    return blobUrl
  }

  function setBackgroundByUrl(url: string): Promise<fabric.Image> {
    return new Promise((resolve, reject) => {
      url && fabric.Image.fromURL(url, (imgInstance) => {
        if (!canvas.value) {
          reject(new Error('no canvas'))
          return
        }
        const workspace = canvas.value.getObjects().find(item => item.id === 'workspace')
        if (!workspace) {
          reject(new Error('no workspace'))
          return
        }
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
          id: 'background',
          name: '背景图片',
          left: workspace.left,
          top: workspace.top,
        })
        // 移除之前的背景图片
        if (canvasBackgroundImage.value)
          canvas.value.remove(canvasBackgroundImage.value)

        canvas.value.add(imgInstance)
        // 更新背景图片变量
        canvasBackgroundImage.value = imgInstance
        canvas.value.renderAll()
        resolve(imgInstance)
      })
    })
  }
  // expose methods
  function handleMockFetch() {
    formData.value = cloneDeep(mockData)
  }
  function handleEdit() {

  }
  return {
    // constants
    PREVIEW_URL_OPTIONS,
    ELEMENT_LIST,
    WORKSPACE_ID,
    // shallowRef
    canvas,
    canvasBackgroundUrl,
    canvasBackgroundImage,
    // ref
    workspaceProps,
    canvasObjectsToBeAdded,
    canvasTemplateTextValues,
    // computed
    elementList,
    // methods
    getDataURLOptions,
    _base64ToBlobUrl,
    setBackgroundByUrl,
    // expose methods
    handleMockFetch,
  }
})
