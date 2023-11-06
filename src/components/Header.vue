<script lang="ts" setup>
const { canvas, WORKSPACE_ID } = useFabricStore()
function handlePreview() {
  //
}
function handleSave() {
  if (!canvas.value)
    return
  const workspace = canvas.value.getObjects().find(item => item.id === WORKSPACE_ID)
  if (!workspace) {
    console.warn('没有找到工作区')
    return
  }
  const workspaceLeft = workspace.left!
  const workspaceTop = workspace.top!
  const objects = canvas.value.getObjects()
  objects.forEach((object) => {
  // 检查对象是否为文本类型
    if (object.type === 'text') {
    // 隐藏文本对象
      // object.visible = false
      console.log(object.left! - workspaceLeft, object.top! - workspaceTop)
    }
  })
}
</script>

<template>
  <div class="h-68px px-20px flex items-center shadow justify-between">
    <ASpace align="center">
      <img class="w-30px h-30px mr-10px" src="/logo.svg" alt="logo">
      <div class="font-bold text-size-18px">
        设置模板
      </div>
      <Hello />
    </ASpace>
    <ASpace>
      <AButton type="primary" shape="round" @click="handlePreview">
        <template #icon>
          <IconImage />
        </template>
        预览
      </AButton>
      <AButton type="primary" shape="round" @click="handleSave">
        <template #icon>
          <IconSave />
        </template>
        保存
      </AButton>
    </ASpace>
  </div>
</template>
