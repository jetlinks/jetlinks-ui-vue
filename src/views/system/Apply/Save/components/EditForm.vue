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
      <a-form-item
        :label="$t('components.EditForm.949962-3')"
        name="provider"
        :rules="[
                    {
                        required: true,
                        message: $t('components.EditForm.949962-4'),
                    },
                ]"
      >
        <ApplyList
          :options="typeOptions"
          v-model:photoUrl="form.data.logoUrl"
          v-model:value="form.data.provider"
          :disabled="!!routeQuery.id || !!routeQuery?.provider"
        />
      </a-form-item>
      <a-row>
        <a-col :span="joinOptions.length >= 3 ? 24 : 6 * joinOptions.length">
          <a-form-item
            :label="$t('components.EditForm.949962-5')"
            name="integrationModes"
            :rules="[
                            {
                                required: true,
                                message: $t('components.EditForm.949962-6'),
                            },
                        ]"
          >
            <j-check-button
              v-model:value="form.data.integrationModes"
              :options="joinOptions"
              :multiple="true"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-collapse style="margin-bottom: 20px;">
        <a-collapse-panel
          v-for="(item, index) in form.data.integrationModes"
          :key="item + index"
          :forceRender="true"
        >
          <template #header>
                        <span>
                            {{
                            joinOptions.find((it) => it.value === item)
                              ?.label
                          }}
                            <span
                              v-show="form.errorNumInfo[item]?.size"
                              class="error-info"
                              :style="
                                    form.errorNumInfo.ssoClient.size > 9 &&
                                    form.errorNumInfo?.ssoClient?.size
                                        ? { padding: '0 8px' }
                                        : {}
                                "
                            >
                                {{ form.errorNumInfo[item]?.size }}
                            </span>
                        </span>
          </template>
          <!-- 页面集成 -->
          <template v-if="item === 'page'">
            <a-form-item
              :name="['page', 'baseUrl']"
              class="resetLabel"
              :rules="[
                                {
                                    required: true,
                                    message: $t('components.EditForm.949962-7'),
                                },{
                                    validator:validateBaseUrl,
                                    trigger: 'change'
                                }
                            ]"
            >
              <template #label>
                <FormLabel
                  :text="$t('components.EditForm.949962-8')"
                  required
                  :tooltip="$t('components.EditForm.949962-9')"
                />
              </template>

              <!-- <j-input
                  v-model:value="form.data.page.baseUrl"
                  :placeholder="$t('components.EditForm.949962-7')"
              /> -->
              <InputGroup v-model:value="form.data.page.baseUrl" style="width: 100%;"/>
            </a-form-item>
            <a-form-item
              :label="$t('components.EditForm.949962-10')"
              :name="['page', 'routeType']"
              :rules="[
                                {
                                    required: true,
                                    message: $t('components.EditForm.949962-11'),
                                },
                            ]"
            >
              <a-select v-model:value="form.data.page.routeType">
                <a-select-option value="hash"
                >hash
                </a-select-option
                >
                <a-select-option value="history"
                >history
                </a-select-option
                >
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="form.data.provider === 'third-party'"
            >
              <template #label>
                <FormLabel
                  :text="$t('components.EditForm.949962-12')"
                  :tooltip="$t('components.EditForm.949962-13')"
                />
              </template>

              <RequestTable
                v-model:value="form.data.page.parameters"
                value-type="input"
              />
            </a-form-item>
          </template>
          <!-- API客户端 -->
          <template v-if="item === 'apiClient'">
            <a-form-item
              class="resetLabel"
              :name="['apiClient', 'baseUrl']"
              :rules="[
                                {
                                    required: true,
                                    message: $t('components.EditForm.949962-14'),
                                },
                            ]"
            >
              <template #label>
                <FormLabel
                  :text="$t('components.EditForm.949962-15')"
                  required
                  :tooltip="$t('components.EditForm.949962-16')"
                />
              </template>
              <a-input
                v-model:value="form.data.apiClient.baseUrl"
                :placeholder="$t('components.EditForm.949962-14')"
              />
            </a-form-item>
            <div
              v-if="form.data.provider === 'internal-standalone'"
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
                                        form.data.apiClient.authConfig.oauth2
                                            .authorizationUrl
                                    "
                  :placeholder="$t('components.EditForm.949962-17')"
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
                                        form.data.apiClient.authConfig.oauth2
                                            .tokenUrl
                                    "
                  :placeholder="$t('components.EditForm.949962-20')"
                />
              </a-form-item>
              <a-form-item>
                <template #label>
                  <FormLabel
                    :text="$t('components.EditForm.949962-23')"
                    :tooltip="$t('components.EditForm.949962-24')"
                  />
                </template>
                <a-input
                  v-model:value="
                                        form.data.apiClient.authConfig.oauth2
                                            .redirectUri
                                    "
                  :placeholder="$t('components.EditForm.949962-25')"
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
                                        form.data.apiClient.authConfig.oauth2
                                            .clientId
                                    "
                  :placeholder="$t('components.EditForm.949962-26')"
                  :disabled="!!form.data.id && !!form.data.apiClient.authConfig.oauth2.clientId"
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
                                        form.data.apiClient.authConfig.oauth2
                                            .clientSecret
                                    "
                  :placeholder="$t('components.EditForm.949962-28')"
                />
              </a-form-item>
            </div>
            <div v-else-if="form.data.provider === 'third-party'">
              <a-form-item
                :label="$t('components.EditForm.949962-30')"
                :name="['apiClient', 'authConfig', 'type']"
                :rules="[{ required: true }]"
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
                    {{ $t('components.EditForm.949962-31') }}
                  </a-select-option>
                  <a-select-option value="bearer">
                    {{ $t('components.EditForm.949962-32') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <div
                v-if="
                                    form.data.apiClient.authConfig.type ===
                                    'oauth2'
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
                                            form.data.apiClient.authConfig
                                                .oauth2.authorizationUrl
                                        "
                    :placeholder="$t('components.EditForm.949962-17')"
                  />
                </a-form-item>

                <a-form-item
                  :label="$t('components.EditForm.949962-33')"
                  :name="[
                                        'apiClient',
                                        'authConfig',
                                        'oauth2',
                                        'tokenRequestType',
                                    ]"
                  :rules="[
                                        {
                                            required: true,
                                            message: $t('components.EditForm.949962-34'),
                                        },
                                    ]"
                >
                  <a-select
                    v-model:value="
                                            form.data.apiClient.authConfig
                                                .oauth2.tokenRequestType
                                        "
                    :placeholder="$t('components.EditForm.949962-34')"
                  >
                    <a-select-option value="POST_BODY">
                      {{ $t('components.EditForm.949962-35') }}
                    </a-select-option>
                    <a-select-option value="POST_URI">
                      {{ $t('components.EditForm.949962-36') }}
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
                                            form.data.apiClient.authConfig
                                                .oauth2.clientId
                                        "
                    :placeholder="$t('components.EditForm.949962-37')"
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
                                            form.data.apiClient.authConfig
                                                .oauth2.clientSecret
                                        "
                    :placeholder="$t('components.EditForm.949962-39')"
                  />
                </a-form-item>
              </div>
              <div
                v-else-if="
                                    form.data.apiClient.authConfig.type ===
                                    'basic'
                                "
              >
                <a-form-item
                  :label="$t('components.EditForm.949962-41')"
                  :name="[
                                        'apiClient',
                                        'authConfig',
                                        'basic',
                                        'username',
                                    ]"
                  :rules="[
                                        {
                                            required: true,
                                            message: $t('components.EditForm.949962-42'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('components.EditForm.949962-2'),
                                        },
                                    ]"
                >
                  <a-input
                    v-model:value="
                                            form.data.apiClient.authConfig.basic
                                                .username
                                        "
                    :placeholder="$t('components.EditForm.949962-42')"
                  />
                </a-form-item>
                <a-form-item
                  :label="$t('components.EditForm.949962-43')"
                  :name="[
                                        'apiClient',
                                        'authConfig',
                                        'basic',
                                        'password',
                                    ]"
                  :rules="[
                                        {
                                            required: true,
                                            message: $t('components.EditForm.949962-44'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('components.EditForm.949962-2'),
                                        },
                                    ]"
                >
                  <a-input
                    v-model:value="
                                            form.data.apiClient.authConfig.basic
                                                .password
                                        "
                    :placeholder="$t('components.EditForm.949962-44')"
                  />
                </a-form-item>
              </div>
              <a-form-item
                v-else-if="
                                    form.data.apiClient.authConfig.type ===
                                    'bearer'
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
                                        message: $t('components.EditForm.949962-45'),
                                    },
                                ]"
              >
                <a-input
                  v-model:value="
                                        form.data.apiClient.authConfig.bearer
                                            .token
                                    "
                  :placeholder="$t('components.EditForm.949962-45')"
                />
              </a-form-item>
            </div>

            <div
              v-if="form.data.provider !== 'internal-integrated'"
            >
              <a-form-item
                :name="['apiClient', 'headers']"
                :rules="[
                                    {
                                        required: !headerValid,
                                        message: $t('components.EditForm.949962-46'),
                                    },
                                    {
                                        validator: headerValidator,
                                    },
                                ]"
              >
                <template #label>
                  <FormLabel
                    :text="$t('components.EditForm.949962-36')"
                    :tooltip="$t('components.EditForm.949962-47')"
                  />
                </template>

                <RequestTable
                  v-model:value="form.data.apiClient.headers"
                  v-model:valid="headerValid"
                />
              </a-form-item>
              <a-form-item
                :label="$t('components.EditForm.949962-12')"
                :name="['apiClient', 'parameters']"
                :rules="[
                                    {
                                        required: !paramsValid,
                                        message: $t('components.EditForm.949962-48'),
                                    },
                                    {
                                        validator: paramsValidator,
                                    },
                                ]"
              >
                <RequestTable
                  v-model:value="
                                        form.data.apiClient.parameters
                                    "
                  v-model:valid="paramsValid"
                />
              </a-form-item>
            </div>
          </template>
          <!-- API服务 -->
          <template v-if="item === 'apiServer'">
            <a-form-item
              class="resetLabel"
              v-if="
                                !form.data.integrationModes.includes(
                                    'apiClient',
                                )
                            "
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
              v-show="
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
                v-model:value="form.data.apiServer.redirectUri"
                :placeholder="$t('components.EditForm.949962-51')"
              />
            </a-form-item>
            <a-form-item
              class="resetLabel"
              :name="['apiServer', 'roleIdList']"
              :rules="[
                                {
                                    required: true,
                                    message: $t('components.EditForm.949962-52'),
                                },
                            ]"
            >
              <template #label>
                <FormLabel
                  :text="$t('components.EditForm.949962-53')"
                  required
                  :tooltip="$t('components.EditForm.949962-54')"
                />
              </template>
              <a-select
                v-model:value="form.data.apiServer.roleIdList"
                :options="form.roleIdList"
                mode="multiple"
                :placeholder="$t('components.EditForm.949962-52')"
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
            <a-form-item>
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
            </a-form-item>

            <div v-if="form.data.provider === 'third-party'">
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
            </div>
          </template>
          <!-- 单点登录 -->
          <template v-if="item === 'ssoClient'">
            <!-- 第三方应用 -->
            <div v-if="form.data.provider === 'third-party'">
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
              v-if="
                                (form.data.provider === 'internal-standalone' ||
                                    form.data.provider === 'third-party') &&
                                !form.data.integrationModes.includes(
                                    'apiClient',
                                ) && form.data.sso.configuration.type === 'oauth2'
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
            <div v-if="form.data.provider === 'third-party' && form.data.sso.configuration.type">
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

              <a-form-item :label="$t('components.EditForm.949962-53')">
                <a-select
                  v-model:value="form.data.sso.roleIdList"
                  mode="multiple"
                  :options="form.roleIdList"
                  :placeholder="$t('components.EditForm.949962-52')"
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
              <a-form-item :label="$t('components.EditForm.949962-55')">
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
        @refresh="menuStory.jumpPage('system/Apply', {})"
      />
      <ThirdMenu
        v-if="dialog.visible && dialog.current.provider === 'third-party'"
        :data="dialog.current"
        :mode="routeQuery.id ? 'edit' : 'add'"
        mode="add"
        @cancel="dialog.visible = false"
        @ok="menuStory.jumpPage('system/Apply', {})"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {passwordRegEx, testIP} from '@/utils/validate';

import {
  getDepartmentList_api,
  addApp_api,
  updateApp_api,
  getAppInfo_api,
  queryType,
  getThirdPartyType
} from '@/api/system/apply';
import {getRoleList_api} from '@/api/system/user';
import FormLabel from './FormLabel.vue';
import RequestTable from './RequestTable.vue';
import MenuDialog from '../../componenets/MenuDialog.vue';
import ThirdMenu from '../../componenets/ThirdMenu.vue';
import type {formType, dictType, optionsType, applyType} from '../typing';
import {randomString, onlyMessage} from '@jetlinks-web/utils';
import {cloneDeep, difference} from 'lodash-es';
import {useMenuStore} from '@/store';
import {Rule} from 'ant-design-vue/lib/form';
import ApplyList from './ApplyList/index.vue';
import InputGroup from './InputGroup.vue'
import {systemImg} from "@/assets";
import {useI18n} from 'vue-i18n';

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

// 初始化表单
const initForm: formType = {
  name: '',
  provider: 'internal-standalone',
  logoUrl: systemImg.internalStandaloneImg,
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
      // bearer: {
      //   loginUrl: undefined,
      //   userInfoUrl: undefined,
      //   tokenKey: undefined,
      //   base64: false,
      //   userProperty: {
      //     userId: undefined,
      //     name: undefined
      //   }
      // },
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

// 请求头和参数必填验
const headerValid = ref(true);
const paramsValid = ref(true);
const headerValidator = () => {
  return new Promise((resolve, reject) => {
    headerValid.value ? resolve('') : reject($t('components.EditForm.949962-86'));
  });
};
const paramsValidator = () => {
  return new Promise((resolve, reject) => {
    paramsValid.value ? resolve('') : reject($t('components.EditForm.949962-87'));
  });
};
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
  queryThirdPartyType()
  if (routeQuery.id) {
    getInfo(routeQuery.id as string);
  }
  if (routeQuery.provider) {
    form.data.provider = routeQuery?.provider as applyType;
    typeOptions.value = typeOptions.value.filter((i: any) => {
      return i.value === routeQuery.provider;
    });
    form.data.logoUrl = defaultImg[typeOptions.value[0].value]
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

// 接入方式的选项
const joinOptions = computed(() => {
  return (
    typeOptions.value.find((item) => form.data?.provider === item.value)
      ?.integrationModes || []
  );
});

const dialog = reactive({
  visible: false,
  current: {},
});

watch(
  () => form.data.provider,
  (n) => {
    if (!form.data.id) {
      // 新增时, 切换应用类型, 清空公用字段的值
      form.data.page.baseUrl = '';
      form.data.apiClient.baseUrl = '';
      form.data.page.parameters = [];
      form.data.apiClient.parameters = [];
      form.data.apiClient.authConfig.oauth2.authorizationUrl = '';
      form.data.sso.configuration.oauth2.authorizationUrl = '';
      form.data.apiClient.authConfig.oauth2.clientId = '';
      form.data.sso.configuration.oauth2.clientId = '';
      form.data.apiClient.authConfig.oauth2.clientSecret = '';
      form.data.sso.configuration.oauth2.clientSecret = '';
      form.data.apiClient.headers = [];
      form.data.apiServer.roleIdList = [];
      form.data.apiServer.orgIdList = [];
      form.data.description = '';
      form.data.apiServer.redirectUri = '';
      form.data.sso.configuration.appSecret = '';

      // formRef.value?.resetFields();
    }
    emit('changeApplyType', n);
    if (routeQuery.id) return;
    if (
      [
        'wechat-webapp',
        'dingtalk-ent-app',
        'wechat-miniapp',
      ].includes(n)
    ) {
      form.data.integrationModes = ['ssoClient'];
      // form.integrationModesISO = ['ssoClient'];
    } else form.data.integrationModes = [];
  },
  {immediate: true},
);
watch(
  () => form.data.integrationModes,
  (n, o) => {
    o.forEach((key) => {
      if (!n.includes(key)) form.errorNumInfo[key].clear();
    });

    // form.integrationModesISO = [...n];
  },
);

function getInfo(id: string) {
  getAppInfo_api(id).then((resp: any) => {
    // 后端返回的headers和parameters中, key转为label
    if (resp.result.apiClient) {
      resp.result.apiClient.headers = resp.result.apiClient.headers?.map(
        (m: any) => ({
          ...m,
          label: m.key,
        }),
      );
      resp.result.apiClient.parameters =
        resp.result.apiClient.parameters?.map((m: any) => ({
          ...m,
          label: m.key,
        }));
    }
    if (resp.result.page) {
      resp.result.page.parameters = resp.result.page.parameters?.map(
        (m: any) => ({
          ...m,
          label: m.key,
        }),
      );
    }
    form.data = {
      ...initForm, // 查询详情, 赋值初始字段. 解决编辑改变接入方式报错的问题: bug#10892
      ...resp.result,
      integrationModes: resp.result.integrationModes?.map(
        (item: any) => item.value,
      ),
    } as formType;
    form.data.apiServer && (form.data.apiServer.appId = id);

    if (routeQuery.id) {
      typeOptions.value = typeOptions.value.filter((i: any) => {
        return i.value === form.data?.provider;
      });
    }
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

// 添加角色/组织
function clickAddItem(data: string[], target: string) {
  const tab: any = window.open(`${origin}/#/system/${target}?save=true`);
  tab.onTabSaveSuccess = (value: string) => {
    if (target === 'Role') {
      getRoleIdList();
    } else {
      getOrgIdList()
    }
    data.push(value)
  };
}

// 保存
function clickSave() {
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

    if (params.provider === 'internal-standalone') {
      // 只选择了API服务和单点登录 或者只选择了单点登录
      if (
        (params.integrationModes.includes('ssoClient') &&
          params.integrationModes.length === 1) ||
        (params.integrationModes.includes('ssoClient') &&
          params.integrationModes.includes('apiServer') &&
          params.integrationModes.length === 2)
      ) {
        return onlyMessage($t('components.EditForm.949962-90'), 'warning');
      }
    }

    //独立应用-api客户端 id?clientId:appId
    if (['internal-standalone', 'third-party'].includes(params.provider)) {
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
      params.apiClient.headers = params.apiClient.headers?.map(
        (m: any) => ({
          ...m,
          key: m.label,
        }),
      );
      params.apiClient.parameters = params.apiClient.parameters?.map(
        (m: any) => ({
          ...m,
          key: m.label,
        }),
      );
    }
    if (params.integrationModes.includes('page')) {
      params.page.parameters = params.page.parameters?.map((m: any) => ({
        ...m,
        key: m.label,
      }));
    }
    loading.value = true;
    const request = routeQuery.id
      ? updateApp_api(routeQuery.id as string, params)
      : addApp_api(params);
    request
      .then((resp: any) => {
        if (resp.status === 200) {
          const isPage = params.integrationModes.includes('page');
          if (routeQuery.id && isPage) {
            dialog.current = {
              ...params,
              id: routeQuery.id || resp.result.id,
            };
            dialog.visible = true;
          } else {
            onlyMessage($t('components.EditForm.949962-91'));
            menuStory.jumpPage('system/Apply', {});
          }
        }
      })
      .finally(() => {
        loading.value = false;
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

/**
 * 校验接入地址
 */
const validateBaseUrl = (_rule: Rule, value: string) => {
  if (value) {
    if (value === 'http://' || value === 'https://') {
      return Promise.reject($t('components.EditForm.949962-7'))
    }
    return Promise.resolve()
  } else {
    return Promise.reject($t('components.EditForm.949962-7'))
  }
}

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
