import {DeviceMetadata, MetadataItem, MetadataType} from "@/views/device/Product/typings";
import {useInstanceStore} from "store/instance";
import {useProductStore} from "store/product";
import type { Ref, ComputedRef } from "vue";

const useMetadata = (type: 'device' | 'product', key?: MetadataType, ): {
    data: ComputedRef<MetadataItem[]>,
    metadata: Ref<Partial<DeviceMetadata>>,
    noEdit: Ref<any>
} => {
    const instanceStore = useInstanceStore()
    const productStore = useProductStore()
    const metadata = ref<Partial<DeviceMetadata>>({})
    const noEdit = ref<any>({})

    const data = computed(() => {
        const _metadataStr = type === 'product' ? productStore.current?.metadata : instanceStore.current.metadata
        const _metadata = JSON.parse(_metadataStr || '{}')
        const newMetadata = (key ? _metadata[key] : []) as MetadataItem[]
        const indexs = newMetadata.map((item, index) => index)
        noEdit.value.id = indexs
        if (key === 'properties') {
            noEdit.value.source = indexs
        }
        return newMetadata
    })
    
    return {
        data,
        metadata,
        noEdit
    }
}
export default useMetadata