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
                    {{ $t('Edge.index.4282915-0') }}
                </div>
                <div class="search">
                    <j-input-search
                        allowClear
                        :placeholder="$t('Edge.index.4282915-1')"
                        style="width: 300px"
                        @search="networkSearch"
                    />
                    <PermissionButton
                        type="primary"
                        @click="addNetwork"
                        hasPermission="link/Type:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Edge.index.4282915-2') }}
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
                                        <j-tooltip placement="top" :title="addressesTip(item.addresses)">
                                            <!-- <div
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
                                            </div> -->
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
                                                    >{{ $t('Edge.index.4282915-3') }}{{ item.addresses.length }}{{ $t('Edge.index.4282915-4') }}</span
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
                        :description="$t('Edge.index.4282915-5')"
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
                    <title-component :data="$t('Edge.index.4282915-6')" />
                    <j-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                        ref="formRef"
                    >
                        <j-form-item
                            :label="$t('Edge.index.4282915-7')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Edge.index.4282915-8'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Edge.index.4282915-9'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <j-input
                                :placeholder="$t('Edge.index.4282915-8')"
                                v-model:value="formState.name"
                            />
                        </j-form-item>
                        <j-form-item :label="$t('Edge.index.4282915-10')" name="description">
                            <j-textarea
                                :placeholder="$t('Edge.index.4282915-11')"
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
                                :loading="loading"
                            >
                                {{ $t('Edge.index.4282915-12') }}
                            </PermissionButton>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div class="doc" style="height: 600px">
                        <TitleComponent :data="$t('Edge.index.4282915-13')" />
                        <p>{{ $t('Edge.index.4282915-14') }}{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ $t('Edge.index.4282915-15') }}{{ provider.id }}</p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div
            v-if="channel !== 'edge-child-device'"
            :class="current !== 1 ? 'steps-action' : 'steps-action-save'"
        >
            <j-button v-if="current > 0" @click="prev" style="margin-right: 8px"> {{ $t('Edge.index.4282915-16') }} </j-button>
            <PermissionButton
                v-if="current === 1 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Edge.index.4282915-12') }}
            </PermissionButton>
            <j-button
              v-if="[0].includes(current)"

              @click="next"
            >
              {{ $t('Edge.index.4282915-17') }}
            </j-button>
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const loading = ref(false)
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
const steps = ref([$t('Edge.index.4282915-18'), $t('Edge.index.4282915-19')]);
const networkCurrent: any = ref('');
const networkList: any = ref([]);
const allNetworkList: any = ref([]);

const onFinish = async (values: any) => {
    loading.value = true
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
        onlyMessage($t('Edge.index.4282915-20'), 'success');
        history.back();        
        if ((window as any).onTabSaveSuccess) {            
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
    loading.value = false
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
        onlyMessage($t('Edge.index.4282915-21'), 'error');
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

const addressesTip = (data:any)=>{
    let tip:any = ''
    data.forEach((item:any)=>{
        tip =  tip + " " +item.address 
    })
    return tip
} 
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
