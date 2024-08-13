<template>
    <div>
        <j-steps class="steps-steps" :current="stepCurrent">
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ $t('Cloud.Ctwing.4282912-0') }}
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
                                    <j-col :span="12">
                                        <j-form-item
                                            :label="$t('Cloud.Ctwing.4282912-1')"
                                            name="apiAddress"
                                            :rules="[
                                                {
                                                    required: true,
                                                },
                                            ]"
                                        >
                                            <j-input
                                                v-model:value="
                                                    formState.apiAddress
                                                "
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="12">
                                        <j-form-item
                                            label="appKey"
                                            name="appKey"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.Ctwing.4282912-2'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.Ctwing.4282912-3'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <j-input
                                                v-model:value="formState.appKey"
                                                :placeholder="$t('Cloud.Ctwing.4282912-2')"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="12">
                                        <j-form-item
                                            label="appSecret"
                                            name="appSecret"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: $t('Cloud.Ctwing.4282912-4'),
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        $t('Cloud.Ctwing.4282912-3'),
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <j-input
                                                v-model:value="
                                                    formState.appSecret
                                                "
                                                :placeholder="$t('Cloud.Ctwing.4282912-4')"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            :label="$t('Cloud.Ctwing.4282912-5')"
                                            name="description"
                                        >
                                            <j-textarea
                                                :placeholder="$t('Cloud.Ctwing.4282912-6')"
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
                                    <h1>{{ $t('Cloud.Ctwing.4282912-7') }}</h1>
                                    <div>
                                        {{ $t('Cloud.Ctwing.4282912-8') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img1" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.4282912-9') }}
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
                                        {{ $t('Cloud.Ctwing.4282912-10') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img2" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.4282912-11') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img3" />
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img4" />
                                    </div>
                                    <j-descriptions
                                        bordered
                                        size="small"
                                        :column="1"
                                        :labelStyle="{ width: '100px' }"
                                    >
                                        <j-descriptions-item :label="$t('Cloud.Ctwing.4282912-12')"
                                            >{{ $t('Cloud.Ctwing.4282912-5') }}</j-descriptions-item
                                        >
                                        <j-descriptions-item label="IMEI"
                                            >{{ $t('Cloud.Ctwing.4282912-13') }}</j-descriptions-item
                                        >
                                        <j-descriptions-item label="SN">
                                            {{ $t('Cloud.Ctwing.4282912-14') }}
                                        </j-descriptions-item>
                                        <j-descriptions-item label="IMSI">
                                            {{ $t('Cloud.Ctwing.4282912-15') }}
                                        </j-descriptions-item>
                                        <j-descriptions-item label="PSK">
                                            {{ $t('Cloud.Ctwing.4282912-16') }}
                                        </j-descriptions-item>
                                    </j-descriptions>
                                    <div class="overLength">
                                        {{ $t('Cloud.Ctwing.4282912-17') }} {{
                                                `${origin}/api/ctwing/${randomString()}/notify`
                                            }}{{ $t('Cloud.Ctwing.4282912-18') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img5" />
                                    </div>
                                    <div>
                                        {{ $t('Cloud.Ctwing.4282912-19') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img6" />
                                    </div>
                                    <h1>
                                        {{ $t('Cloud.Ctwing.4282912-20') }}
                                    </h1>
                                    <div>
                                        {{ $t('Cloud.Ctwing.4282912-21') }}
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
                    {{ $t('Cloud.Ctwing.4282912-22') }}
                </div>
                <div class="search">
                    <j-input-search
                        allowClear
                        :placeholder="$t('Cloud.Ctwing.4282912-23')"
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
                        {{ $t('Cloud.Ctwing.4282912-24') }}
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
                        :description="$t('Cloud.Ctwing.4282912-25')"
                    />
                </j-scrollbar>
            </div>
        </div>
        <div v-if="current === 2" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <TitleComponent :data="$t('Cloud.Ctwing.4282912-26')" />
                    <j-form
                        :model="formData"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        ref="formRef2"
                    >
                        <j-form-item
                            :label="$t('Cloud.Ctwing.4282912-27')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Cloud.Ctwing.4282912-28'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Cloud.Ctwing.4282912-3'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <j-input
                                :placeholder="$t('Cloud.Ctwing.4282912-28')"
                                v-model:value="formData.name"
                            />
                        </j-form-item>
                        <j-form-item :label="$t('Cloud.Ctwing.4282912-5')" name="description">
                            <j-textarea
                                :placeholder="$t('Cloud.Ctwing.4282912-6')"
                                :rows="4"
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                            />
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div class="doc" style="height: 606px">
                        <TitleComponent :data="$t('Cloud.Ctwing.4282912-29')" />
                        <p>{{ $t('Cloud.Ctwing.4282912-30') }}{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ $t('Cloud.Ctwing.4282912-31') }}{{ procotolCurrent }}</p>
                        <TitleComponent :data="$t('Cloud.Ctwing.4282912-32')" />
                        <p>
                            {{ $t('Cloud.Ctwing.4282912-33',[props?.provider?.id === 'OneNet'
                          ? 'OneNet'
                          : 'CTWing']) }}
                        </p>
                        <p>
                            {{ $t('Cloud.Ctwing.4282912-35') }}
                            {{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : $t('Cloud.Ctwing.4282912-36')
                            }}
                        </p>
                        <p>
                            {{ $t('Cloud.Ctwing.4282912-37') }}
                        </p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">

          <j-button v-if="current > 0" @click="prev" style="margin-right: 8px"> {{ $t('Cloud.Ctwing.4282912-38') }} </j-button>
            <PermissionButton
                v-if="current === 2 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Cloud.Ctwing.4282912-39') }}
            </PermissionButton>
          <j-button
            v-if="[0, 1].includes(current)"
            type="primary"

            @click="next"
          >
            {{ $t('Cloud.Ctwing.4282912-40') }}
          </j-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudCtwing">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '@/api/link/accessConfig';
import { ProtocolMapping } from '../../data';
import AccessCard from '../AccessCard/index.vue';
import { randomString } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const origin = window.location.origin;
const img1 = getImage('/network/01.png');
const img2 = getImage('/network/02.jpg');
const img3 = getImage('/network/03.png');
const img4 = getImage('/network/04.jpg');
const img5 = getImage('/network/05-Ctwing.png')
const img6 = getImage('/network/06-Ctwing.png')

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
const steps = ref([$t('Cloud.Ctwing.4282912-41'), $t('Cloud.Ctwing.4282912-42'), $t('Cloud.Ctwing.4282912-43')]);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const procotolCurrent: any = ref('');

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
        onlyMessage($t('Cloud.Ctwing.4282912-44'), 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
    loading.value = false
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
        await formRef1.value?.validate();
        queryProcotolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            onlyMessage($t('Cloud.Ctwing.4282912-45'), 'error');
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
.overLength{
    overflow-wrap: break-word;
}
</style>
