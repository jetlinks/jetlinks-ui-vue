<template>
  <div class="edit-form-container">
    <a-form
        ref="formRef"
        :model="form.data"
        layout="vertical"
        class="form"
        @validate="getErrorNum"
    >
      <a-form-item
          :label="$t('components.EditForm.949962-0')"
          name="name"
          :rules="[
                    {
                        required: true,
                        message: $t('components.EditForm.949962-1'),
                    },
                    {
                        max: 64,
                        message: $t('components.EditForm.949962-2'),
                    },
                ]"
      >
        <a-input
            v-model:value="form.data.name"
            :placeholder="$t('components.EditForm.949962-1')"
        />
      </a-form-item>
      <a-form-item :label="$t('components.EditForm.949962-3')">
        <ApplyList
            :options="[{ label: '第三方应用', value: 'third-party' }]"
            v-model:photoUrl="form.data.logoUrl"
            v-model:value="form.data.provider"
            :disabled="true"
        />
      </a-form-item>
      <a-row>
        <a-col :span="joinOptions.length >= 3 ? 24 : 6 * joinOptions.length">
          <a-form-item
              :label="$t('components.EditForm.949962-5')"
              name="integrationMode"
              :rules="[
                            {
                                required: true,
                                message: $t('components.EditForm.949962-6'),
                            },
                        ]"
          >
            <j-check-button
                v-model:value="form.data.integrationMode"
                :options="joinOptions"
                :multiple="false"
                @change="onIntegrationModeChange"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-collapse v-if="form.data.integrationMode" style="margin-bottom: 20px;">
        <a-collapse-panel
            :key="form.data.integrationMode"
            :forceRender="true"
        >
          <template #header>
                        <span>
                            {{
                            joinOptions.find((it) => it.value === form.data.integrationMode)
                                ?.label
                          }}
                            <span
                                v-show="form.errorNumInfo[form.data.integrationMode]?.size"
                                class="error-info"
                                :style="
                                    form.errorNumInfo.ssoClient.size > 9 &&
                                    form.errorNumInfo?.ssoClient?.size
                                        ? { padding: '0 8px' }
                                        : {}
                                "
                            >
                                {{ form.errorNumInfo[form.data.integrationMode]?.size }}
                            </span>
                        </span>
          </template>
          <!-- API服务 -->
          <template v-if="form.data.integrationMode === 'apiServer'">
            <a-form-item
                class="resetLabel"
                :name="['apiServer', 'appId']"
                :rules="[{ required: true }]"
            >
              <template #label>
                <FormLabel
                    text="appId"
                    required
                    :tooltip="$t('components.EditForm.949962-27')"
                />
              </template>
              <a-input
                  v-model:value="form.data.apiServer.appId"
                  disabled
                  :placeholder="$t('components.EditForm.949962-26')"
              />
            </a-form-item>

            <a-form-item
                class="resetLabel"
                :name="['apiServer', 'secureKey']"
                :rules="[
                                {
                                    required: true,
                                    message: $t('components.EditForm.949962-49'),
                                },
                            ]"
            >
              <template #label>
                <FormLabel
                    text="secureKey"
                    required
                    :tooltip="$t('components.EditForm.949962-50')"
                />
              </template>
              <a-input-password
                  v-model:value="form.data.apiServer.secureKey"
                  :placeholder="$t('components.EditForm.949962-49')"
              />
            </a-form-item>
            <a-form-item
                class="resetLabel"
            >
              <template #label>
                <FormLabel
                    :text="$t('components.EditForm.949962-23')"
                    :tooltip="$t('components.EditForm.949962-24')"
                />
              </template>
              <a-input
                  v-model:value="form.data.apiServer.redirectUri"
                  :placeholder="$t('components.EditForm.949962-51')"
              />
            </a-form-item>
            <a-form-item 
                :label="'角色'"
                :name="['apiServer', 'roleIdList']"
                :rules="[
                    {
                        required: true,
                        message: '请选择角色',
                    },
                    {
                        validator: validateRoleOrOrg(),
                        trigger: 'change',
                    },
                ]"
            >
              <a-select
                  v-model:value="form.data.apiServer.roleIdList"
                  mode="multiple"
                  :options="form.roleIdList"
                  :placeholder="'请选择角色'"
                  :filter-option="filterOption"
              ></a-select>
              <j-permission-button
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
                <AIcon type="PlusOutlined"/>
              </j-permission-button>
            </a-form-item>

            <a-form-item
                :name="['apiServer', 'orgIdList']"
                :rules="[
                    {
                        required: true,
                        message: '请选择组织',
                    },
                    {
                        validator: validateRoleOrOrg('请选择组织'),
                        trigger: 'change',
                    },
                ]"
            >
              <template #label>
                <FormLabel
                    :text="$t('components.EditForm.949962-55')"
                    :tooltip="$t('components.EditForm.949962-56')"
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
                  :placeholder="$t('components.EditForm.949962-57')"
                  :filterTreeNode="
                                (v: string, node: any) => filterSelectNode(v, node, 'name')
                            "
              >
                <template #title="{ name }">
                  {{ name }}
                </template>
              </a-tree-select>
              <j-permission-button
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
                <AIcon type="PlusOutlined"/>
              </j-permission-button>
              <a-button
                  type="link"
                  @click="getOrgIdList"
                  :title="'刷新组织列表'"
              >
                <AIcon type="ReloadOutlined"/>
              </a-button>
            </a-form-item>

            <a-form-item>
              <template #label>
                <FormLabel
                    text="redirectUrl"
                    :tooltip="$t('components.EditForm.949962-58')"
                />
              </template>
              <a-input
                  v-model:value="
                                        form.data.apiServer.redirectUri
                                    "
                  :placeholder="$t('components.EditForm.949962-59')"
              />
            </a-form-item>
            <a-form-item
                :label="$t('components.EditForm.949962-60')"
                :name="['apiServer', 'ipWhiteList']"
                :rules="[
                                    {
                                        validator: validateIP,
                                    },
                                ]"
            >
              <a-textarea
                  v-model:value="
                                        form.data.apiServer.ipWhiteList
                                    "
                  :placeholder="$t('components.EditForm.949962-61')"
                  :rows="3"
                  style="width: 100%"
              />
            </a-form-item>
          </template>
          <!-- 单点登录 -->
          <template v-if="form.data.integrationMode === 'ssoClient'">
            <!-- 第三方应用 -->
            <div>
              <a-form-item
                  :label="$t('components.EditForm.949962-30')"
                  :name="[
                                    'sso',
                                    'configuration',
                                    'type',
                                ]"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-62'),
                                    },
                                ]"
              >
                <a-select
                    v-model:value="
                                        form.data.sso.configuration.type
                                    "
                    :placeholder="$t('components.EditForm.949962-62')"
                    :options="thirdPartyType"
                    @change="onSsoTypeChange"
                />
              </a-form-item>

              <template v-if="form.data.sso.configuration.type === 'oauth2'">
                <a-form-item
                    class="resetLabel"
                    :name="[
                                    'sso',
                                    'configuration',
                                    'oauth2',
                                    'scope',
                                ]"
                    :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-63'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('components.EditForm.949962-2'),
                                    },
                                ]"
                >
                  <template #label>
                    <FormLabel
                        text="scope"
                        required
                        :tooltip="$t('components.EditForm.949962-64')"
                    />
                  </template>
                  <a-input
                      v-model:value="
                                        form.data.sso.configuration.oauth2.scope
                                    "
                      :placeholder="$t('components.EditForm.949962-63')"
                  />
                </a-form-item>
                <a-form-item
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
                                        message: $t('components.EditForm.949962-37'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('components.EditForm.949962-2'),
                                    },
                                ]"
                >
                  <template #label>
                    <FormLabel
                        text="client_id"
                        required
                        :tooltip="$t('components.EditForm.949962-38')"
                    />
                  </template>
                  <a-input
                      v-model:value="
                                        form.data.sso.configuration.oauth2
                                            .clientId
                                    "
                      :placeholder="$t('components.EditForm.949962-37')"
                  />
                </a-form-item>
                <a-form-item
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
                                        message: $t('components.EditForm.949962-39'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('components.EditForm.949962-2'),
                                    },
                                ]"
                >
                  <template #label>
                    <FormLabel
                        text="client_secret"
                        required
                        :tooltip="$t('components.EditForm.949962-40')"
                    />
                  </template>
                  <a-input
                      v-model:value="
                                        form.data.sso.configuration.oauth2
                                            .clientSecret
                                    "
                      :placeholder="$t('components.EditForm.949962-39')"
                  />
                </a-form-item>
              </template>
            </div>
            <a-form-item
                v-if="form.data.sso.configuration.type === 'oauth2'"
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
                                    message: $t('components.EditForm.949962-17'),
                                },
                            ]"
            >
              <template #label>
                <FormLabel
                    :text="$t('components.EditForm.949962-18')"
                    required
                    :tooltip="$t('components.EditForm.949962-19')"
                />
              </template>
              <a-input
                  v-model:value="
                                    form.data.sso.configuration.oauth2
                                        .authorizationUrl
                                "
                  :placeholder="$t('components.EditForm.949962-17')"
              />
            </a-form-item>

            <!-- 第三方应用 -->
            <div v-if="form.data.sso.configuration.type">
              <template v-if="form.data.sso.configuration.type === 'oauth2'">
                <a-form-item
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
                                        message: $t('components.EditForm.949962-20'),
                                    },
                                ]"
                >
                  <template #label>
                    <FormLabel
                        :text="$t('components.EditForm.949962-21')"
                        required
                        :tooltip="$t('components.EditForm.949962-22')"
                    />
                  </template>
                  <a-input
                      v-model:value="
                                        form.data.sso.configuration.oauth2
                                            .tokenUrl
                                    "
                      :placeholder="$t('components.EditForm.949962-20')"
                  />
                </a-form-item>
                <a-form-item
                    :label="$t('components.EditForm.949962-65')"
                    :name="[
                                    'sso',
                                    'configuration',
                                    'oauth2',
                                    'userInfoUrl',
                                ]"
                    :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-66'),
                                    },
                                ]"
                >
                  <a-input
                      v-model:value="
                                        form.data.sso.configuration.oauth2
                                            .userInfoUrl
                                    "
                      :placeholder="$t('components.EditForm.949962-66')"
                  />
                </a-form-item>
              </template>
              <template v-if="form.data.sso.configuration.type === 'bearer'">
                <a-form-item
                    :name="[
                        'sso',
                        'configuration',
                        'bearer',
                        'loginUrl',
                    ]"
                    :label="$t('components.EditForm.949962-93')"
                    :rules="[
                        {
                            required: true,
                            message: $t('components.EditForm.949962-62'),
                        },
                    ]"
                >
                  <a-input
                      v-model:value="form.data.sso.configuration.bearer.loginUrl"
                      :placeholder="$t('components.InputGroup.573743-0')"
                  />
                </a-form-item>
                <a-form-item
                    :name="[
                        'sso',
                        'configuration',
                        'bearer',
                        'userInfoUrl',
                    ]"
                    :rules="[
                        {
                            required: true,
                            message: $t('components.EditForm.949962-63'),
                        },
                    ]"
                    :label="$t('components.EditForm.949962-94')"
                >
                  <a-input
                      v-model:value="form.data.sso.configuration.bearer.userInfoUrl"
                      :placeholder="$t('components.InputGroup.573743-0')"
                  />
                </a-form-item>
                <a-form-item
                    class="resetLabel"
                    :name="[
                        'sso',
                        'configuration',
                        'bearer',
                        'tokenKey',
                    ]"
                    :label="$t('components.EditForm.949962-95')"
                >
                  <a-input
                      v-model:value="form.data.sso.configuration.bearer.tokenKey"
                      :placeholder="$t('components.InputGroup.573743-0')"
                  />
                </a-form-item>
                <a-form-item
                    class="resetLabel"
                    :name="[
                        'sso',
                        'configuration',
                        'bearer',
                        'base64',
                    ]"
                    :label="$t('components.EditForm.949962-96')"
                >
                  <a-switch
                      v-model:checked="form.data.sso.configuration.bearer.base64"
                  />
                </a-form-item>
              </template>
              <a-form-item
                  class="resetLabel"
                  :name="[
                                    'sso',
                                    'configuration',
                                    form.data.sso.configuration.type,
                                    'userProperty',
                                    'userId',
                                ]"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-67'),
                                    },
                                ]"
              >
                <template #label>
                  <FormLabel
                      :text="$t('components.EditForm.949962-68')"
                      required
                      :tooltip="$t('components.EditForm.949962-69')"
                  />
                </template>
                <a-input
                    v-model:value="
                                        form.data.sso.configuration[form.data.sso.configuration.type]
                                            .userProperty.userId
                                    "
                    :placeholder="$t('components.EditForm.949962-70')"
                />
              </a-form-item>
              <a-form-item
                  :label="$t('components.EditForm.949962-41')"
                  :name="[
                                    'sso',
                                    'configuration',
                                    form.data.sso.configuration.type,
                                    'userProperty',
                                    'username',
                                ]"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-42'),
                                    },
                                ]"
              >
                <a-input
                    v-model:value="
                                        form.data.sso.configuration[form.data.sso.configuration.type]
                                            .userProperty.username
                                    "
                    :placeholder="$t('components.EditForm.949962-71')"
                />
              </a-form-item>
              <a-form-item :label="$t('components.EditForm.949962-72')" :name="[
                                    'sso',
                                    'configuration',
                                    form.data.sso.configuration.type,
                                    'userProperty',
                                    'username',
                                ]">
                <a-input
                    v-model:value="
                                        form.data.sso.configuration[form.data.sso.configuration.type]
                                            .userProperty.avatar
                                    "
                    :placeholder="$t('components.EditForm.949962-73')"
                />
              </a-form-item>
            </div>
            <!-- 非第三方应用 -->
            <div
                v-else-if="
                                !form.data.integrationModes.includes(
                                    'apiClient',
                                )
                            "
            >
              <a-form-item
                  v-if="
                                    form.data.provider === 'internal-standalone'
                                "
              >
                <template #label>
                  <FormLabel
                      :text="$t('components.EditForm.949962-23')"
                      :tooltip="$t('components.EditForm.949962-24')"
                  />
                </template>
                <a-input
                    v-model:value="
                                        form.data.sso.configuration.oauth2
                                            .redirectUri
                                    "
                    :placeholder="$t('components.EditForm.949962-25')"
                />
              </a-form-item>
              <!-- 非钉钉 -->
              <a-form-item
                  v-if="form.data.provider !== 'dingtalk-ent-app'"
                  class="resetLabel"
                  :name="['sso', 'configuration', 'appId']"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-26'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('components.EditForm.949962-2'),
                                    },
                                ]"
              >
                <template #label>
                  <FormLabel
                      text="appId"
                      required
                      :tooltip="$t('components.EditForm.949962-27')"
                  />
                </template>
                <a-input
                    v-model:value="
                                        form.data.sso.configuration.appId
                                    "
                    :placeholder="$t('components.EditForm.949962-26')"
                />
              </a-form-item>
              <!-- 非微信 -->
              <a-form-item
                  v-if="
                                    form.data.provider !== 'wechat-webapp' &&
                                    form.data.provider !== 'wechat-miniapp'
                                "
                  class="resetLabel"
                  :name="['sso', 'configuration', 'appKey']"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-28'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('components.EditForm.949962-2'),
                                    },
                                ]"
              >
                <template #label>
                  <FormLabel
                      text="appKey"
                      required
                      :tooltip="$t('components.EditForm.949962-29')"
                  />
                </template>
                <a-input
                    v-model:value="
                                        form.data.sso.configuration.appKey
                                    "
                    :placeholder="$t('components.EditForm.949962-28')"
                />
              </a-form-item>

              <!-- 钉钉 + 微信 -->
              <a-form-item
                  v-if="['wechat-miniapp', 'wechat-webapp', 'dingtalk-ent-app'].includes(form.data?.provider)"
                  class="resetLabel"
                  :name="['sso', 'configuration', 'appSecret']"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-74'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('components.EditForm.949962-2'),
                                    },
                                ]"
              >
                <template #label>
                  <FormLabel
                      text="appSecret"
                      required
                      :tooltip="$t('components.EditForm.949962-75')"
                  />
                </template>
                <a-input
                    v-model:value="
                                        form.data.sso.configuration.appSecret
                                    "
                    :placeholder="$t('components.EditForm.949962-74')"
                />
              </a-form-item>
            </div>

            <a-form-item class="resetLabel">
              <template #label>
                <FormLabel
                    :text="$t('components.EditForm.949962-76')"
                    required
                    :tooltip="$t('components.EditForm.949962-77')"
                />
              </template>
              <a-switch
                  v-model:checked="form.data.sso.autoCreateUser"
              />
            </a-form-item>
            <div v-if="form.data.sso.autoCreateUser">
              <a-form-item
                  :label="$t('components.EditForm.949962-78')"
                  :name="['sso', 'usernamePrefix']"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-79'),
                                    },
                                   {
                                        validator: checkCh,
                                        trigger: 'change'
                                    }
                                ]"
              >
                <a-input
                    v-model:value="form.data.sso.usernamePrefix"
                    :placeholder="$t('components.EditForm.949962-79')"
                />
              </a-form-item>
              <a-form-item
                  :label="$t('components.EditForm.949962-80')"
                  :name="['sso', 'defaultPasswd']"
                  :rules="[
                                    {
                                        required: true,
                                        message: $t('components.EditForm.949962-81'),
                                    },
                                    // {
                                    //     min: 8,
                                    //     message: '最少输入8个字符',
                                    // },
                                    // {
                                    //     max: 64,
                                    //     message: $t('components.EditForm.949962-2'),
                                    // },
                                    {
                                        validator: checkPassword,
                                    }
                                ]"
              >
                <a-input
                    v-model:value="form.data.sso.defaultPasswd"
                    :placeholder="$t('components.EditForm.949962-81')"
                />
              </a-form-item>

              <a-form-item 
                  :label="$t('components.EditForm.949962-53')"
                  :name="['sso', 'roleIdList']"
                  :rules="[
                      {
                          required: true,
                          message: '请选择角色',
                      },
                      {
                          validator: validateRoleOrOrg('请选择角色'),
                          trigger: 'change',
                      },
                  ]"
              >
                <a-select
                    v-model:value="form.data.sso.roleIdList"
                    mode="multiple"
                    :options="form.roleIdList"
                    :placeholder="$t('components.EditForm.949962-52')"
                    :filter-option="filterOption"
                ></a-select>
                <j-permission-button
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
                  <AIcon type="PlusOutlined"/>
                </j-permission-button>
              </a-form-item>
              <a-form-item 
                  :label="$t('components.EditForm.949962-55')"
                  :name="['sso', 'orgIdList']"
                  :rules="[
                      {
                          required: true,
                          message: '请选择组织',
                      },
                      {
                          validator: validateRoleOrOrg('请选择组织'),
                          trigger: 'change',
                      },
                  ]"
              >
                <a-tree-select
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
                    :placeholder="$t('components.EditForm.949962-57')"
                    :filterTreeNode="
                                (v: string, node: any) => filterSelectNode(v, node, 'name')
                            "
                >
                  <template #title="{ name }">
                    {{ name }}
                  </template>
                </a-tree-select>
                <j-permission-button
                    :hasPermission="`${deptPermission}:update`"
                    type="link"
                    @click="
                                        clickAddItem(
                                            form.data.sso.orgIdList,
                                            'Department',
                                        )
                                    "
                    class="add-item"
                >
                  <AIcon type="PlusOutlined"/>
                </j-permission-button>
                <a-button
                    type="link"
                    @click="getOrgIdList"
                    :title="'刷新组织列表'"
                >
                  <AIcon type="ReloadOutlined"/>
                </a-button>
              </a-form-item>
            </div>
          </template>
        </a-collapse-panel>
      </a-collapse>

      <a-form-item :label="$t('components.EditForm.949962-82')" name="description">
        <a-textarea
            v-model:value="form.data.description"
            :placeholder="$t('components.EditForm.949962-83')"
            showCount
            :maxlength="200"
            :rows="3"
            style="width: 100%"
        />
      </a-form-item>
    </a-form>

    <a-button
        v-if="routeQuery.view !== 'true'"
        @click="clickSave"
        type="primary"
        :loading="loading"
    >
      {{ $t('components.EditForm.949962-84') }}
    </a-button>

    <div class="dialog">
      <MenuDialog
          v-if="dialog.visible && dialog.current.provider !== 'third-party'"
          v-model:visible="dialog.visible"
          :data="dialog.current"
          :mode="routeQuery.id ? 'edit' : 'add'"
          @refresh="menuStory.jumpPage('system/application', {})"
      />
      <ThirdMenu
          v-if="dialog.visible && dialog.current.provider === 'third-party'"
          :data="dialog.current"
          :mode="routeQuery.id ? 'edit' : 'add'"
          mode="add"
          @cancel="dialog.visible = false"
          @ok="menuStory.jumpPage('system/application', {})"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {passwordRegEx, testIP} from '@jetlinks-web-core/utils/validate';

import {
  getDepartmentList_api,
  addApp_api,
  updateApp_api,
  getAppInfo_api,
  queryType,
  getThirdPartyType,
} from '@authentication-manager-ui/api/system/apply';
import {getRoleList_api} from '@authentication-manager-ui/api/system/user';
import FormLabel from './FormLabel.vue';
import RequestTable from './RequestTable.vue';
import MenuDialog from '../../componenets/MenuDialog.vue';
import ThirdMenu from '../../componenets/ThirdMenu.vue';
import type {formType, dictType, optionsType, applyType} from '../typing';
import {randomString, onlyMessage} from '@jetlinks-web/utils';
import {cloneDeep, difference} from 'lodash-es';
import {useMenuStore} from '@jetlinks-web-core/store';
import {Rule} from 'ant-design-vue/lib/form';
import ApplyList from './ApplyList/index.vue';
import {systemImg} from "@authentication-manager-ui/assets";
import {useI18n} from 'vue-i18n';
import { useTabSaveSuccess } from '@jetlinks-web-core/hooks'
import {filterSelectNode} from "@jetlinks-web-core/utils";

const {t: $t} = useI18n();
const emit = defineEmits(['changeApplyType']);

const defaultImg = {
  'internal-standalone': systemImg.internalStandaloneImg,
  'internal-integrated': systemImg.internalIntegratedImg,
  'wechat-webapp': systemImg.wechatWebapp,
  'dingtalk-ent-app': systemImg.dingTalkEntAppImg,
  'third-party': systemImg.thirdParty,
  'wechat-miniapp': systemImg.wechatMiniapp,
};


const routeQuery = useRoute().query;
const menuStory = useMenuStore();

const deptPermission = 'system/Department';
const rolePermission = 'system/Role';

const typeOptions = ref<any[]>([]);

const loading = ref<boolean>(false);
const { onOpen } = useTabSaveSuccess('system/Role')

// 初始化表单
const initForm: formType = {
  name: '',
  provider: 'third-party',
  logoUrl: systemImg.thirdParty,
  integrationMode: '',
  integrationModes: [],
  description: '',
  page: {
    // 页面集成
    baseUrl: '',
    routeType: 'hash',
    parameters: [],
    configuration: {},
  },
  apiClient: {
    // API客户端
    baseUrl: '',
    headers: [], // 请求头
    parameters: [], // 请求参数
    authConfig: {
      // API客户端
      type: 'oauth2', // 类型, 可选值：none, bearer, oauth2, basic, other
      bearer: {token: ''}, // 授权信息
      basic: {username: '', password: ''}, // 基本信息
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
      type: '', // 认证方式
      appId: '', // 微信单点登录配置
      appKey: '', // 钉钉单点登录配置
      appSecret: '', // 钉钉、微信单点登录配置
    },
    type: undefined,
    autoCreateUser: false, // 是否自动创建平台用户
    usernamePrefix: '', // 用户ID前缀
    roleIdList: [], // 自动创建平台用户时角色列表
    orgIdList: [], // 自动创建平台用户时部门列表
    defaultPasswd: '', // 默认密码
  },
};
const formRef = ref<any>();
const form = reactive({
  data: {...initForm},
  // integrationModesISO: [] as string[], // 接入方式镜像  折叠面板使用
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
const thirdPartyType = ref<any[]>([])

const checkCh = (_rule: Rule, value: string): Promise<any> =>
    new Promise((resolve, reject) => {
      if (/[\u4e00-\u9fa5]/.test(value)) return reject($t('components.EditForm.949962-85'));
      else return resolve('')
    })

// 角色/组织必填校验
const validateRoleOrOrg = () => {
  return (_rule: Rule, value: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        reject()
      } else {
        resolve()
      }
    })
  }
}

const getType = async () => {
  const resp: any = await queryType();
  if (resp.status === 200) {
    const arr = resp.result.map((item: any) => ({
      label: item.name,
      value: item.provider,
      integrationModes: item.integrationModes?.map((i: any) => {
        return {
          label: i.text,
          value: i.value,
        };
      }),
    }));
    typeOptions.value = arr;
  }
}

onMounted(async () => {
  await getType();
  getRoleIdList();
  getOrgIdList();
  queryThirdPartyType();

  // 设置默认 provider 为 third-party
  form.data.provider = 'third-party';
  form.data.logoUrl = systemImg.thirdParty;

  if (routeQuery.id) {
    getInfo(routeQuery.id as string);
  }
});

const checkPassword = (_rule: Rule, value: string) => {
  return new Promise((resolve, reject) => {
    if (!value) return resolve('');
    else if (value.length > 64) return reject($t('components.EditForm.949962-2'));
    else if (value.length < 8) return reject($t('components.EditForm.949962-88'));
    else if (!passwordRegEx(value)) {
      return reject($t('components.EditForm.949962-89'));
    } else {
      resolve('')
    }
  })
}

// 接入方式的选项（过滤掉 page 和 apiClient）
const joinOptions = computed(() => {
  const options = typeOptions.value.find((item) => item.value === 'third-party')
      ?.integrationModes || [];
  // 只保留 apiServer 和 ssoClient
  return options.filter((opt: any) => ['apiServer', 'ssoClient'].includes(opt.value));
});

// 接入方式切换处理
const onIntegrationModeChange = () => {
  const mode = form.data.integrationMode;
  // 清空另一种方式的数据
  if (mode === 'apiServer') {
    // 清空 ssoClient 数据
    form.data.sso = {
      configuration: {
        oauth2: {
          authorizationUrl: '',
          redirectUri: '',
          clientId: '',
          clientSecret: '',
          userInfoUrl: '',
          scope: '',
          userProperty: {
            userId: '',
            username: '',
            name: '',
            avatar: '',
            email: '',
            telephone: '',
            description: '',
          },
          grantType: '',
          tokenUrl: '',
          accessTokenProperty: '',
          tokenRequestType: '',
        },
        type: '',
        appId: '',
        appKey: '',
        appSecret: '',
      },
      type: undefined,
      autoCreateUser: false,
      usernamePrefix: '',
      roleIdList: [],
      orgIdList: [],
      defaultPasswd: '',
    };
  } else if (mode === 'ssoClient') {
    // 清空 apiServer 数据
    form.data.apiServer = {
      appId: randomString(16),
      secureKey: randomString(),
      redirectUri: '',
      roleIdList: [],
      orgIdList: [],
      ipWhiteList: '',
      enableOAuth2: false,
    };
  }
};

const dialog = reactive({
  visible: false,
  current: {},
});

watch(
    () => form.data.provider,
    (n) => {
      if (!form.data.id) {
        // 新增时, 切换应用类型, 清空公用字段的值
        form.data.description = '';
        form.data.apiServer.redirectUri = '';
        form.data.apiServer.roleIdList = [];
        form.data.apiServer.orgIdList = [];
      }
      emit('changeApplyType', n);
    },
    {immediate: true},
);
watch(
    () => form.data.integrationMode,
    (n, o) => {
      if (o && form.errorNumInfo[o]) {
        form.errorNumInfo[o].clear();
      }
    },
);

function getInfo(id: string) {
  getAppInfo_api(id).then((resp: any) => {
    form.data = {
      ...initForm, // 查询详情, 赋值初始字段
      ...resp.result,
      provider: 'third-party', // 强制设置为第三方应用
      integrationMode: resp.result.integrationModes?.[0]?.value || '', // 取第一个接入方式
    } as formType;
    form.data.apiServer && (form.data.apiServer.appId = id);
  });
}

// 获取角色列表
function getRoleIdList() {
  getRoleList_api().then((resp) => {
    if (resp.status === 200) {
      const result = resp.result as dictType;
      form.roleIdList = result?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
  });
}

// 获取组织列表
function getOrgIdList() {
  getDepartmentList_api({paging: false}).then((resp) => {
    if (resp.status === 200) {
      form.orgIdList = resp.result as dictType;
    }
  });
}

const filterOption = (input: string, option: any) => {
  return option.label.indexOf(input) >= 0;
};

// 添加角色/组织
function clickAddItem(data: string[], target: string) {
  onOpen({ save: true},{
    menuCode: `system/${target}`
  }).then(() => {
    // 添加成功后不自动刷新，避免影响用户正在编辑的数据
    // 用户可以通过刷新按钮手动更新列表
  })
}

// 保存
function clickSave() {
  formRef.value?.validate().then(() => {
    const params = cloneDeep(form.data);

    // 设置 provider 为 third-party
    params.provider = 'third-party';

    // 将 integrationMode 转换为 integrationModes 数组
    params.integrationModes = params.integrationMode ? [params.integrationMode] : [];

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

    // 设置 id
    if (params.integrationModes.includes('apiServer')) {
      params.id = params.apiServer.appId;
    }

    loading.value = true;
    const request = routeQuery.id
        ? updateApp_api(routeQuery.id as string, params)
        : addApp_api(params);
    request
        .then((resp: any) => {
          if (resp.status === 200) {
            onlyMessage($t('components.EditForm.949962-91'));
            menuStory.jumpPage('system/application', {});
          }
        })
        .finally(() => {
          loading.value = false;
        });
  }).catch(() => {
    // 验证失败，Ant Design Vue 会自动显示错误信息，这里不需要额外处理
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

/**
 * 验证IP合法性
 * @param _rule
 * @param value
 */
const validateIP = (_rule: Rule, value: string) => {
  if (value) {
    const ipList = value
        ?.split(/[\n,]/g)
        .filter((i: string) => i && i.trim());
    const errorIPList = ipList?.filter(
        (f: string) => !testIP(f.replace(/\s*/g, '')),
    );
    return new Promise((resolve, reject) => {
      !errorIPList?.length
          ? resolve('')
          : reject($t('components.EditForm.949962-92', [errorIPList]));
    });
  } else {
    return Promise.resolve();
  }
};

const onSsoTypeChange = (val) => {
  if (val === 'oauth2') {
    form.data.sso.configuration.oauth2 = {
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
    }
    form.data.sso.configuration.bearer = undefined
  }
  if (val === 'bearer') {
    form.data.sso.configuration.bearer = {
      loginUrl: undefined,
      userInfoUrl: undefined,
      tokenKey: undefined,
      base64: false,
      userProperty: {
        userId: undefined,
        name: undefined
      }
    }
    form.data.sso.configuration.oauth2 = undefined
  }
}
const queryThirdPartyType = async () => {
  const resp = await getThirdPartyType()
  if (resp.success) {
    const flag = resp.result.find(i => i.value === 'bearer')
    thirdPartyType.value = !!flag ? [{label: 'oauth2', value: 'oauth2'}, {label: 'bearer', value: 'bearer'}] : [{label: 'oauth2', value: 'oauth2'}]
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
          // .ant-upload-select-picture-card {
          //     width: auto;
          //     height: auto;
          //     max-width: 150px;
          //     max-height: 150px;

          //     > .ant-upload {
          //         height: 150px;
          //     }
          // }
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
