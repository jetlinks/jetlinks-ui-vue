<template>
    <div style="margin-top: 20px" v-if="config.length">
        <div style="display: flex;">
            <div style="font-size: 16px; font-weight: 700">配置</div>
            <a-space>
               <a-button type="link" @click="visible = true"><AIcon type="EditOutlined" />编辑</a-button>
               <a-popconfirm title="确认重新应用该配置？" @confirm="deployBtn">
                    <a-button type="link" v-if="instanceStore.detail.current?.value !== 'notActive'"><AIcon type="CheckOutlined" />应用配置<a-tooltip title="修改配置后需重新应用后才能生效。"><AIcon type="QuestionCircleOutlined" /></a-tooltip></a-button>
               </a-popconfirm>
               <a-popconfirm title="确认恢复默认配置？" @confirm="resetBtn">
                    <a-button type="link" v-if="instanceStore.detail.aloneConfiguration"><AIcon type="SyncOutlined" />恢复默认<a-tooltip title="该设备单独编辑过配置信息，点击此将恢复成默认的配置信息，请谨慎操作。"><AIcon type="QuestionCircleOutlined" /></a-tooltip></a-button>
               </a-popconfirm>
            </a-space>
        </div>
        <a-descriptions bordered size="small" v-for="i in config" :key="i.name">
            <template #title><h4>{{i.name}}</h4></template>
            <a-descriptions-item v-for="item in i.properties" :key="item.property">
                <template #label>
                    <a-tooltip v-if="item.description" :title="item.description"><AIcon type="QuestionCircleOutlined" /></a-tooltip>
                    <span>{{item.name}}</span>
                </template>
                <span v-if="item.type.type === 'password' && instanceStore.current?.configuration?.[item.property]?.length > 0">******</span>
                <span v-else>
                    <span>{{ instanceStore.current?.configuration?.[item.property] || '' }}</span>
                    <a-tooltip v-if="isExit(item.property)" :title="`有效值:${instanceStore.current?.configuration?.[item.property]}`"><AIcon type="QuestionCircleOutlined" /></a-tooltip>
                </span>
            </a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from "@/store/instance"
import { ConfigMetadata } from "@/views/device/Product/typings"
import { getConfigMetadata, _deploy, configurationReset } from '@/api/device/instance'
import { message } from "ant-design-vue"

const instanceStore = useInstanceStore()
const visible = ref<boolean>(false)
const config = ref<ConfigMetadata[]>([])

watchEffect(() => {
    if(instanceStore.current.id){
        getConfigMetadata(instanceStore.current.id).then(resp => {
            if(resp.status === 200){
                config.value = resp?.result as ConfigMetadata[]
            }
        })
    }
})

const isExit = (property: string) => {
    return (
      instanceStore.current?.cachedConfiguration &&
      instanceStore.current?.cachedConfiguration[property] !== undefined &&
      instanceStore.current?.configuration &&
      instanceStore.current?.configuration[property] !==
        instanceStore.current?.cachedConfiguration[property]
    );
  }
  
const deployBtn = async () => {
    if(instanceStore.current.id){
        const resp = await _deploy(instanceStore.current.id)
        if (resp.status === 200) {
            message.success('操作成功')
            instanceStore.refresh(instanceStore.current.id)
        }
    }
}

const resetBtn = async () => {
    if(instanceStore.current.id){
        const resp = await configurationReset(instanceStore.current.id)
        if (resp.status === 200) {
            message.success('恢复默认配置成功')
            instanceStore.refresh(instanceStore.current.id)
        }
    }
}
</script>