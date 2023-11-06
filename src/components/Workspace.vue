<script lang="ts" setup>
import { fabric } from 'fabric'

const WorkspaceRef = shallowRef()
const CanvasRef = shallowRef()
const { canvas } = useFabricStore()
useFabric({
  WrapRef: WorkspaceRef,
})
onMounted(() => {
  const value = new fabric.Canvas(CanvasRef.value, {
    preserveObjectStacking: true,
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
  })
  canvas.value = value
})
</script>

<template>
  <div ref="WorkspaceRef" class="grow shrink basis-0 overflow-hidden bg-[#f1f1f1]">
    <div class="relative w-full h-full">
      <div class="absolute w-full h-full shadow-[inset_0_0_9px_2px_#0000001f] z-10 pointer-events-none" />
      <canvas ref="CanvasRef" />
    </div>
  </div>
</template>
