<template>
    <a-modal :maskClosable="false" width="800px" :visible="true" title="当前进度" @ok="handleOk" @cancel="handleCancel">
        <div>
            <a-badge v-if="flag" status="processing" text="进行中" />
            <a-badge v-else status="success" text="已完成" /> 
        </div>
        <p>总数量：{{count}}</p>
        <a></a>
    </a-modal>
</template>

<script lang="ts" setup>
import { downloadFile } from '@/utils/utils'

const emit = defineEmits(['close'])
const props = defineProps({
    api: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    }
})
const eventSource = ref<Record<string, any>>({})
const count = ref<number>(0)
const flag = ref<boolean>(false)
const errMessage = ref<string>('')
const isSource = ref<boolean>(false)
const id = ref<string>('')

const handleOk = () => {
     emit('close')
}

const handleCancel = () => {
    emit('close')    
}

const getData = () => {

}

watch(() => props.api,
    () => {
        getData()
    }, 
    {deep: true, immediate: true}
)
</script>