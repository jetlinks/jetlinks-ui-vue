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
                                    label="名称"
                                    name="name"
                                    :rules="Rules.name"
                                >
                                    <j-input
                                        v-model:value="formData.name"
                                        placeholder="请输入名称"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    label="类型"
                                    name="type"
                                    :rules="Rules.type"
                                >
                                    <j-select
                                        v-model:value="formData.type"
                                        :options="typeOptions"
                                        placeholder="请选择类型"
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
                                        集群
                                        <j-tooltip
                                            title="共享配置:集群下所有节点共用同一配置,独立配置:集群下不同节点使用不同配置"
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
                                        <j-radio-button :value="true"
                                            >共享配置</j-radio-button
                                        >
                                        <j-radio-button :value="false"
                                            >独立配置</j-radio-button
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
                                        :key="cluster.id"
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
                                                          }.配置信息`
                                                        : ''
                                                }}
                                            </div>
                                        </template>
                                        <template #extra v-if="!shareCluster">
                                            <j-popconfirm
                                                @confirm.prevent="
                                                    removeCluster(cluster)
                                                "
                                            >
                                                <span class="delete-btn">
                                                    删除
                                                </span>
                                            </j-popconfirm>
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
                                                    label="节点名称"
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
                                                        placeholder="请选择节点名称"
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
                                                        本地地址
                                                        <j-tooltip
                                                            title="绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0"
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
                                                        v-model:value="cluster.configuration.host"
                                                        :serverId="cluster.serverId"
                                                        :shareCluster="shareCluster"
                                                        @change="(value) => changeHost(cluster.serverId, value, index)"
                                                        @valueChange="(value) => changeHost(cluster.serverId, value, index, true)"
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
                                                        本地端口
                                                        <j-tooltip
                                                            title="监听指定端口的请求"
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
                                                        placeholder="请选择本地端口"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterPortOption
                                                        "
                                                    />
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
                                                        公网地址
                                                        <j-tooltip
                                                            title="对外提供访问的地址,内网环境时填写服务器的内网IP地址"
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
                                                        placeholder="请输入公网地址"
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
                                                        公网端口
                                                        <j-tooltip
                                                            title="对外提供访问的端口"
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
                                                        placeholder="请输入端口"
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
                                                    label="远程地址"
                                                >
                                                    <j-input
                                                        placeholder="请输入远程地址"
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
                                                    label="远程端口"
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
                                                        placeholder="请输入远程端口"
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
                                                        placeholder="请输入ClientId"
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
                                                    label="用户名"
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
                                                        placeholder="请输入用户名"
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
                                                    label="密码"
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
                                                        placeholder="请输入密码"
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
                                                        订阅前缀
                                                        <j-tooltip
                                                            title="当连接的服务为EMQ时,可能需要使用共享的订阅前缀,如:$queue或$share"
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
                                                        placeholder="请输入订阅前缀"
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
                                                        最大消息长度
                                                        <j-tooltip
                                                            title="单次收发消息的最大长度,单位:字节;设置过大可能会影响性能"
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
                                                        placeholder="请输入最大消息长度"
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
                                                            ? '开启DTLS'
                                                            : '开启TLS'
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
                                                            >是</j-radio
                                                        >
                                                        <j-radio :value="false"
                                                            >否</j-radio
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
                                                        label="证书"
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
                                                            placeholder="请选择证书"
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
                                                        label="私钥别名"
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
                                                            placeholder="请输入私钥别名"
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
                                                        粘拆包规则
                                                        <j-tooltip
                                                            title="处理TCP粘拆包的方式"
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
                                                        placeholder="请选择粘拆包规则"
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
                                                        label="分隔符"
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
                                                            placeholder="请输入分隔符"
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
                                                        label="解析脚本"
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
                                                        label="长度值"
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
                                                            placeholder="请输入长度值"
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
                                                        label="长度"
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
                                                            placeholder="请选择长度"
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
                                                        label="偏移量"
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
                                                            placeholder="请输入偏移量"
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
                                                        label="大小端"
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
                                                            placeholder="请选择大小端"
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
                                    新增
                                </j-button>
                            </j-form-item>
                        </j-form>

                        <j-row :gutter="[24, 0]">
                            <j-col :span="24">
                                <j-form-item label="说明" name="description">
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
                        保存
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
import { Store } from 'jetlinks-store';
import LocalAddressSelect from './LocalAddressSelect.vue';
import { isNoCommunity } from '@/utils/utils';

const route = useRoute();
const NetworkType = route.query.type as string;
const view = NetworkType ? 'false' : (route.query.view as string);
const id = route.params.id as string;
const activeKey = ref(['1']);
const loading = ref(false);
const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();
const shareCluster = ref(true);

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
    }
};

const updateClustersListIndex = () => {
    const { cluster } = dynamicValidateForm;
    const filters = cluster?.map((item) => item.serverId);
    const newConfigRef = shareCluster.value ? Store.get('configRef')?.filter(
        (item: any) => !filters.includes(item.clusterNodeId),
    ) : configClustersList.value?.filter(
        (item: any) => !filters.includes(item.id),
    )
    cluster.forEach((item, index) => {
        clustersListIndex.value[index] = newConfigRef?.map((i: any) => {
            if(shareCluster.value){
                return {
                    value: i.clusterNodeId,
                    label: i.clusterNodeId,
                }
            } else {
                return {
                    value: i.id,
                    label: i.name,
                }
            }
        })
        if(item.serverId) {
            clustersListIndex.value[index].push({
                value: item.serverId,
                label: item.serverId
            })
        }
    });
};

const changeServerId = async (value: string | undefined, index: number) => {
    const { configuration } = dynamicValidateForm.cluster[index];
    configuration.host = undefined;
    configuration.port = undefined;
    hostOptionsIndex.value[index] = [];
    if(value){
        updateClustersListIndex();
    }
};
const changeHost = (
    serverId: string | undefined,
    value: string | undefined,
    index: number,
    flag?: boolean
) => {
    const { configuration } = dynamicValidateForm.cluster[index];
    if(!flag){
        configuration.port = undefined;
    }
    const checked = Store.get('resourcesClusters')?.[serverId || '']
    if(checked){
        getPortOptions(checked, index)
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
        return onlyMessage('请新增或完善配置', 'error');
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
        onlyMessage('操作成功', 'success');
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
        if (!typeOptions.value.every((item : any) => item.value === 'UDP') && !NetworkType) {
          formData.value.type = typeOptions.value[0].value
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
    resourcesCurrent().then((resp) => {
        if (resp.status === 200) {
            const clusterNodeId = resp.result?.[0]?.clusterNodeId
            const resourcesClusters = Store.get('resourcesClusters') || {}
            resourcesClusters[clusterNodeId] = resp.result
            Store.set('resourcesClusters', resourcesClusters)
            Store.set('configRef', resp.result);
            getPortOptions(Store.get('resourcesClusters')?.[clusterNodeId]);
        }
    });
};

const getResourcesClusters = () => {
    resourceClusters().then((resp) => {
        if (resp.status === 200) {
            configClustersList.value = resp.result as any[]
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

                    // const configRef = Store.get('configRef').filter(
                    //     (item: any) => item.host === '0.0.0.0',
                    // );
                    // getPortOptions(configRef); //更新端口
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
    if(isNoCommunity){
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
            ? getPortOptions(Store.get('configRef'))
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
