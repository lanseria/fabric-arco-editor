<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import type { CanvasElementProps } from '~/composables/types'

const { open, reset, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  multiple: false,
})

onChange((files) => {
  if (!storeCanvas.value) {
    Message.warning('canvas 不存在')
    return
  }
  if (files) {
    // 获取第一个文件
    const filesList = Array.from(files)
    if (filesList.length === 0) {
      reset()
    }
    else {
      const file = filesList[0]
      const url = useObjectUrl(file)
      canvasSetBackgroundByUrl(url.value!)
      reset()
    }
  }
})
function handleAddElement(item: CanvasElementProps) {
  canvasAddElement(item)
}
function handleSetBackgroundImage() {
  open()
}
onMounted(() => {

})
</script>

<template>
  <div class="w-400px px-10px py-20px">
    <div class="font-bold text-sm mb-20px">
      画布属性
    </div>
    <AForm :model="storeCanvasProps" layout="inline">
      <div grid="~ cols-2">
        <AFormItem field="width" tooltip="宽度小于4k像素大于1像素" label="宽度">
          <AInputNumber
            v-model="storeCanvasProps.width"
            :max="4096"
            :min="1"
            :precision="0"
            placeholder="画布宽度"
          />
        </AFormItem>
        <AFormItem field="height" tooltip="高度小于4k像素大于1像素" label="高度">
          <AInputNumber
            v-model="storeCanvasProps.height"
            :max="4096"
            :min="1"
            :precision="0"
            placeholder="画布高度"
          />
        </AFormItem>
      </div>

      <!-- <div grid="~ cols-2" gap-2 w-full>
        <AButton type="primary" long @click="handleSubmit">
          <template #icon>
            <IconSave />
          </template>
          将当前尺寸保存
        </AButton>
        <AButton type="primary" status="success" long @click="handleSubmit">
          <template #icon>
            <IconApps />
          </template>
          选择尺寸
        </AButton>
      </div> -->
    </AForm>

    <ADivider />

    <div class="font-bold text-sm mb-20px">
      设置证书背景
    </div>
    <AButton type="primary" shape="round" @click="handleSetBackgroundImage">
      <template #icon>
        <IconImage />
      </template>
      上传背景图片
    </AButton>
    <ADivider />
    <div class="font-bold text-sm mb-20px">
      添加元素
    </div>
    <div v-if="!storeCanvasBackgroundImage" class="text-[rgba(var(--red-6))]">
      请先上传背景图片
    </div>
    <div grid="~ cols-2" gap-10px>
      <div
        v-for="item in storeElementList"
        :key="item.id"
      >
        <AButton
          long
          :loading="storeImageLoading"
          :disabled="!storeCanvasBackgroundImage || item.disabled"
          @click="handleAddElement(item)"
        >
          {{ item.value }}
        </AButton>
      </div>
    </div>
  </div>
</template>
