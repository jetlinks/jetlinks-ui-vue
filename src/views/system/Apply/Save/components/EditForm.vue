<template>
    <div class="edit-form-container">
        <j-form
            ref="formRef"
            :model="form.data"
            layout="vertical"
            class="form"
            @validate="getErrorNum"
        >
            <j-form-item
                label="名称"
                name="name"
                :rules="[
                    {
                        required: true,
                        message: '请输入名称',
                    },
                    {
                        max: 64,
                        message: '最多可输入64个字符',
                    },
                ]"
            >
                <j-input
                    v-model:value="form.data.name"
                    placeholder="请输入名称"
                />
            </j-form-item>
            <j-form-item
                label="应用"
                name="provider"
                :rules="[
                    {
                        required: true,
                        message: '请选择应用',
                    },
                ]"
            >
                <j-radio-group
                    v-model:value="form.data.provider"
                    class="radio-container"
                    :disabled="!!routeQuery.id"
                >
                    <j-radio-button value="internal-standalone">
                        <div>
                            <j-image
                                :preview="false"
                                :src="getImage('/apply/provider1.png')"
                                width="64px"
                                height="64px"
                            />
                            <p>内部独立应用</p>
                        </div>
                    </j-radio-button>
                    <j-radio-button value="internal-integrated">
                        <div>
                            <j-image
                                :preview="false"
                                :src="getImage('/apply/provider2.png')"
                            />
                            <p>内部集成应用</p>
                        </div>
                    </j-radio-button>
                    <j-radio-button value="wechat-webapp">
                        <div>
                            <j-image
                                :preview="false"
                                :src="getImage('/apply/provider3.png')"
                            />
                            <p>微信网站应用</p>
                        </div>
                    </j-radio-button>
                    <j-radio-button value="dingtalk-ent-app">
                        <div>
                            <j-image
                                :preview="false"
                                :src="getImage('/apply/provider4.png')"
                            />
                            <p>钉钉企业内部应用</p>
                        </div>
                    </j-radio-button>
                    <j-radio-button value="third-party">
                        <div>
                            <j-image
                                :preview="false"
                                :src="getImage('/apply/provider5.png')"
                            />
                            <p>第三方应用</p>
                        </div>
                    </j-radio-button>
                </j-radio-group>
            </j-form-item>
            <j-form-item
                label="接入方式"
                name="integrationModes"
                :rules="[
                    {
                        required: true,
                        message: '请选择接入方式',
                    },
                ]"
            >
                <j-checkbox-group
                    v-model:value="form.data.integrationModes"
                    :options="joinOptions"
                />
            </j-form-item>

            <j-collapse v-model:activeKey="form.integrationModesISO">
                <!-- 页面集成 -->
                <j-collapse-panel
                    key="page"
                    v-if="form.data.integrationModes.includes('page')"
                >
                    <template #header>
                        <span>
                            页面集成
                            <span
                                v-show="form.errorNumInfo.page.size"
                                class="error-info"
                            >
                                {{ form.errorNumInfo.page.size }}
                            </span>
                        </span>
                    </template>
                    <j-form-item
                        :name="['page', 'baseUrl']"
                        class="resetLabel"
                        :rules="[
                            {
                                required: true,
                                message: '请输入接入地址',
                            },
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="接入地址"
                                required
                                tooltip="填写访问其它平台的地址"
                            />
                        </template>
                        <j-input
                            v-model:value="form.data.page.baseUrl"
                            placeholder="请输入接入地址"
                        />
                    </j-form-item>
                    <j-form-item
                        label="路由方式"
                        :name="['page', 'routeType']"
                        :rules="[
                            {
                                required: true,
                                message: '请选择路由方式',
                            },
                        ]"
                    >
                        <j-select v-model:value="form.data.page.routeType">
                            <j-select-option value="hash">hash</j-select-option>
                            <j-select-option value="history"
                                >history</j-select-option
                            >
                        </j-select>
                    </j-form-item>

                    <j-form-item v-if="form.data.provider === 'third-party'">
                        <template #label>
                            <FormLabel
                                text="参数"
                                tooltip="自定义参数,格式${name}"
                            />
                        </template>

                        <RequestTable
                            v-model:value="form.data.page.parameters"
                            value-type="select"
                            :value-options="[
                                { label: '用户ID', value: '用户ID' },
                                { label: '用户名', value: '用户名' },
                                { label: 'token', value: 'token' },
                            ]"
                        />
                    </j-form-item>
                </j-collapse-panel>
                <!-- API客户端 -->
                <j-collapse-panel
                    key="apiClient"
                    v-if="form.data.integrationModes.includes('apiClient')"
                >
                    <template #header>
                        <span>
                            API客户端
                            <span
                                v-show="form.errorNumInfo.apiClient.size"
                                class="error-info"
                            >
                                {{ form.errorNumInfo.apiClient.size }}
                            </span>
                        </span>
                    </template>
                    <j-form-item
                        class="resetLabel"
                        :name="['apiClient', 'baseUrl']"
                        :rules="[
                            {
                                required: true,
                                message: '请输入接口地址',
                            },
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="接口地址"
                                required
                                tooltip="访问Api服务的地址"
                            />
                        </template>
                        <j-input
                            v-model:value="form.data.apiClient.baseUrl"
                            placeholder="请输入接口地址"
                        />
                    </j-form-item>
                    <div v-if="form.data.provider === 'internal-standalone'">
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'apiClient',
                                'authConfig',
                                'oauth2',
                                'authorizationUrl',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入授权地址',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="授权地址"
                                    required
                                    tooltip="认证授权地址"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .authorizationUrl
                                "
                                placeholder="请输入授权地址"
                            />
                        </j-form-item>
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'apiClient',
                                'authConfig',
                                'oauth2',
                                'tokenUrl',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入token地址',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="token地址"
                                    required
                                    tooltip="设置token令牌的地址"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .tokenUrl
                                "
                                placeholder="请输入token地址"
                            />
                        </j-form-item>
                        <j-form-item>
                            <template #label>
                                <FormLabel
                                    text="回调地址"
                                    tooltip="授权完成后跳转到具体页面的回调地址"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .redirectUri
                                "
                                placeholder="请输入回调地址"
                            />
                        </j-form-item>
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'apiClient',
                                'authConfig',
                                'oauth2',
                                'clientId',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入appId',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appId"
                                    required
                                    tooltip="第三方应用唯一标识"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .clientId
                                "
                                placeholder="请输入appId"
                                :disabled="!!form.data.id"
                            />
                        </j-form-item>
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'apiClient',
                                'authConfig',
                                'oauth2',
                                'clientSecret',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入appKey',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appKey"
                                    required
                                    tooltip="第三方应用唯一标识的密钥"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .clientSecret
                                "
                                placeholder="请输入appKey"
                            />
                        </j-form-item>
                    </div>
                    <div v-else-if="form.data.provider === 'third-party'">
                        <j-form-item
                            label="认证方式"
                            :name="['apiClient', 'authConfig', 'type']"
                            :rules="[{ required: true }]"
                        >
                            <j-select
                                v-model:value="
                                    form.data.apiClient.authConfig.type
                                "
                            >
                                <j-select-option value="oauth2">
                                    OAuth2
                                </j-select-option>
                                <j-select-option value="basic">
                                    基本认证
                                </j-select-option>
                                <j-select-option value="bearer">
                                    bearer认证
                                </j-select-option>
                            </j-select>
                        </j-form-item>
                        <div
                            v-if="
                                form.data.apiClient.authConfig.type === 'oauth2'
                            "
                        >
                            <j-form-item
                                class="resetLabel"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'oauth2',
                                    'authorizationUrl',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入授权地址',
                                    },
                                ]"
                            >
                                <template #label>
                                    <FormLabel
                                        text="授权地址"
                                        required
                                        tooltip="认证授权地址"
                                    />
                                </template>
                                <j-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .authorizationUrl
                                    "
                                    placeholder="请输入授权地址"
                                />
                            </j-form-item>

                            <j-form-item
                                label="请求方式"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'oauth2',
                                    'tokenRequestType',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请选择请求方式',
                                    },
                                ]"
                            >
                                <j-select
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .tokenRequestType
                                    "
                                    placeholder="请选择请求方式"
                                >
                                    <j-select-option value="POST_BODY">
                                        请求体
                                    </j-select-option>
                                    <j-select-option value="POST_URI">
                                        请求头
                                    </j-select-option>
                                </j-select>
                            </j-form-item>

                            <j-form-item
                                class="resetLabel"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'oauth2',
                                    'clientId',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入client_id',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
                            >
                                <template #label>
                                    <FormLabel
                                        text="client_id"
                                        required
                                        tooltip="应用唯一标识"
                                    />
                                </template>
                                <j-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .clientId
                                    "
                                    placeholder="请输入client_id"
                                />
                            </j-form-item>
                            <j-form-item
                                class="resetLabel"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'oauth2',
                                    'clientSecret',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入client_secret',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
                            >
                                <template #label>
                                    <FormLabel
                                        text="client_secret"
                                        required
                                        tooltip="应用唯一标识的秘钥"
                                    />
                                </template>
                                <j-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .clientSecret
                                    "
                                    placeholder="请输入client_secret"
                                />
                            </j-form-item>
                        </div>
                        <div
                            v-else-if="
                                form.data.apiClient.authConfig.type === 'basic'
                            "
                        >
                            <j-form-item
                                label="用户名"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'basic',
                                    'username',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '该字段是必填字段',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.basic
                                            .username
                                    "
                                    placeholder="请输入用户名"
                                />
                            </j-form-item>
                            <j-form-item
                                label="密码"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'basic',
                                    'password',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '该字段是必填字段',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.basic
                                            .password
                                    "
                                    placeholder="请输入密码"
                                />
                            </j-form-item>
                        </div>
                        <j-form-item
                            v-else-if="
                                form.data.apiClient.authConfig.type === 'bearer'
                            "
                            label="token"
                            :name="[
                                'apiClient',
                                'authConfig',
                                'bearer',
                                'token',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入token',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="
                                    form.data.apiClient.authConfig.bearer.token
                                "
                                placeholder="请输入token"
                            />
                        </j-form-item>
                    </div>

                    <div v-if="form.data.provider !== 'internal-integrated'">
                        <j-form-item
                            :name="['apiClient', 'headers']"
                            :rules="[
                                {
                                    required: !headerValid,
                                    message: '请输入请求头',
                                },
                                {
                                    validator: headerValidator,
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="请求头"
                                    tooltip="根据不同应用的调用规范，自定义请求头内容"
                                />
                            </template>

                            <RequestTable
                                v-model:value="form.data.apiClient.headers"
                                v-model:valid="headerValid"
                            />
                        </j-form-item>
                        <j-form-item
                            label="参数"
                            :name="['apiClient', 'parameters']"
                            :rules="[
                                {
                                    required: !paramsValid,
                                    message: '请输入参数',
                                },
                                {
                                    validator: paramsValidator,
                                },
                            ]"
                        >
                            <RequestTable
                                v-model:value="form.data.apiClient.parameters"
                                v-model:valid="paramsValid"
                            />
                        </j-form-item>
                    </div>
                </j-collapse-panel>
                <!-- API服务 -->
                <j-collapse-panel
                    key="apiServer"
                    v-if="form.data.integrationModes.includes('apiServer')"
                >
                    <template #header>
                        <span>
                            API服务
                            <span
                                v-show="form.errorNumInfo.apiServer.size"
                                class="error-info"
                            >
                                {{ form.errorNumInfo.apiServer.size }}
                            </span>
                        </span>
                    </template>
                    <j-form-item
                        class="resetLabel"
                        v-if="!form.data.integrationModes.includes('apiClient')"
                        :name="['apiServer', 'appId']"
                        :rules="[{ required: true }]"
                    >
                        <template #label>
                            <FormLabel
                                text="appId"
                                required
                                tooltip="第三方应用唯一标识"
                            />
                        </template>
                        <j-input
                            v-model:value="form.data.apiServer.appId"
                            disabled
                            placeholder="请输入appId"
                        />
                    </j-form-item>

                    <j-form-item
                        class="resetLabel"
                        :name="['apiServer', 'secureKey']"
                        :rules="[
                            {
                                required: true,
                                message: '请输入secureKey',
                            },
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="secureKey"
                                required
                                tooltip="第三方应用唯一标识匹配的秘钥"
                            />
                        </template>
                        <j-input
                            v-model:value="form.data.apiServer.secureKey"
                            placeholder="请输入secureKey"
                        />
                    </j-form-item>
                    <j-form-item
                        class="resetLabel"
                        v-show="form.data.provider === 'internal-standalone'"
                    >
                        <template #label>
                            <FormLabel
                                text="回调地址"
                                tooltip="授权完成后跳转到具体页面的回调地址"
                            />
                        </template>
                        <j-input
                            v-model:value="form.data.apiServer.redirectUri"
                            placeholder="请输入redirectUri"
                        />
                    </j-form-item>
                    <j-form-item
                        class="resetLabel"
                        :name="['apiServer', 'roleIdList']"
                        :rules="[
                            {
                                required: true,
                                message: '请选择角色',
                            },
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="角色"
                                required
                                tooltip="为应用用户分配角色，根据绑定的角色，进行系统菜单赋权"
                            />
                        </template>
                        <j-select
                            v-model:value="form.data.apiServer.roleIdList"
                            :options="form.roleIdList"
                            mode="multiple"
                            placeholder="请选择角色"
                        ></j-select>
                        <PermissionButton
                            :hasPermission="`${rolePermission}:update`"
                            type="link"
                            @click="
                                clickAddItem(
                                    form.data.apiServer.roleIdList,
                                    'Role',
                                )
                            "
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </j-form-item>
                    <j-form-item>
                        <template #label>
                            <FormLabel
                                text="组织"
                                tooltip="为应用用户分配所属组织，根据绑定的组织，进行数据隔离"
                            />
                        </template>
                        <j-tree-select
                            v-model:value="form.data.apiServer.orgIdList"
                            show-search
                            style="width: 100%"
                            :dropdown-style="{
                                maxHeight: '400px',
                                overflow: 'auto',
                            }"
                            :fieldNames="{
                                label: 'name',
                                value: 'id',
                            }"
                            multiple
                            :tree-data="form.orgIdList"
                            placeholder="请选择组织"
                        >
                            <template #title="{ name }">
                                {{ name }}
                            </template>
                        </j-tree-select>
                        <PermissionButton
                            :hasPermission="`${deptPermission}:update`"
                            type="link"
                            @click="
                                clickAddItem(
                                    form.data.apiServer.orgIdList,
                                    'Department',
                                )
                            "
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </j-form-item>

                    <div v-if="form.data.provider === 'third-party'">
                        <j-form-item>
                            <template #label>
                                <FormLabel
                                    text="redirectUrl"
                                    tooltip="授权后自动跳转的页面地址"
                                />
                            </template>
                            <j-input
                                v-model:value="form.data.apiServer.redirectUri"
                                placeholder="请输入redirectUrl"
                            />
                        </j-form-item>
                        <j-form-item label="IP白名单">
                            <j-textarea
                                v-model:value="form.data.apiServer.ipWhiteList"
                                placeholder="请输入IP白名单，多个地址回车分隔，不填默认均可访问"
                                :rows="3"
                                style="width: 100%"
                            />
                        </j-form-item>
                    </div>
                </j-collapse-panel>
                <!-- 单点登录 -->
                <j-collapse-panel
                    key="ssoClient"
                    v-if="form.data.integrationModes.includes('ssoClient')"
                >
                    <template #header>
                        <span>
                            单点登录
                            <span
                                v-show="form.errorNumInfo.ssoClient.size"
                                class="error-info"
                                :style="
                                    form.errorNumInfo.ssoClient.size > 9
                                        ? { padding: '0 8px' }
                                        : {}
                                "
                            >
                                {{ form.errorNumInfo.ssoClient.size }}
                            </span>
                        </span>
                    </template>
                    <!-- 第三方应用 -->
                    <div v-if="form.data.provider === 'third-party'">
                        <j-form-item
                            label="认证方式"
                            :name="['sso', 'configuration', 'oauth2', 'type']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请选择认证方式',
                                },
                            ]"
                        >
                            <j-select
                                v-model:value="
                                    form.data.sso.configuration.oauth2.type
                                "
                                placeholder="请选择认证方式"
                                :options="[
                                    { label: 'oauth2', value: 'oauth2' },
                                ]"
                            />
                        </j-form-item>

                        <j-form-item
                            class="resetLabel"
                            :name="['sso', 'configuration', 'oauth2', 'scope']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入scope',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="scope"
                                    required
                                    tooltip="限制用户访问应用程序的权限"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2.scope
                                "
                                placeholder="请输入scope"
                            />
                        </j-form-item>
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'clientId',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入client_id',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="client_id"
                                    required
                                    tooltip="应用唯一标识"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2.clientId
                                "
                                placeholder="请输入client_id"
                            />
                        </j-form-item>
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'clientSecret',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入client_secret',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="client_secret"
                                    required
                                    tooltip="应用唯一标识的秘钥"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .clientSecret
                                "
                                placeholder="请输入client_secret"
                            />
                        </j-form-item>
                    </div>
                    <j-form-item
                        v-if="
                            (form.data.provider === 'internal-standalone' ||
                                form.data.provider === 'third-party') &&
                            !form.data.integrationModes.includes('apiClient')
                        "
                        class="resetLabel"
                        :name="[
                            'sso',
                            'configuration',
                            'oauth2',
                            'authorizationUrl',
                        ]"
                        :rules="[
                            {
                                required: true,
                                message: '请输入授权地址',
                            },
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="授权地址"
                                required
                                tooltip="认证授权地址"
                            />
                        </template>
                        <j-input
                            v-model:value="
                                form.data.sso.configuration.oauth2
                                    .authorizationUrl
                            "
                            placeholder="请输入授权地址"
                        />
                    </j-form-item>

                    <!-- 第三方应用 -->
                    <div v-if="form.data.provider === 'third-party'">
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'tokenUrl',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入token地址',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="token地址"
                                    required
                                    tooltip="设置token令牌的地址"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2.tokenUrl
                                "
                                placeholder="请输入token地址"
                            />
                        </j-form-item>
                        <j-form-item label="logo">
                            <j-upload
                                v-model:file-list="form.fileList"
                                accept=".jpg,.png"
                                :maxCount="1"
                                list-type="picture-card"
                                :show-upload-list="false"
                                :headers="{
                                    [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                                }"
                                :action="`${BASE_API_PATH}/file/static`"
                                :beforeUpload="beforeLogoUpload"
                                @change="changeBackUpload"
                            >
                                <img
                                    v-if="
                                        form.data.sso.configuration.oauth2
                                            .logoUrl
                                    "
                                    :src="
                                        form.data.sso.configuration.oauth2
                                            .logoUrl
                                    "
                                    alt="avatar"
                                    style="width: 150px"
                                />
                                <div v-else style="width: 150px">
                                    <AIcon
                                        :type="
                                            form.uploadLoading
                                                ? 'LoadingOutlined'
                                                : 'PlusOutlined'
                                        "
                                    />
                                    <div class="ant-upload-text">
                                        点击上传图片
                                    </div>
                                </div>
                            </j-upload>
                        </j-form-item>

                        <j-form-item
                            label="用户信息地址"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'userInfoUrl',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入用户信息地址',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .userInfoUrl
                                "
                                placeholder="请输入用户信息地址"
                            />
                        </j-form-item>
                        <j-form-item
                            class="resetLabel"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'userProperty',
                                'userId',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入用户ID',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="用户ID"
                                    required
                                    tooltip="通过jsonpath表达式从授权结果中获取第三方平台用户的唯一标识"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .userProperty.userId
                                "
                                placeholder="输入从用户信息接口返回数据中的用户ID字段。示例:result.id"
                            />
                        </j-form-item>
                        <j-form-item
                            label="用户名"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'userProperty',
                                'username',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入用户名',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .userProperty.username
                                "
                                placeholder="输入从用户信息接口返回数据中的用户名字段。示例:result.name"
                            />
                        </j-form-item>
                        <j-form-item label="头像">
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .userProperty.avatar
                                "
                                placeholder="输入从用户信息接口返回数据中的用户头像字段。示例:result.avatar"
                            />
                        </j-form-item>
                    </div>
                    <!-- 非第三方应用 -->
                    <div
                        v-else-if="
                            !form.data.integrationModes.includes('apiClient')
                        "
                    >
                        <j-form-item
                            v-if="form.data.provider === 'internal-standalone'"
                        >
                            <template #label>
                                <FormLabel
                                    text="回调地址"
                                    tooltip="授权完成后跳转到具体页面的回调地址"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .redirectUri
                                "
                                placeholder="请输入回调地址"
                            />
                        </j-form-item>
                        <!-- 非钉钉 -->
                        <j-form-item
                            v-if="form.data.provider !== 'dingtalk-ent-app'"
                            class="resetLabel"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'clientId',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入appId',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appId"
                                    required
                                    tooltip="第三方应用唯一标识"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2.clientId
                                "
                                placeholder="请输入appId"
                            />
                        </j-form-item>
                        <!-- 非微信 -->
                        <j-form-item
                            v-if="form.data.provider !== 'wechat-webapp'"
                            class="resetLabel"
                            :name="[
                                'sso',
                                'configuration',
                                'oauth2',
                                'clientSecret',
                            ]"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入appKey',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appKey"
                                    required
                                    tooltip="第三方应用唯一标识的密钥"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .clientSecret
                                "
                                placeholder="请输入appKey"
                            />
                        </j-form-item>

                        <!-- 钉钉 + 微信 -->
                        <j-form-item
                            v-if="
                                form.data.provider === 'wechat-webapp' ||
                                form.data.provider === 'dingtalk-ent-app'
                            "
                            class="resetLabel"
                            :name="['sso', 'configuration', 'appSecret']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入appSecret',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appSecret"
                                    required
                                    tooltip="应用的唯一标识的秘钥"
                                />
                            </template>
                            <j-input
                                v-model:value="
                                    form.data.sso.configuration.appSecret
                                "
                                placeholder="请输入appSecret"
                            />
                        </j-form-item>
                    </div>

                    <j-form-item class="resetLabel">
                        <template #label>
                            <FormLabel
                                text="自动创建用户"
                                required
                                tooltip="开启后，第三方用户第一次授权登录系统时，无需进入授权绑定页面。系统默认创建一个新用户与之绑定。"
                            />
                        </template>
                        <j-switch
                            v-model:checked="form.data.sso.autoCreateUser"
                        />
                    </j-form-item>
                    <div v-if="form.data.sso.autoCreateUser">
                        <j-form-item
                            label="用户名前缀"
                            :name="['sso', 'usernamePrefix']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入用户名前缀',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="form.data.sso.usernamePrefix"
                                placeholder="请输入用户名前缀"
                            />
                        </j-form-item>
                        <j-form-item
                            label="默认密码"
                            :name="['sso', 'defaultPasswd']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入默认密码',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="form.data.sso.defaultPasswd"
                                placeholder="请输入默认密码"
                            />
                        </j-form-item>

                        <j-form-item label="角色">
                            <j-select
                                v-model:value="form.data.sso.roleIdList"
                                mode="multiple"
                                :options="form.roleIdList"
                                placeholder="请选择角色"
                            ></j-select>
                            <PermissionButton
                                :hasPermission="`${rolePermission}:update`"
                                type="link"
                                @click="
                                    clickAddItem(
                                        form.data.sso.roleIdList,
                                        'Role',
                                    )
                                "
                                class="add-item"
                            >
                                <AIcon type="PlusOutlined" />
                            </PermissionButton>
                        </j-form-item>
                        <j-form-item label="组织">
                            <j-tree-select
                                v-model:value="form.data.sso.orgIdList"
                                show-search
                                style="width: 100%"
                                :dropdown-style="{
                                    maxHeight: '400px',
                                    overflow: 'auto',
                                }"
                                :fieldNames="{
                                    label: 'name',
                                    value: 'id',
                                }"
                                multiple
                                :tree-data="form.orgIdList"
                                placeholder="请选择组织"
                            >
                                <template #title="{ name }">
                                    {{ name }}
                                </template>
                            </j-tree-select>
                            <PermissionButton
                                :hasPermission="`${deptPermission}:update`"
                                type="link"
                                @click="
                                    clickAddItem(
                                        form.data.sso.orgIdList,
                                        'Role',
                                    )
                                "
                                class="add-item"
                            >
                                <AIcon type="PlusOutlined" />
                            </PermissionButton>
                        </j-form-item>
                    </div>
                </j-collapse-panel>
            </j-collapse>

            <j-form-item label="说明" name="description">
                <j-textarea
                    v-model:value="form.data.description"
                    placeholder="请输入说明"
                    showCount
                    :maxlength="200"
                    :rows="3"
                    style="width: 100%"
                />
            </j-form-item>
        </j-form>

        <j-button
            v-if="routeQuery.view !== 'true'"
            @click="clickSave"
            type="primary"
        >
            保存
        </j-button>

        <div class="dialog">
            <MenuDialog
                v-if="dialog.visible"
                v-model:visible="dialog.visible"
                :id="dialog.selectId"
                :provider="dialog.selectProvider"
                :mode="routeQuery.id ? 'edit' : 'add'"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';

import {
    getDepartmentList_api,
    addApp_api,
    updateApp_api,
    getAppInfo_api,
} from '@/api/system/apply';
import FormLabel from './FormLabel.vue';
import RequestTable from './RequestTable.vue';
import MenuDialog from '../../componenets/MenuDialog.vue';
import { getImage } from '@/utils/comm';
import type { formType, dictType, optionsType } from '../typing';
import { getRoleList_api } from '@/api/system/user';
import {
    FormInstance,
    message,
    UploadChangeParam,
    UploadFile,
} from 'ant-design-vue';
import { randomString } from '@/utils/utils';
import { cloneDeep, difference } from 'lodash';
import { useMenuStore } from '@/store/menu';

const emit = defineEmits(['changeApplyType']);
const routeQuery = useRoute().query;
const menuStory = useMenuStore();

const deptPermission = 'system/Department';
const rolePermission = 'system/Role';

// 初始化表单
const initForm: formType = {
    name: '',
    provider: 'internal-standalone',
    integrationModes: [],
    description: '',
    page: {
        // 页面集成
        baseUrl: '',
        routeType: 'hash',
        parameters: [],
    },
    apiClient: {
        // API客户端
        baseUrl: '',
        headers: [], // 请求头
        parameters: [], // 请求参数
        authConfig: {
            // API客户端
            type: 'oauth2', // 类型, 可选值：none, bearer, oauth2, basic, other
            bearer: { token: '' }, // 授权信息
            basic: { username: '', password: '' }, // 基本信息
            // token: '',
            oauth2: {
                // OAuth2信息
                authorizationUrl: '', // 授权地址
                tokenUrl: '', // token地址
                redirectUri: '', // 重定向地址
                clientId: '', // 客户端ID
                clientSecret: '', // 客户端密钥
                grantType: '', // 类型
                accessTokenProperty: '', // token属性名
                tokenRequestType: undefined, // token请求方式, 可选值：POST_URI，POST_BODY
            },
        },
    },
    apiServer: {
        // API服务
        appId: randomString(16),
        secureKey: randomString(), // 密钥
        redirectUri: '', // 重定向URL
        roleIdList: [], // 角色列表
        orgIdList: [], // 部门列表
        ipWhiteList: '', // IP白名单
        enableOAuth2: false, // 是否启用OAuth2
    },
    sso: {
        // 统一单点登陆集成
        configuration: {
            // 配置
            oauth2: {
                // Oauth2单点登录配置
                authorizationUrl: '', // 授权地址
                redirectUri: '', // 重定向地址
                clientId: '', // 客户端ID
                clientSecret: '', // 客户端密钥
                userInfoUrl: '', // 用户信息接口
                scope: '', // scope
                userProperty: {
                    // 用户属性字段信息
                    userId: '', // 用户ID
                    username: '', // 用户名
                    name: '', // 名称
                    avatar: '', // 头像
                    email: '', // 邮箱
                    telephone: '', // 电话
                    description: '', // 说明
                },
                grantType: '', // 类型
                tokenUrl: '', // token地址
                accessTokenProperty: '', // token属性名
                tokenRequestType: '', // token请求方式
            },
            appId: '', // 微信单点登录配置
            appKey: '', // 钉钉单点登录配置
            appSecret: '', // 钉钉、微信单点登录配置
        },
        autoCreateUser: false, // 是否自动创建平台用户
        usernamePrefix: '', // 用户ID前缀
        roleIdList: [], // 自动创建平台用户时角色列表
        orgIdList: [], // 自动创建平台用户时部门列表
        defaultPasswd: '', // 默认密码
    },
};
const formRef = ref<FormInstance>();
const form = reactive({
    data: { ...initForm },
    integrationModesISO: [] as string[], // 接入方式镜像  折叠面板使用
    roleIdList: [] as optionsType, // 角色列表
    orgIdList: [] as dictType, // 组织列表

    errorNumInfo: {
        page: new Set(),
        apiClient: new Set(),
        apiServer: new Set(),
        ssoClient: new Set(),
    },

    fileList: [] as any[],
    uploadLoading: false,
});

// 请求头和参数必填验证
const headerValid = ref(true);
const paramsValid = ref(true);
const headerValidator = () => {
    return new Promise((resolve, reject) => {
        headerValid.value ? resolve('') : reject('请输入完整的请求头');
    });
};
const paramsValidator = () => {
    return new Promise((resolve, reject) => {
        paramsValid.value ? resolve('') : reject('请输入完整的请求参数');
    });
};

// 接入方式的选项
const joinOptions = computed(() => {
    if (form.data.provider === 'internal-standalone')
        return [
            {
                label: '页面集成',
                value: 'page',
            },
            {
                label: 'API客户端',
                value: 'apiClient',
            },
            {
                label: 'API服务',
                value: 'apiServer',
            },
            {
                label: '单点登录',
                value: 'ssoClient',
            },
        ];
    else if (form.data.provider === 'internal-integrated')
        return [
            {
                label: '页面集成',
                value: 'page',
            },
            {
                label: 'API客户端',
                value: 'apiClient',
            },
        ];
    else if (form.data.provider === 'wechat-webapp')
        return [
            {
                label: '单点登录',
                value: 'ssoClient',
            },
        ];
    else if (form.data.provider === 'dingtalk-ent-app')
        return [
            {
                label: '单点登录',
                value: 'ssoClient',
            },
        ];
    else if (form.data.provider === 'third-party')
        return [
            {
                label: '页面集成',
                value: 'page',
            },
            {
                label: 'API客户端',
                value: 'apiClient',
            },
            {
                label: 'API服务',
                value: 'apiServer',
            },
            {
                label: '单点登录',
                value: 'ssoClient',
            },
        ];
});

const dialog = reactive({
    visible: false,
    selectId: '',
    selectProvider: '' as any,
});

init();

function init() {
    getRoleIdList();
    getOrgIdList();

    if (routeQuery.id) getInfo(routeQuery.id as string);

    watch(
        () => form.data.provider,
        (n) => {
            emit('changeApplyType', n);
            if (routeQuery.id) return;
            if (n === 'wechat-webapp' || n === 'dingtalk-ent-app') {
                form.data.integrationModes = ['ssoClient'];
                form.integrationModesISO = ['ssoClient'];
            } else form.data.integrationModes = [];
        },
        { immediate: true },
    );
    watch(
        () => form.data.integrationModes,
        (n, o) => {
            o.forEach((key) => {
                if (!n.includes(key)) form.errorNumInfo[key].clear();
            });

            form.integrationModesISO = [...n];
        },
    );
}

function getInfo(id: string) {
    getAppInfo_api(id).then((resp: any) => {
        // 后端返回的headers和parameters中, key转为label
        resp.result.apiClient.headers = resp.result.apiClient.headers.map(
            (m: any) => ({
                ...m,
                label: m.key,
            }),
        );
        resp.result.apiClient.parameters = resp.result.apiClient.parameters.map(
            (m: any) => ({
                ...m,
                label: m.key,
            }),
        );
        form.data = {
            ...resp.result,
            integrationModes: resp.result.integrationModes.map(
                (item: any) => item.value,
            ),
        } as formType;
        form.data.apiServer && (form.data.apiServer.appId = id);
    });
}
// 获取角色列表
function getRoleIdList() {
    getRoleList_api().then((resp) => {
        if (resp.status === 200) {
            const result = resp.result as dictType;
            form.roleIdList = result.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
    });
}
// 获取组织列表
function getOrgIdList() {
    getDepartmentList_api().then((resp) => {
        if (resp.status === 200) {
            form.orgIdList = resp.result as dictType;
        }
    });
}
// 添加角色/组织
function clickAddItem(data: string[], target: string) {
    const tab: any = window.open(`${origin}/#/system/${target}?save=true`);
    tab.onSaveSuccess = (value: string) => {
        data.push(value);
        if (target === 'Role') getRoleIdList();
        else getOrgIdList();
    };
}
// 保存
function clickSave() {
    console.log('headers: ', form.data.apiClient.headers);
    formRef.value?.validate().then(() => {
        const params = cloneDeep(form.data);
        // 删除多余的参数
        const list = ['page', 'apiClient', 'apiServer', 'ssoClient'];
        difference(list, params.integrationModes).forEach((item) => {
            if (item === 'ssoClient') {
                // @ts-ignore
                delete params['sso'];
            }
            delete params[item];
        });
        clearNullProp(params);
        if (
            params.provider === 'internal-standalone' &&
            params.integrationModes.includes('page')
        ) {
            // @ts-ignore
            delete params.page.parameters;
        }

        if (
            params.provider === 'internal-standalone' &&
            params.integrationModes.includes('ssoClient') &&
            params.integrationModes.length === 1
        )
            return message.warning('配置单点登录需同时配置api配置');

        //独立应用-api客户端 id?clientId:appId
        if (params.provider === 'internal-standalone') {
            if (params.integrationModes.includes('apiClient')) {
                params.id = params.apiClient.authConfig.oauth2.clientId;
            }
            if (
                params.integrationModes.includes('apiServer') &&
                !params.integrationModes.includes('apiClient')
            ) {
                params.id = params.apiServer.appId;
            }
        }

        // headers和params参数label需改为key传给后端
        if (params.integrationModes.includes('apiClient')) {
            params.apiClient.headers = params.apiClient.headers.map(
                (m: any) => ({
                    ...m,
                    key: m.label,
                }),
            );
            params.apiClient.parameters = params.apiClient.parameters.map(
                (m: any) => ({
                    ...m,
                    key: m.label,
                }),
            );
        }

        const request = routeQuery.id
            ? updateApp_api(routeQuery.id as string, params)
            : addApp_api(params);
        request.then((resp: any) => {
            if (resp.status === 200) {
                const isPage = params.integrationModes.includes('page');
                if (isPage) {
                    form.data = params;
                    dialog.selectId = routeQuery.id || resp.result.id;
                    dialog.selectProvider = form.data.provider;
                    dialog.visible = true;
                } else {
                    message.success('保存成功');
                    menuStory.jumpPage('system/Apply');
                }
            }
        });
    });
}
function getErrorNum(
    name: string | number | string[] | number[],
    status: boolean,
) {
    if (typeof name !== 'object') return;
    const props = ['page', 'apiClient', 'apiServer', 'ssoClient'];
    const prop = name[0] === 'sso' ? 'ssoClient' : name[0];
    if (props.includes(prop + '')) {
        const key = name.slice(1).join();
        const set = form.errorNumInfo[prop] as Set<string>;
        // 如果此项校验成功且在失败列表中，则从此列表中移除，反之则加上
        if (status) {
            if (set.has(key)) set.delete(key);
        } else if (!set.has(key)) set.add(key);
    }
}

const imageTypes = ref(['image/jpg', 'image/png']);
const beforeLogoUpload = (file: any) => {
    const isType: any = imageTypes.value.includes(file.type);
    if (!isType) {
        message.error(`请上传.jpg.png格式的图片`);
        return false;
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        message.error(`图片大小必须小于${4}M`);
    }
    return isType && isSize;
};
function changeBackUpload(info: UploadChangeParam<UploadFile<any>>) {
    if (info.file.status === 'uploading') {
        form.uploadLoading = true;
    } else if (info.file.status === 'done') {
        info.file.url = info.file.response?.result;
        form.uploadLoading = false;
        form.data.sso.configuration.oauth2.logoUrl = info.file.response?.result;
    } else if (info.file.status === 'error') {
        console.log(info.file);
        form.uploadLoading = false;
        message.error('logo上传失败，请稍后再试');
    }
}
function clearNullProp(obj: object) {
    if (typeof obj !== 'object') return;
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            const val = obj[prop];
            if (val === '') delete obj[prop];
            else if (typeof val === 'object') clearNullProp(obj[prop]);
        }
    }
}
</script>

<style lang="less" scoped>
.edit-form-container {
    .form {
        .ant-form-item {
            &.resetLabel {
                :deep(.ant-form-item-required) {
                    &::before {
                        display: none;
                    }
                }
            }

            :deep(.ant-form-item-control) {
                .ant-form-item-control-input-content {
                    display: flex;
                    .ant-upload-select-picture-card {
                        width: auto;
                        height: auto;
                        max-width: 150px;
                        max-height: 150px;

                        > .ant-upload {
                            height: 150px;
                        }
                    }
                }
            }
        }
        .radio-container {
            .ant-radio-button-wrapper {
                height: 120px;
                width: 120px;
                padding: 0 15px;
                box-sizing: content-box;
                margin-right: 20px;
                color: #000;

                &.ant-radio-button-wrapper-disabled {
                    opacity: 0.5;
                }

                &.ant-radio-button-wrapper-checked {
                    background-color: #fff;
                    border: 1px solid #1d39c4;
                    opacity: 1;
                }

                > :last-child {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    > div {
                        width: 100%;
                        text-align: center;
                    }
                    :deep(.ant-image) {
                        width: 64px;
                        height: 64px;
                    }
                    p {
                        margin: 0;
                    }
                }
            }
        }
        :deep(.ant-collapse-header) {
            > span {
                position: relative;
                .error-info {
                    position: absolute;
                    text-align: center;
                    line-height: 14px;
                    min-width: 14px;
                    min-height: 14px;
                    right: -15px;
                    top: -5px;
                    font-size: 8px;
                    background-color: #ff4d4f;
                    color: #fff;
                    border-radius: 7px;
                }
            }
        }
    }
}
</style>
