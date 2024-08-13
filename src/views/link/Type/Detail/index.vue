<template>
    <page-container>
        <FullPage>
            <j-card>
                <div class="container">
                    <j-form
                        :model="formData"
                        ref="formRef1"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                    >
                        <j-row :gutter="[24, 0]">
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Detail.index.962514-0')"
                                    name="name"
                                    :rules="Rules.name"
                                >
                                    <j-input
                                        v-model:value="formData.name"
                                        :placeholder="$t('Detail.index.962514-1')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="$t('Detail.index.962514-2')"
                                    name="type"
                                    :rules="Rules.type"
                                >
                                    <j-select
                                        v-model:value="formData.type"
                                        :options="typeOptions"
                                        :placeholder="$t('Detail.index.962514-3')"
                                        allowClear
                                        show-search
                                        :filter-option="filterOption"
                                        @change="changeType"
                                        :disabled="!!NetworkType"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24" v-if="isNoCommunity">
                                <j-form-item
                                    name="shareCluster"
                                    :rules="Rules.shareCluster"
                                >
                                    <template #label>
                                        {{ $t('Detail.index.962514-4') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.962514-5')"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </template>
                                    <j-radio-group
                                        v-model:value="formData.shareCluster"
                                        button-style="solid"
                                        @change="
                                            changeShareCluster(
                                                formData.shareCluster,
                                            )
                                        "
                                    >
                                        <j-radio-button
                                            :value="true"
                                            :disabled="
                                                formData.type === 'MQTT_CLIENT'
                                            "
                                            >{{ $t('Detail.index.962514-6') }}</j-radio-button
                                        >
                                        <j-radio-button :value="false"
                                            >{{ $t('Detail.index.962514-7') }}</j-radio-button
                                        >
                                    </j-radio-group>
                                </j-form-item>
                            </j-col>
                        </j-row>
                        <div
                            v-if="
                                !shareCluster &&
                                dynamicValidateForm.cluster.length === 0
                            "
                            style="
                                border: 1px #d9d9d9 solid;
                                margin-bottom: 12px;
                            "
                        >
                            <j-empty style="margin-top: 12px" />
                        </div>
                        <j-form
                            ref="formRef2"
                            layout="vertical"
                            name="dynamic_form_nest_item"
                            :model="dynamicValidateForm"
                            class="form2"
                        >
                            <div
                                v-for="(
                                    cluster, index
                                ) in dynamicValidateForm.cluster"
                                :key="cluster.id"
                            >
                                <j-collapse
                                    v-model:activeKey="activeKey"
                                    :class="[
                                        !formData.shareCluster
                                            ? 'collapse'
                                            : 'collapse-panel',
                                    ]"
                                    :ghost="formData.shareCluster"
                                    collapsible="header"
                                >
                                    <j-collapse-panel
                                        :key="index + 1"
                                        :show-arrow="!formData.shareCluster"
                                    >
                                        <template #header v-if="!shareCluster">
                                            <div class="collapse-header">
                                                {{
                                                    cluster.serverId
                                                        ? cluster.serverId
                                                        : !formData.shareCluster
                                                        ? `#${
                                                              index + 1
                                                          }.${$t('Detail.index.962514-8')}`
                                                        : ''
                                                }}
                                            </div>
                                        </template>
                                        <template #extra v-if="!shareCluster">
                                            <PermissionButton
                                                danger
                                                :popConfirm="{
                                                    title: $t('Detail.index.962514-9'),
                                                    onConfirm: () =>
                                                        removeCluster(cluster),
                                                }"
                                                >{{ $t('Detail.index.962514-10') }}</PermissionButton
                                            >
                                        </template>
                                        <j-row :gutter="[24, 0]">
                                            <j-col
                                                :span="12"
                                                v-if="!shareCluster"
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'serverId',
                                                    ]"
                                                    :label="$t('Detail.index.962514-11')"
                                                    :rules="Rules.serverId"
                                                >
                                                    <j-select
                                                        v-model:value="
                                                            cluster.serverId
                                                        "
                                                        :options="
                                                            clustersListIndex[
                                                                index
                                                            ]
                                                        "
                                                        :placeholder="$t('Detail.index.962514-12')"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                        @change="
                                                            changeServerId(
                                                                cluster.serverId,
                                                                index,
                                                            )
                                                        "
                                                    >
                                                    </j-select>
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'host',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'host',
                                                    ]"
                                                    :rules="Rules.host"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-13') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-14')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <!-- <j-select
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .host
                                                        "
                                                        :options="
                                                            hostOptionsIndex[
                                                                index
                                                            ]
                                                        "
                                                        placeholder="请选择本地地址"
                                                        allowClear
                                                        show-search
                                                        :disabled="shareCluster"
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                        @change="
                                                            changeHost(
                                                                cluster.serverId,
                                                                cluster
                                                                    .configuration
                                                                    .host,
                                                                index,
                                                            )
                                                        "
                                                    >
                                                    </j-select> -->
                                                    <LocalAddressSelect
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .host
                                                        "
                                                        :serverId="
                                                            cluster.serverId
                                                        "
                                                        :shareCluster="
                                                            shareCluster
                                                        "
                                                        @change="
                                                            (value) =>
                                                                changeHost(
                                                                    cluster.serverId,
                                                                    value,
                                                                    index,
                                                                )
                                                        "
                                                        @valueChange="
                                                            (value) =>
                                                                changeHost(
                                                                    cluster.serverId,
                                                                    value,
                                                                    index,
                                                                    true,
                                                                )
                                                        "
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'port',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'port',
                                                    ]"
                                                    :rules="Rules.port"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-15') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-16')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <j-select
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .port
                                                        "
                                                        :options="
                                                            portOptionsIndex[
                                                                index
                                                            ]
                                                        "
                                                        :placeholder="$t('Detail.index.962514-17')"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterPortOption
                                                        "
                                                    >
                                                        <!-- <j-select-option
                                                          v-for="i in getPortList( portOptionsIndex[
                                                                index
                                                            ], cluster
                                                                .configuration
                                                                .port)"
                                                        :value="i.value"
                                                      >
                                                        {{ i.label }}
                                                      </j-select-option> -->
                                                    </j-select>
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'publicHost',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',

                                                        'publicHost',
                                                    ]"
                                                    :rules="Rules.publicHost"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-18') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-19')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <j-input
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .publicHost
                                                        "
                                                        :placeholder="$t('Detail.index.962514-20')"
                                                        allowClear
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'publicPort',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'publicPort',
                                                    ]"
                                                    :rules="Rules.publicPort"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-21') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-22')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <j-input-number
                                                        style="width: 100%"
                                                        :placeholder="$t('Detail.index.962514-23')"
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .publicPort
                                                        "
                                                        :min="1"
                                                        :max="65535"
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'remoteHost',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'remoteHost',
                                                    ]"
                                                    :rules="Rules.remoteHost"
                                                    :label="$t('Detail.index.962514-24')"
                                                >
                                                    <j-input
                                                        :placeholder="$t('Detail.index.962514-25')"
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .remoteHost
                                                        "
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'remotePort',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :label="$t('Detail.index.962514-26')"
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'remotePort',
                                                    ]"
                                                    :rules="Rules.remotePort"
                                                >
                                                    <j-input-number
                                                        style="width: 100%"
                                                        :placeholder="$t('Detail.index.962514-27')"
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .remotePort
                                                        "
                                                        :min="1"
                                                        :max="65535"
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'clientId',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    label="clientId"
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'clientId',
                                                    ]"
                                                    :rules="Rules.clientId"
                                                >
                                                    <j-input
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .clientId
                                                        "
                                                        :placeholder="$t('Detail.index.962514-28')"
                                                    />
                                                </j-form-item>
                                            </j-col>

                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'username',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :label="$t('Detail.index.962514-29')"
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'username',
                                                    ]"
                                                    :rules="Rules.username"
                                                >
                                                    <j-input
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .username
                                                        "
                                                        :placeholder="$t('Detail.index.962514-30')"
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'password',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :label="$t('Detail.index.962514-31')"
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'password',
                                                    ]"
                                                    :rules="Rules.password"
                                                >
                                                    <j-input-password
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .password
                                                        "
                                                        :placeholder="$t('Detail.index.962514-32')"
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'topicPrefix',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'topicPrefix',
                                                    ]"
                                                    :rules="Rules.topicPrefix"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-33') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-34')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <j-input
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .topicPrefix
                                                        "
                                                        :placeholder="$t('Detail.index.962514-35')"
                                                    />
                                                </j-form-item>
                                            </j-col>

                                            <j-col
                                                :span="12"
                                                v-if="
                                                    isVisible(
                                                        'maxMessageSize',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'maxMessageSize',
                                                    ]"
                                                    :rules="
                                                        Rules.maxMessageSize
                                                    "
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-36') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-37')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <j-input-number
                                                        style="width: 100%"
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .maxMessageSize
                                                        "
                                                        :placeholder="$t('Detail.index.962514-38')"
                                                        :min="1024"
                                                        :max="1073741824"
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <j-col :span="24">
                                                <j-form-item
                                                    :label="
                                                        isVisible(
                                                            'secure',
                                                            formData.type,
                                                        )
                                                            ? $t('Detail.index.962514-39')
                                                            : $t('Detail.index.962514-40')
                                                    "
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'secure',
                                                    ]"
                                                    :rules="Rules.secure"
                                                    @change="
                                                        changeSecure(
                                                            cluster
                                                                .configuration
                                                                .secure,
                                                            index,
                                                        )
                                                    "
                                                >
                                                    <j-radio-group
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .secure
                                                        "
                                                    >
                                                        <j-radio :value="true"
                                                            >{{ $t('Detail.index.962514-41') }}</j-radio
                                                        >
                                                        <j-radio :value="false"
                                                            >{{ $t('Detail.index.962514-42') }}</j-radio
                                                        >
                                                    </j-radio-group>
                                                </j-form-item>
                                            </j-col>
                                            <div class="form2-row">
                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        cluster.configuration
                                                            .secure
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-43')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'certId',
                                                        ]"
                                                        :rules="Rules.certId"
                                                        class="form2-left"
                                                    >
                                                        <j-select
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .certId
                                                            "
                                                            :options="
                                                                certIdOptions
                                                            "
                                                            :placeholder="$t('Detail.index.962514-44')"
                                                            allowClear
                                                            show-search
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                        />
                                                    </j-form-item>
                                                </j-col>
                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        cluster.configuration
                                                            .secure
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-45')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'privateKeyAlias',
                                                        ]"
                                                        :rules="
                                                            Rules.privateKeyAlias
                                                        "
                                                        class="form2-right"
                                                    >
                                                        <j-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .privateKeyAlias
                                                            "
                                                            :placeholder="$t('Detail.index.962514-46')"
                                                        />
                                                    </j-form-item>
                                                </j-col>
                                            </div>

                                            <j-col
                                                :span="24"
                                                v-if="
                                                    isVisible(
                                                        'parserType',
                                                        formData.type,
                                                    )
                                                "
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'configuration',
                                                        'parserType',
                                                    ]"
                                                    :rules="Rules.parserType"
                                                >
                                                    <template #label>
                                                        {{ $t('Detail.index.962514-47') }}
                                                        <j-tooltip
                                                            :title="$t('Detail.index.962514-48')"
                                                        >
                                                            <AIcon
                                                                type="QuestionCircleOutlined"
                                                                style="
                                                                    margin-left: 2px;
                                                                "
                                                            />
                                                        </j-tooltip>
                                                    </template>
                                                    <j-select
                                                        style="width: 48.5%"
                                                        v-model:value="
                                                            cluster
                                                                .configuration
                                                                .parserType
                                                        "
                                                        :options="
                                                            ParserTypeOptions
                                                        "
                                                        :placeholder="$t('Detail.index.962514-49')"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                        @change="
                                                            changeParserType(
                                                                cluster
                                                                    .configuration
                                                                    .parserType,
                                                                index,
                                                            )
                                                        "
                                                    />
                                                </j-form-item>
                                            </j-col>
                                            <div class="form2-row">
                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'delimited',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-50')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'delimited',
                                                        ]"
                                                        :rules="Rules.delimited"
                                                        class="form2-left"
                                                    >
                                                        <j-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .delimited
                                                            "
                                                            :placeholder="$t('Detail.index.962514-51')"
                                                        />
                                                    </j-form-item>
                                                </j-col>

                                                <!-- <j-col
                                    :span="24"
                                    v-if="
                                        isVisible(
                                            'lang',
                                            cluster.configuration
                                                .parserType,
                                        )
                                    "
                                >
                                    <j-form-item
                                        v-show="false"
                                        label="脚本语言"
                                        :name="[
                                            'cluster',
                                            index,
                                            'configuration',
                                            'parserConfiguration',
                                            'lang',
                                        ]"
                                        class="form2-left"
                                    >
                                        <j-input
                                            v-model:value="
                                                cluster
                                                    .configuration
                                                    .parserConfiguration
                                                    .lang
                                            "
                                        />
                                    </j-form-item>
                                </j-col> -->
                                                <j-col
                                                    :span="24"
                                                    v-if="
                                                        isVisible(
                                                            'script',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-52')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'script',
                                                        ]"
                                                        :rules="Rules.script"
                                                        class="form2-left form2-right"
                                                    >
                                                        <div
                                                            style="
                                                                width: 100%;
                                                                height: 400px;
                                                            "
                                                        >
                                                            <j-monaco-editor
                                                                theme="vs"
                                                                v-model:modelValue="
                                                                    cluster
                                                                        .configuration
                                                                        .parserConfiguration
                                                                        .script
                                                                "
                                                                language="javascript"
                                                                :init="
                                                                    editorInit
                                                                "
                                                                :registrationTypescript="
                                                                    typescriptTip
                                                                "
                                                            />
                                                        </div>
                                                    </j-form-item>
                                                </j-col>

                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'size',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-53')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'size',
                                                        ]"
                                                        :rules="Rules.size"
                                                        class="form2-left"
                                                    >
                                                        <j-input-number
                                                            style="width: 100%"
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .size
                                                            "
                                                            :placeholder="$t('Detail.index.962514-54')"
                                                        />
                                                    </j-form-item>
                                                </j-col>
                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'length',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-55')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'length',
                                                        ]"
                                                        :rules="Rules.length"
                                                        class="form2-left"
                                                    >
                                                        <j-select
                                                            style="width: 100%"
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .length
                                                            "
                                                            :options="
                                                                LengthOptions
                                                            "
                                                            :placeholder="$t('Detail.index.962514-56')"
                                                            allowClear
                                                            show-search
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                        />
                                                    </j-form-item>
                                                </j-col>
                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'offset',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-57')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'offset',
                                                        ]"
                                                        :rules="Rules.offset"
                                                        class="form2-right"
                                                    >
                                                        <j-input-number
                                                            style="width: 100%"
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .offset
                                                            "
                                                            :placeholder="$t('Detail.index.962514-58')"
                                                            :min="0"
                                                            :max="65535"
                                                        />
                                                    </j-form-item>
                                                </j-col>
                                                <j-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'little',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <j-form-item
                                                        :label="$t('Detail.index.962514-59')"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'little',
                                                        ]"
                                                        class="form2-left"
                                                    >
                                                        <j-select
                                                            style="width: 100%"
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .little
                                                            "
                                                            :options="
                                                                LittleOptions
                                                            "
                                                            :placeholder="$t('Detail.index.962514-60')"
                                                            allowClear
                                                            show-search
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                        />
                                                    </j-form-item>
                                                </j-col>
                                            </div>
                                        </j-row>
                                    </j-collapse-panel>
                                </j-collapse>
                            </div>
                            <j-form-item v-if="!shareCluster">
                                <j-button
                                    type="primary"
                                    block
                                    ghost
                                    @click="addCluster"
                                >
                                    <AIcon type="PlusOutlined" />
                                    {{ $t('Detail.index.962514-61') }}
                                </j-button>
                            </j-form-item>
                        </j-form>

                        <j-row :gutter="[24, 0]">
                            <j-col :span="24">
                                <j-form-item :label="$t('Detail.index.962514-62')" name="description">
                                    <j-textarea
                                        v-model:value="formData.description"
                                        show-count
                                        :maxlength="200"
                                        :rows="4"
                                    /> </j-form-item
                            ></j-col>
                        </j-row>
                    </j-form>
                </div>
                <div class="footer">
                    <PermissionButton
                        v-if="view === 'false'"
                        type="primary"
                        @click="saveData"
                        :loading="loading"
                        :hasPermission="`link/Type:${
                            id !== ':id' ? 'update' : 'add'
                        }`"
                    >
                        {{ $t('Detail.index.962514-63') }}
                    </PermissionButton>
                </div>
            </j-card>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup name="AccessNetwork">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import {
    update,
    save,
    detail,
    resourcesCurrent,
    supports,
    certificates,
    start,
    resourceClusters,
    resourceClustersById,
    getTs,
} from '@/api/link/type';
import {
    ParserConfiguration,
    Configuration,
    FormStates,
    FormStates2,
    ParserTypeOptions,
    isVisible,
    LengthOptions,
    LittleOptions,
    Rules,
    TCPList,
    UDPList,
} from '../data';
import { cloneDeep } from 'lodash-es';
import type { FormData2Type, FormDataType } from '../type';
import LocalAddressSelect from './LocalAddressSelect.vue';
import { isNoCommunity } from '@/utils/utils';
import { useTypeStore } from '@/store/type';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const route = useRoute();
const NetworkType = route.query.type as string;
const view = NetworkType ? 'false' : (route.query.view as string);
const id = route.params.id as string;
const activeKey = ref(['1']);
const loading = ref(false);
const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();
const shareCluster = ref(true);

const _typeStore = useTypeStore();
const { configRef, resourcesClusters } = storeToRefs(_typeStore);

const formData = ref<FormDataType>({
    ...FormStates,
});
const hostOptionsIndex: any = ref([]);
const clustersListIndex: any = ref([]);
const typeOptions = ref([]);
const portOptionsIndex: any = ref([]);
// let portOptionsConst: any = [];
const certIdOptions = ref([]);
const configClustersList = ref<any[]>([]);

const typescriptTip = reactive({
    typescript: '',
});

const editorInit = (editor: any, monaco: any) => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowJs: true,
        checkJs: true,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        strictNullChecks: false,
        strictPropertyInitialization: true,
        strictFunctionTypes: true,
        strictBindCallApply: true,
        useDefineForClassFields: true, //permit class static fields with private name to have initializer
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        typeRoots: ['types'],
        lib: ['esnext'],
    });
};

const dynamicValidateForm = reactive<{ cluster: FormData2Type[] }>({
    cluster: [{ ...cloneDeep(FormStates2), id: '1' }],
});

const removeCluster = (item: FormData2Type) => {
    let index = dynamicValidateForm.cluster.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.cluster.splice(index, 1);
    }
};

const addCluster = () => {
    const id = Date.now();
    dynamicValidateForm.cluster.push({
        ...cloneDeep(FormStates2),
        id,
    });
    activeKey.value = [...activeKey.value, id.toString()];
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const filterPortOption = (input: string, option: any) => {
    return JSON.stringify(option.label).indexOf(input) >= 0;
};

// const getPortList = (list: any[], id: string) => {
//   const keys = dynamicValidateForm?.cluster?.map?.(item => item.configuration?.port) || []
// //   console.log(dynamicValidateForm?.cluster, id, keys)
//   return (list || []).filter(item => item.value === id || !keys.includes(item.value) )
// }

const filterConfigByType = (data: any[], type: string) => {
    let _temp = type;
    if (TCPList.includes(type)) {
        _temp = 'TCP';
    } else if (UDPList.includes(type)) {
        _temp = 'UDP';
    }
    // 只保留ports 包含type的数据
    const _config = data?.filter((item: any) => {
        return Object.keys(item.ports).includes(_temp);
    });

    // 只保留ports的type数据
    return _config?.map((i: any) => {
        i.ports = i.ports[_temp];
        return i;
    });
};

const getPortOptions = (portOptions: any, index = 0) => {
    if (!portOptions) return;
    const type = formData.value.type;
    const host = dynamicValidateForm.cluster[index].configuration.host;
    const _port = filterConfigByType(cloneDeep(portOptions), type);
    const _host = _port.find((item: any) => item.host === host);
    portOptionsIndex.value[index] = _host?.ports?.map((p: any) => ({
        label: p,
        value: p,
    }));
};

const changeShareCluster = (value: boolean) => {
    shareCluster.value = value;
    activeKey.value = ['1'];
    dynamicValidateForm.cluster = [{ ...cloneDeep(FormStates2), id: '1' }];
};

const changeType = (value: string) => {
    getResourcesCurrent();
    dynamicValidateForm.cluster = [{ ...cloneDeep(FormStates2), id: '1' }];
    if (value !== 'MQTT_CLIENT') {
        const { configuration } = dynamicValidateForm.cluster[0];
        value && (configuration.host = '0.0.0.0');
    } else if (isNoCommunity) {
        formData.value.shareCluster = false;
        changeShareCluster(formData.value.shareCluster);
    }
    if (value === 'TCP_SERVER') {
        getTs().then((res: any) => {
            if (res.status === 200) {
                typescriptTip.typescript = res.result;
            }
        });
    }
};

const updateClustersListIndex = () => {
    const { cluster } = dynamicValidateForm;
    const filters = cluster?.map((item) => item.serverId);
    const newConfigRef = shareCluster.value
        ? (configRef.value || [])?.filter(
              (item: any) => !filters.includes(item.clusterNodeId),
          )
        : configClustersList.value?.filter(
              (item: any) => !filters.includes(item.id),
          );
    cluster.forEach((item, index) => {
        clustersListIndex.value[index] = newConfigRef?.map((i: any) => {
            if (shareCluster.value) {
                return {
                    value: i.clusterNodeId,
                    label: i.clusterNodeId,
                };
            } else {
                return {
                    value: i.id,
                    label: i.name,
                };
            }
        });
        if (item.serverId) {
            clustersListIndex.value[index].push({
                value: item.serverId,
                label: item.serverId,
            });
        }
    });
};

const changeServerId = async (value: string | undefined, index: number) => {
    const { configuration } = dynamicValidateForm.cluster[index];
    configuration.host = undefined;
    configuration.port = undefined;
    hostOptionsIndex.value[index] = [];
    if (value) {
        updateClustersListIndex();
    }
};
const changeHost = (
    serverId: string | undefined,
    value: string | undefined,
    index: number,
    flag?: boolean,
) => {
    if (dynamicValidateForm.cluster?.[index]) {
        const { configuration } = dynamicValidateForm.cluster?.[index];
        if (!flag) {
            configuration.port = undefined;
        }
        const checked = resourcesClusters.value?.[serverId || ''];
        if (checked) {
            getPortOptions(checked, index);
        }
    }
};

const changeParserType = (value: string | undefined, index: number) => {
    const configuration: any = dynamicValidateForm.cluster[index].configuration;
    configuration.parserConfiguration = cloneDeep(ParserConfiguration);
    value === 'SCRIPT'
        ? (configuration.parserConfiguration.lang = 'javascript')
        : '';
};
const changeSecure = (value: string | undefined, index: number) => {
    if (!value) {
        const configuration: any =
            dynamicValidateForm.cluster[index].configuration;
        configuration.certId = undefined;
        configuration.privateKeyAlias = '';
    }
};

const saveData = async () => {
    await formRef1.value?.validate();

    const formRef2Data = await formRef2.value?.validate().catch((err) => {
        err.errorFields.forEach((item: any) => {
            const activeId: any = dynamicValidateForm.cluster[item.name[1]].id;
            if (!activeKey.value.includes(activeId)) {
                activeKey.value.push(activeId); // 校验未通过的展开
            }
        });
    });

    if (!formRef2Data?.cluster) {
        return onlyMessage($t('Detail.index.962514-64'), 'error');
    }

    const { configuration } = formRef2Data?.cluster[0];
    const params = shareCluster.value
        ? { ...formData.value, configuration }
        : { ...formData.value, ...formRef2Data };

    loading.value = true;
    const resp: any =
        id === ':id'
            ? await save(params).catch(() => {})
            : await update({ ...params, id }).catch(() => {});
    loading.value = false;
    if (resp?.status === 200) {
        onlyMessage($t('Detail.index.962514-65'), 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            if (resp.result?.id) {
                start(resp.result?.id).then(() => {
                    (window as any).onTabSaveSuccess(resp);
                    setTimeout(() => window.close(), 300);
                });
            }
        }
    }
};

const getSupports = async () => {
    const res: any = await supports();
    if (res.status === 200) {
        typeOptions.value = res.result.map((item: any) => ({
            label: item.name,
            value: item.id,
        }));
        if (
            !typeOptions.value.every((item: any) => item.value === 'UDP') &&
            !NetworkType
        ) {
            formData.value.type = typeOptions.value[0].value;
        }
    }
};

const getCertificates = async () => {
    const resp: any = await certificates();
    if (resp.status === 200) {
        certIdOptions.value = resp.result.map((i: any) => ({
            value: i.id,
            label: i.name,
        }));
    }
};

const getResourcesCurrent = () => {
    resourcesCurrent().then((resp: any) => {
        if (resp.status === 200) {
            _typeStore.setConfigRef(resp.result || []);

            const clusterNodeId = resp.result?.[0]?.clusterNodeId;
            const _resourcesClusters = cloneDeep(resourcesClusters.value || {});
            _resourcesClusters[clusterNodeId] = resp.result;
            _typeStore.setResourcesClusters(_resourcesClusters);
            getPortOptions(resp.result);
        }
    });
};

const getResourcesClusters = () => {
    resourceClusters().then((resp) => {
        if (resp.status === 200) {
            configClustersList.value = resp.result as any[];
        }
    });
};

const getDetail = () => {
    if (id !== ':id') {
        loading.value = true;
        detail(id).then((resp) => {
            if (resp.status === 200) {
                const result: any = resp.result;
                const { configuration, cluster } = result;
                formData.value = { ...result };
                shareCluster.value = result.shareCluster;
                activeKey.value = ['1'];
                if (result.shareCluster) {
                    dynamicValidateForm.cluster[0].configuration = {
                        ...cloneDeep(Configuration), //防止编辑时，表单字段不完善，导致输入/选择框新出现时找不到
                        ...configuration,
                    };
                } else {
                    dynamicValidateForm.cluster = cluster;
                    // const arr = cluster.map((item: any) => item.configuration.serverId)
                    //遍历数据更新对应的本地端口
                    // setTimeout(() => {
                    //     cluster.forEach((item: any, index: number) => {
                    //         const { serverId } = item.configuration
                    //         if(!resourcesClustersMap.get(serverId)){
                    //             // await getResourcesClustersById(serverId)
                    //         }
                    //         const checked = resourcesClustersMap.get(serverId)
                    //         getPortOptions(checked, index);
                    //     });
                    // }, 0);
                }

                if (dynamicValidateForm.cluster.length === 1) {
                    dynamicValidateForm.cluster[0].id = '1';
                }
            }
        });
        loading.value = false;
    }
};

onMounted(() => {
    getSupports();
    getCertificates();
    getResourcesCurrent();
    if (isNoCommunity) {
        getResourcesClusters();
    }
    getDetail();
});

watch(
    () => formData.value.shareCluster,
    (value) => {
        const { cluster } = dynamicValidateForm;
        if (cluster) {
            value && (cluster[0].configuration.host = '0.0.0.0');
            updateClustersListIndex();
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => shareCluster.value,
    (value) => {
        formData.value.shareCluster = value;
        value
            ? getPortOptions(configRef.value)
            : (portOptionsIndex.value[0] = []);
        updateClustersListIndex();
    },
    { deep: true },
);
watch(
    () => dynamicValidateForm.cluster?.length,
    () => {
        updateClustersListIndex();
    },
    { deep: true, immediate: true },
);

watch(
    () => NetworkType,
    (value) => {
        if (value) {
            const { cluster } = dynamicValidateForm;
            formData.value.type = value;
            cluster[0].configuration.host = '0.0.0.0';
        }
    },
    { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.container {
    width: 70%;
    min-height: 400px;
}
.footer {
    width: 100%;
    margin-top: 24px;
}
.form2 {
    :deep(.ant-collapse-content-box) {
        background: #fafafa;
        border-radius: 2px;
    }
    .form2-row {
        display: flex;
        width: 100%;
        position: relative;
        flex-flow: row wrap;
        .form2-left {
            padding-left: 16px;
            flex: 1;
        }
        .form2-right {
            padding-right: 16px;
            flex: 1;
        }
        &::before {
            position: absolute;
            top: -10px;
            left: 10px;
            right: 10px;
            width: calc(100% - 10px);
            height: 100%;
            background-color: #f4f4f4;
            content: ' ';
        }
    }
}

.collapse {
    margin-bottom: 20px;
    background: #f4f4f4;
    :deep(.ant-collapse-header-text) {
        flex: 1;
    }
}
.collapse-panel {
    margin-bottom: 20px;
    border: #d9d9d9 1px solid;
    background: #f4f4f4;
    border-radius: 2px;
    :deep(.ant-collapse-header) {
        padding: 0;
    }
}

.delete-btn {
    display: inline-block;
    color: #e50012;
    padding: 0px 8px;
    background: #ffffff;
    border: 1px solid #e50012;
    border-radius: 2px;
    cursor: pointer;
}
</style>
