<script setup lang="ts">
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
</script>

<template>
  <AConfigProvider
    :locale="zhCN"
  >
    <main class="font-sans h-100vh">
      <RouterView />
    </main>
  </AConfigProvider>
</template>
