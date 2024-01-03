<script lang="ts" setup>
const WrapRef = shallowRef()
const CanvasRef = shallowRef()
useFabric({
  WrapRef,
  CanvasRef,
})
</script>

<template>
  <div ref="WrapRef" class="grow shrink basis-0 overflow-hidden bg-[#f1f1f1]">
    <div class="relative w-full h-full">
      <div class="absolute w-full h-full shadow-[inset_0_0_9px_2px_#0000001f] z-10 pointer-events-none" />
      <canvas ref="CanvasRef" />
    </div>
  </div>
</template>
