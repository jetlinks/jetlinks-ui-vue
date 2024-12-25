<template>
    <div class="container">
        <a-row align="middle" :gutter="[16, 16]">
            <a-col :span="2">
                <div class="title">
                    快捷创建
                </div>
            </a-col>
            <a-col :span="22">
                <div class="tip">
                    海量产品方案支撑，轻松创建标准产品
                </div>
            </a-col>
        </a-row>
        <div class="createSteps">
            <a-steps direction="vertical" :current="2">
                <a-step>
                    <template #title>
                        <div>
                            <span>已选择产品</span>
                            <a-button type="link" @click="emits('reselection')">重新选择</a-button>
                        </div>
                    </template>
                    <template #description>
                        <div class="resource">
                            <img src="" alt="">
                            <div>
                                {{ data?.name }}
                            </div>
                            <a-button type="link" @click="showMetadata">
                                <template #icon>
                                    <AIcon type="InboxOutlined"></AIcon>
                                </template>
                                物模型
                            </a-button>
                        </div>
                    </template>
                </a-step>
                <a-step>
                    <template #title>
                        <div>
                            <span>接入配置</span>
                            <a-button v-if="!visibleAdvanceMode" type="link" @click="showAdvancedMode">高级模式</a-button>
                        </div>
                    </template>
                    <template #description>
                        <div v-if="!visibleAdvanceMode" :class="{ 'accessConfig': true, 'unmet': unmet }">
                            <template v-if="!unmet">
                                <img :src="BackMap.get(accessConfig?.provider)" alt="">
                                <div style="margin-left: 24px;">
                                    <div class="accessName">
                                        {{ accessConfig?.name }}
                                    </div>
                                    <a-row :gutter="[12, 12]">
                                        <a-col>
                                            <div>网络: {{ }}</div>
                                        </a-col>
                                        <a-col>
                                            <div>协议: {{ protocol?.name }}</div>
                                        </a-col>
                                    </a-row>
                                </div>
                            </template>
                            <div v-else>
                                未满足条件,请点击高级模式
                            </div>
                        </div>
                        <AdvanceMode v-else :accessList="data?.accessInfos" :descriptions="accessDescriptions"
                            @submitData="advanceComplete" @quit="visibleAdvanceMode = false" />
                    </template>
                </a-step>
                <a-step title="完善产品信息">
                    <div>
                        <a-form>
                            <a-form-item label="产品名称"></a-form-item>
                            <a-form-item label="设备类型">
                                <j-card-select :value="form.deviceType" :options="deviceList" @change="changeDeviceType">
                                    <template #title="item">
                                        <span>{{ item.title }}</span>
                                        <a-tooltip :title="item.option.tooltip">
                                            <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
                                        </a-tooltip>
                                    </template>
                                </j-card-select>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-step>
            </a-steps>
        </div>
        <Metadata v-if="metadataVisible" :metadata="metadata" :data="metadataData" @close="metadataVisible = false"
            @complete="generateMetadata" />
    </div>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import Metadata from './components/Metadata.vue';
import { BackMap } from '@/views/link/AccessConfig/data';
import { getResourcesCurrent } from '@/api/link/accessConfig';
import { NetworkTypeMapping } from './data';
import { UDPList, TCPList } from './data';
import AdvanceMode from './components/AdvanceMode.vue';
import { getProviders } from '@/api/device/product';
const props = defineProps({
    data: {
        type: Object,
        default: () => {

        }
    }
})
const emits = defineEmits(['reselection'])
const form = ref({

})
const deviceList = ref([])
//接口获取到的物模型
const metadata = ref()
//network类型无可用端口
const unmet = ref(false)
const accessConfig = ref({})
//资源库默认协议
const protocol = ref({})
//资源库默认插件
const plugin = ref({})
//设备接入网管描述
const accessDescriptions = ref(new Map())
//自动生成的网络组件
const network = ref({})
const metadataVisible = ref(false);
const visibleAdvanceMode = ref(false)
const showMetadata = () => {
    metadataVisible.value = true
}
const metadataData = ref()

//获取对应网络组件类型是否有可用端口
const filterConfigByType = (data, type) => {
    let _temp = type;
    if (TCPList.includes(type)) {
        _temp = 'TCP';
    } else if (UDPList.includes(type)) {
        _temp = 'UDP';
    }
    // 只保留ports 包含type的数据
    const _config = data?.filter((item) => {
        return Object.keys(item.ports).includes(_temp);
    });

    // 只保留ports的type数据
    return _config?.map((i) => {
        i.ports = i.ports[_temp];
        return i;
    });
};

//选中物模型
const generateMetadata = (data) => {
    metadataData.value = data
    metadataVisible.value = false
}
const showAdvancedMode = () => {
    visibleAdvanceMode.value = true
}

//查询默认接入方式的插件或协议

//查询默认接入方式网络组件可用端口
const queryAvailablePort = async () => {
    const res = await getResourcesCurrent();
    if (res.success && NetworkTypeMapping.get(accessConfig.value.provider)) {
        const _ports = filterConfigByType(res.result, NetworkTypeMapping.get(accessConfig.value.provider))
        if (_ports.length) {

        } else {
            unmet.value = false
        }
    }
}

const getDescription = async () => {
    const res = await getProviders()
    if (res.success) {
        res.result.forEach((i) => {
            accessDescriptions.value.set(i.id, i.description)
        })
    }
}
//高级模式选择完成
const advanceComplete = (data) => {
    console.log(data);
}

const changeDeviceType = () =>{

}

onMounted(() => {
    getDescription();
    metadata.value = JSON.parse(props.data?.metadata || "{}")
    metadataData.value = cloneDeep(metadata.value)
    accessConfig.value = props.data?.accessInfos?.filter((i) => {
        return i.defaultAccess
    })?.[0] || {}
    if (accessConfig.value?.channel === 'network') {
        queryAvailablePort();
    }
    if (accessConfig.value?.bindInfo) {
        if (accessConfig.value?.channel === 'network') {
            protocol.value = accessConfig.value.bindInfo.filter((i) => {
                return i.defaultAccess
            })?.[0] || {}
        } else if (accessConfig.value?.channel === 'plugin') {
            plugin.value = accessConfig.value.bindInfo.filter((i) => {
                return i.defaultAccess
            })?.[0] || {}
        }
    }
})
</script>
<style lang='less' scoped>
.container {
    padding: 10px 20px;
}

.title {
    font-size: 16px;
}

.createSteps {
    margin-top: 40px;
    padding: 0 20px;

    .accessConfig {
        display: flex;
        align-items: center;
        border: 1px solid #c1c1c1;
        padding: 10px 20px;
        border-radius: 8px;

        .accessName {
            font-size: 16px;
            margin-bottom: 8px;
        }
    }

    .unmet {
        background-color: #848587;
    }
}

.resource {
    border: 1px solid #bebfbf;
    display: flex;
    padding: 10px;
    align-items: center;
    border-radius: 4px;
}
</style>