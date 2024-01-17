import type { CanvasElementProps } from './types'

export const storeImageLoading = ref(false)

export const storeCanvasStatus = ref<'idle' | 'processing' | 'zooming'>('idle')

export const storeCanvasProps = ref(initStoreCanvasProps())

export const storeCanvasBackgroundImage = shallowRef<fabric.Image>()

export const storeCanvas = shallowRef<fabric.Canvas>()

export const storeCanvasElementListIds = computed(() => {
  const elementIds = ELEMENT_LIST.map(m => m.id)
  if (!storeCanvas.value)
    return []
  console.warn('[storeCanvasElementListIds]', storeCanvas.value.getObjects())
  return storeCanvas.value.getObjects().filter(item => elementIds.includes(item.id!)).map(item => item.id)
})

export const storeElementList = computed<CanvasElementProps[]>(() => {
  console.warn('[store.ts]:', storeCanvasElementListIds.value)
  return ELEMENT_LIST.map((item) => {
    return {
      ...item,
      disabled: storeCanvasElementListIds.value.includes(item.id),
    }
  })
})
