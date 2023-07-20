<template>
    <j-select
        :value="host"
        :options="options"
        placeholder="请选择本地地址"
        allowClear
        show-search
        :disabled="shareCluster"
        @change="changeHost"
    >
    </j-select>
</template>

<script lang="ts" setup>
import { resourceClustersById } from "@/api/link/type"
import { useTypeStore } from "@/store/type"
import { cloneDeep } from "lodash-es"
import { storeToRefs } from "pinia"

const _typeStore = useTypeStore()
const { resourcesClusters } = storeToRefs(_typeStore)

const props = defineProps({
    value: {
        type: String,
        default: undefined
    },
    shareCluster: {
        type: Boolean,
        default: true
    },
    serverId: {
        type: String,
        default: undefined
    }
})

const emit = defineEmits(['update:value', 'change', 'valueChange'])

const host = ref<string>()
const options = ref<any[]>([])

const getResourcesClustersById = async (id: string) => {
    const _value = resourcesClusters.value?.[id]
    if(!_value){
        const resp = await resourceClustersById(id)
        if (resp.status === 200) {
            const checked = resp.result?.[0]
            const checkedHost = [{ value: checked?.host, label: checked?.host }];
            options.value = checked ? checkedHost : []

            const _resourcesClusters = cloneDeep(resourcesClusters.value)
            _resourcesClusters[id] = resp.result
            _typeStore.setResourcesClusters(_resourcesClusters)
            emit('valueChange', props.value)
        } else {
            options.value = []
        }
    } else {
        const checked = resourcesClusters.value?.[id]?.[0]
        const checkedHost = [{ value: checked?.host, label: checked?.host }];
        options.value = checked ? checkedHost : []
    }
}

watchEffect(() => {
    host.value = props.value
    if(!props.shareCluster && props.serverId){
        getResourcesClustersById(props.serverId)
    }
    emit('valueChange', props.value)
})

const changeHost = (_value: string) => {
    emit('update:value', _value)
    emit('change', props.value)
}
</script>