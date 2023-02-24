<template>
    <div class="edit-form-container">
        <a-form ref="formRef" :model="form.data" layout="vertical" class="form">
            <a-form-item
                label="名称"
                name="name"
                :rules="[
                    {
                        required: true,
                        message: '请输入名称',
                    },
                ]"
            >
                <a-input
                    v-model:value="form.data.name"
                    placeholder="请输入名称"
                />
            </a-form-item>
            <a-form-item
                label="应用"
                name="provider"
                :rules="[
                    {
                        required: true,
                        message: '请选择应用',
                    },
                ]"
            >
                <a-radio-group
                    v-model:value="form.data.provider"
                    class="radio-container"
                    @change="form.data.integrationModes = []"
                >
                    <a-radio-button value="internal-standalone">
                        <div>
                            <a-image
                                :preview="false"
                                :src="getImage('/apply/provider1.png')"
                                width="64px"
                                height="64px"
                            />
                            <p>内部独立应用</p>
                        </div>
                    </a-radio-button>
                    <a-radio-button value="internal-integrated">
                        <div>
                            <a-image
                                :preview="false"
                                :src="getImage('/apply/provider2.png')"
                            />
                            <p>内部集成应用</p>
                        </div>
                    </a-radio-button>
                    <a-radio-button value="wechat-webapp">
                        <div>
                            <a-image
                                :preview="false"
                                :src="getImage('/apply/provider3.png')"
                            />
                            <p>微信网站应用</p>
                        </div>
                    </a-radio-button>
                    <a-radio-button value="dingtalk-ent-app">
                        <div>
                            <a-image
                                :preview="false"
                                :src="getImage('/apply/provider4.png')"
                            />
                            <p>钉钉企业内部应用</p>
                        </div>
                    </a-radio-button>
                    <a-radio-button value="third-party">
                        <div>
                            <a-image
                                :preview="false"
                                :src="getImage('/apply/provider5.png')"
                            />
                            <p>第三方应用</p>
                        </div>
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item
                label="接入方式"
                name="integrationModes"
                :rules="[
                    {
                        required: true,
                        message: '请选择接入方式',
                    },
                ]"
            >
                <a-checkbox-group
                    v-model:value="form.data.integrationModes"
                    :options="joinOptions"
                />
            </a-form-item>

            <a-collapse v-model:activeKey="form.integrationModesISO">
                <!-- 页面集成 -->
                <a-collapse-panel
                    key="page"
                    v-if="form.data.integrationModes.includes('page')"
                    header="页面集成"
                >
                    <a-form-item
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
                        <a-input
                            v-model:value="form.data.page.baseUrl"
                            placeholder="请输入接入地址"
                        />
                    </a-form-item>
                    <a-form-item
                        label="路由方式"
                        :name="['page', 'routeType']"
                        :rules="[
                            {
                                required: true,
                                message: '请选择路由方式',
                            },
                        ]"
                    >
                        <a-select v-model:value="form.data.page.routeType">
                            <a-select-option value="hash">hash</a-select-option>
                            <a-select-option value="history"
                                >history</a-select-option
                            >
                        </a-select>
                    </a-form-item>

                    <a-form-item v-if="form.data.provider === 'third-party'">
                        <template #label>
                            <FormLabel
                                text="参数"
                                tooltip="自定义参数,格式${name}"
                            />
                        </template>

                        <RequestTable
                            v-model:value="form.data.page.parameters"
                        />
                    </a-form-item>
                </a-collapse-panel>
                <!-- API客户端 -->
                <a-collapse-panel
                    key="apiClient"
                    v-if="form.data.integrationModes.includes('apiClient')"
                    header="API客户端"
                >
                    <a-form-item
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
                        <a-input
                            v-model:value="form.data.apiClient.baseUrl"
                            placeholder="请输入接口地址"
                        />
                    </a-form-item>
                    <div v-if="form.data.provider === 'internal-standalone'">
                        <a-form-item
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
                            <a-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .authorizationUrl
                                "
                                placeholder="请输入授权地址"
                            />
                        </a-form-item>
                        <a-form-item
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
                            <a-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .tokenUrl
                                "
                                placeholder="请输入token地址"
                            />
                        </a-form-item>
                        <a-form-item>
                            <template #label>
                                <FormLabel
                                    text="回调地址"
                                    tooltip="授权完成后跳转到具体页面的回调地址"
                                />
                            </template>
                            <a-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .redirectUri
                                "
                                placeholder="请输入回调地址"
                            />
                        </a-form-item>
                        <a-form-item
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
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appId"
                                    required
                                    tooltip="第三方应用唯一标识"
                                />
                            </template>
                            <a-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .clientId
                                "
                                placeholder="请输入appId"
                            />
                        </a-form-item>
                        <a-form-item
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
                            ]"
                        >
                            <template #label>
                                <FormLabel
                                    text="appKey"
                                    required
                                    tooltip="第三方应用唯一标识的密钥"
                                />
                            </template>
                            <a-input
                                v-model:value="
                                    form.data.apiClient.authConfig.oauth2
                                        .clientSecret
                                "
                                placeholder="请输入appKey"
                            />
                        </a-form-item>
                    </div>
                    <div v-else-if="form.data.provider === 'third-party'">
                        <a-form-item
                            label="认证方式"
                            :name="['apiClient', 'authConfig', 'type']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请选择认证方式',
                                },
                            ]"
                        >
                            <a-select
                                v-model:value="
                                    form.data.apiClient.authConfig.type
                                "
                            >
                                <a-select-option value="oauth2">
                                    OAuth2
                                </a-select-option>
                                <a-select-option value="basic">
                                    基本认证
                                </a-select-option>
                                <a-select-option value="bearer">
                                    bearer认证
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <div
                            v-if="
                                form.data.apiClient.authConfig.type === 'oauth2'
                            "
                        >
                            <a-form-item
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
                                <a-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .authorizationUrl
                                    "
                                    placeholder="请输入授权地址"
                                />
                            </a-form-item>

                            <a-form-item
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
                                        message: '请选择认证方式',
                                    },
                                ]"
                            >
                                <a-select
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .tokenRequestType
                                    "
                                >
                                    <a-select-option value="POST_BODY">
                                        请求体
                                    </a-select-option>
                                    <a-select-option value="POST_URI">
                                        请求头
                                    </a-select-option>
                                </a-select>
                            </a-form-item>

                            <a-form-item
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
                                ]"
                            >
                                <template #label>
                                    <FormLabel
                                        text="client_id"
                                        required
                                        tooltip="应用唯一标识"
                                    />
                                </template>
                                <a-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .clientId
                                    "
                                    placeholder="请输入client_id"
                                />
                            </a-form-item>
                            <a-form-item
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
                                ]"
                            >
                                <template #label>
                                    <FormLabel
                                        text="client_secret"
                                        required
                                        tooltip="应用唯一标识的秘钥"
                                    />
                                </template>
                                <a-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .clientSecret
                                    "
                                    placeholder="请输入client_secret"
                                />
                            </a-form-item>
                        </div>
                        <div
                            v-else-if="
                                form.data.apiClient.authConfig.type === 'basic'
                            "
                        >
                            <a-form-item
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
                                        message: '请输入用户名',
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.basic
                                            .username
                                    "
                                    placeholder="请输入用户名"
                                />
                            </a-form-item>
                            <a-form-item
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
                                        message: '请输入密码',
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.basic
                                            .password
                                    "
                                    placeholder="请输入密码"
                                />
                            </a-form-item>
                        </div>
                        <div
                            v-else-if="
                                form.data.apiClient.authConfig.type === 'bearer'
                            "
                        >
                            <a-form-item
                                label="token"
                                :name="[
                                    'apiClient',
                                    'authConfig',
                                    'oauth2',
                                    'tokenUrl',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入token',
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .tokenUrl
                                    "
                                    placeholder="请输入token"
                                />
                            </a-form-item>
                        </div>
                    </div>

                    <div
                        v-if="
                            form.data.provider === 'internal-standalone' ||
                            form.data.provider === 'third-party'
                        "
                    >
                        <a-form-item>
                            <template #label>
                                <FormLabel
                                    text="请求头"
                                    tooltip="根据不同应用的调用规范，自定义请求头内容"
                                />
                            </template>

                            <RequestTable
                                v-model:value="form.data.apiClient.headers"
                            />
                        </a-form-item>
                        <a-form-item label="参数">
                            <RequestTable
                                v-model:value="form.data.apiClient.parameters"
                            />
                        </a-form-item>
                    </div>
                </a-collapse-panel>
                <!-- API服务 -->
                <a-collapse-panel
                    key="apiServer"
                    v-if="form.data.integrationModes.includes('apiServer')"
                    header="API服务"
                >
                    <a-form-item
                        class="resetLabel"
                        v-if="!form.data.integrationModes.includes('apiClient')"
                        :name="['apiServer', 'appId']"
                        :rules="[
                            {
                                required: true,
                                message: '请输入appId',
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
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2.clientId
                            "
                            disabled
                            placeholder="请输入appId"
                        />
                    </a-form-item>

                    <a-form-item
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
                        <a-input
                            v-model:value="form.data.apiServer.secureKey"
                            placeholder="请输入secureKey"
                        />
                    </a-form-item>
                    <a-form-item
                        class="resetLabel"
                        v-if="form.data.provider === 'internal-standalone'"
                    >
                        <template #label>
                            <FormLabel
                                text="回调地址"
                                tooltip="授权完成后跳转到具体页面的回调地址"
                            />
                        </template>
                        <a-input
                            v-model:value="form.data.apiServer.redirectUri"
                            placeholder="请输入redirectUri"
                        />
                    </a-form-item>
                    <a-form-item
                        class="resetLabel"
                        :name="['apiServer', 'roleIdList']"
                        :rules="[
                            {
                                required: true,
                                message: '请选中角色',
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
                        <a-select
                            v-model:value="form.data.apiServer.roleIdList"
                            :options="form.roleIdList"
                            placeholder="请选中角色"
                        ></a-select>
                        <PermissionButton
                            :uhasPermission="`${rolePermission}:update`"
                            type="link"
                            @click="clickAddItem('roleIdList', 'Role')"
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            <FormLabel
                                text="组织"
                                tooltip="为应用用户分配所属组织，根据绑定的组织，进行数据隔离"
                            />
                        </template>
                        <a-tree-select
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
                        </a-tree-select>
                        <PermissionButton
                            :uhasPermission="`${deptPermission}:update`"
                            type="link"
                            @click="clickAddItem('roleIdList', 'Role')"
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </a-form-item>

                    <div v-if="form.data.provider === 'third-party'">
                        <a-form-item>
                            <template #label>
                                <FormLabel
                                    text="redirectUrl"
                                    tooltip="授权后自动跳转的页面地址"
                                />
                            </template>
                            <a-input v-model:value="form.data.apiServer.redirectUri" placeholder="请输入redirectUrl" />
                        </a-form-item>
                        <a-form-item label="IP白名单">
                            <a-textarea
                                v-model:value="form.data.apiServer.ipWhiteList"
                                placeholder="请输入IP白名单，多个地址回车分隔，不填默认均可访问"
                                :rows="3"
                                style="width: 100%"
                            />
                        </a-form-item>
                    </div>
                </a-collapse-panel>
                <!-- 单点登录 -->
                <a-collapse-panel
                    key="ssoClient"
                    v-if="form.data.integrationModes.includes('ssoClient')"
                    header="单点登录"
                >
                    <a-form-item
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
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2
                                    .authorizationUrl
                            "
                            placeholder="请输入授权地址"
                        />
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            <FormLabel
                                text="回调地址"
                                tooltip="授权完成后跳转到具体页面的回调地址"
                            />
                        </template>
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2
                                    .redirectUri
                            "
                            placeholder="请输入回调地址"
                        />
                    </a-form-item>
                    <a-form-item
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
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="appId"
                                required
                                tooltip="第三方应用唯一标识"
                            />
                        </template>
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2.clientId
                            "
                            disabled
                            placeholder="请输入appId"
                        />
                    </a-form-item>
                    <a-form-item
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
                        ]"
                    >
                        <template #label>
                            <FormLabel
                                text="appKey"
                                required
                                tooltip="第三方应用唯一标识的密钥"
                            />
                        </template>
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2
                                    .clientSecret
                            "
                            placeholder="请输入appKey"
                        />
                    </a-form-item>

                    <a-form-item class="resetLabel">
                        <template #label>
                            <FormLabel
                                text="自动创建用户"
                                required
                                tooltip="开启后，第三方用户第一次授权登录系统时，无需进入授权绑定页面。系统默认创建一个新用户与之绑定。"
                            />
                        </template>
                        <a-switch
                            v-model:checked="
                                form.data.apiClient.authConfig.oauth2
                                    .clientSecret
                            "
                        />
                    </a-form-item>
                    <a-form-item
                        label="用户名前缀"
                        :name="[
                            'apiClient',
                            'authConfig',
                            'oauth2',
                            'clientSecret',
                        ]"
                        :rules="[
                            {
                                required: true,
                                message: '请输入用户名前缀',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2
                                    .clientSecret
                            "
                            placeholder="请输入用户名前缀"
                        />
                    </a-form-item>
                    <a-form-item
                        label="默认密码"
                        :name="[
                            'apiClient',
                            'authConfig',
                            'oauth2',
                            'clientSecret',
                        ]"
                        :rules="[
                            {
                                required: true,
                                message: '请输入默认密码',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="
                                form.data.apiClient.authConfig.oauth2
                                    .clientSecret
                            "
                            placeholder="请输入默认密码"
                        />
                    </a-form-item>

                    <a-form-item label="角色">
                        <a-select
                            v-model:value="form.data.apiServer.roleIdList"
                            :options="form.roleIdList"
                            placeholder="请选中角色"
                        ></a-select>
                        <PermissionButton
                            :uhasPermission="`${rolePermission}:update`"
                            type="link"
                            @click="clickAddItem('roleIdList', 'Role')"
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </a-form-item>
                    <a-form-item label="组织">
                        <a-tree-select
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
                        </a-tree-select>
                        <PermissionButton
                            :uhasPermission="`${deptPermission}:update`"
                            type="link"
                            @click="clickAddItem('roleIdList', 'Role')"
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </a-form-item>
                </a-collapse-panel>
            </a-collapse>

            <a-form-item label="说明" name="description">
                <a-textarea
                    v-model:value="form.data.description"
                    placeholder="请输入说明"
                    showCount
                    :maxlength="200"
                    :rows="3"
                    style="width: 100%"
                />
            </a-form-item>
        </a-form>

        <a-button v-if="!routeQuery.view" @click="clickSave">
            {{ routeQuery.view }}保存
        </a-button>
    </div>
</template>

<script setup lang="ts">
import { getDepartmentList_api } from '@/api/system/apply';
import FormLabel from './FormLabel.vue';
import RequestTable from './RequestTable.vue';
import { getImage } from '@/utils/comm';
import type { formType, dictType, optionsType } from '../typing';
import { getRoleList_api } from '@/api/system/user';
import { FormInstance } from 'ant-design-vue';

const emit = defineEmits(['changeApplyType']);
const routeQuery = useRoute().query;

const deptPermission = 'system/Department';
const rolePermission = 'system/Role';

const initForm: formType = {
    name: '',
    provider: 'internal-standalone',
    integrationModes: [],
    config: '',
    description: '',
    page: {
        // 页面集成
        baseUrl: '',
        routeType: 'hash',
        parameters: [{ label: '', value: '' }],
    },
    apiClient: {
        // API客户端
        baseUrl: '',
        headers: [{ label: '', value: '' }], // 请求头
        parameters: [{ label: '', value: '' }], // 请求参数
        authConfig: {
            // API客户端
            type: 'oauth2', // 类型, 可选值：none, bearer, oauth2, basic, other
            bearer: { token: '' }, // 授权信息
            basic: { username: '', password: '' }, // 基本信息
            oauth2: {
                // OAuth2信息
                authorizationUrl: '', // 授权地址
                tokenUrl: '', // token地址
                redirectUri: '', // 重定向地址
                clientId: '', // 客户端ID
                clientSecret: '', // 客户端密钥
                grantType: '', // 类型
                accessTokenProperty: '', // token属性名
                tokenRequestType: '', // token请求方式, 可选值：POST_URI，POST_BODY
            },
        },
    },
    apiServer: {
        // API服务
        appId: '',
        secureKey: '', // 密钥
        redirectUri: '', // 重定向URL
        roleIdList: [], // 角色列表
        orgIdList: [], // 部门列表
        ipWhiteList: '', // IP白名单
        signature: '', // 签名方式, 可选值：MD5，SHA256
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
    integrationModesISO: [] as string[],
    roleIdList: [] as optionsType,
    orgIdList: [] as dictType,
});
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

init();

function init() {
    getRoleIdList();
    getOrgIdList();

    watch(
        () => form.data.provider,
        (n) => {
            emit('changeApplyType', n);
        },
        { immediate: true },
    );
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
function clickAddItem(prop: 'roleIdList' | 'orgIdList', target: string) {
    const tab: any = window.open(`${origin}/#/system/${target}?save=true`);
    tab.onSaveSuccess = (value: string) => {
        form.data.apiServer[prop] = [
            ...(form.data.apiServer[prop] || []),
            value,
        ];
        if (prop === 'roleIdList') getRoleIdList();
        else getOrgIdList();
    };
}
// 保存
function clickSave() {
    formRef.value?.validate().then((resp) => {
        console.log('save');
    });
}

function test(...args: any[]) {
    console.log('test:', args);
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
    }
}
</style>
