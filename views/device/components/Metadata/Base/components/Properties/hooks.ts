import {
    updateProductThreshold,
    updateDeviceThreshold,
    queryDeviceThreshold,
    queryProductThreshold,
    deleteProductThreshold,
    deleteDeviceThreshold,
    queryMetric, saveMetric
} from '../../../../../../../api/instance'
import { useRequest } from '@jetlinks-web/hooks'
import {useProductStore} from "../../../../../../../store/product";
import {useInstanceStore} from "../../../../../../../store/instance";
export const useThreshold = (props: Record<string, any>) => {

    const productStore = useProductStore();
    const deviceStore = useInstanceStore();

    const thresholdDetail = ref({})

    const { run: updateProductRun } = useRequest(updateProductThreshold, { immediate: false })

    const { run: updateDeviceRun } = useRequest(updateDeviceThreshold,{ immediate: false})

    const { run: deleteProductRun } = useRequest(deleteProductThreshold,{ immediate: false})

    const { run: deleteDeviceRun } = useRequest(deleteDeviceThreshold,{ immediate: false})

    const { run: queryDevice } = useRequest(queryDeviceThreshold, {
        immediate: false,
        onSuccess(res) {
            if(res.result) {
                handleDetail(res.result)
            }
        }
    })

    const { run: queryProduct } = useRequest(queryProductThreshold, {
        immediate: false,
        onSuccess(res) {
            if(res.result) {
                handleDetail(res.result)
            }
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
            mode: data.configuration.processors?.length > 1 ? 'record-alarm' : data.configuration.processors[0].provider
        }
    }

    const thresholdUpdate = (data: Record<string, any>) => {
        const params = {
            thingType: 'device',
            provider: 'simple',
            // configuration:{
            //     matcher:{
            //         provider: data.type,
            //         configuration:{
            //             max: data.limit.upper,
            //             min: data.limit.lower,
            //             not: true
            //         }
            //     },
            //     processors: data.mode === 'record-alarm' ? [
            //         {
            //             "provider": "device-record",
            //             "configuration": {}
            //         },
            //         {
            //             "provider": "device-alarm",
            //             "configuration": {}
            //         }
            //     ] : [{
            //         provider: data.mode,
            //         configuration:{}
            //     }]
            //     // data.mode.map((i:any)=>{
            //     //     return  {
            //     //         provider: i,
            //     //         configuration:{}
            //     //     }
            //     // })
            //     // data.mode.map((i:any)=>{
            //     //     return  {
            //     //         provider: i,
            //     //         configuration:{}
            //     //     }
            //     // })
            // },
            configuration: {
                matcher:{
                    provider: data.type,
                    configuration: data.type === 'file-matcher' ? {} : {
                        max: data.limit.upper,
                        min: data.limit.lower,
                        not: true
                    }
                },
                processors: data.mode === 'record-alarm' ? [
                    {
                        "provider": "device-record",
                        "configuration": {}
                    },
                    {
                        "provider": "device-alarm",
                        "configuration": {}
                    }
                ] : [{
                    provider: data.mode,
                    configuration:{}
                }]
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
            queryProduct(productStore.current.id, props.id,false)
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


export const useMetrics = (props: any) => {
    const deviceStore = useInstanceStore();
    const metrics = ref([])

    const metricsQuery = async () => {
        if (props.target === 'product') {
            metrics.value = props.record?.expands?.metrics || []
        }
        if (props.target === 'device' && props.record.id) {
            if(props.record.id){
                const resp = await queryMetric(deviceStore.current.id, props.record.id)
                if(resp.success){
                    metrics.value = resp.result || []
                }
            }
            // 如果是新增的数据该怎么办
            const arr = props.record?.expands?.metrics || []
            if(arr.length > 0 && metrics.value.length === 0) {
                metrics.value = arr
            }
        }
    }

    const metricsUpdate = async (arr = []) => {
        if(props.target === 'device'){
            const resp = await saveMetric(
              deviceStore.current.id || '',
              props.record.id || '',
              arr,
            )
            if(resp.success){

            }
        }

    }

    return {
        metrics,
        metricsUpdate,
        metricsQuery
    }
}
