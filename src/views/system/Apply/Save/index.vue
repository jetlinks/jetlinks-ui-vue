<template>
    <page-container>
        <a-card class="save-container">
            <a-row :gutter="24">
                <a-col :span="14">
                    <a-form
                        ref="formRef"
                        :model="form.data"
                        layout="vertical"
                        class="form"
                    >
                        <a-form-item label="名称" name="name">
                            <a-input
                                v-model:value="form.data.name"
                                placeholder="请输入名称"
                            />
                        </a-form-item>
                        <a-form-item label="应用" name="provider">
                            <a-radio-group
                                v-model:value="form.data.provider"
                                class="radio-container"
                                @change="form.data.integrationModes = []"
                            >
                                <a-radio-button value="internal-standalone">
                                    <div>
                                        <a-image
                                            :preview="false"
                                            :src="
                                                getImage('/apply/provider1.png')
                                            "
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
                                            :src="
                                                getImage('/apply/provider2.png')
                                            "
                                        />
                                        <p>内部集成应用</p>
                                    </div>
                                </a-radio-button>
                                <a-radio-button value="wechat-webapp">
                                    <div>
                                        <a-image
                                            :preview="false"
                                            :src="
                                                getImage('/apply/provider3.png')
                                            "
                                        />
                                        <p>微信网站应用</p>
                                    </div>
                                </a-radio-button>
                                <a-radio-button value="dingtalk-ent-app">
                                    <div>
                                        <a-image
                                            :preview="false"
                                            :src="
                                                getImage('/apply/provider4.png')
                                            "
                                        />
                                        <p>钉钉企业内部应用</p>
                                    </div>
                                </a-radio-button>
                                <a-radio-button value="third-party">
                                    <div>
                                        <a-image
                                            :preview="false"
                                            :src="
                                                getImage('/apply/provider5.png')
                                            "
                                        />
                                        <p>第三方应用</p>
                                    </div>
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="接入方式" name="integrationModes">
                            <a-checkbox-group
                                v-model:value="form.data.integrationModes"
                                :options="joinOptions"
                            />
                        </a-form-item>
                        <a-collapse
                            v-model:activeKey="form.integrationModesISO"
                        >
                            <a-collapse-panel
                                key="page"
                                v-show="
                                    form.data.integrationModes.includes('page')
                                "
                                header="页面集成"
                            >
                                <a-form-item
                                    :name="['page', 'baseUrl']"
                                    class="resetLabel"
                                    :rules="[
                                        {
                                            required: true,
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
                                        },
                                    ]"
                                >
                                    <a-select
                                        v-model:value="form.data.page.routeType"
                                        style="width: 120px"
                                    >
                                        <a-select-option value="hash"
                                            >hash</a-select-option
                                        >
                                        <a-select-option value="history"
                                            >history</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-collapse-panel>
                            <a-collapse-panel
                                key="apiClient"
                                v-show="
                                    form.data.integrationModes.includes(
                                        'apiClient',
                                    )
                                "
                                header="API客户端"
                            >
                                <a-form-item
                                    class="resetLabel"
                                    :name="['apiClient', 'baseUrl']"
                                    :rules="[
                                        {
                                            required: true,
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
                                        v-model:value="
                                            form.data.apiClient.baseUrl
                                        "
                                        placeholder="请输入接入地址"
                                    />
                                </a-form-item>
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
                                            form.data.apiClient.authConfig
                                                .oauth2.authorizationUrl
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
                                            form.data.apiClient.authConfig
                                                .oauth2.tokenUrl
                                        "
                                        placeholder="请输入token地址"
                                    />
                                </a-form-item>
                                <a-form-item
                                    label="回调地址"
                                    :name="[
                                        'apiClient',
                                        'authConfig',
                                        'oauth2',
                                        'redirectUri',
                                    ]"
                                >
                                    <template #label>
                                        <FormLabel
                                            text="回调地址"
                                            tooltip="授权完成后跳转到具体页面的回调地址"
                                        />
                                    </template>
                                    <a-input
                                        v-model:value="
                                            form.data.apiClient.authConfig
                                                .oauth2.redirectUri
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
                                            form.data.apiClient.authConfig
                                                .oauth2.clientId
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
                                            form.data.apiClient.authConfig
                                                .oauth2.clientSecret
                                        "
                                        placeholder="请输入appKey"
                                    />
                                </a-form-item>

                                <a-form-item label="请求头"> </a-form-item>
                                <a-form-item label="参数"> </a-form-item>
                            </a-collapse-panel>
                            <a-collapse-panel
                                key="apiServer"
                                v-show="
                                    form.data.integrationModes.includes(
                                        'apiServer',
                                    )
                                "
                                header="API服务"
                            >
                            </a-collapse-panel>
                            <a-collapse-panel
                                key="ssoClient"
                                v-show="
                                    form.data.integrationModes.includes(
                                        'ssoClient',
                                    )
                                "
                                header="单点登录"
                            >
                            </a-collapse-panel>
                        </a-collapse>
                        <a-form-item label="说明" name="description">
                            <a-textarea
                                v-model:value="form.data.description"
                                placeholder="请输入说明"
                                showCount
                                :maxlength="200"
                                :rows="5"
                            />
                        </a-form-item>
                    </a-form>
                    <a-button v-if="!routeQuery.view">保存</a-button>
                </a-col>
                <a-col :span="10"><Does :type="form.data.provider" /></a-col>
            </a-row>
        </a-card>
    </page-container>
</template>

<script setup lang="ts">
import Does from './components/Does.vue';
import FormLabel from './components/FormLabel.vue';
import { getImage } from '@/utils/comm';
import type { applyType, formType } from './typing';
const routeQuery = useRoute().query;

const initForm: formType = {
    name: '',
    provider: 'internal-standalone',
    integrationModes: [],
    config: '',
    description: '',
    page: {
        baseUrl: '',
        routeType: 'hash',
    },
    apiClient: {
        baseUrl: '',
        authConfig: {
            type: '',
            oauth2: {
                authorizationUrl: '',
                tokenUrl: '',
                redirectUri: '',
                clientId: '',
                clientSecret: '',
            },
        },
    },
};
const form = reactive({
    data: { ...initForm },
    integrationModesISO: [] as string[],
});
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
</script>

<style lang="less" scoped>
.save-container {
    .form {
        .ant-form-item {
            &.resetLabel {
                :deep(.ant-form-item-required) {
                    &::before {
                        display: none;
                    }
                }
            }

            .ant-select {
                width: 100% !important;
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
