<template>
    <div v-if="type === 'edge'">
        <a-steps
            v-if="channel !== 'edge-child-device'"
            class="steps-steps"
            :current="stepCurrent"
        >
            <a-step disabled v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div v-if="channel !== 'edge-child-device'" class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Edge.index.066653-0') }}
                </div>
                <div class="search">
                    <a-input-search
                        allowClear
                        :placeholder="$t('Edge.index.066653-1')"
                        style="width: 300px"
                        @search="networkSearch"
                    />
                    <j-permission-button
                        type="primary"
                        @click="addNetwork"
                        hasPermission="link/Type:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Edge.index.066653-2') }}
                    </j-permission-button>
                </div>
                <j-scrollbar height="480">
                    <a-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="networkList.length > 0"
                    >
                        <a-col
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
                                        <a-tooltip placement="top" :title="addressesTip(item.addresses)">
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
                                                    <a-badge
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
                                                <a-badge
                                                    :status="getColor(i)"
                                                    :text="i.address"
                                                />
                                                <span
                                                    v-if="
                                                        (item.addresses || [])
                                                            .length > 1
                                                    "
                                                    >{{ $t('Edge.index.066653-3') }}{{ item.addresses.length }}{{ $t('Edge.index.066653-4') }}</span
                                                >
                                            </div>
                                        </a-tooltip>
                                    </div>
                                </template>
                            </AccessCard>
                        </a-col>
                    </a-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        :description="$t('Edge.index.066653-5')"
                    />
                </j-scrollbar>
            </div>
        </div>
        <div
            v-if="channel === 'edge-child-device' || current === 1"
            class="card-last"
        >
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <title-component :data="$t('Edge.index.066653-6')" />
                    <a-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                        ref="formRef"
                    >
                        <a-form-item
                            :label="$t('Edge.index.066653-7')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Edge.index.066653-8'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Edge.index.066653-9'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <a-input
                                :placeholder="$t('Edge.index.066653-8')"
                                v-model:value="formState.name"
                            />
                        </a-form-item>
                        <a-form-item :label="$t('Edge.index.066653-10')" name="description">
                            <a-textarea
                                :placeholder="$t('Edge.index.066653-11')"
                                :rows="4"
                                v-model:value="formState.description"
                                show-count
                                :maxlength="200"
                            />
                        </a-form-item>
                        <a-form-item>
                            <j-permission-button
                                v-if="current !== 1 && view === 'false'"
                                type="primary"
                                html-type="submit"
                                :hasPermission="`link/AccessConfig:${
                                    id === ':id' ? 'add' : 'update'
                                }`"
                                :loading="loading"
                            >
                                {{ $t('Edge.index.066653-12') }}
                            </j-permission-button>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="12">
                    <div class="doc" style="height: 600px">
                        <TitleComponent :data="$t('Edge.index.066653-13')" />
                        <p>{{ $t('Edge.index.066653-14') }}{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ $t('Edge.index.066653-15') }}{{ provider.id }}</p>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div
            v-if="channel !== 'edge-child-device'"
            :class="current !== 1 ? 'steps-action' : 'steps-action-save'"
        >
            <a-button v-if="current > 0" @click="prev" style="margin-right: 8px"> {{ $t('Edge.index.066653-16') }} </a-button>
            <j-permission-button
                v-if="current === 1 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Edge.index.066653-12') }}
            </j-permission-button>
            <a-button
              v-if="[0].includes(current)"

              @click="next"
            >
              {{ $t('Edge.index.066653-17') }}
            </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessEdge">
import { onlyMessage, randomString } from '@jetlinks-web/utils';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getNetworkList } from '../../../../../api/link/accessConfig';
import {
    descriptionList,
    ProtocolMapping,
    NetworkTypeMapping,
} from '../../data';
import AccessCard from '../AccessCard/index.vue';
import { useMenuStore } from '@jetlinks-web-core/store/menu';
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccess, useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
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
const steps = ref([$t('Edge.index.066653-18'), $t('Edge.index.066653-19')]);
const networkCurrent: any = ref('');
const networkList: any = ref([]);
const allNetworkList: any = ref([]);

const { onBack } = useTabSaveSuccessBack()

const { onOpen } = useTabSaveSuccess('link/Type/Detail', {
  onSuccess(value) {
    networkCurrent.value = value.result.id;
    queryNetworkList(props.provider?.id, networkCurrent.value || '');
  }
})

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
        onlyMessage($t('Edge.index.066653-20'), 'success');
        history.back();
        onBack(resp)
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
  onOpen({
    type: NetworkTypeMapping.get(props.provider?.id) || ''
  })
};

const next = async () => {
    if (!networkCurrent.value) {
        onlyMessage($t('Edge.index.066653-21'), 'error');
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
