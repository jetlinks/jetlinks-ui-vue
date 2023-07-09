import {DeviceMetadata, MetadataItem, MetadataType} from "@/views/device/Product/typings";
import {useInstanceStore} from "store/instance";
import {useProductStore} from "store/product";
import type { Ref, ComputedRef } from "vue";

const useMetadata = (type: 'device' | 'product', key?: MetadataType, ): {
    data: ComputedRef<MetadataItem[]>,
    metadata: Ref<Partial<DeviceMetadata>>,
    noEdit: Ref<any>
    productNoEdit: Ref<any>
} => {
    const instanceStore = useInstanceStore()
    const productStore = useProductStore()
    const metadata = ref<Partial<DeviceMetadata>>({})
    const noEdit = ref<any>({})
    const productNoEdit = ref<any>({})

    const data = computed(() => {
        const _metadataStr = type === 'product' ? productStore.current?.metadata : instanceStore.current.metadata
        const _metadata = JSON.parse(_metadataStr || '{}')
        const newMetadata = (key ? _metadata?.[key] || [] : []) as MetadataItem[]

        const indexKeys = newMetadata.map((item, index) => index)
        noEdit.value = {}
        productNoEdit.value = {}
        noEdit.value.id = indexKeys

        if (key === 'properties') {
            noEdit.value.source = indexKeys
        }

        if (type === 'device' && instanceStore.current.productMetadata) {
            const productMetadata: any = JSON.parse(instanceStore.current.productMetadata)
            const metaArray = key ? productMetadata[key] : []
            const productIndexKeys = metaArray?.map((item:any, index: number) => index) || []
            productNoEdit.value.id = productIndexKeys
            productNoEdit.value.name = productIndexKeys
            if (key === 'properties') {
                productNoEdit.value.valueType = productIndexKeys
                productNoEdit.value.expands = productIndexKeys
            }

            if (key === 'functions') {
                productNoEdit.value.async = productIndexKeys
                productNoEdit.value.inputs = productIndexKeys
                productNoEdit.value.output = productIndexKeys
                productNoEdit.value.description = productIndexKeys
            }

            if (key === 'events') {
                productNoEdit.value.expands = productIndexKeys
                productNoEdit.value.outInput = productIndexKeys
                productNoEdit.value.properties = productIndexKeys
                productNoEdit.value.description = productIndexKeys
            }

            if (key === 'tags') {
                productNoEdit.value.valueType = productIndexKeys
                productNoEdit.value.readType = productIndexKeys
                productNoEdit.value.description = productIndexKeys
            }
        }

        return newMetadata
    })
    
    return {
        data,
        metadata,
        noEdit,
        productNoEdit
    }
}
export default useMetadata