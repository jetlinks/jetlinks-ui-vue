<template>
    <div>
        <a-steps class="steps-steps" :current="stepCurrent">
            <a-step disabled v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Cloud.OneNet.808542-0') }}
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
                                    <a-col :span="24">
                                        <a-form-item
                                            name="apiAddress"
                                            :rules="[
                                                {
                                                    required: true,
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                {{ $t('Cloud.OneNet.808542-1') }}
                                                <a-tooltip
                                                    :title="$t('Cloud.OneNet.808542-2')"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </template>
                                            <a-input
                                                v-model:value="
                                                    formState.apiAddress
                                                "
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="[24, 24]">
                                    <a-col :span="24">
                                        <a-form-item
                                            label="apiKey"
                                            name="apiKey"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.OneNet.808542-3'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.OneNet.808542-4'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <a-input
                                                v-model:value="formState.apiKey"
                                                :placeholder="$t('Cloud.OneNet.808542-3')"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="[24, 24]">
                                    <a-col :span="12">
                                        <a-form-item
                                            name="validateToken"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.OneNet.808542-5'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.OneNet.808542-4'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                {{ $t('Cloud.OneNet.808542-6') }}
                                                <a-tooltip
                                                    :title="$t('Cloud.OneNet.808542-7')"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </template>
                                            <a-input
                                                v-model:value="
                                                    formState.validateToken
                                                "
                                                :placeholder="$t('Cloud.OneNet.808542-5')"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            name="aesKey"
                                            :rules="[
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.OneNet.808542-4'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                aesKey
                                                <a-tooltip
                                                    :title="$t('Cloud.OneNet.808542-8')"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </template>
                                            <a-input
                                                v-model:value="formState.aesKey"
                                                :placeholder="$t('Cloud.OneNet.808542-9')"
                                            /> </a-form-item
                                    ></a-col>
                                </a-row>
                                <a-row :gutter="[24, 24]">
                                    <a-col :span="24">
                                        <a-form-item
                                            :label="$t('Cloud.OneNet.808542-10')"
                                            name="description"
                                        >
                                            <a-textarea
                                                :placeholder="$t('Cloud.OneNet.808542-11')"
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
                                    <h1>{{ $t('Cloud.OneNet.808542-12') }}</h1>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-13') }}
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-14') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img5" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-15') }}
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-16') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img6" />
                                        <div class="desc">{{ $t('Cloud.OneNet.808542-17') }}</div>
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-18') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img7" />
                                    </div>
                                    <h1>{{ $t('Cloud.OneNet.808542-19') }}</h1>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-20') }}<b>{{ $t('Cloud.OneNet.808542-21') }}</b>
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img8" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-22') }}
                                    </div>
                                    <div class="image">
                                        <a-image width="100%" :src="img9" />
                                    </div>
                                    <a-descriptions
                                        bordered
                                        size="small"
                                        :column="1"
                                        :labelStyle="{ width: '100px' }"
                                    >
                                        <a-descriptions-item :label="$t('Cloud.OneNet.808542-23')"
                                            >{{ $t('Cloud.OneNet.808542-10') }}</a-descriptions-item
                                        >
                                        <a-descriptions-item :label="$t('Cloud.OneNet.808542-24')">
                                            {{ $t('Cloud.OneNet.808542-25') }}
                                            <div style="word-wrap: break-word">
                                                {{
                                                    `${origin}/api/one-net/${randomString()}/notify`
                                                }}
                                            </div>
                                        </a-descriptions-item>
                                        <a-descriptions-item label="Token">
                                            {{ $t('Cloud.OneNet.808542-26') }}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="AESKey">
                                            {{ $t('Cloud.OneNet.808542-27') }}
                                        </a-descriptions-item>
                                    </a-descriptions>

                                    <a-alert
                                        :message="$t('Cloud.OneNet.808542-28')"
                                        style="margin-top: 15px;"
                                        type="warning"
                                    >
                                    <template #description>
                                        <span>
                                            {{ $t('Cloud.OneNet.808542-29') }}
                                            <span style="color: red">validate fail: validate token fail.</span>
                                        </span>
                                    </template>
                                    </a-alert>

                                    <h1>{{ $t('Cloud.OneNet.808542-30') }}</h1>

                                    <a-descriptions
                                        bordered
                                        size="small"
                                        :column="1"
                                        :labelStyle="{ width: '100px' }"
                                    >
                                        <a-descriptions-item :label="$t('Cloud.OneNet.808542-23')"
                                            >{{ $t('Cloud.OneNet.808542-10') }}</a-descriptions-item
                                        >
                                        <a-descriptions-item label="apiKey"
                                            >{{ $t('Cloud.OneNet.808542-31') }}</a-descriptions-item
                                        >
                                        <a-descriptions-item :label="$t('Cloud.OneNet.808542-6')">
                                            {{ $t('Cloud.OneNet.808542-32') }}
                                        </a-descriptions-item>
                                        <a-descriptions-item label="aesKey">
                                            {{ $t('Cloud.OneNet.808542-33') }}
                                        </a-descriptions-item>
                                    </a-descriptions>
                                    <h1>{{ $t('Cloud.OneNet.808542-34') }}</h1>
                                    <div>
                                        {{ $t('Cloud.OneNet.808542-35') }}
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
                    {{ $t('Cloud.OneNet.808542-36') }}
                </div>
                <div class="search">
                    <a-input-search
                        allowClear
                        :placeholder="$t('Cloud.OneNet.808542-37')"
                        style="width: 300px"
                        @search="procotolSearch"
                    />
                    <j-permission-button
                        v-if='showAddBtn'
                        type="primary"
                        @click="addProcotol"
                        hasPermission="link/Protocol:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Cloud.OneNet.808542-38') }}
                    </j-permission-button>
                </div>
                <j-scrollbar height="480">
                    <a-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="procotolList.length > 0"
                    >
                        <a-col
                            :span="8"
                            v-for="item in procotolList"
                            :key="item.id"
                        >
                            <AccessCard
                                @checkedChange="procotolChange"
                                :checked="procotolCurrent"
                                :disabled='!showAddBtn'
                                :data="{ ...item, type: 'protocol' }"
                            >
                            </AccessCard>
                        </a-col>
                    </a-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        :description="$t('Cloud.OneNet.808542-39')"
                    />
                </j-scrollbar>
            </div>
        </div>
        <div v-if="current === 2" class="card-last">
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <title-component :data="$t('Cloud.OneNet.808542-40')" />
                    <div>
                        <a-form
                            :model="formData"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            ref="formRef2"
                        >
                            <a-form-item
                                :label="$t('Cloud.OneNet.808542-41')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Cloud.OneNet.808542-42'),
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: $t('Cloud.OneNet.808542-4'),
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <a-input
                                    :placeholder="$t('Cloud.OneNet.808542-42')"
                                    v-model:value="formData.name"
                                />
                            </a-form-item>
                            <a-form-item :label="$t('Cloud.OneNet.808542-10')" name="description">
                                <a-textarea
                                    :placeholder="$t('Cloud.OneNet.808542-11')"
                                    :rows="4"
                                    v-model:value="formData.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </a-form-item>
                        </a-form>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div class="doc" style="height: 606px">
                        <TitleComponent :data="$t('Cloud.OneNet.808542-43')" />
                        <p>{{ $t('Cloud.OneNet.808542-44') }}{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ $t('Cloud.OneNet.808542-45') }}{{ procotolCurrent }}</p>
                        <TitleComponent :data="$t('Cloud.OneNet.808542-46')" />
                        <p>
                            {{ $t('Cloud.OneNet.808542-47') }}{{
                                ['OneNet', 'OneNet-platform'].includes(props?.provider?.id)
                                    ? 'OneNet'
                                    : 'CTWing'
                            }}{{ $t('Cloud.OneNet.808542-48') }}
                        </p>
                        <p>
                            {{ $t('Cloud.OneNet.808542-49') }}
                            {{
                                ['OneNet', 'OneNet-platform'].includes(props?.provider?.id)
                                    ? 'OneNet'
                                    : $t('Cloud.OneNet.808542-50')
                            }}
                        </p>
                        <p>
                            {{ $t('Cloud.OneNet.808542-51') }}
                        </p>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">
          <a-button v-if="current > 0" @click="prev" style="margin-right: 8px"> {{ $t('Cloud.OneNet.808542-52') }} </a-button>
            <j-permission-button
                style="margin-right: 8px"
                v-if="current === 2 && view === 'false'"
                type="primary"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Cloud.OneNet.808542-53') }}
            </j-permission-button>
          <a-button
            v-if="[0, 1].includes(current)"
            type="primary"

            @click="next"
          >
            {{ $t('Cloud.OneNet.808542-54') }}
          </a-button>

        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudOneNet">
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '../../../../../api/link/accessConfig';
import AccessCard from '../AccessCard/index.vue';
import { randomString, onlyMessage } from '@jetlinks-web/utils';
import { ProtocolMapping } from '../../data';
import { useMenuStore } from '@jetlinks-web-core/store';
import { network } from '../../../../../assets';
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccess, useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const menuStory = useMenuStore();
const origin = window.location.origin;
const img5 = network.network5
const img6 = network.network6
const img7 = network.network7
const img8 = network.network8
const img9 = network.network9

interface FormState {
    apiAddress: string;
    apiKey: string;
    validateToken: string;
    aesKey: string;
    description: string;
}
interface Form {
    name: string;
    description: string;
}

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

const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const formState = ref<FormState>({
    apiAddress:   props.provider.id === 'OneNet' ? 'http://api.zj.cmcconenet.com/' : 'https://iot-api.heclouds.com',
    apiKey: '',
    validateToken: '',
    aesKey: '',
    description: '',
});
const formData = ref<Form>({
    name: '',
    description: '',
});

const loading = ref(false)
const current = ref(0);
const stepCurrent = ref(0);
const steps = ref([$t('Cloud.OneNet.808542-55'), $t('Cloud.OneNet.808542-56'), $t('Cloud.OneNet.808542-57')]);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const procotolCurrent: any = ref('');

const showAddBtn = computed(() => {
  return route.query.view === 'false' && !props.bindProduct
})

const { onOpen } = useTabSaveSuccess('link/Protocol', {
  onSuccess(value) {
    procotolCurrent.value = value.result?.id;
    queryProcotolList(props.provider?.id);
  }
})

const { onBack } = useTabSaveSuccessBack()

const procotolChange = (id: string) => {
    procotolCurrent.value = id;
};

const procotolSearch = (value: string) => {
    procotolList.value = value
        ? allProcotolList.value.filter(
              (i: any) =>
                  i.name &&
                  i.name
                      .toLocaleLowerCase()
                      .includes(value.toLocaleLowerCase()),
          )
        : allProcotolList.value;
};

const saveData = async () => {
    const data: any = await formRef2.value?.validate();
    loading.value = true
    const params = {
        ...data,
        configuration: {
            ...formState.value,
            protocol: procotolCurrent.value,
        },
        protocol: procotolCurrent.value,
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
        onlyMessage($t('Cloud.OneNet.808542-58'), 'success');
        history.back();
        onBack(resp)
    }
    loading.value =false
};

const queryProcotolList = async (id: string, params = {}) => {
    const resp: any = await getProtocolList(ProtocolMapping.get(id), {
        ...params,
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
        paging: false,
    });
    if (resp.status === 200) {
        procotolList.value = resp.result;
        allProcotolList.value = resp.result;
    }
};

const addProcotol = () => {
  onOpen({
    save: true
  })
};

const next = async () => {
    if (current.value === 0) {
        let data1: any = await formRef1.value?.validate();
        queryProcotolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            onlyMessage($t('Cloud.OneNet.808542-59'), 'error');
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
        procotolCurrent.value = props.data.protocol;
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

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}

.form-label {
    height: 30px;
    padding-bottom: 8px;
}

.desc {
    width: 100%;
    text-align: center;
    color: rgb(138, 143, 141);
    margin-top: 10px;
}
</style>
