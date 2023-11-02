<script lang="ts" setup>
import { fabric } from 'fabric'

const elementList = [
  {
    label: '姓名',
    value: 'USER_NAME',
  },
  {
    label: '培训名称',
    value: 'COURSE_NAME',
  },
  {
    label: '考试名称',
    value: 'EXAM_NAME',
  },
  {
    label: '颁发日期',
    value: 'ISSUE_DATE',
  },
  {
    label: '二维码',
    value: 'QR_CODE',
  },
]
function handleSubmit() {
  //
}
function handleAddText(item: { label: string; value: string }) {
  const { canvas } = window
  if (canvas) {
    const workspace = canvas.getObjects().find(item => item.id === 'workspace')
    if (!workspace)
      return
    const text = new fabric.Text(item.label, {
      left: workspace.left! + workspace.width! / 2,
      top: workspace.top! + workspace.height! / 2,
      fontSize: 30,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    })
    canvas.add(text)
    canvas.bringToFront(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }
}
onMounted(() => {

})
</script>

<template>
  <div class="w-400px px-10px py-20px">
    <div class="font-bold text-sm mb-20px">
      画布属性
    </div>
    <AForm :model="storeWorkspacePropsForm" layout="inline" @submit="handleSubmit">
      <div grid="~ cols-2">
        <AFormItem field="width" tooltip="宽度" label="宽度">
          <AInputNumber
            v-model="storeWorkspacePropsForm.width"
            placeholder="画布宽度"
          />
        </AFormItem>
        <AFormItem field="height" tooltip="高度" label="高度">
          <AInputNumber
            v-model="storeWorkspacePropsForm.height"
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
      添加元素
    </div>
    <div v-if="globalBackgroundImage === null" class="text-[rgba(var(--red-6))]">
      请先上传背景图片
    </div>
    <div grid="~ cols-2" gap-10px>
      <AButton
        v-for="item in elementList"
        :key="item.value"
        :disabled="globalBackgroundImage === null"
        @click="handleAddText(item)"
      >
        {{ item.label }}
      </AButton>
    </div>
  </div>
</template>
