<template>
    <page-container>
        <a-card>
            <div class="steps-content">
                <div class="steps-box">
                    <div>
                        <a-form
                            :model="formData"
                            ref="formRef1"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                        >
                            <a-row :gutter="[24, 0]">
                                <a-col :span="12">
                                    <a-form-item
                                        label="名称"
                                        name="name"
                                        :rules="Rules.name"
                                    >
                                        <a-input
                                            v-model:value="formData.name"
                                            placeholder="请输入名称"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item
                                        label="类型"
                                        name="type"
                                        :rules="Rules.type"
                                    >
                                        <a-select
                                            v-model:value="formData.type"
                                            :options="typeOptions"
                                            placeholder="请选择类型"
                                            allowClear
                                            show-search
                                            :filter-option="filterOption"
                                            @change="changeType"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="24">
                                    <a-form-item
                                        name="shareCluster"
                                        :rules="Rules.shareCluster"
                                    >
                                        <div class="form-label">
                                            集群
                                            <span class="form-label-required"
                                                >*</span
                                            >
                                            <a-tooltip>
                                                <template #title>
                                                    <p>
                                                        共享配置:集群下所有节点共用同一配置
                                                    </p>
                                                    <p>
                                                        独立配置:集群下不同节点使用不同配置
                                                    </p>
                                                </template>
                                                <question-circle-outlined />
                                            </a-tooltip>
                                        </div>

                                        <a-radio-group
                                            v-model:value="
                                                formData.shareCluster
                                            "
                                            button-style="solid"
                                            @change="
                                                changeShareCluster(
                                                    formData.shareCluster,
                                                )
                                            "
                                        >
                                            <a-radio-button :value="true"
                                                >共享配置</a-radio-button
                                            >
                                            <a-radio-button :value="false"
                                                >独立配置</a-radio-button
                                            >
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-form
                                ref="formRef2"
                                layout="vertical"
                                name="dynamic_form_nest_item"
                                :model="dynamicValidateForm"
                            >
                                <div
                                    v-for="(
                                        cluster, index
                                    ) in dynamicValidateForm.cluster"
                                    :key="cluster.id"
                                >
                                    <a-collapse
                                        v-model:activeKey="activeKey"
                                        class="collapse"
                                    >
                                        <a-collapse-panel
                                            :key="cluster.id"
                                            :header="`#${index + 1}.节点`"
                                        >
                                            <template
                                                #extra
                                                v-if="!shareCluster"
                                            >
                                                <delete-outlined
                                                    @click="
                                                        removeCluster(cluster)
                                                    "
                                                />
                                            </template>
                                            <a-row :gutter="[24, 0]">
                                                <a-col
                                                    :span="12"
                                                    v-if="!shareCluster"
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'serverId',
                                                        ]"
                                                    >
                                                        <div class="form-label">
                                                            节点名称
                                                        </div>
                                                        <a-select
                                                            v-model:value="
                                                                cluster.serverId
                                                            "
                                                            :options="
                                                                clustersList
                                                            "
                                                            placeholder="请选择节点名称"
                                                            allowClear
                                                            show-search
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                        >
                                                        </a-select>
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'host',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'host',
                                                        ]"
                                                        :rules="Rules.host"
                                                    >
                                                        <div class="form-label">
                                                            本地地址
                                                            <span
                                                                class="form-label-required"
                                                                >*</span
                                                            >
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>

                                                        <a-select
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .host
                                                            "
                                                            :options="
                                                                sipListOption
                                                            "
                                                            placeholder="请选择本地地址"
                                                            allowClear
                                                            show-search
                                                            :disabled="
                                                                shareCluster
                                                            "
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                            @change="
                                                                handleChangeForm2Sip(
                                                                    index,
                                                                )
                                                            "
                                                        >
                                                        </a-select>
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'port',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'port',
                                                        ]"
                                                        :rules="Rules.port"
                                                    >
                                                        <div class="form-label">
                                                            本地端口
                                                            <span
                                                                class="form-label-required"
                                                                >*</span
                                                            >
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        监听指定端口的请求
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>
                                                        <a-select
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .port
                                                            "
                                                            :options="
                                                                portOptions
                                                            "
                                                            placeholder="请选择本地端口"
                                                            allowClear
                                                            show-search
                                                            :filter-option="
                                                                filterPortOption
                                                            "
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'publicHost',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',

                                                            'publicHost',
                                                        ]"
                                                        :rules="
                                                            Rules.publicHost
                                                        "
                                                    >
                                                        <div class="form-label">
                                                            公网地址
                                                            <span
                                                                class="form-label-required"
                                                                >*</span
                                                            >
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        对外提供访问的地址,内网环境时填写服务器的内网IP地址
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .publicHost
                                                            "
                                                            placeholder="请输入公网地址"
                                                            allowClear
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'publicPort',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'publicPort',
                                                        ]"
                                                        :rules="
                                                            Rules.publicPort
                                                        "
                                                    >
                                                        <div class="form-label">
                                                            公网端口
                                                            <span
                                                                class="form-label-required"
                                                                >*</span
                                                            >
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        对外提供访问的端口
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>

                                                        <a-input-number
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
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'remoteHost',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'remoteHost',
                                                        ]"
                                                        :rules="
                                                            Rules.remoteHost
                                                        "
                                                    >
                                                        <div
                                                            class="form-label"
                                                        ></div>

                                                        <a-input
                                                            placeholder="请输入远程地址"
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .remoteHost
                                                            "
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'remotePort',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        label="远程端口"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'remotePort',
                                                        ]"
                                                        :rules="
                                                            Rules.remotePort
                                                        "
                                                    >
                                                        <a-input-number
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
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'clientId',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        label="clientId"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'clientId',
                                                        ]"
                                                        :rules="Rules.clientId"
                                                    >
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .clientId
                                                            "
                                                            placeholder="请输入ClientId"
                                                        />
                                                    </a-form-item>
                                                </a-col>

                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'username',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        label="用户名"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'username',
                                                        ]"
                                                        :rules="Rules.username"
                                                    >
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .username
                                                            "
                                                            placeholder="请输入用户名"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'password',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        label="密码"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'password',
                                                        ]"
                                                        :rules="Rules.password"
                                                    >
                                                        <a-input-password
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .password
                                                            "
                                                            placeholder="请输入密码"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'topicPrefix',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'topicPrefix',
                                                        ]"
                                                        :rules="
                                                            Rules.topicPrefix
                                                        "
                                                    >
                                                        <div class="form-label">
                                                            订阅前缀
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        当连接的服务为EMQ时,可能需要使用共享的订阅前缀,如:$queue或$share
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .topicPrefix
                                                            "
                                                            placeholder="请输入订阅前缀"
                                                        />
                                                    </a-form-item>
                                                </a-col>

                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        isVisible(
                                                            'maxMessageSize',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
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
                                                        <div class="form-label">
                                                            最大消息长度
                                                            <span
                                                                class="form-label-required"
                                                                >*</span
                                                            >
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        单次收发消息的最大长度,单位:字节;设置过大可能会影响性能
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>
                                                        <a-input-number
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
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="
                                                        isVisible(
                                                            'secureSpan12',
                                                            formData.type,
                                                        )
                                                            ? '12'
                                                            : '24'
                                                    "
                                                >
                                                    <a-form-item
                                                        :label="
                                                            isVisible(
                                                                'secure',
                                                                formData.type,
                                                            )
                                                                ? '开启TLS'
                                                                : '开启DTLS'
                                                        "
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'secure',
                                                        ]"
                                                        :rules="Rules.secure"
                                                    >
                                                        <a-radio-group
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .secure
                                                            "
                                                        >
                                                            <a-radio
                                                                :value="true"
                                                                >是</a-radio
                                                            >
                                                            <a-radio
                                                                :value="false"
                                                                >否</a-radio
                                                            >
                                                        </a-radio-group>
                                                    </a-form-item>
                                                </a-col>

                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        cluster.configuration
                                                            .secure
                                                    "
                                                >
                                                    <a-form-item
                                                        label="证书"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'certId',
                                                        ]"
                                                        :rules="Rules.certId"
                                                    >
                                                        <a-select
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .certId
                                                            "
                                                            :options="sipList"
                                                            placeholder="请选择证书"
                                                            allowClear
                                                            show-search
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="12"
                                                    v-if="
                                                        cluster.configuration
                                                            .secure
                                                    "
                                                >
                                                    <a-form-item
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
                                                    >
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .privateKeyAlias
                                                            "
                                                            placeholder="请输入私钥别名"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="24"
                                                    v-if="
                                                        isVisible(
                                                            'parserType',
                                                            formData.type,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserType',
                                                        ]"
                                                        :rules="
                                                            Rules.parserType
                                                        "
                                                    >
                                                        <div class="form-label">
                                                            粘拆包规则
                                                            <span
                                                                class="form-label-required"
                                                                >*</span
                                                            >
                                                            <a-tooltip>
                                                                <template
                                                                    #title
                                                                >
                                                                    <p>
                                                                        处理TCP粘拆包的方式
                                                                    </p>
                                                                </template>
                                                                <question-circle-outlined />
                                                            </a-tooltip>
                                                        </div>
                                                        <a-select
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
                                                        />
                                                    </a-form-item>
                                                </a-col>

                                                <a-col
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
                                                    <a-form-item
                                                        label="分隔符"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'delimited',
                                                        ]"
                                                        :rules="Rules.delimited"
                                                    >
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .delimited
                                                            "
                                                            placeholder="请输入分隔符"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
                                                    :span="24"
                                                    v-if="
                                                        isVisible(
                                                            'lang',
                                                            cluster
                                                                .configuration
                                                                .parserType,
                                                        )
                                                    "
                                                >
                                                    <a-form-item
                                                        v-show="false"
                                                        label="脚本语言"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'lang',
                                                        ]"
                                                        :rules="Rules.lang"
                                                    >
                                                        <a-select
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .lang
                                                            "
                                                            show-search
                                                            :filter-option="
                                                                filterOption
                                                            "
                                                        >
                                                            <a-select-option
                                                                :value="
                                                                    cluster
                                                                        .configuration
                                                                        .parserType ===
                                                                    'SCRIPT'
                                                                        ? 'javascript'
                                                                        : ''
                                                                "
                                                                >javascript</a-select-option
                                                            >
                                                        </a-select>
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
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
                                                    <a-form-item
                                                        label="解析脚本"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'script',
                                                        ]"
                                                        :rules="Rules.script"
                                                    >
                                                        <a-input
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .script
                                                            "
                                                            placeholder="请输入脚本"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
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
                                                    <a-form-item
                                                        label="长度值"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'size',
                                                        ]"
                                                        :rules="Rules.size"
                                                    >
                                                        <a-input-number
                                                            style="width: 100%"
                                                            v-model:value="
                                                                cluster
                                                                    .configuration
                                                                    .parserConfiguration
                                                                    .size
                                                            "
                                                            placeholder="请输入长度值"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
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
                                                    <a-form-item
                                                        label="长度"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'length',
                                                        ]"
                                                        :rules="Rules.length"
                                                    >
                                                        <a-select
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
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
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
                                                    <a-form-item
                                                        label="偏移量"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'offset',
                                                        ]"
                                                        :rules="Rules.offset"
                                                    >
                                                        <a-input-number
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
                                                    </a-form-item>
                                                </a-col>
                                                <a-col
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
                                                    <a-form-item
                                                        label="大小端"
                                                        :name="[
                                                            'cluster',
                                                            index,
                                                            'configuration',
                                                            'parserConfiguration',
                                                            'little',
                                                        ]"
                                                    >
                                                        <a-select
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
                                                    </a-form-item>
                                                </a-col>
                                            </a-row>
                                        </a-collapse-panel>
                                    </a-collapse>
                                </div>
                                <a-form-item v-if="!shareCluster">
                                    <a-button
                                        type="dashed"
                                        block
                                        @click="addCluster"
                                    >
                                        <PlusOutlined />
                                        新增
                                    </a-button>
                                </a-form-item>
                            </a-form>

                            <a-row :gutter="[24, 0]">
                                <a-col :span="24">
                                    <a-form-item
                                        label="说明"
                                        name="description"
                                    >
                                        <a-textarea
                                            v-model:value="formData.description"
                                            show-count
                                            :maxlength="200"
                                            :rows="4"
                                        /> </a-form-item
                                ></a-col>
                            </a-row>
                        </a-form>
                    </div>
                </div>
            </div>
            <div class="steps-action">
                <a-button
                    v-if="view === 'false'"
                    type="primary"
                    @click="saveData"
                >
                    保存
                </a-button>
            </div>
        </a-card>
    </page-container>
</template>

<script lang="ts" setup name="AccessNetwork">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { getResourcesCurrent, getClusters } from '@/api/link/accessConfig';
import {
    DeleteOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons-vue';
import { update, save } from '@/api/link/accessConfig';
import {
    // update,
    // save,
    resourcesCurrent,
    resourceClusters,
    supports,
} from '@/api/link/type';
import {
    FormStates,
    FormStates2,
    Configuration,
    ParserTypeOptions,
    isVisible,
    Validator,
    LengthOptions,
    LittleOptions,
    Rules,
    TCPList,
    UDPList,
} from '../data';
import { cloneDeep } from 'lodash-es';
import type { ConfigurationType, FormDataType, FormData2Type } from '../type';
import { Store } from 'jetlinks-store';

const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const activeKey = ref(['1']);
const clientHeight = document.body.clientHeight;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();
const useForm = Form.useForm;

let formData = ref(FormStates);

let params = {
    configuration: {},
};
let sipListConst: any = [];
const sipListOption = ref([]);
const sipList = ref([]);
const sipListIndex: any = ref([]);
const clustersList = ref([]);
const typeOptions = ref([]);
const portOptions = ref([]);
let portOptionsConst: any = [];

// <{ cluster: Form2[] }>

// const dynamicValidateForm = reactive<{ cluster: FormData2Type[] }>(
//     initDynamicValidateForm(),
// );
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

const handleChangeForm2Sip = (index: number) => {
    dynamicValidateForm.cluster[index].configuration.port = undefined;
    const value = dynamicValidateForm.cluster[index].configuration.host;
    sipListIndex.value[index] = sipListConst
        .find((i: any) => i.host === value)
        ?.portList.map((i: any) => {
            return {
                value: JSON.stringify({
                    host: value,
                    port: i.port,
                }),
                label: `${i.transports.join('/')} (${i.port})`,
            };
        });
};

const saveData = async () => {
    let data2 = await formRef2.value?.validate();
};

const next = async () => {
    let data2 = await formRef2.value?.validate();
};

const getSupports = async () => {
    const res = await supports();

    typeOptions.value = res.result.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    // supports().then((resp) =>
    //   resp.result?.map((item: any) => ({
    //     label: item.name,
    //     value: item.id,
    //   })),
    // );
};
getSupports();

const filterConfigByType = (data, type: string) => {
    let _temp = type;
    if (TCPList.includes(type)) {
        _temp = 'TCP';
    } else if (UDPList.includes(type)) {
        _temp = 'UDP';
    }
    // 只保留ports 包含type的数据
    const _config = data?.filter((item) => {
        return Object.keys(item.ports).includes(_temp);
    });

    // 只保留ports的type数据
    return _config?.map((i) => {
        i.ports = i.ports[_temp];
        return i;
    });
};
// const getResourceById = async (id, type) =>
//   Service.getResourcesClustersById(id).then((resp) => filterConfigByType(resp.result, type))

onMounted(() => {
    resourcesCurrent().then((resp) => {
        if (resp.status === 200) {
            portOptionsConst = resp.result;
            Store.set('configRef', resp.result);
            const type = formData.value.type;
            const host = dynamicValidateForm.cluster[0].configuration.host;

            const _port = filterConfigByType(resp.result, type);
            const _host = _port.find((item) => item.host === host);

            portOptions.value = _host?.ports?.map((p) => ({
                label: p,
                value: p,
            }));

            // sipListConst = resp.result;
            // sipListOption.value = sipListConst.map((i) => ({
            //     value: i.host,
            //     label: i.host,
            // }));

            // sipList.value = sipListConst
            //     .find((i) => i.host === '0.0.0.0')
            //     ?.portList.map((i) => {
            //         return {
            //             value: JSON.stringify({
            //                 host: '0.0.0.0',
            //                 port: i.port,
            //             }),
            //             label: `${i.transports.join('/')} (${i.port})`,
            //         };
            //     });
        }
    });

    getClusters().then((resp) => {
        if (resp.status === 200) {
            const list = resp.result.map((i) => ({
                value: i.id,
                label: i.name,
            }));
            clustersList.value = list;
        }
    });

    if (id !== ':id') {
        // formData.value = props.data.configuration;
        // formData.value = {
        //     name: props.data.name,
        //     description: props.data?.description || '',
        // };
    }
});

const shareCluster = ref(true);

const changeShareCluster = (value: boolean) => {
    shareCluster.value = value;
    activeKey.value = ['1'];
    console.log(1112, shareCluster.value);

    dynamicValidateForm.cluster = [{ ...cloneDeep(FormStates2), id: '1' }];
};

const changeType = (value: string) => {
    dynamicValidateForm.cluster = [{ ...cloneDeep(FormStates2), id: '1' }];
};

watch(
    () => formData.value.shareCluster,

    (value) => {
        const { configuration } = dynamicValidateForm.cluster[0];
        if (value) configuration.host = '0.0.0.0';
    },
    { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.steps-box {
    width: 70%;
    min-height: 400px;
    .card-item {
        padding-right: 5px;
        max-height: 480px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .card-last {
        padding-right: 5px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
.steps-action {
    width: 100%;
    margin-top: 24px;
    // margin-left: 20px;
}

.form-item1 {
    // background-color: #f6f6f6;
    border: 1px solid #d9d9d9;
    padding: 10px;
    margin-bottom: 20px;
}
.form-label {
    height: 30px;
    padding-bottom: 8px;
    .form-label-required {
        color: red;
        margin: 0 4px 0 -2px;
    }
}
.collapse {
    margin-bottom: 20px;
}
</style>
