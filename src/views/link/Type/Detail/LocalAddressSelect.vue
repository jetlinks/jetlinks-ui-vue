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
import { Store } from "jetlinks-store"
import { resourceClustersById } from "@/api/link/type"

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
    const _value = Store.get('resourcesClusters')?.[id]
    if(!_value){
        const resp = await resourceClustersById(id)
        if (resp.status === 200) {
            const checked = resp.result?.[0]
            const checkedHost = [{ value: checked?.host, label: checked?.host }];
            options.value = checked ? checkedHost : []

            const resourcesClusters = Store.get('resourcesClusters') || {}
            resourcesClusters[id] = resp.result
            Store.set('resourcesClusters', resourcesClusters)
            emit('valueChange', props.value)
        } else {
            options.value = []
        }
    } else {
        const checked = Store.get('resourcesClusters')?.[id]?.[0]
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