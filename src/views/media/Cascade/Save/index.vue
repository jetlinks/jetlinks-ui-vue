<!-- 国标级联新增/编辑 -->
<template>
    <page-container>
        <j-card>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form ref="formRef" layout="vertical" :model="formData">
                        <j-row :gutter="24">
                            <TitleComponent :data="$t('Save.index.755832-0')" />
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-1')"
                                    name="cascadeName"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-2'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.cascadeName"
                                        :placeholder="$t('Save.index.755832-2')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-4')"
                                    name="proxyStream"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-5'),
                                        },
                                    ]"
                                >
                                    <j-radio-group
                                        button-style="solid"
                                        v-model:value="formData.proxyStream"
                                    >
                                        <j-radio-button :value="true">
                                            {{ $t('Save.index.755832-6') }}
                                        </j-radio-button>
                                        <j-radio-button :value="false">
                                            {{ $t('Save.index.755832-7') }}
                                        </j-radio-button>
                                    </j-radio-group>
                                </j-form-item>
                            </j-col>

                            <TitleComponent :data="$t('Save.index.755832-8')" />
                            <j-col :span="12">
                                <j-form-item
                                    name="clusterNodeId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-9'),
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            {{ $t('Save.index.755832-10') }}
                                            <j-tooltip
                                                :title="$t('Save.index.755832-11')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-select
                                        v-model:value="formData.clusterNodeId"
                                        :placeholder="$t('Save.index.755832-9')"
                                        :options="clustersList"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-12')"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-13'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.name"
                                        :placeholder="$t('Save.index.755832-13')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :label="$t('Save.index.755832-14')"
                                    name="sipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-15'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.sipId"
                                        :placeholder="$t('Save.index.755832-15')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-16')"
                                    name="domain"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-17'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.domain"
                                        :placeholder="$t('Save.index.755832-17')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-18')"
                                    name="remoteAddress"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-19'),
                                        },
                                        {
                                            validator: checkSIP,
                                        },
                                    ]"
                                >
                                    <j-row :gutter="10">
                                        <j-col :span="14">
                                            <j-input
                                                v-model:value="
                                                    formData.remoteAddress
                                                "
                                                :placeholder="$t('Save.index.755832-20')"
                                            />
                                        </j-col>
                                        <j-col :span="10">
                                            <j-input-number
                                                :min="1"
                                                :max="65535"
                                                v-model:value="
                                                    formData.remotePort
                                                "
                                                :placeholder="$t('Save.index.755832-21')"
                                                style="width: 100%"
                                                :precision="0"
                                            />
                                        </j-col>
                                    </j-row>
                                </j-form-item>
                            </j-col>

                            <j-col :span="24">
                                <j-form-item
                                    :label="$t('Save.index.755832-22')"
                                    name="localSipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-23'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.localSipId"
                                        :placeholder="$t('Save.index.755832-24')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    name="host"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-25'),
                                        },
                                        {
                                            validator: checkLocalSIP,
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            {{ $t('Save.index.755832-26') }}
                                            <j-tooltip
                                                :title="$t('Save.index.755832-27')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-row :gutter="10">
                                        <j-col :span="14">
                                            <j-select
                                                v-model:value="formData.host"
                                                :placeholder="$t('Save.index.755832-28')"
                                                :options="allList"
                                                @change="setPorts"
                                                showSearch
                                            />
                                        </j-col>
                                        <j-col :span="10">
                                            <j-select
                                                v-model:value="formData.port"
                                                :placeholder="$t('Save.index.755832-29')"
                                                :options="allListPorts"
                                            />
                                        </j-col>
                                    </j-row>
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-30')"
                                    name="publicHost"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-31'),
                                        },
                                        {
                                            validator: checkPublicSIP,
                                        },
                                    ]"
                                >
                                    <j-row :gutter="10">
                                        <j-col :span="14">
                                            <j-input
                                                v-model:value="
                                                    formData.publicHost
                                                "
                                                :placeholder="$t('Save.index.755832-20')"
                                            />
                                        </j-col>
                                        <j-col :span="10">
                                            <j-input-number
                                                :min="1"
                                                :max="65535"
                                                v-model:value="
                                                    formData.publicPort
                                                "
                                                :placeholder="$t('Save.index.755832-21')"
                                                style="width: 100%"
                                                :precision="0"
                                            />
                                        </j-col>
                                    </j-row>
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :label="$t('Save.index.755832-32')"
                                    name="transport"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-33'),
                                        },
                                    ]"
                                >
                                    <j-radio-group
                                        button-style="solid"
                                        v-model:value="formData.transport"
                                        @change="handleTransportChange"
                                    >
                                        <j-radio-button value="UDP">
                                            UDP
                                        </j-radio-button>
                                        <j-radio-button value="TCP">
                                            TCP
                                        </j-radio-button>
                                    </j-radio-group>
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-34')"
                                    name="user"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-35'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.user"
                                        :placeholder="$t('Save.index.755832-35')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-36')"
                                    name="password"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-37'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input-password
                                        v-model:value="formData.password"
                                        :placeholder="$t('Save.index.755832-37')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-38')"
                                    name="manufacturer"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-39'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.manufacturer"
                                        :placeholder="$t('Save.index.755832-39')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-40')"
                                    name="model"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-41'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.model"
                                        :placeholder="$t('Save.index.755832-41')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-42')"
                                    name="firmware"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-43'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.755832-3'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.firmware"
                                        :placeholder="$t('Save.index.755832-43')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-44')"
                                    name="keepaliveInterval"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-45'),
                                        },
                                        {
                                            pattern: /^[1-9]\d*$/,
                                            message: $t('Save.index.755832-46'),
                                        }
                                    ]"
                                >
                                    <j-input-number
                                        :min="1"
                                        :max="10000"
                                        v-model:value="
                                            formData.keepaliveInterval
                                        "
                                        :placeholder="$t('Save.index.755832-45')"
                                        style="width: 100%"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Save.index.755832-47')"
                                    name="registerInterval"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.755832-48'),
                                        },
                                        {
                                            pattern: /^[1-9]\d*$/,
                                            message: $t('Save.index.755832-46'),
                                        }
                                    ]"
                                >
                                    <j-input-number
                                        :min="1"
                                        :max="10000"
                                        v-model:value="
                                            formData.registerInterval
                                        "
                                        :placeholder="$t('Save.index.755832-48')"
                                        style="width: 100%"
                                    />
                                </j-form-item>
                            </j-col>
                        </j-row>

                        <j-form-item>
                            <j-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                {{ $t('Save.index.755832-49') }}
                            </j-button>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div class="doc">
                        <h1>{{ $t('Save.index.755832-50') }}</h1>
                        <div>
                            {{ $t('Save.index.755832-51') }}
                        </div>
                        <div>
                            <j-alert
                                :message="$t('Save.index.755832-52')"
                                type="info"
                                show-icon
                            />
                        </div>
                        <h1>{{ $t('Save.index.755832-53') }}</h1>
                        <div>
                            {{ $t('Save.index.755832-54') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-55') }}</h2>
                        <div>{{ $t('Save.index.755832-56') }}<b>SIP ID</b>{{ $t('Save.index.755832-64') }}</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/northbound/doc2.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.755832-57') }}</h2>
                        <div>{{ $t('Save.index.755832-56') }}<b>{{ $t('Save.index.755832-58') }}</b>{{ $t('Save.index.755832-64') }}</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/northbound/doc1.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.755832-59') }}</h2>
                        <div>{{ $t('Save.index.755832-56') }}<b>{{ $t('Save.index.755832-60') }}</b>{{ $t('Save.index.755832-64') }}</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/northbound/doc3.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.755832-61') }}</h2>
                        <div>
                            {{ $t('Save.index.755832-62') }}<b>{{ $t('Save.index.755832-60') }}</b>。
                            {{ $t('Save.index.755832-63') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-73') }}</h2>
                        <div>
                            {{ $t('Save.index.755832-74') }}<b>{{ $t('Save.index.755832-75') }}</b>{{ $t('Save.index.755832-76') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-77') }}</h2>
                        <div>
                            {{ $t('Save.index.755832-78') }}<b
                                >{{ $t('Save.index.755832-22') }}</b
                            >{{ $t('Save.index.755832-79') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-80') }}</h2>
                        <div>
                            {{ $t('Save.index.755832-81') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-82') }}</h2>
                        <div>
                           {{ $t('Save.index.755832-83') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-84') }}</h2>
                        <div>
                            {{ $t('Save.index.755832-85') }}
                        </div>
                        <h2>{{ $t('Save.index.755832-86') }}</h2>
                        <div>
                            {{ $t('Save.index.755832-87') }}
                        </div>
                    </div>
                </j-col>
            </j-row>
        </j-card>
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import CascadeApi from '@/api/media/cascade';
import { regIPv6 } from '@/utils/regular'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref({
    id: route.query.id || undefined,
    // name: undefined,
    cascadeName: undefined,
    proxyStream: false,
    // 以下字段, 提交时需提取到sipConfigs[{}]字段当中
    clusterNodeId: undefined,
    name: undefined,
    sipId: undefined,
    domain: undefined,
    remoteAddress: undefined,
    remotePort: undefined,
    localSipId: undefined,
    host: undefined,
    port: undefined,
    // remotePublic: {
    //     host: undefined,
    //     port: undefined,
    // },
    publicHost: undefined,
    publicPort: undefined,
    transport: 'UDP',
    user: undefined,
    password: undefined,
    manufacturer: undefined,
    model: undefined,
    firmware: undefined,
    keepaliveInterval: '60',
    registerInterval: '3600',
});

/**
 * 获取集群节点
 */
const clustersList = ref([]);
const getClustersList = async () => {
    const { result } = await CascadeApi.clusters();
    clustersList.value = result.map((m: any) => ({
        label: m.name,
        value: m.id,
    }));
};
getClustersList();
/**
 * SIP本地地址
 */
const allList = ref<any[]>([]);
const getAllList = async () => {
    const { result } = await CascadeApi.all();
    allList.value = result.map((m: any) => ({
        label: m.host,
        value: m.host,
        ...m,
    }));
    setPorts();
};
getAllList();

const handleTransportChange = () => {
    formData.value.host = undefined;
    formData.value.port = undefined;
    setPorts();
};
/**
 * 获取端口
 */
const allListPorts = ref([]);
const setPorts = () => {
    if (!formData.value.host) {
        allListPorts.value = []
        return
    };
    allListPorts.value = allList.value
        .find((f: any) => f.host === formData.value.host)
        ?.ports[formData.value.transport || '']?.map((m: string) => ({
            label: m,
            value: m,
        }));
};

/**
 * 获取详情
 */
const getDetail = async () => {
    if (!route.query.id) return;
    const res = await CascadeApi.detail(route.query.id as string);
    const { id, name, proxyStream, sipConfigs, ...others } = res.result;
    Object.keys(formData.value).forEach((key: string) => {
        if (key === 'id') formData.value[key] = id;
        else if (key === 'cascadeName') formData.value[key] = name;
        else if (key === 'proxyStream') formData.value[key] = proxyStream;
        else formData.value[key] = sipConfigs[0][key];
    });
    // console.log('formData.value: ', formData.value);
};

onMounted(() => {
    getDetail();
});

const regDomain = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.|$)){4}$/
    // /[j-zA-Z0-9][-j-zA-Z0-9]{0,62}(\.[j-zA-Z0-9][-j-zA-Z0-9]{0,62})+\.?/;

const ipv6 = new RegExp(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/)
/**
 * 上级SIP地址 字段验证
 * @param _
 * @param value 此处绑定的是 remoteAddress
 */
const checkSIP = (_: any, value: string) => {
    return checkHost(value, formData.value.remotePort);
};
/**
 * SIP远程地址 字段验证
 * @param _
 * @param value 此处绑定的是 publicHost
 */
const checkPublicSIP = (_: any, value: string) => {
    return checkHost(value, formData.value.publicPort);
};

/**
 * 字段验证
 * @param host ip
 * @param port 端口
 */
const checkHost = (host: string, port: string | number | undefined) => {
    if (!host) {
        return Promise.resolve();
    } else if (!host) {
        return Promise.reject(new Error($t('Save.index.755832-89')));
    } else if (host && !regDomain.test(host) && !regIPv6.test(host)) {
        return Promise.reject(new Error($t('Save.index.755832-90')));
    } else if (!port) {
        return Promise.reject(new Error($t('Save.index.755832-21')));
    } else if ((port && Number(port) < 1) || Number(port) > 65535) {
        return Promise.reject(new Error($t('Save.index.755832-91')));
    }
    return Promise.resolve();
};

/**
 * SIP本地地址 字段验证
 * @param _
 * @param value
 */
const checkLocalSIP = (_: any, value: string) => {
    if (!value) {
        return Promise.resolve();
    } else if (!value) {
        return Promise.reject(new Error($t('Save.index.755832-28')));
    } else if (!formData.value.port) {
        return Promise.reject(new Error($t('Save.index.755832-29')));
    }
    return Promise.resolve();
};

/**
 * 表单提交
 */
const formRef = ref();
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    // console.log('formData.value: ', formData.value);
    formRef.value
        .validate()
        .then(() => {
            const {
                id,
                cascadeName,
                proxyStream,
                // publicHost,
                // publicPort,
                ...extraFormData
            } = formData.value;
            const params = {
                id,
                name: cascadeName,
                proxyStream,
                sipConfigs: [
                    {
                        ...extraFormData,
                        // remotePublic: {
                        //     host: publicHost,
                        //     port: publicPort,
                        // },
                    },
                ],
            };
            btnLoading.value = true;
            CascadeApi[id ? 'update' : 'save'](params)
                .then(() => {
                    onlyMessage($t('Save.index.755832-92'));
                    router.back();
                })
                .finally(() => {
                    btnLoading.value = false;
                });
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
</script>

<style lang="less" scoped>
// @import './index.less';
</style>
