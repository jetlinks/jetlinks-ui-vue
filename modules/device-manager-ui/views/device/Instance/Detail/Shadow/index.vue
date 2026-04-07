<template>
    <div class="top">
        <j-permission-button :hasPermission="true" type="text" @click="copyText" :tooltip="{
            title: $t('Shadow.index.897708-0'),
        }">
                <AIcon type="CopyOutlined" />
        </j-permission-button>
        <j-permission-button :hasPermission="true" type="text" @click="getShadows" :tooltip="{
            title: $t('Shadow.index.897708-1'),
        }">
                <AIcon type="ReloadOutlined" />
        </j-permission-button>
    </div>
    <JsonViewer :value="data" style="background-color: #fafafa" :expanded="true" :expandDepth="10" deep="4"></JsonViewer>
</template>

<script setup lang="ts" name="Shadow">
import 'vue3-json-viewer/dist/index.css';
import { JsonViewer } from 'vue3-json-viewer';
import { useInstanceStore } from '../../../../../store/instance';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { getDeviceShadow } from '../../../../../api/instance';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const instanceStore = useInstanceStore();
const data = ref<Record<string, any>>({});

const getShadows = async()=>{
    const res:any = await getDeviceShadow(instanceStore.detail.id)
    if(res.status === 200){
      data.value = res.result
    }
}

const copyText = ()=>{
    if(navigator.clipboard){
        navigator.clipboard.writeText(JSON.stringify(data.value))
        onlyMessage($t('Shadow.index.897708-2'));
    }else{
        const input = document.createElement('input');
        input.value = JSON.stringify(data.value);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        onlyMessage($t('Shadow.index.897708-2'));
    }
}

onMounted(()=>{
    getShadows()
})

</script>

<style scoped lang="less">
.top {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 6px;
}
</style>
