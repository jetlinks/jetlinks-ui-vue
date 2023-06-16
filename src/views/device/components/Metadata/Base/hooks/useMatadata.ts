import {DeviceMetadata, MetadataItem, MetadataType} from "@/views/device/Product/typings";
import {useInstanceStore} from "store/instance";
import {useProductStore} from "store/product";
import type { Ref, ComputedRef } from "vue";

const useMetadata = (type: 'device' | 'product', key?: MetadataType): {
    data: ComputedRef<MetadataItem[]>,
    metadata: Ref<Partial<DeviceMetadata>>
} => {
    const instanceStore = useInstanceStore()
    const productStore = useProductStore()
    const metadata = ref<Partial<DeviceMetadata>>({})

    const data = computed(() => {
        const _metadataStr = type === 'product' ? productStore.current?.metadata : instanceStore.current.metadata
        const _metadata = JSON.parse(_metadataStr)
        console.log(_metadata)
        return (key ? _metadata[key] : []) as MetadataItem[]
    })
    
    return {
        data,
        metadata
    }
}
export default useMetadata