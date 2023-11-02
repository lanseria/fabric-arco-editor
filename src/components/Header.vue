<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { fabric } from 'fabric'

const { open, reset, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  multiple: false,
})
function handleSetglobalBackgroundImage() {
  open()
}
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
      if (globalBackgroundImage.value)
        canvas.remove(globalBackgroundImage.value)

      canvas.add(imgInstance)
      canvas.setActiveObject(imgInstance)
      // 更新背景图片变量
      globalBackgroundImage.value = imgInstance
      canvas.renderAll()
    })
    reset()
  }
})
function handleSave() {
  const { canvas } = window
  if (canvas) {
    const objects = canvas.getObjects()
    // 遍历所有元素
    objects.forEach((object) => {
      // 获取相对定位
      const left = object.left
      const top = object.top

      // 获取宽度和高度
      const width = object.width
      const height = object.height

      // 检查元素类型
      if (object.type === 'text') {
        // 文字元素的字体和大小
        const fontFamily = object.fontFamily
        const fontSize = object.fontSize
        console.log(object)
        // 在控制台打印信息
        console.log('Left:', left, 'Top:', top, 'Width:', width, 'Height:', height, 'Font Family:', fontFamily, 'Font Size:', fontSize)
      }
      else {
        // 非文字元素的处理
        // ...
      }
    })
  }
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
      <AButton type="primary" shape="round" @click="handleSetglobalBackgroundImage">
        <template #icon>
          <IconImage />
        </template>
        上传背景图片
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
