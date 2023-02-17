<template>
    <page-container>
        <a-card>
            <div class="steps-box">
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
                                label="名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                    },
                                    {
                                        max: 64,
                                        message: '最大可输入64个字符',
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="formState.name"
                                    placeholder="请输入名称"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="类型"
                                name="type"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请选择类型',
                                    },
                                ]"
                            >
                                <a-select
                                    v-model:value="formState.type"
                                    :options="typeOption"
                                    placeholder="请选择类型"
                                    allowClear
                                    show-search
                                    :filter-option="filterOption"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-form-item
                        name="shareCluster"
                        :rules="[
                            {
                                required: true,
                                message: '请选择集群',
                            },
                        ]"
                    >
                        <div class="form-label">
                            集群
                            <span class="form-label-required">*</span>
                            <a-tooltip>
                                <template #title>
                                    <p>共享配置:集群下所有节点共用同一配置</p>
                                    <p>独立配置:集群下不同节点使用不同配置</p>
                                </template>
                                <question-circle-outlined />
                            </a-tooltip>
                        </div>

                        <a-radio-group
                            v-model:value="formState.shareCluster"
                            button-style="solid"
                        >
                            <a-radio-button :value="true"
                                >共享配置</a-radio-button
                            >
                            <a-radio-button :value="false"
                                >独立配置</a-radio-button
                            >
                        </a-radio-group>
                    </a-form-item>
                    <div v-if="formState.shareCluster" class="form-item1">
                        <a-row :gutter="[24, 0]">
                            <a-col
                                :span="12"
                                v-if="isVisible('host', formState.type)"
                            >
                                <a-form-item
                                    :name="['configuration', 'host']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择本地地址',
                                        },
                                        {
                                            pattern:
                                                Validator.regIp ||
                                                Validator.regDomain,
                                            message: '请输入IP或者域名',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        本地地址
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
                                                <p>
                                                    绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0
                                                </p>
                                            </template>
                                            <question-circle-outlined />
                                        </a-tooltip>
                                    </div>
                                    <a-select
                                        v-model:value="
                                            formState.configuration.host
                                        "
                                        :disabled="true"
                                        show-search
                                        :filter-option="filterOption"
                                    >
                                        <a-select-option value="0.0.0.0"
                                            >0.0.0.0</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('port', formState.type)"
                            >
                                <a-form-item
                                    :name="['configuration', 'port']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择本地端口',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        本地端口
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
                                                <p>监听指定端口的请求</p>
                                            </template>
                                            <question-circle-outlined />
                                        </a-tooltip>
                                    </div>

                                    <a-select
                                        v-model:value="
                                            formState.configuration.port
                                        "
                                        :options="sipList"
                                        placeholder="请选择本地端口"
                                        allowClear
                                        show-search
                                        :filter-option="filterOption"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('publicHost', formState.type)"
                            >
                                <a-form-item
                                    :name="['configuration', 'publicHost']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入公网地址',
                                        },
                                        {
                                            pattern:
                                                Validator.regIp ||
                                                Validator.regDomain,
                                            message: '请输入IP或者域名',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        公网地址
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
                                                <p>
                                                    对外提供访问的地址,内网环境时填写服务器的内网IP地址
                                                </p>
                                            </template>
                                            <question-circle-outlined />
                                        </a-tooltip>
                                    </div>
                                    <a-input
                                        v-model:value="
                                            formState.configuration.publicHost
                                        "
                                        placeholder="请输入公网地址"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('publicPort', formState.type)"
                            >
                                <a-form-item
                                    :name="['configuration', 'publicPort']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入公网端口',
                                        },
                                        {
                                            pattern: Validator.regOnlyNumber,
                                            message:
                                                '请输入1-65535之间的正整数',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        公网端口
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
                                                <p>对外提供访问的端口</p>
                                            </template>
                                            <question-circle-outlined />
                                        </a-tooltip>
                                    </div>

                                    <a-input-number
                                        style="width: 100%"
                                        placeholder="请输入公网端口"
                                        v-model:value="
                                            formState.configuration.publicPort
                                        "
                                        :min="1"
                                        :max="65535"
                                    />
                                </a-form-item>
                            </a-col>

                            <a-col
                                :span="12"
                                v-if="isVisible('remoteHost', formState.type)"
                            >
                                <a-form-item
                                    label="远程地址"
                                    :name="['configuration', 'remoteHost']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入远程地址',
                                        },
                                        {
                                            pattern:
                                                Validator.regIp ||
                                                Validator.regDomain,
                                            message: '请输入IP或者域名',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="
                                            formState.configuration.remoteHost
                                        "
                                        placeholder="请输入远程地址"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('remotePort', formState.type)"
                            >
                                <a-form-item
                                    label="远程端口"
                                    :name="['configuration', 'remotePort']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '输入远程端口',
                                        },
                                        {
                                            pattern: Validator.regOnlyNumber,
                                            message:
                                                '请输入1-65535之间的正整数',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        style="width: 100%"
                                        placeholder="请输入远程端口"
                                        v-model:value="
                                            formState.configuration.remotePort
                                        "
                                        :min="1"
                                        :max="65535"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('clientId', formState.type)"
                            >
                                <a-form-item
                                    label="clientId"
                                    :name="['configuration', 'clientId']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入ClientId',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="
                                            formState.configuration.clientId
                                        "
                                        placeholder="请输入ClientId"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('username', formState.type)"
                            >
                                <a-form-item
                                    label="用户名"
                                    :name="['configuration', 'username']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入用户名',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="
                                            formState.configuration.username
                                        "
                                        placeholder="请输入用户名"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('password', formState.type)"
                            >
                                <a-form-item
                                    label="密码"
                                    :name="['configuration', 'password']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入密码',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input-password
                                        v-model:value="
                                            formState.configuration.password
                                        "
                                        placeholder="请输入密码"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="isVisible('topicPrefix', formState.type)"
                            >
                                <a-form-item
                                    :name="['configuration', 'topicPrefix']"
                                    :rules="[
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        订阅前缀
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
                                                <p>
                                                    当连接的服务为EMQ时,可能需要使用共享的订阅前缀,如:$queue或$share
                                                </p>
                                            </template>
                                            <question-circle-outlined />
                                        </a-tooltip>
                                    </div>
                                    <a-input
                                        v-model:value="
                                            formState.configuration.topicPrefix
                                        "
                                        placeholder="请输入订阅前缀"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="
                                    isVisible('maxMessageSize', formState.type)
                                "
                            >
                                <a-form-item
                                    :name="['configuration', 'maxMessageSize']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入最大消息长度',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        最大消息长度
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
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
                                            formState.configuration
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
                                    isVisible('secureSpan12', formState.type)
                                        ? '12'
                                        : '24'
                                "
                            >
                                <a-form-item
                                    :label="
                                        isVisible('secure', formState.type)
                                            ? '开启TLS'
                                            : '开启DTLS'
                                    "
                                    :name="['configuration', 'secure']"
                                    :rules="[
                                        {
                                            required: true,
                                        },
                                    ]"
                                >
                                    <a-radio-group
                                        v-model:value="
                                            formState.configuration.secure
                                        "
                                    >
                                        <a-radio :value="true">是</a-radio>
                                        <a-radio :value="false">否</a-radio>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="formState.configuration.secure"
                            >
                                <a-form-item
                                    label="证书"
                                    :name="['configuration', 'certId']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择证书',
                                        },
                                    ]"
                                >
                                    <a-select
                                        v-model:value="
                                            formState.configuration.certId
                                        "
                                        :options="sipList"
                                        placeholder="请选择证书"
                                        allowClear
                                        show-search
                                        :filter-option="filterOption"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="formState.configuration.secure"
                            >
                                <a-form-item
                                    label="私钥别名"
                                    :name="['configuration', 'privateKeyAlias']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入私钥别名',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="
                                            formState.configuration
                                                .privateKeyAlias
                                        "
                                        placeholder="请输入私钥别名"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="24"
                                v-if="isVisible('parserType', formState.type)"
                            >
                                <a-form-item
                                    :name="['configuration', 'parserType']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择粘拆包规则',
                                        },
                                    ]"
                                >
                                    <div class="form-label">
                                        粘拆包规则
                                        <span class="form-label-required"
                                            >*</span
                                        >
                                        <a-tooltip>
                                            <template #title>
                                                <p>处理TCP粘拆包的方式</p>
                                            </template>
                                            <question-circle-outlined />
                                        </a-tooltip>
                                    </div>
                                    <a-select
                                        style="width: 48.5%"
                                        v-model:value="
                                            formState.configuration.parserType
                                        "
                                        :options="ParserTypeOptions"
                                        placeholder="请选择粘拆包规则"
                                        allowClear
                                        show-search
                                        :filter-option="filterOption"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="
                                    isVisible(
                                        'delimited',
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    label="分隔符"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'delimited',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入分隔符',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.delimited
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
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    v-show="false"
                                    label="脚本语言"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'lang',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择脚本语言',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-select
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.lang
                                        "
                                        show-search
                                        :filter-option="filterOption"
                                    >
                                        <a-select-option
                                            :value="
                                                formState.configuration
                                                    .parserType === 'SCRIPT'
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
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    label="解析脚本"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'script',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入脚本',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.script
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
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    label="长度值"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'size',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入长度值',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        style="width: 100%"
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.size
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
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    label="长度"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'length',
                                    ]"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择长度',
                                        },
                                    ]"
                                >
                                    <a-select
                                        style="width: 100%"
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.length
                                        "
                                        :options="LengthOptions"
                                        placeholder="请选择长度"
                                        allowClear
                                        show-search
                                        :filter-option="filterOption"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col
                                :span="12"
                                v-if="
                                    isVisible(
                                        'offset',
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    label="偏移量"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'offset',
                                    ]"
                                    :rules="[
                                        {
                                            pattern: Validator.regOnlyNumber,
                                            message:
                                                '请输入0-65535之间的正整数',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        style="width: 100%"
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.offset
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
                                        formState.configuration.parserType,
                                    )
                                "
                            >
                                <a-form-item
                                    label="大小端"
                                    :name="[
                                        'configuration',
                                        'parserConfiguration',
                                        'little',
                                    ]"
                                >
                                    <a-select
                                        style="width: 100%"
                                        v-model:value="
                                            formState.configuration
                                                .parserConfiguration.little
                                        "
                                        :options="LittleOptions"
                                        placeholder="请选择大小端"
                                        allowClear
                                        show-search
                                        :filter-option="filterOption"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                    <a-row :gutter="[24, 24]" v-if="formState.shareCluster">
                        <a-col :span="24">
                            <a-form-item label="说明" name="description">
                                <a-textarea
                                    v-model:value="formState.description"
                                    show-count
                                    :maxlength="200"
                                    :rows="4"
                                /> </a-form-item
                        ></a-col>
                    </a-row>
                </a-form>
                <div v-if="!formState.shareCluster" class="form-item2">
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
                            <a-collapse v-model:activeKey="activeKey">
                                <a-collapse-panel
                                    :key="cluster.id"
                                    :header="`#${index + 1}.节点`"
                                >
                                    <template #extra>
                                        <delete-outlined
                                            @click="removeCluster(cluster)"
                                        />
                                    </template>

                                    <a-row :gutter="[24, 0]">
                                        <a-col :span="12">
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
                                                    :options="clustersList"
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
                                                    formState.type,
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
                                                :rules="{
                                                    required: true,
                                                    message: '请选择本地地址',
                                                }"
                                            >
                                                <div class="form-label">
                                                    本地地址
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
                                                            <p>
                                                                绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0
                                                            </p>
                                                        </template>
                                                        <question-circle-outlined />
                                                    </a-tooltip>
                                                </div>

                                                <a-select
                                                    v-model:value="
                                                        cluster.configuration
                                                            .host
                                                    "
                                                    :options="sipListOption"
                                                    placeholder="本地地址"
                                                    allowClear
                                                    show-search
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
                                                    formState.type,
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
                                                :rules="{
                                                    required: true,
                                                    message: '请选择本地端口',
                                                }"
                                            >
                                                <div class="form-label">
                                                    本地端口
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
                                                            <p>
                                                                监听指定端口的请求
                                                            </p>
                                                        </template>
                                                        <question-circle-outlined />
                                                    </a-tooltip>
                                                </div>
                                                <a-select
                                                    v-model:value="
                                                        cluster.configuration
                                                            .port
                                                    "
                                                    :options="
                                                        sipListIndex[index]
                                                    "
                                                    placeholder="请选择本地端口"
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
                                                    'publicHost',
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入公网地址',
                                                    },
                                                    {
                                                        pattern:
                                                            Validator.regIp ||
                                                            Validator.regDomain,
                                                        message:
                                                            '请输入IP或者域名',
                                                    },
                                                ]"
                                            >
                                                <div class="form-label">
                                                    公网地址
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
                                                            <p>
                                                                对外提供访问的地址,内网环境时填写服务器的内网IP地址
                                                            </p>
                                                        </template>
                                                        <question-circle-outlined />
                                                    </a-tooltip>
                                                </div>
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入公网端口',
                                                    },
                                                    {
                                                        pattern:
                                                            Validator.regOnlyNumber,
                                                        message:
                                                            '请输入1-65535之间的正整数',
                                                    },
                                                ]"
                                            >
                                                <div class="form-label">
                                                    公网端口
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
                                                            <p>
                                                                对外提供访问的端口
                                                            </p>
                                                        </template>
                                                        <question-circle-outlined />
                                                    </a-tooltip>
                                                </div>

                                                <a-input-number
                                                    style="width: 100%"
                                                    placeholder="请输入公网端口"
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
                                                )
                                            "
                                        >
                                            <a-form-item
                                                label="远程地址"
                                                :name="[
                                                    'cluster',
                                                    index,
                                                    'configuration',
                                                    'remoteHost',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入远程地址',
                                                    },
                                                    {
                                                        pattern:
                                                            Validator.regIp ||
                                                            Validator.regDomain,
                                                        message:
                                                            '请输入IP或者域名',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
                                                            .configuration
                                                            .remoteHost
                                                    "
                                                    placeholder="请输入远程地址"
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col
                                            :span="12"
                                            v-if="
                                                isVisible(
                                                    'remotePort',
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '输入远程端口',
                                                    },
                                                    {
                                                        pattern:
                                                            Validator.regOnlyNumber,
                                                        message:
                                                            '请输入1-65535之间的正整数',
                                                    },
                                                ]"
                                            >
                                                <a-input-number
                                                    style="width: 100%"
                                                    placeholder="请输入远程端口"
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入ClientId',
                                                    },
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请输入用户名',
                                                    },
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请输入密码',
                                                    },
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <a-input-password
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <div class="form-label">
                                                    订阅前缀
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
                                                            <p>
                                                                当连接的服务为EMQ时,可能需要使用共享的订阅前缀,如:$queue或$share
                                                            </p>
                                                        </template>
                                                        <question-circle-outlined />
                                                    </a-tooltip>
                                                </div>
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入最大消息长度',
                                                    },
                                                ]"
                                            >
                                                <div class="form-label">
                                                    最大消息长度
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
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
                                                        cluster.configuration
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
                                                    formState.type,
                                                )
                                                    ? '12'
                                                    : '24'
                                            "
                                        >
                                            <a-form-item
                                                :label="
                                                    isVisible(
                                                        'secure',
                                                        formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                    },
                                                ]"
                                            >
                                                <a-radio-group
                                                    v-model:value="
                                                        cluster.configuration
                                                            .secure
                                                    "
                                                >
                                                    <a-radio :value="true"
                                                        >是</a-radio
                                                    >
                                                    <a-radio :value="false"
                                                        >否</a-radio
                                                    >
                                                </a-radio-group>
                                            </a-form-item>
                                        </a-col>
                                        <a-col
                                            :span="12"
                                            v-if="cluster.configuration.secure"
                                        >
                                            <a-form-item
                                                label="证书"
                                                :name="[
                                                    'cluster',
                                                    index,
                                                    'configuration',
                                                    'certId',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请选择证书',
                                                    },
                                                ]"
                                            >
                                                <a-select
                                                    v-model:value="
                                                        cluster.configuration
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
                                            v-if="cluster.configuration.secure"
                                        >
                                            <a-form-item
                                                label="私钥别名"
                                                :name="[
                                                    'cluster',
                                                    index,
                                                    'configuration',
                                                    'privateKeyAlias',
                                                ]"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入私钥别名',
                                                    },
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    formState.type,
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请选择粘拆包规则',
                                                    },
                                                ]"
                                            >
                                                <div class="form-label">
                                                    粘拆包规则
                                                    <span
                                                        class="form-label-required"
                                                        >*</span
                                                    >
                                                    <a-tooltip>
                                                        <template #title>
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
                                                        cluster.configuration
                                                            .parserType
                                                    "
                                                    :options="ParserTypeOptions"
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
                                                    cluster.configuration
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请输入分隔符',
                                                    },
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    cluster.configuration
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message:
                                                            '请选择脚本语言',
                                                    },
                                                    {
                                                        max: 64,
                                                        message:
                                                            '最大可输入64个字符',
                                                    },
                                                ]"
                                            >
                                                <a-select
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    cluster.configuration
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请输入脚本',
                                                    },
                                                ]"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    cluster.configuration
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请输入长度值',
                                                    },
                                                ]"
                                            >
                                                <a-input-number
                                                    style="width: 100%"
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    cluster.configuration
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
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: '请选择长度',
                                                    },
                                                ]"
                                            >
                                                <a-select
                                                    style="width: 100%"
                                                    v-model:value="
                                                        cluster.configuration
                                                            .parserConfiguration
                                                            .length
                                                    "
                                                    :options="LengthOptions"
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
                                                    cluster.configuration
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
                                                :rules="[
                                                    {
                                                        pattern:
                                                            Validator.regOnlyNumber,
                                                        message:
                                                            '请输入0-65535之间的正整数',
                                                    },
                                                ]"
                                            >
                                                <a-input-number
                                                    style="width: 100%"
                                                    v-model:value="
                                                        cluster.configuration
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
                                                    cluster.configuration
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
                                                        cluster.configuration
                                                            .parserConfiguration
                                                            .little
                                                    "
                                                    :options="LittleOptions"
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

                        <a-form-item>
                            <a-button
                                style="margin-top: 10px"
                                type="dashed"
                                block
                                @click="addCluster"
                            >
                                <PlusOutlined />
                                新增
                            </a-button>
                        </a-form-item>
                        <a-row
                            :gutter="[24, 24]"
                            v-if="!formState.shareCluster"
                        >
                            <a-col :span="24">
                                <a-form-item label="说明" name="description">
                                    <a-textarea
                                        v-model:value="formState.description"
                                        show-count
                                        :maxlength="200"
                                        :rows="4"
                                    /> </a-form-item
                            ></a-col>
                        </a-row>
                    </a-form>
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

        <!-- <div class="steps-action">
            <a-button
                v-if="[0].includes(current)"
                style="margin-right: 8px"
                @click="next"
            >
                下一步
            </a-button>
            <a-button
                v-if="current === 1 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
            >
                保存
            </a-button>
            <a-button v-if="current > 0" @click="prev"> 上一步 </a-button>
        </div> -->
    </page-container>
</template>

<script lang="ts" setup name="TypeDetail">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import {
    update,
    save,
    resourcesCurrent,
    resourceClusters,
    supports,
} from '@/api/link/type';
import {
    DeleteOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons-vue';
// import { update, save } from '@/api/link/accessConfig';
import {
    FormStates,
    FormStates2,
    VisibleData,
    ParserTypeOptions,
    isVisible,
    Validator,
    LengthOptions,
    LittleOptions,
} from '../data';
import type { Form2 } from '../type';

// interface Form2 {
//     clusterNodeId: string;
//     port: string;
//     host: string;
//     publicPort: string;
//     publicHost: string;
//     id: number;
// }

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

const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const activeKey: any = ref([]);
const clientHeight = document.body.clientHeight;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();
const useForm = Form.useForm;

const formData = ref({
    name: '',
    description: '',
});
// let formState = ref<FormState>({
let formState = ref({
    ...FormStates,
});

let params = {
    configuration: {},
};
let sipListConst: any = [];
const sipListOption = ref([]);
const sipList = ref([]);
const sipListIndex: any = ref([]);
const clustersList = ref([]);
const typeOption = ref([]);

const dynamicValidateForm = reactive<{ cluster: Form2[] }>({
    cluster: [],
});

const removeCluster = (item: Form2) => {
    let index = dynamicValidateForm.cluster.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.cluster.splice(index, 1);
    }
};

const addCluster = () => {
    const id = Date.now();
    dynamicValidateForm.cluster.push({
        ...FormStates2,
        id,
    });
    activeKey.value = [...activeKey.value, id.toString()];
};
// const addCluster = () => {
//     const id = Date.now();
//     dynamicValidateForm.cluster.push({
//         ...FormStates2,
//         id,
//     });
//     activeKey.value = [...activeKey.value, id.toString()];
// };

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleChangeForm2Sip = (index: number) => {
    dynamicValidateForm.cluster.configuration.port = undefined;
    const value = dynamicValidateForm.cluster.configuration.host;
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

const saveData = () => {
    // validate().then(async (values) => {
    //     params = {
    //         ...params,
    //         ...values,
    //         provider: 'gb28181-2016',
    //         transport: 'SIP',
    //         channel: 'gb28181',
    //     };
    //     const resp =
    //         id === ':id' ? await save(params) : await update({ ...params, id });
    //     if (resp.status === 200) {
    //         message.success('操作成功！');
    //         // if (params.get('save')) {
    //         // if ((window as any).onTabSaveSuccess) {
    //         //   if (resp.result) {
    //         //     (window as any).onTabSaveSuccess(resp.result);
    //         //     setTimeout(() => window.close(), 300);
    //         //   }
    //         // }
    //         //   } else {
    //         history.back();
    //         //   }
    //     }
    // });
};

const next = async () => {
    let data1: any = await formRef1.value?.validate();
    if (data1.configuration?.port) {
        const port = JSON.parse(data1.configuration.port).port;
        data1.configuration.port = port;
    }
    if (!data1?.shareCluster) {
        let data2 = await formRef2.value?.validate();
        if (data2 && data2?.cluster) {
            data2.cluster.forEach((i: any) => {
                i.enabled = true;
                i.port = JSON.parse(i.port).port;
            });
            data1 = {
                ...data1,
                ...data2,
            };
        }
    }
    params.configuration = data1;
};

const getSupports = async () => {
    const res = await supports();

    typeOption.value = res.result.map((item) => ({
        label: item.name,
        value: item.id,
    }));
    console.log(1112, res, typeOption.value);

    // supports().then((resp) =>
    //   resp.result?.map((item: any) => ({
    //     label: item.name,
    //     value: item.id,
    //   })),
    // );
};
getSupports();

onMounted(() => {
    resourcesCurrent().then((resp) => {
        if (resp.status === 200) {
            sipListConst = resp.result;
            sipListOption.value = sipListConst.map((i) => ({
                value: i.host,
                label: i.host,
            }));

            sipList.value = sipListConst
                .find((i) => i.host === '0.0.0.0')
                ?.portList.map((i) => {
                    return {
                        value: JSON.stringify({
                            host: '0.0.0.0',
                            port: i.port,
                        }),
                        label: `${i.transports.join('/')} (${i.port})`,
                    };
                });
        }
    });

    resourceClusters().then((resp) => {
        if (resp.status === 200) {
            const list = resp.result.map((i) => ({
                value: i.id,
                label: i.name,
            }));
            clustersList.value = list;
        }
    });

    if (id !== ':id') {
        formState.value = props.data.configuration;
        formData.value = {
            name: props.data.name,
            description: props.data?.description || '',
        };
    }
});
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
    margin-left: 20px;
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
</style>
