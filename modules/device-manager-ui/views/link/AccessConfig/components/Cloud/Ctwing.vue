<template>
    <div>
        <a-steps class="steps-steps" :current="stepCurrent">
            <a-step disabled v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Cloud.Ctwing.076179-0') }}
                </div>
                <div style="margin-top: 42px">
                    <a-row :gutter="[24, 24]">
                        <a-col :span="16">
                            <a-form
                                :model="formState"
                                ref="formRef1"
                                name="basic"
                                autocomplete="off"
                                layout="vertical"
                            >
                                <a-row :gutter="[24, 24]">
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="$t('Cloud.Ctwing.076179-1')"
                                            name="apiAddress"
                                            :rules="[
                                                {
                                                    required: true,
                                                },
                                            ]"
                                        >
                                            <a-input
                                                v-model:value="
                                                    formState.apiAddress
                                                "
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            label="appKey"
                                            name="appKey"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.Ctwing.076179-2'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.Ctwing.076179-3'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <a-input
                                                v-model:value="formState.appKey"
                                                :placeholder="$t('Cloud.Ctwing.076179-2')"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="[24, 24]">
                                    <a-col :span="12">
                                        <a-form-item
                                            label="appSecret"
                                            name="appSecret"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.Ctwing.076179-4'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.Ctwing.076179-3'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <a-input
                                                v-model:value="
                                                    formState.appSecret
                                                "
                                                :placeholder="$t('Cloud.Ctwing.076179-4')"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="[24, 24]">
                                    <a-col :span="24">
                                        <a-form-item
                                            :label="$t('Cloud.Ctwing.076179-5')"
                                            name="description"
                                        >
                                            <a-textarea
                                                :placeholder="$t('Cloud.Ctwing.076179-6')"
                                                :rows="4"
                                                v-model:value="
                                                    formState.description
                                                "
                                                show-count
                                                :maxlength="200"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row> </a-form
                        ></a-col>
                        <a-col :span="8">
                            <j-scrollbar height="500">
                                <div class="doc">
                                    <h1>{{ $t('Cloud.Ctwing.076179-7') }}</h1>
                                    <div>
                                        {{ $t('Cloud.Ctwing.076179-8') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img1" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.076179-9') }}
                                        <!-- <div
                                            class="url"
                                            style="word-wrap: break-word"
                                        >
                                            {{
                                                `${origin}/api/ctwing/${randomString()}/notify`
                                            }}
                                        </div> -->
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.076179-10') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img2" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.076179-11') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img3" />
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img4" />
                                    </div>
                                    <a-descriptions
                                        bordered
                                        size="small"
                                        :column="1"
                                        :labelStyle="{ width: '100px' }"
                                    >
                                        <a-descriptions-item :label="$t('Cloud.Ctwing.076179-12')"
                                            >{{ $t('Cloud.Ctwing.076179-5') }}</a-descriptions-item
                                        >
                                        <a-descriptions-item label="IMEI"
                                            >{{ $t('Cloud.Ctwing.076179-13') }}</a-descriptions-item
                                        >
                                        <a-descriptions-item label="SN">
                                            {{ $t('Cloud.Ctwing.076179-14') }}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="IMSI">
                                            {{ $t('Cloud.Ctwing.076179-15') }}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="PSK">
                                            {{ $t('Cloud.Ctwing.076179-16') }}
                                        </a-descriptions-item>
                                    </a-descriptions>
                                    <div class="overLength">
                                        {{ $t('Cloud.Ctwing.076179-17') }} {{
                                                `${origin}/api/ctwing/${randomString()}/notify`
                                            }}{{ $t('Cloud.Ctwing.076179-18') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img5" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.076179-19') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img6" />
                                    </div>
                                    <h1>
                                        {{ $t('Cloud.Ctwing.076179-20') }}
                                    </h1>
                                    <div>
                                        {{ $t('Cloud.Ctwing.076179-21') }}
                                    </div>
                                </div>
                            </j-scrollbar>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 1">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Cloud.Ctwing.076179-22') }}
                </div>
                <div class="search">
                    <a-input-search
                        allowClear
                        :placeholder="$t('Cloud.Ctwing.076179-23')"
                        style="width: 300px"
                        @search="protocolSearch"
                    />
                    <j-permission-button
                        v-if='showAddBtn'
                        type="primary"
                        @click="addProtocol"
                        hasPermission="link/Protocol:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Cloud.Ctwing.076179-24') }}
                    </j-permission-button>
                </div>
                <j-scrollbar height="480">
                    <a-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="protocolList.length > 0"
                    >
                        <a-col
                            :span="8"
                            v-for="item in protocolList"
                            :key="item.id"
                        >
                            <AccessCard
                                @checkedChange="protocolChange"
                                :checked="protocolCurrent"
                                :disabled='!showAddBtn'
                                :data="{ ...item, type: 'protocol' }"
                            >
                            </AccessCard>
                        </a-col>
                    </a-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        :description="$t('Cloud.Ctwing.076179-25')"
                    />
                </j-scrollbar>
            </div>
        </div>
        <div v-if="current === 2" class="card-last">
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <TitleComponent :data="$t('Cloud.Ctwing.076179-26')" />
                    <a-form
                        :model="formData"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        ref="formRef2"
                    >
                        <a-form-item
                            :label="$t('Cloud.Ctwing.076179-27')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Cloud.Ctwing.076179-28'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Cloud.Ctwing.076179-3'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <a-input
                                :placeholder="$t('Cloud.Ctwing.076179-28')"
                                v-model:value="formData.name"
                            />
                        </a-form-item>
                        <a-form-item :label="$t('Cloud.Ctwing.076179-5')" name="description">
                            <a-textarea
                                :placeholder="$t('Cloud.Ctwing.076179-6')"
                                :rows="4"
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                            />
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="12">
                    <div class="doc" style="height: 606px">
                        <TitleComponent :data="$t('Cloud.Ctwing.076179-29')" />
                        <p>{{ $t('Cloud.Ctwing.076179-30') }}{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ $t('Cloud.Ctwing.076179-31') }}{{ protocolCurrent }}</p>
                        <TitleComponent :data="$t('Cloud.Ctwing.076179-32')" />
                        <p>
                            {{ $t('Cloud.Ctwing.076179-33') }}{{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : 'CTWing'
                            }}{{ $t('Cloud.Ctwing.076179-34') }}
                        </p>
                        <p>
                            {{ $t('Cloud.Ctwing.076179-35') }}
                            {{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : $t('Cloud.Ctwing.076179-36')
                            }}
                        </p>
                        <p>
                            {{ $t('Cloud.Ctwing.076179-37') }}
                        </p>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">

          <a-button v-if="current > 0" @click="prev" style="margin-right: 8px"> {{ $t('Cloud.Ctwing.076179-38') }} </a-button>
            <j-permission-button
                v-if="current === 2 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Cloud.Ctwing.076179-39') }}
            </j-permission-button>
          <a-button
            v-if="[0, 1].includes(current)"
            type="primary"

            @click="next"
          >
            {{ $t('Cloud.Ctwing.076179-40') }}
          </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudCtwing">
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '../../../../../api/link/accessConfig';
import { ProtocolMapping } from '../../data';
import AccessCard from '../AccessCard/index.vue';
import { randomString, onlyMessage } from '@jetlinks-web/utils';
import { useMenuStore } from '@jetlinks-web-core/store/menu';
import { network } from '../../../../../assets';
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccess, useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const menuStory = useMenuStore();
const origin = window.location.origin;
const img1 = network.network1;
const img2 = network.network2;
const img3 = network.network3;
const img4 = network.network4;
const img5 = network.network5C
const img6 = network.network6C

interface FormState {
    apiAddress: string;
    appKey: string;
    appSecret: string;
    description: string;
}
interface Form {
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
    bindProduct: {
      type: Boolean,
      default: false
    }
});

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const formState = ref<FormState>({
    apiAddress: 'https://ag-api.ctwing.cn/',
    appKey: '',
    appSecret: '',
    description: '',
});
const formData = ref<Form>({
    name: '',
    description: '',
});

const showAddBtn = computed(() => {
  return route.query.view === 'false' && !props.bindProduct
})

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref([$t('Cloud.Ctwing.076179-41'), $t('Cloud.Ctwing.076179-42'), $t('Cloud.Ctwing.076179-43')]);
const protocolList: any = ref([]);
const allProtocolList = ref([]);
const protocolCurrent: any = ref('');

const { onOpen } = useTabSaveSuccess('link/Protocol', {
  onSuccess(value) {
    protocolCurrent.value = value.result?.id;
    queryProtocolList(props.provider?.id);
  }
})

const { onBack } = useTabSaveSuccessBack()

const protocolChange = (id: string) => {
    protocolCurrent.value = id;
};

const protocolSearch = (value: string) => {
    protocolList.value = value
        ? allProtocolList.value.filter(
              (i: any) =>
                  i.name &&
                  i.name
                      .toLocaleLowerCase()
                      .includes(value.toLocaleLowerCase()),
          )
        : allProtocolList.value;
};

const saveData = async () => {
    const data: any = await formRef2.value?.validate();
    loading.value = true
    const params = {
        ...data,
        configuration: {
            ...formState.value,
            protocol: protocolCurrent.value,
        },
        protocol: protocolCurrent.value,
        provider: props.provider.id,
        transport: 'HTTP',
    };
    const resp =
        id === ':id'
            ? await save(params)
            : await update({
                  ...props.data,
                  ...params,
                  id,
              });
    if (resp.status === 200) {
        onlyMessage($t('Cloud.Ctwing.076179-44'), 'success');
        history.back();
        onBack(resp)
    }
    loading.value = false
};

const queryProtocolList = async (id: string, params = {}) => {
    const resp: any = await getProtocolList(ProtocolMapping.get(id), {
        ...params,
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
        paging: false,
    });
    if (resp.status === 200) {
        protocolList.value = resp.result;
        allProtocolList.value = resp.result;
    }
};

const addProtocol = () => {
    onOpen({
      save: true
    })
};

const next = async () => {
    if (current.value === 0) {
        await formRef1.value?.validate();
        queryProtocolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!protocolCurrent.value) {
            onlyMessage($t('Cloud.Ctwing.076179-45'), 'error');
        } else {
            current.value = current.value + 1;
        }
    }
};

const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    if (id !== ':id') {
        formState.value = props.data.configuration;
        protocolCurrent.value = props.data.protocol;
        formData.value = {
            name: props.data.name,
            description: props.data.description,
        };
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
.overLength{
    overflow-wrap: break-word;
}
</style>
