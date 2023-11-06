<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col h-full">
    <Header />
    <div class="flex grow shrink basis-0 overflow-hidden">
      <!-- 画布区域 -->
      <Workspace />
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
