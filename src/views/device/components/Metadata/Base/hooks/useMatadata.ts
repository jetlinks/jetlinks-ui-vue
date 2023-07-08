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
        const newMetadata = (key ? _metadata?.[key] || [] : []) as MetadataItem[]

        const indexKeys = newMetadata.map((item, index) => index)

        noEdit.value.id = indexKeys

        if (key === 'properties') {
            noEdit.value.source = indexKeys
        }

        if (type === 'device' && instanceStore.current.productMetadata) {
            const productMetadata: any = JSON.parse(instanceStore.current.productMetadata)
            const metaArray = key ? productMetadata[key] : []
            const productIndexKeys = metaArray?.map((item:any, index: number) => index) || []
            noEdit.value.id = productIndexKeys
            noEdit.value.name = productIndexKeys
            if (key === 'properties') {
                noEdit.value.valueType = productIndexKeys
                noEdit.value.expands = productIndexKeys
            }

            if (key === 'functions') {
                noEdit.value.async = productIndexKeys
                noEdit.value.inputs = productIndexKeys
                noEdit.value.output = productIndexKeys
                noEdit.value.description = productIndexKeys
            }

            if (key === 'events') {
                noEdit.value.expands = productIndexKeys
                noEdit.value.outInput = productIndexKeys
                noEdit.value.properties = productIndexKeys
                noEdit.value.description = productIndexKeys
            }

            if (key === 'tags') {
                noEdit.value.valueType = productIndexKeys
                noEdit.value.readType = productIndexKeys
                noEdit.value.description = productIndexKeys
            }
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