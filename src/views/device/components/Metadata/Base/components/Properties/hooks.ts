import { updateProductThreshold, updateDeviceThreshold ,queryDeviceThreshold, queryProductThreshold , deleteProductThreshold, deleteDeviceThreshold } from '@/api/device/instance'
import { useRequest } from '@/hook'
import {useProductStore} from "store/product";
import {useInstanceStore} from "store/instance";
export const useThreshold = (props: Record<string, any>) => {

    const productStore = useProductStore();
    const deviceStore = useInstanceStore();

    const thresholdDetail = ref({

    })

    const { run: updateProductRun } = useRequest(updateProductThreshold, { immediate: false })

    const { run: updateDeviceRun } = useRequest(updateDeviceThreshold,{ immediate: false})

    const { run: deleteProductRun } = useRequest(deleteProductThreshold,{ immediate: false})
    
    const { run: deleteDeviceRun } = useRequest(deleteDeviceThreshold,{ immediate: false})

    const { run: queryDevice } = useRequest(queryDeviceThreshold, {
        immediate: false,
        onSuccess(res) {
            handleDetail(res.result)
        }
    })

    const { run: queryProduct } = useRequest(queryProductThreshold, {
        immediate: false,
        onSuccess(res) {
            handleDetail(res.result)
        }
    })


    const handleDetail = (data: Record<string, any>) => {
        thresholdDetail.value = {
            type: data.configuration.matcher.provider,
            limit:{
                lower:  data.configuration.matcher.configuration.min,
                upper:  data.configuration.matcher.configuration.max
            },
            // mode: data.configuration.processors.map((i:any)=>{
            //     return i.provider
            // })
            mode: data.configuration.processors[0].provider
        }
    }

    const thresholdUpdate = (data: Record<string, any>) => {
        const params = {
            thingType: props.target,
            provider: 'simple',
            configuration:{
                matcher:{
                    provider: data.type,
                    configuration:{
                        max: data.limit.upper,
                        min: data.limit.lower,
                        not: false
                    }
                },
                processors: [{
                    provider: data.mode,
                    configuration:{}
                }]
                // data.mode.map((i:any)=>{
                //     return  {
                //         provider: i,
                //         configuration:{}
                //     }
                // })
            },
            
        }
        if(props.target === 'product'){
            updateProductRun(productStore.current.id,props.id,params)
        }else{
            updateDeviceRun(deviceStore.current.productId, deviceStore.current.id, props.id,params)
        }
    }

    const thresholdDelete = ()=>{
        if(props.target === 'product'){
            deleteProductRun(productStore.current.id,props.id)
        }else{
            deleteDeviceRun(deviceStore.current.productId,deviceStore.current.id,props.id)
        }
    }
    const thresholdDetailQuery = () => {
        if (props.target === 'product') {
            queryProduct(productStore.current.id, props.id)
        } else {
            queryDevice(deviceStore.current.productId, deviceStore.current.id, props.id)
        }
    }


    return {
        thresholdUpdate,
        thresholdDelete,
        thresholdDetailQuery,
        thresholdDetail
    }
}
