<template>
    <div>
        <j-steps class="steps-steps" :current="stepCurrent">
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Cloud.OneNet.4282910-0') }}
                </div>
                <div style="margin-top: 42px">
                    <j-row :gutter="[24, 24]">
                        <j-col :span="16">
                            <j-form
                                :model="formState"
                                ref="formRef1"
                                name="basic"
                                autocomplete="off"
                                layout="vertical"
                            >
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            name="apiAddress"
                                            :rules="[
                                                {
                                                    required: true,
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                {{ $t('Cloud.OneNet.4282910-1') }}
                                                <j-tooltip
                                                    :title="$t('Cloud.OneNet.4282910-2')"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
                                            <j-input
                                                v-model:value="
                                                    formState.apiAddress
                                                "
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            label="apiKey"
                                            name="apiKey"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.OneNet.4282910-3'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.OneNet.4282910-4'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <j-input
                                                v-model:value="formState.apiKey"
                                                :placeholder="$t('Cloud.OneNet.4282910-3')"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="12">
                                        <j-form-item
                                            name="validateToken"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.OneNet.4282910-5'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.OneNet.4282910-4'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                {{ $t('Cloud.OneNet.4282910-6') }}
                                                <j-tooltip
                                                    :title="$t('Cloud.OneNet.4282910-7')"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
                                            <j-input
                                                v-model:value="
                                                    formState.validateToken
                                                "
                                                :placeholder="$t('Cloud.OneNet.4282910-5')"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="12">
                                        <j-form-item
                                            name="aesKey"
                                            :rules="[
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.OneNet.4282910-4'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                aesKey
                                                <j-tooltip
                                                    :title="$t('Cloud.OneNet.4282910-8')"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
                                            <j-input
                                                v-model:value="formState.aesKey"
                                                :placeholder="$t('Cloud.OneNet.4282910-9')"
                                            /> </j-form-item
                                    ></j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            :label="$t('Cloud.OneNet.4282910-10')"
                                            name="description"
                                        >
                                            <j-textarea
                                                :placeholder="$t('Cloud.OneNet.4282910-11')"
                                                :rows="4"
                                                v-model:value="
                                                    formState.description
                                                "
                                                show-count
                                                :maxlength="200"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row> </j-form
                        ></j-col>
                        <j-col :span="8">
                            <j-scrollbar height="500">
                                <div class="doc">
                                    <h1>{{ $t('Cloud.OneNet.4282910-12') }}</h1>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-13') }}
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-14') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img5" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-15') }}
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-16') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img6" />
                                        <div class="desc">{{ $t('Cloud.OneNet.4282910-17') }}</div>
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-18') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img7" />
                                    </div>
                                    <h1>{{ $t('Cloud.OneNet.4282910-19') }}</h1>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-20') }}<b>{{ $t('Cloud.OneNet.4282910-21') }}</b>
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img8" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-22') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img9" />
                                    </div>
                                    <j-descriptions
                                        bordered
                                        size="small"
                                        :column="1"
                                        :labelStyle="{ width: '100px' }"
                                    >
                                        <j-descriptions-item :label="$t('Cloud.OneNet.4282910-23')"
                                            >{{ $t('Cloud.OneNet.4282910-10') }}</j-descriptions-item
                                        >
                                        <j-descriptions-item :label="$t('Cloud.OneNet.4282910-24')">
                                            {{ $t('Cloud.OneNet.4282910-25') }}
                                            <div style="word-wrap: break-word">
                                                {{
                                                    `${origin}/api/one-net/${randomString()}/notify`
                                                }}
                                            </div>
                                        </j-descriptions-item>
                                        <j-descriptions-item label="Token">
                                            {{ $t('Cloud.OneNet.4282910-26') }}
                                        </j-descriptions-item>
                                        <j-descriptions-item label="AESKey">
                                            {{ $t('Cloud.OneNet.4282910-27') }}
                                        </j-descriptions-item>
                                    </j-descriptions>

                                    <j-alert
                                        :message="$t('Cloud.OneNet.4282910-28')"
                                        style="margin-top: 15px;"
                                        type="warning"
                                    >
                                    <template #description>
                                        <span>
                                            {{ $t('Cloud.OneNet.4282910-29') }}
                                            <span style="color: red">validate fail: validate token fail.</span>
                                        </span>
                                    </template>
                                    </j-alert>

                                    <h1>{{ $t('Cloud.OneNet.4282910-30') }}</h1>

                                    <j-descriptions
                                        bordered
                                        size="small"
                                        :column="1"
                                        :labelStyle="{ width: '100px' }"
                                    >
                                        <j-descriptions-item :label="$t('Cloud.OneNet.4282910-23')"
                                            >{{ $t('Cloud.OneNet.4282910-10') }}</j-descriptions-item
                                        >
                                        <j-descriptions-item label="apiKey"
                                            >{{ $t('Cloud.OneNet.4282910-31') }}</j-descriptions-item
                                        >
                                        <j-descriptions-item :label="$t('Cloud.OneNet.4282910-6')">
                                            {{ $t('Cloud.OneNet.4282910-32') }}
                                        </j-descriptions-item>
                                        <j-descriptions-item label="aesKey">
                                            {{ $t('Cloud.OneNet.4282910-33') }}
                                        </j-descriptions-item>
                                    </j-descriptions>
                                    <h1>{{ $t('Cloud.OneNet.4282910-34') }}</h1>
                                    <div>
                                        {{ $t('Cloud.OneNet.4282910-35') }}
                                    </div>
                                </div>
                            </j-scrollbar>
                        </j-col>
                    </j-row>
                </div>
            </div>
        </div>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 1">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Cloud.OneNet.4282910-36') }}
                </div>
                <div class="search">
                    <j-input-search
                        allowClear
                        :placeholder="$t('Cloud.OneNet.4282910-37')"
                        style="width: 300px"
                        @search="procotolSearch"
                    />
                    <PermissionButton
                        v-if='showAddBtn'
                        type="primary"
                        @click="addProcotol"
                        hasPermission="link/Protocol:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Cloud.OneNet.4282910-38') }}
                    </PermissionButton>
                </div>
                <j-scrollbar height="480">
                    <j-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="procotolList.length > 0"
                    >
                        <j-col
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
                        </j-col>
                    </j-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        :description="$t('Cloud.OneNet.4282910-39')"
                    />
                </j-scrollbar>
            </div>
        </div>
        <div v-if="current === 2" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component :data="$t('Cloud.OneNet.4282910-40')" />
                    <div>
                        <j-form
                            :model="formData"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            ref="formRef2"
                        >
                            <j-form-item
                                :label="$t('Cloud.OneNet.4282910-41')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Cloud.OneNet.4282910-42'),
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: $t('Cloud.OneNet.4282910-4'),
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <j-input
                                    :placeholder="$t('Cloud.OneNet.4282910-42')"
                                    v-model:value="formData.name"
                                />
                            </j-form-item>
                            <j-form-item :label="$t('Cloud.OneNet.4282910-10')" name="description">
                                <j-textarea
                                    :placeholder="$t('Cloud.OneNet.4282910-11')"
                                    :rows="4"
                                    v-model:value="formData.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </j-form-item>
                        </j-form>
                    </div>
                </j-col>
                <j-col :span="12">
                    <div class="doc" style="height: 606px">
                        <TitleComponent :data="$t('Cloud.OneNet.4282910-43')" />
                        <p>{{ $t('Cloud.OneNet.4282910-44') }}{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ $t('Cloud.OneNet.4282910-45') }}{{ procotolCurrent }}</p>
                        <TitleComponent :data="$t('Cloud.OneNet.4282910-46')" />
                        <p>
                            {{ $t('Cloud.OneNet.4282910-47') }}{{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : 'CTWing'
                            }}{{ $t('Cloud.OneNet.4282910-48') }}
                        </p>
                        <p>
                            {{ $t('Cloud.OneNet.4282910-49') }}
                            {{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : $t('Cloud.OneNet.4282910-50')
                            }}
                        </p>
                        <p>
                            {{ $t('Cloud.OneNet.4282910-51') }}
                        </p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">
          <j-button v-if="current > 0" @click="prev" style="margin-right: 8px"> {{ $t('Cloud.OneNet.4282910-52') }} </j-button>
            <PermissionButton
                style="margin-right: 8px"
                v-if="current === 2 && view === 'false'"
                type="primary"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Cloud.OneNet.4282910-53') }}
            </PermissionButton>
          <j-button
            v-if="[0, 1].includes(current)"
            type="primary"

            @click="next"
          >
            {{ $t('Cloud.OneNet.4282910-54') }}
          </j-button>

        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudOneNet">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '@/api/link/accessConfig';
import AccessCard from '../AccessCard/index.vue';
import { randomString } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { ProtocolMapping } from '../../data';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const origin = window.location.origin;
const img5 = getImage('/network/05.jpeg');
const img6 = getImage('/network/06.png');
const img7 = getImage('/network/07.jpeg');
const img8 = getImage('/network/08.png');
const img9 = getImage('/network/09.png');

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
const steps = ref([$t('Cloud.OneNet.4282910-55'), $t('Cloud.OneNet.4282910-56'), $t('Cloud.OneNet.4282910-57')]);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const procotolCurrent: any = ref('');

const showAddBtn = computed(() => {
  return route.query.view === 'false' && !props.bindProduct
})

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
        onlyMessage($t('Cloud.OneNet.4282910-58'), 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
    loading.value =false
};

const queryProcotolList = async (id: string, params = {}) => {
    const resp: any = await getProtocolList(ProtocolMapping.get(id), {
        ...params,
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
    });
    if (resp.status === 200) {
        procotolList.value = resp.result;
        allProcotolList.value = resp.result;
    }
};

const addProcotol = () => {
    const url = menuStory.menus['link/Protocol']?.path;
    const tab: any = window.open(
        `${window.location.origin + window.location.pathname}#${url}?save=true`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        if (value.success) {
            procotolCurrent.value = value.result?.id;
            queryProcotolList(props.provider?.id);
        }
    };
};

const next = async () => {
    if (current.value === 0) {
        let data1: any = await formRef1.value?.validate();
        queryProcotolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            onlyMessage($t('Cloud.OneNet.4282910-59'), 'error');
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
