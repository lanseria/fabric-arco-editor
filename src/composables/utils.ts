/**
 * base64转为Url
 * @param base64
 * @returns
 */
export function _base64ToBlobUrl(base64: string): string {
  // 删除数据类型和编码信息
  const base64WithoutInfo = base64.split(',')[1]

  // 解码 base64 数据
  const decodedData = atob(base64WithoutInfo)

  // 将解码后的数据转换为 Uint8Array
  const dataArray = new Uint8Array(decodedData.length)
  for (let i = 0; i < decodedData.length; i++)
    dataArray[i] = decodedData.charCodeAt(i)

  // 创建 Blob 对象
  const blob = new Blob([dataArray], { type: 'application/octet-stream' })

  // 创建 Blob URL
  const blobUrl = URL.createObjectURL(blob)

  return blobUrl
}
