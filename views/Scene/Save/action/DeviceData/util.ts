
type MetadataType = {
  properties?: any[]
  functions?: any[]
  tags?: any[]
  events?: any[]
}

type MetadataKey = keyof MetadataType

export const handleMetadata = (metadata: MetadataType) =>{
  return Object.keys(metadata).reduce<MetadataType>((prev, next) => {
    prev[next as MetadataKey] = metadata[next as MetadataKey]?.map(item => item.id) || []
    return prev
  }, {})
}
