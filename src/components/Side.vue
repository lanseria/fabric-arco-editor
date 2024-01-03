<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { fabric } from 'fabric'

const { WORKSPACE_ID, elementList, canvas, canvasWorkspaceProps, canvasBackgroundImage, setBackgroundByUrl } = useFabricStore()
const { open, reset, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  multiple: false,
})

onChange((files) => {
  if (!canvas.value) {
    Message.warning('canvas 不存在')
    return
  }
  if (files?.length === 0) {
    reset()
  }
  else {
    const file = files![0]
    const url = useObjectUrl(file)
    setBackgroundByUrl(url.value!)
    reset()
  }
})
function handleSubmit() {
  //
}
function handleAddText(item: { label: string, value: string }) {
  if (!canvas.value)
    return
  const workspace = canvas.value.getObjects().find(item => item.id === WORKSPACE_ID)
  if (!workspace) {
    console.warn('没有找到工作区')
    return
  }
  const text = new fabric.Text(item.label, {
    left: workspace.left! + workspace.width! / 2,
    top: workspace.top! + workspace.height! / 2,
    fontSize: 30,
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    hasControls: false,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true, // 锁定旋转
  })
  canvas.value.add(text)
  canvas.value.setActiveObject(text)
  canvas.value.renderAll()
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
    <AForm :model="canvasWorkspaceProps" layout="inline" @submit="handleSubmit">
      <div grid="~ cols-2">
        <AFormItem field="width" tooltip="宽度" label="宽度">
          <AInputNumber
            v-model="canvasWorkspaceProps.width"
            placeholder="画布宽度"
          />
        </AFormItem>
        <AFormItem field="height" tooltip="高度" label="高度">
          <AInputNumber
            v-model="canvasWorkspaceProps.height"
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
    <div v-if="!canvasBackgroundImage" class="text-[rgba(var(--red-6))]">
      请先上传背景图片
    </div>
    <div grid="~ cols-2" gap-10px>
      <AButton
        v-for="item in elementList"
        :key="item.value"
        :disabled="!canvasBackgroundImage"
        @click="handleAddText(item)"
      >
        {{ item.label }}
      </AButton>
    </div>
  </div>
</template>
