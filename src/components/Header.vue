<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { fabric } from 'fabric'

const { open, reset, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  multiple: false,
})
function handleSetBackgroundImage() {
  open()
}
let backgroundImage: fabric.Image
onChange((files) => {
  const { canvas } = window
  if (!canvas) {
    Message.warning('canvas 不存在')
    return
  }
  if (files?.length === 0) {
    reset()
  }
  else {
    const file = files![0]
    const url = useObjectUrl(file)
    url.value && fabric.Image.fromURL(url.value, (imgInstance) => {
      const workspace = canvas.getObjects().find(item => item.id === 'workspace')
      if (!workspace)
        return
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
        // width: workspace.width,
        // height: workspace.height,
      })
      // 移除之前的背景图片
      if (backgroundImage)
        canvas.remove(backgroundImage)

      canvas.add(imgInstance)
      canvas.setActiveObject(imgInstance)
      // 更新背景图片变量
      backgroundImage = imgInstance
      canvas.renderAll()
    })
    reset()
  }
})
</script>

<template>
  <div class="h-68px px-20px flex items-center shadow">
    <ASpace align="center">
      <img class="w-30px h-30px mr-10px" src="/logo.svg" alt="logo">
      <div class="font-bold text-size-18px">
        设置模板
      </div>
      <AButton type="primary" shape="round" @click="handleSetBackgroundImage">
        <template #icon>
          <IconImage />
        </template>
        上传背景图片
      </AButton>
      <Hello />
    </ASpace>
  </div>
</template>
