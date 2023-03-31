<template>
    <div v-if="type === 'edge'">
        <j-steps
            v-if="channel !== 'edge-child-device'"
            class="steps-steps"
            :current="stepCurrent"
        >
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div v-if="channel !== 'edge-child-device'" class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    选择与设备通信的网络组件
                </div>
                <div class="search">
                    <j-input-search
                        allowClear
                        placeholder="请输入"
                        style="width: 300px"
                        @search="networkSearch"
                    />
                    <PermissionButton
                        type="primary"
                        @click="addNetwork"
                        hasPermission="link/Type:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </div>
                <j-scrollbar height="480">
                    <j-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="networkList.length > 0"
                    >
                        <j-col
                            :span="8"
                            v-for="item in networkList"
                            :key="item.id"
                        >
                            <AccessCard
                                @checkedChange="checkedChange"
                                :checked="networkCurrent"
                                :data="{
                                    ...item,
                                    description: item.description
                                        ? item.description
                                        : descriptionList[provider.id],
                                }"
                            >
                                <template #other>
                                    <div class="other">
                                        <j-tooltip placement="topLeft">
                                            <div
                                                v-if="
                                                    (item.addresses || [])
                                                        .length > 1
                                                "
                                            >
                                                <div
                                                    v-for="i in item.addresses ||
                                                    []"
                                                    :key="i.address"
                                                    class="item"
                                                >
                                                    <j-badge
                                                        :status="getColor(i)"
                                                    />{{ i.address }}
                                                </div>
                                            </div>
                                            <div
                                                v-for="i in (
                                                    item.addresses || []
                                                ).slice(0, 1)"
                                                :key="i.address"
                                                class="item"
                                            >
                                                <j-badge
                                                    :status="getColor(i)"
                                                    :text="i.address"
                                                />
                                                <span
                                                    v-if="
                                                        (item.addresses || [])
                                                            .length > 1
                                                    "
                                                    >...</span
                                                >
                                            </div>
                                        </j-tooltip>
                                    </div>
                                </template>
                            </AccessCard>
                        </j-col>
                    </j-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        description="暂无数据"
                    />
                </j-scrollbar>
            </div>
        </div>
        <div
            v-if="channel === 'edge-child-device' || current === 1"
            class="card-last"
        >
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component data="基本信息" />
                    <j-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                        ref="formRef"
                    >
                        <j-form-item
                            label="名称"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入名称',
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <j-input
                                placeholder="请输入名称"
                                v-model:value="formState.name"
                            />
                        </j-form-item>
                        <j-form-item label="说明" name="description">
                            <j-textarea
                                placeholder="请输入说明"
                                :rows="4"
                                v-model:value="formState.description"
                                show-count
                                :maxlength="200"
                            />
                        </j-form-item>
                        <j-form-item>
                            <PermissionButton
                                v-if="current !== 1 && view === 'false'"
                                type="primary"
                                html-type="submit"
                                :hasPermission="`link/AccessConfig:${
                                    id === ':id' ? 'add' : 'update'
                                }`"
                            >
                                保存
                            </PermissionButton>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div class="doc" style="height: 600px">
                        <TitleComponent data="配置概览" />
                        <p>接入方式：{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>消息协议：{{ provider.id }}</p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div
            v-if="channel !== 'edge-child-device'"
            :class="current !== 1 ? 'steps-action' : 'steps-action-save'"
        >
            <j-button
                v-if="[0].includes(current)"
                style="margin-right: 8px"
                @click="next"
            >
                下一步
            </j-button>
            <PermissionButton
                v-if="current === 1 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
            >
                保存
            </PermissionButton>
            <j-button v-if="current > 0" @click="prev"> 上一步 </j-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessEdge">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getNetworkList } from '@/api/link/accessConfig';
import {
    descriptionList,
    ProtocolMapping,
    NetworkTypeMapping,
} from '../../data';
import AccessCard from '../AccessCard/index.vue';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const type = ref(props.provider.type || props.data.type);
const channel = ref(props.provider.channel);

const formState = ref<FormState>({
    name: '',
    description: '',
});

const formRef = ref<FormInstance>();

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['网络组件', '完成']);
const networkCurrent: any = ref('');
const networkList: any = ref([]);
const allNetworkList: any = ref([]);

const onFinish = async (values: any) => {
    const providerId = props.provider.id;
    const params = {
        ...values,
        protocol: 'official-edge-protocol',
        provider: providerId,
        transport: ProtocolMapping.get(providerId),
    };
    if (networkCurrent.value) params.channelId = networkCurrent.value;
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage('操作成功', 'success');
        history.back();        
        if ((window as any).onTabSaveSuccess) {            
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
};

const checkedChange = (id: string) => {
    networkCurrent.value = id;
};
const getColor = (i: any) => (i.health === -1 ? 'error' : 'processing');

const queryNetworkList = async (id: string, include: string, data = {}) => {
    const resp = await getNetworkList(
        NetworkTypeMapping.get(id),
        include,
        data,
    );
    if (resp.status === 200) {
        networkList.value = resp.result;
        allNetworkList.value = resp.result;
    }
};

const networkSearch = (value: string) => {
    networkList.value = value
        ? allNetworkList.value.filter(
              (i: any) =>
                  i.name &&
                  i.name
                      .toLocaleLowerCase()
                      .includes(value.toLocaleLowerCase()),
          )
        : allNetworkList.value;
};

const saveData = async () => {
    const data: any = await formRef.value?.validate();
    onFinish(data);
};

const addNetwork = () => {
    const url = menuStory.menus['link/Type/Detail']?.path;
    const tab: any = window.open(
        `${window.location.origin + window.location.pathname}#${url}?type=${
            NetworkTypeMapping.get(props.provider?.id) || ''
        }`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        if (value.success) {
            networkCurrent.value = value.result.id;
            queryNetworkList(props.provider?.id, networkCurrent.value || '');
        }
    };
};

const next = async () => {
    if (!networkCurrent.value) {
        onlyMessage('请选择网络组件！', 'error');
    } else {
        current.value = current.value + 1;
    }
};
const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    if (props.provider.id === 'official-edge-gateway') {
        queryNetworkList(props.provider.id, '');
    }
    if (id !== ':id') {
        formState.value = {
            name: props.data.name,
            description: props.data?.description || '',
        };
        networkCurrent.value = props.data.channelId;
    }
});
watch(
    current,
    (v) => {
        stepCurrent.value = v;
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.steps-content {
    margin-top: 20px;
}
.steps-box {
    min-height: 400px;
    .card-last {
        padding-right: 5px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}

.steps-action {
    width: 100%;
    margin-top: 24px;
}
.steps-action-save {
    margin-left: 0;
}
.alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
.search {
    display: flex;
    margin: 15px 0;
    justify-content: space-between;
}

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
.config-right {
    padding: 20px;
    .config-right-item {
        margin-bottom: 10px;

        .config-right-item-title {
            width: 100%;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .config-right-item-context {
            margin: 5px 0;
            color: rgba(0, 0, 0, 0.8);
        }
    }
}
</style>
