import {DeviceMetadata, MetadataItem, MetadataType} from "@/views/device/Product/typings";
import {useInstanceStore} from "store/instance";
import {useProductStore} from "store/product";
import type { Ref, ComputedRef } from "vue";
import { storeToRefs } from 'pinia'

const useMetadata = (type: 'device' | 'product', key?: MetadataType, ): {
    data: Ref<MetadataItem[]>,
    metadata: Ref<Partial<DeviceMetadata>>,
    noEdit: Ref<any>
    productNoEdit: Ref<any>
} => {
    const instanceStore = useInstanceStore()
    const productStore = useProductStore()
    const metadata = ref<Partial<DeviceMetadata>>({})
    const noEdit = ref<any>({})
    const productNoEdit = ref<any>({})
    const data = ref<MetadataItem[]>([])
    const { current: instanceCurrent } = storeToRefs(instanceStore)
    const { current: productCurrent } = storeToRefs(productStore)

    const handleMetadata = (_metadataStr: string) => {
        if(!_metadataStr){
            return
        }
        const fileTypeReg = new RegExp('"fileType":',"g")
        const _dealMetadata = _metadataStr.replaceAll(fileTypeReg,'"bodyType":')
        const _metadata = JSON.parse(_dealMetadata || '{}')
        const newMetadata = (key ? _metadata?.[key] || [] : []) as any[]


        metadata.value = newMetadata as any

        const ids = newMetadata.map((item) => item.id)
        noEdit.value = {}
        productNoEdit.value = {}
        noEdit.value.id = ids

        if (key === 'properties') {
            noEdit.value.source = ids
        }

        if (type === 'device' && instanceCurrent.value.productMetadata) {
            const productMetadata: any = JSON.parse(instanceCurrent.value.productMetadata)
            const metaArray = key ? productMetadata[key] : []
            const productIds = metaArray?.map((item:any) => item.id) || []
            // productNoEdit.value.ids = metaArray?.map((item: any) => item.id) || []
            productNoEdit.value.ids = productIds
            productNoEdit.value.id = productIds
            productNoEdit.value.name = productIds
            if (key === 'properties') {
                productNoEdit.value.valueType = productIds
                productNoEdit.value.expands = productIds
            }

            if (key === 'functions') {
                productNoEdit.value.async = productIds
                productNoEdit.value.inputs = productIds
                productNoEdit.value.output = productIds
                productNoEdit.value.description = productIds
            }

            if (key === 'events') {
                productNoEdit.value.expands = productIds
                productNoEdit.value.outInput = productIds
                productNoEdit.value.properties = productIds
                productNoEdit.value.description = productIds
            }

            if (key === 'tags') {
                productNoEdit.value.valueType = productIds
                productNoEdit.value.readType = productIds
                productNoEdit.value.description = productIds
            }
        }

        data.value = newMetadata
    }

    watch(() => [instanceCurrent.value.metadata, productCurrent.value.metadata], () => {
        if (type === 'device') {
            handleMetadata(instanceCurrent.value.metadata)
        } else {
            handleMetadata(productCurrent.value.metadata)
        }
    }, { immediate: true})

    return {
        data,
        metadata,
        noEdit,
        productNoEdit
    }
}
export default useMetadata