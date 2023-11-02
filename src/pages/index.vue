<script setup lang="ts">
import { fabric } from 'fabric'
import { useFabricWorkspace } from '~/composables'

const state = reactive({
  menuActive: 1,
  show: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: false,
})

const WorkspaceRef = shallowRef()
useFabricWorkspace({
  WorkspaceRef,
})
onMounted(() => {
  const canvas = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
  })
  window.canvas = canvas
  // workspace

  // 创建编辑器
  // canvasEditor = new CanvasEditor(canvas)
  state.show = true
})
provide('fabric', fabric)
// provide('canvasEditor', canvasEditor)
</script>

<template>
  <div class="flex flex-col h-full">
    <Header />
    <div class="flex grow shrink basis-0 overflow-hidden">
      <!-- 画布区域 -->
      <div ref="WorkspaceRef" class="grow shrink basis-0 overflow-hidden bg-[#f1f1f1]">
        <div class="relative w-full h-full">
          <div class="absolute w-full h-full shadow-[inset_0_0_9px_2px_#0000001f] z-10 pointer-events-none" />
          <canvas id="canvas" :class="state.ruler ? 'design-stage-grid' : ''" />
        </div>
      </div>
      <!-- 属性区域 -->
      <Side />
    </div>
  </div>
</template>

<style lang="css" scoped>
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    ),
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
