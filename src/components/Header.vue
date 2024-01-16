<script lang="ts" setup>
const tempFormData = useStorage('tempFormData', MOCK_DATA)
const previewImageUrl = ref('')
const ImagePreviewVisible = ref(false)
const MockModalVisible = ref(false)
function handlePreview() {
  const url = canvasToImageUrl()
  if (url) {
    previewImageUrl.value = url
    ImagePreviewVisible.value = true
  }
}
/**
 * 提交
 * 移除所有元素包括二维码，只保留底图，转为base64保存导出
 */
function handleSubmit() {
  const res = canvasSpliceElementListAndBackground()
  if (res) {
    console.warn('[handleSubmit]:', res)
    tempFormData.value = res
  }
}
function handleShowMockData() {
  MockModalVisible.value = true
}
function handleSetData() {
  MockModalVisible.value = false
  storeCanvasProps.value.height = tempFormData.value.height
  storeCanvasProps.value.width = tempFormData.value.width
  const canvasElementList = tempFormData.value.elementList
  const canvasBackgroundImageBase64 = tempFormData.value.backgroundImageBase64
  // 1. 已经自动设置了画布的宽高
  // 2. 手动设置背景图片
  if (canvasBackgroundImageBase64) {
    const url = _base64ToBlobUrl(canvasBackgroundImageBase64)
    canvasSetBackgroundByUrl(url)
  }
  // 3. 设置二维码图片,先将图片排序到最前面
  const sortElementList = canvasElementList.sort((x, y) => x.type > y.type ? 1 : -1)
  console.warn('[handleSetData]:', sortElementList)
  sortElementList.forEach((element) => {
    console.warn(element)
    canvasAddElement(element)
  })
}
function handleShowCanvasInfo() {
  console.warn('[handleShowCanvasInfo]:', storeCanvas.value!.getObjects())
  triggerRef(storeCanvas)
}
</script>

<template>
  <div class="h-68px px-20px flex items-center shadow justify-between">
    <ASpace align="center">
      <img class="w-30px h-30px mr-10px" src="/logo.svg" alt="logo">
      <div class="font-bold text-size-18px">
        设置模板
      </div>
      <SourceMode />
    </ASpace>
    <AImagePreview
      v-model:visible="ImagePreviewVisible"
      :src="previewImageUrl"
    />
    <AModal v-model:visible="MockModalVisible" title="当前保存数据">
      <ATextarea
        :model-value="JSON.stringify(tempFormData.elementList)" :auto-size="{
          minRows: 5,
          maxRows: 10,
        }"
      />
      <template #footer>
        <ASpace>
          <AButton type="primary" @click="handleSetData()">
            <template #icon>
              <IconExport />
            </template>
            将数据覆盖到当前画布中
          </AButton>
        </ASpace>
      </template>
    </AModal>
    <ASpace>
      <AButton shape="round" @click="handleShowCanvasInfo">
        <template #icon>
          <IconBug />
        </template>
        DEBUG
      </AButton>
      <AButton type="primary" shape="round" @click="handleShowMockData">
        <template #icon>
          <IconBug />
        </template>
        查看保存数据
      </AButton>
      <AButton type="primary" shape="round" @click="handlePreview">
        <template #icon>
          <IconImage />
        </template>
        预览
      </AButton>
      <AButton type="primary" shape="round" @click="handleSubmit">
        <template #icon>
          <IconSave />
        </template>
        保存
      </AButton>
    </ASpace>
  </div>
</template>
