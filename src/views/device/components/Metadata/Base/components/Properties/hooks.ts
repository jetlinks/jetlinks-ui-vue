import { updateThreshold, queryDeviceThreshold, queryProductThreshold, resetDeviceThreshold } from '@/api/device/instance'
import { useRequest } from '@/hook'
import {useProductStore} from "store/product";
import {useInstanceStore} from "store/instance";
export const useThreshold = (props: Record<string, any>) => {

    const productStore = useProductStore();
    const deviceStore = useInstanceStore();

    const thresholdDetail = ref({

    })

    const { run: updateRun } = useRequest(updateThreshold, { immediate: false })

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
            type: data.type,
            lowerLimit: data.lowerLimit,
            upperLimit: data.upperLimit,
            mode: data.mode.value
        }
    }

    const thresholdUpdate = (data: Record<string, any>) => {
        updateRun({
            productId: props.target === 'product' ? productStore.current.id : deviceStore.current.productId,
            deviceId: props.target === 'product' ? undefined : deviceStore.current.id,
            propertyId: props.id,
            propertyName: props.name,
            ...data,
        })
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
