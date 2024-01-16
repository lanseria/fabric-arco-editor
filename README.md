# Fabric Arco editor

这个项目是一个简单的前端示例，使用 `fabric.js` 和 `vue.js` 进行构建，其中 `arco-design` 作为框架。网页的主要功能是提供一个类似证书模板的设计器。

This project is a simple frontend demo built using `fabric.js` and `vue.js`, with `arco-design` as the framework. The webpage primarily serves as a designer for a certificate template.

## 当前的功能

- 首先，会有一个画布
- 其次，这个画布可以调整大小
- 每次改变窗口大小，也就是Canvas外侧div大小，Canvas同时改变
- Canvas改变的同时，画布同时放大缩小（注意，这里是Fabric.js自我控制）
- 在画布上仅可以放置一张背景图片（功能先这样）
- 在画布上可以放置带给后端的模板文字，比如{{姓名}} {{发布日期}}
- 画布可以预览，可以以 File / Base64 上传给后端，这里推荐用Base64同时搭配json格式上传方便一些
- 可以编辑，比如后端传过来的背景图片 Base64 刚好覆盖这个画布，同时后端需要保存高度与宽度，然后再添加上模板文字

## 如何实现

- div.wrap > canvas > [fabric.js]画布
- 在onMounted时，生成变量 canvas
```
const canvas = new fabric.Canvas(CanvasRef.value, {
  preserveObjectStacking: true,
  fireRightClick: true, // 启用右键，button的数字为3
  stopContextMenu: true, // 禁止默认右键菜单
  controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
})
```
- 监听 wrapWidth wrapHeight 值
```
watchDebounced([width, height], () => {
  console.warn('[watchDebounced] width, height', width.value, height.value, workspaceProps.value, canvas.value)
  if (height.value && width.value && canvas.value) {
    if (!isLoad.value) {
      _initWorkspace(canvas.value)
      _autoScale()
      isLoad.value = true
      // TODO 查询待添加元素的数组
    }
    else {
      _autoScale()
    }
  }
}, { debounce: 500, maxWait: 1000 })
```
- 当初始化完成后，执行待添加的背景图片与模板文字
