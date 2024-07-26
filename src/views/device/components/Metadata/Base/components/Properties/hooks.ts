import { updateProductThreshold, updateDeviceThreshold ,queryDeviceThreshold, queryProductThreshold, resetDeviceThreshold } from '@/api/device/instance'
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

    const { run: rest } = useRequest(resetDeviceThreshold, { immediate: false, onSuccess(res) {
            thresholdDetailQuery()
        } })

    const handleDetail = (data: Record<string, any>) => {
        thresholdDetail.value = {
            type: data.configuration.matcher.provider,
            lowerLimit: data.configuration.matcher.configuration.min,
            upperLimit: data.configuration.matcher.configuration.max,
            mode: data.configuration.processors.map((i:any)=>{
                return i.provider
            })
        }
    }

    const thresholdUpdate = (data: Record<string, any>) => {
        const param = {
            thingType: props.target,
            provider: 'simple',
            configuration:{
                matcher:{
                    provider: data.type,
                    configuration:{
                        max: data.upperLimit,
                        min: data.lowerLimit,
                        not: true
                    }
                },
                processors: data.mode.map((i:any)=>{
                    return  {
                        provider: i,
                        configuration:{}
                    }
                })
            },
            
        }
        if(props.target === 'product'){
            updateProductRun(productStore.current.id,props.id,param)
        }else{
            updateDeviceRun(deviceStore.current.productId, deviceStore.current.id, props.id)
        }
    }

    const thresholdDetailQuery = () => {
        if (props.target === 'product') {
            queryProduct(productStore.current.id, props.id)
        } else {
            queryDevice(deviceStore.current.productId, deviceStore.current.id, props.id)
        }
    }

    const thresholdRest = () => {
        rest(deviceStore.current.id, [props.id])
    }

    return {
        thresholdUpdate,
        thresholdRest,
        thresholdDetailQuery,
        thresholdDetail
    }
}
