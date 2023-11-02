export const storeWorkspacePropsForm = useStorage('fabric-paint-props', {
  width: 1200,
  height: 720,
})

export const globalBackgroundImage: Ref<fabric.Image | null> = ref(null)
