<script lang="ts" setup>
import { fabric } from 'fabric'

const WrapRef = shallowRef()
const CanvasRef = shallowRef()

const { width: wrapWidth, height: wrapHeight } = useElementSize(WrapRef)

// ref
const isLoad = ref(false)

// hooks
onMounted(() => {
  const value = new fabric.Canvas(CanvasRef.value, {
    preserveObjectStacking: true,
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
  })
  storeCanvas.value = value
})

// 监听容器宽高变化
watchDebounced([wrapWidth, wrapHeight], () => {
  console.warn('[watchDebounced] width, height', wrapWidth.value, wrapHeight.value)
  if (wrapHeight.value && wrapWidth.value && storeCanvas.value) {
    if (!isLoad.value)
      canvasInitWorkspace(storeCanvas.value, wrapWidth.value, wrapHeight.value)

    isLoad.value = true
    canvasWorkspaceAutoZoom(storeCanvas.value, wrapWidth.value, wrapHeight.value)
  }
}, { debounce: 500, maxWait: 1000 })
// 监听画布属性
watchDebounced([storeCanvasProps], () => {
  console.warn('[watchDebounced] width, height', storeCanvasProps.value)
  if (wrapHeight.value && wrapWidth.value && storeCanvas.value)
    canvasWorkspaceAutoZoom(storeCanvas.value, wrapWidth.value, wrapHeight.value)
}, { debounce: 500, maxWait: 1000, deep: true })
// 手动自动缩放
watchDebounced([storeCanvasStatus], () => {
  console.warn('[watchDebounced] 手动自动缩放', storeCanvasStatus.value)
  if (storeCanvasStatus.value === 'zooming' && storeCanvas.value) {
    storeCanvasStatus.value = 'processing'
    canvasWorkspaceAutoZoom(storeCanvas.value, wrapWidth.value, wrapHeight.value)
    storeCanvasStatus.value = 'idle'
  }
}, { debounce: 500, maxWait: 1000 })
</script>

<template>
  <div ref="WrapRef" class="grow shrink basis-0 overflow-hidden bg-[#f1f1f1]">
    <div class="relative w-full h-full">
      <div class="absolute w-full h-full shadow-[inset_0_0_9px_2px_#0000001f] z-10 pointer-events-none" />
      <canvas ref="CanvasRef" />
    </div>
  </div>
</template>
