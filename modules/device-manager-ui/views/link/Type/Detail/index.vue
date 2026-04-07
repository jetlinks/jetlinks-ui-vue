<template>
  <j-page-container>
    <FullPage :fixed="false" style="padding: 24px">
      <div class="container">
        <a-form
          :model="formData"
          ref="formRef1"
          name="basic"
          autocomplete="off"
          layout="vertical"
        >
          <a-row :gutter="[24, 0]">
            <a-col :span="12">
              <a-form-item :label="$t('Detail.index.258513-0')" name="name" :rules="Rules.name">
                <a-input
                  v-model:value="formData.name"
                  :placeholder="$t('Detail.index.258513-1')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('Detail.index.258513-2')" name="type" :rules="Rules.type">
                <a-select
                  v-model:value="formData.type"
                  :options="typeOptions"
                  :placeholder="$t('Detail.index.258513-3')"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                  :disabled="typeDisabled || id !== ':id'"
                  @change="changeType"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="isNoCommunity">
              <a-form-item name="shareCluster" :rules="Rules.shareCluster">
                <template #label>
                  {{ $t('Detail.index.258513-4') }}
                  <a-tooltip
                    :title="$t('Detail.index.258513-5')"
                  >
                    <AIcon
                      type="QuestionCircleOutlined"
                      style="margin-left: 2px"
                    />
                  </a-tooltip>
                </template>
                <a-radio-group
                  v-model:value="formData.shareCluster"
                  button-style="solid"
                  @change="changeShareCluster(formData.shareCluster)"
                >
                  <a-radio-button
                    :value="true"
                    :disabled="formData.type === 'MQTT_CLIENT'"
                    >{{ $t('Detail.index.258513-6') }}</a-radio-button
                  >
                  <a-radio-button :value="false">{{ $t('Detail.index.258513-7') }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <div
            v-if="!shareCluster && dynamicValidateForm.cluster.length === 0"
            style="border: 1px #d9d9d9 solid; margin-bottom: 12px"
          >
            <j-empty style="margin-top: 12px" />
          </div>
          <a-form
            ref="formRef2"
            layout="vertical"
            name="dynamic_form_nest_item"
            :model="dynamicValidateForm"
            class="form2"
          >
            <div
              v-for="(cluster, index) in dynamicValidateForm.cluster"
              :key="cluster.id"
            >
              <a-collapse
                v-model:activeKey="activeKey"
                :class="[
                  !formData.shareCluster ? 'collapse' : 'collapse-panel',
                ]"
                :ghost="formData.shareCluster"
                collapsible="header"
              >
                <a-collapse-panel
                  :key="index + 1"
                  :show-arrow="!formData.shareCluster"
                >
                  <template #header v-if="!shareCluster">
                    <div class="collapse-header">
                      {{
                        cluster.serverId
                          ? cluster.serverId
                          : !formData.shareCluster
                          ? $t('Detail.index.258513-8', [index + 1])
                          : ""
                      }}
                    </div>
                  </template>
                  <template #extra v-if="!shareCluster">
                    <j-permission-button
                      danger
                      :popConfirm="{
                        title: $t('Detail.index.258513-9'),
                        onConfirm: () => removeCluster(cluster),
                      }"
                      >{{ $t('Detail.index.258513-10') }}</j-permission-button
                    >
                  </template>
                  <a-row :gutter="[24, 0]">
                    <a-col :span="12" v-if="!shareCluster">
                      <a-form-item
                        :name="['cluster', index, 'tagsFilter']"
                        :label="$t('Detail.index.258513-11')"
                        :rules="Rules.tagsFilter"
                      >
                        <!-- <a-select
                          v-model:value="cluster.serverId"
                          :options="clustersListIndex[index]"
                          :placeholder="$t('Detail.index.258513-12')"
                          allowClear
                          show-search
                          :filter-option="filterOption"
                          @change="changeServerId(cluster.serverId, index)"
                        >
                        </a-select> -->
                        <NodeSelect :tagList="tagList" :tagValueObj="tagValueObj" :value="cluster.tagsFilter" @change="(data) => handleChangeCluster(index, data)"/>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12" v-if="isVisible('host', formData.type)">
                      <a-form-item
                        :name="['cluster', index, 'configuration', 'host']"
                        :rules="Rules.host"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-13') }}
                          <a-tooltip
                            :title="$t('Detail.index.258513-14')"
                          >
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <!-- <a-select
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
                            </a-select> -->
                        <LocalAddressSelect
                          :clusterTagFilter="dynamicValidateForm.cluster[index].tagsFilter"
                          :clusters="configClustersList"
                          v-model:value="cluster.configuration.host"
                          :serverId="cluster.serverId"
                          :shareCluster="shareCluster"
                          @change="
                            (value) =>
                              changeHost(cluster.serverId, value, index)
                          "
                          @valueChange="
                            (value) =>
                              changeHost(cluster.serverId, value, index, true)
                          "
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12" v-if="isVisible('port', formData.type)">
                      <a-form-item
                        :name="['cluster', index, 'configuration', 'port']"
                        :rules="Rules.port"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-15') }}
                          <a-tooltip :title="$t('Detail.index.258513-16')">
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <a-select
                          v-model:value="cluster.configuration.port"
                          :options="portOptionsIndex[index]"
                          :placeholder="$t('Detail.index.258513-17')"
                          allowClear
                          show-search
                          :filter-option="filterPortOption"
                        >
                          <!-- <a-select-option
                                v-for="i in getPortList( portOptionsIndex[
                                      index
                                  ], cluster
                                      .configuration
                                      .port)"
                              :value="i.value"
                            >
                              {{ i.label }}
                            </a-select-option> -->
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('publicHost', formData.type)"
                    >
                      <a-form-item
                        :name="[
                          'cluster',
                          index,
                          'configuration',

                          'publicHost',
                        ]"
                        :rules="Rules.publicHost"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-18') }}
                          <a-tooltip
                            :title="$t('Detail.index.258513-19')"
                          >
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <a-input
                          v-model:value="cluster.configuration.publicHost"
                          :placeholder="$t('Detail.index.258513-20')"
                          allowClear
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('publicPort', formData.type)"
                    >
                      <a-form-item
                        :name="[
                          'cluster',
                          index,
                          'configuration',
                          'publicPort',
                        ]"
                        :rules="Rules.publicPort"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-21') }}
                          <a-tooltip :title="$t('Detail.index.258513-22')">
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <a-input-number
                          style="width: 100%"
                          :placeholder="$t('Detail.index.258513-23')"
                          v-model:value="cluster.configuration.publicPort"
                          :min="1"
                          :max="65535"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('remoteHost', formData.type)"
                    >
                      <a-form-item
                        :name="[
                          'cluster',
                          index,
                          'configuration',
                          'remoteHost',
                        ]"
                        :rules="Rules.remoteHost"
                        :label="$t('Detail.index.258513-24')"
                      >
                        <a-input
                          :placeholder="$t('Detail.index.258513-25')"
                          v-model:value="cluster.configuration.remoteHost"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('remotePort', formData.type)"
                    >
                      <a-form-item
                        :label="$t('Detail.index.258513-26')"
                        :name="[
                          'cluster',
                          index,
                          'configuration',
                          'remotePort',
                        ]"
                        :rules="Rules.remotePort"
                      >
                        <a-input-number
                          style="width: 100%"
                          :placeholder="$t('Detail.index.258513-27')"
                          v-model:value="cluster.configuration.remotePort"
                          :min="1"
                          :max="65535"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('clientId', formData.type)"
                    >
                      <a-form-item
                        label="clientId"
                        :name="['cluster', index, 'configuration', 'clientId']"
                        :rules="Rules.clientId"
                      >
                        <a-input
                          v-model:value="cluster.configuration.clientId"
                          :placeholder="$t('Detail.index.258513-28')"
                        />
                      </a-form-item>
                    </a-col>

                    <a-col
                      :span="12"
                      v-if="isVisible('username', formData.type)"
                    >
                      <a-form-item
                        :label="$t('Detail.index.258513-29')"
                        :name="['cluster', index, 'configuration', 'username']"
                        :rules="Rules.username"
                      >
                        <a-input
                          v-model:value="cluster.configuration.username"
                          :placeholder="$t('Detail.index.258513-30')"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('password', formData.type)"
                    >
                      <a-form-item
                        :label="$t('Detail.index.258513-31')"
                        :name="['cluster', index, 'configuration', 'password']"
                        :rules="Rules.password"
                      >
                        <a-input-password
                          v-model:value="cluster.configuration.password"
                          :placeholder="$t('Detail.index.258513-32')"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      :span="12"
                      v-if="isVisible('topicPrefix', formData.type)"
                    >
                      <a-form-item
                        :name="[
                          'cluster',
                          index,
                          'configuration',
                          'topicPrefix',
                        ]"
                        :rules="Rules.topicPrefix"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-33') }}
                          <a-tooltip
                            :title="$t('Detail.index.258513-34')"
                          >
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <a-input
                          v-model:value="cluster.configuration.topicPrefix"
                          :placeholder="$t('Detail.index.258513-35')"
                        />
                      </a-form-item>
                    </a-col>

                    <a-col
                      :span="12"
                      v-if="isVisible('maxMessageSize', formData.type)"
                    >
                      <a-form-item
                        :name="[
                          'cluster',
                          index,
                          'configuration',
                          'maxMessageSize',
                        ]"
                        :rules="Rules.maxMessageSize"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-36') }}
                          <a-tooltip
                            :title="$t('Detail.index.258513-37')"
                          >
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <a-input-number
                          style="width: 100%"
                          v-model:value="cluster.configuration.maxMessageSize"
                          :placeholder="$t('Detail.index.258513-38')"
                          :min="1024"
                          :max="1073741824"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="24">
                      <a-form-item
                        :label="
                          isVisible('secure', formData.type)
                            ? $t('Detail.index.258513-39')
                            : $t('Detail.index.258513-40')
                        "
                        :name="['cluster', index, 'configuration', 'secure']"
                        :rules="Rules.secure"
                        @change="
                          changeSecure(cluster.configuration.secure, index)
                        "
                      >
                        <a-radio-group
                          v-model:value="cluster.configuration.secure"
                        >
                          <a-radio :value="true">{{ $t('Detail.index.258513-41') }}</a-radio>
                          <a-radio :value="false">{{ $t('Detail.index.258513-42') }}</a-radio>
                        </a-radio-group>
                      </a-form-item>
                    </a-col>
                    <div class="form2-row">
                      <a-col :span="12" v-if="cluster.configuration.secure">
                        <a-form-item
                          :label="$t('Detail.index.258513-43')"
                          :name="['cluster', index, 'configuration', 'certId']"
                          :rules="Rules.certId"
                          class="form2-left"
                        >
                          <a-select
                            v-model:value="cluster.configuration.certId"
                            :options="certIdOptions"
                            :placeholder="$t('Detail.index.258513-44')"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12" v-if="cluster.configuration.secure">
                        <a-form-item
                          :label="$t('Detail.index.258513-45')"
                          :name="[
                            'cluster',
                            index,
                            'configuration',
                            'privateKeyAlias',
                          ]"
                          :rules="Rules.privateKeyAlias"
                          class="form2-right"
                        >
                          <a-input
                            v-model:value="
                              cluster.configuration.privateKeyAlias
                            "
                            :placeholder="$t('Detail.index.258513-46')"
                          />
                        </a-form-item>
                      </a-col>
                    </div>

                    <a-col
                      :span="24"
                      v-if="isVisible('parserType', formData.type)"
                    >
                      <a-form-item
                        :name="[
                          'cluster',
                          index,
                          'configuration',
                          'parserType',
                        ]"
                        :rules="Rules.parserType"
                      >
                        <template #label>
                          {{ $t('Detail.index.258513-47') }}
                          <a-tooltip :title="$t('Detail.index.258513-48')">
                            <AIcon
                              type="QuestionCircleOutlined"
                              style="margin-left: 2px"
                            />
                          </a-tooltip>
                        </template>
                        <a-select
                          style="width: 48.5%"
                          v-model:value="cluster.configuration.parserType"
                          :options="ParserTypeOptions"
                          :placeholder="$t('Detail.index.258513-49')"
                          allowClear
                          show-search
                          :filter-option="filterOption"
                          @change="
                            changeParserType(
                              cluster.configuration.parserType,
                              index
                            )
                          "
                        />
                      </a-form-item>
                    </a-col>
                    <div class="form2-row">
                      <a-col
                        :span="12"
                        v-if="
                          isVisible(
                            'delimited',
                            cluster.configuration.parserType
                          )
                        "
                      >
                        <a-form-item
                          :label="$t('Detail.index.258513-50')"
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
                          <a-input
                            v-model:value="
                              cluster.configuration.parserConfiguration
                                .delimited
                            "
                            :placeholder="$t('Detail.index.258513-51')"
                          />
                        </a-form-item>
                      </a-col>

                      <!-- <a-col
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
                  class="form2-left"
              >
                  <a-input
                      v-model:value="
                          cluster
                              .configuration
                              .parserConfiguration
                              .lang
                      "
                  />
              </a-form-item>
          </a-col> -->
                      <a-col
                        :span="24"
                        v-if="
                          isVisible('script', cluster.configuration.parserType)
                        "
                      >
                        <a-form-item
                          :label="$t('Detail.index.258513-52')"
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
                          <div style="width: 100%; height: 400px">
                            <monaco-editor
                              theme="vs"
                              v-model:modelValue="
                                cluster.configuration.parserConfiguration.script
                              "
                              language="javascript"
                              :init="editorInit"
                              :registrationTypescript="typescriptTip"
                            />
                          </div>
                        </a-form-item>
                      </a-col>

                      <a-col
                        :span="12"
                        v-if="
                          isVisible('size', cluster.configuration.parserType)
                        "
                      >
                        <a-form-item
                          :label="$t('Detail.index.258513-53')"
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
                          <a-input-number
                            style="width: 100%"
                            v-model:value="
                              cluster.configuration.parserConfiguration.size
                            "
                            :placeholder="$t('Detail.index.258513-54')"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :span="12"
                        v-if="
                          isVisible('length', cluster.configuration.parserType)
                        "
                      >
                        <a-form-item
                          :label="$t('Detail.index.258513-55')"
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
                          <a-select
                            style="width: 100%"
                            v-model:value="
                              cluster.configuration.parserConfiguration.length
                            "
                            :options="LengthOptions"
                            :placeholder="$t('Detail.index.258513-56')"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :span="12"
                        v-if="
                          isVisible('offset', cluster.configuration.parserType)
                        "
                      >
                        <a-form-item
                          :label="$t('Detail.index.258513-57')"
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
                          <a-input-number
                            style="width: 100%"
                            v-model:value="
                              cluster.configuration.parserConfiguration.offset
                            "
                            :placeholder="$t('Detail.index.258513-58')"
                            :min="0"
                            :max="65535"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col
                        :span="12"
                        v-if="
                          isVisible('little', cluster.configuration.parserType)
                        "
                      >
                        <a-form-item
                          :label="$t('Detail.index.258513-59')"
                          :name="[
                            'cluster',
                            index,
                            'configuration',
                            'parserConfiguration',
                            'little',
                          ]"
                          class="form2-left"
                        >
                          <a-select
                            style="width: 100%"
                            v-model:value="
                              cluster.configuration.parserConfiguration.little
                            "
                            :options="LittleOptions"
                            :placeholder="$t('Detail.index.258513-60')"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                          />
                        </a-form-item>
                      </a-col>
                    </div>
                  </a-row>
                </a-collapse-panel>
              </a-collapse>
            </div>
            <a-form-item v-if="!shareCluster">
              <a-button type="primary" block ghost @click="addCluster">
                <AIcon type="PlusOutlined" />
                {{ $t('Detail.index.258513-61') }}
              </a-button>
            </a-form-item>
          </a-form>

          <a-row :gutter="[24, 0]">
            <a-col :span="24">
              <a-form-item :label="$t('Detail.index.258513-62')" name="description">
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
      <div class="footer">
        <j-permission-button
          v-if="view === 'false'"
          type="primary"
          @click="saveData"
          :loading="loading"
          :hasPermission="`link/Type:${id !== ':id' ? 'update' : 'add'}`"
        >
          {{ $t('Detail.index.258513-63') }}
        </j-permission-button>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script lang="ts" setup name="AccessNetwork">
import { onlyMessage } from "@jetlinks-web/utils";
import type { FormInstance } from "ant-design-vue";
import {
  update,
  save,
  detail,
  resourcesCurrent,
  allResources,
  supports,
  certificates,
  start,
  resourceClusters,
  getTs,
} from "../../../../api/link/type";
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
} from "../data";
import { cloneDeep } from "lodash-es";
import type { TagsFilterType, FormData2Type, FormDataType } from "../type";
import LocalAddressSelect from "./LocalAddressSelect.vue";
import { isNoCommunity } from "@jetlinks-web-core/utils/utils";
import { useTypeStore } from "../../../../store/type";
import { storeToRefs } from "pinia";
import NodeSelect from "./NodeSelect.vue";
import { useI18n } from "vue-i18n";
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const route = useRoute();
const NetworkType = route.query.type as string;
const view = NetworkType ? "false" : (route.query.view as string);
const id = route.params.id as string;
const activeKey = ref(["1"]);
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
const tagList = ref<{label: string, value: string}[]>([]);
const tagValueObj = ref<Record<string, any>>({});

const typescriptTip = reactive({
  typescript: "",
});

const typeDisabled = computed(() => {
  if (route.query.type) {
    return !route.query.type.includes(',');
  }
  return false
})

const { onBack } = useTabSaveSuccessBack()

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
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    typeRoots: ["types"],
    lib: ["esnext"],
  });
};

const dynamicValidateForm = reactive<{ cluster: FormData2Type[] }>({
  cluster: [{ ...cloneDeep(FormStates2), id: "1", index: 1 }],
});

const handleChangeCluster = (index: number, data: TagsFilterType[]) => {
  dynamicValidateForm.cluster[index]!.tagsFilter = cloneDeep(data);
}

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
    index: dynamicValidateForm.cluster.length,
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
    _temp = "TCP";
  } else if (UDPList.includes(type)) {
    _temp = "UDP";
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
  const _port = filterConfigByType(cloneDeep(portOptions), type);

  if (shareCluster.value) {
    // 当shareCluster为true时，计算所有主机端口的交集
    if (_port && _port.length > 0) {
      // 获取第一个主机的端口作为基准
      let intersection = _port[0].ports || [];

      // 计算所有主机端口的交集
      for (let i = 1; i < _port.length; i++) {
        const currentPorts = _port[i].ports || [];
        intersection = intersection.filter((port: any) =>
          currentPorts.includes(port)
        );
      }

      portOptionsIndex.value[index] = intersection.map((p: any) => ({
        label: p,
        value: p,
      }));
    } else {
      portOptionsIndex.value[index] = [];
    }
  } else {
    // 当shareCluster为false时，使用原有逻辑
    const host = dynamicValidateForm.cluster[index].configuration.host;
    const _host = _port.find((item: any) => item.host === host);
    portOptionsIndex.value[index] = _host?.ports?.map((p: any) => ({
      label: p,
      value: p,
    }));
  }
};

const changeShareCluster = (value: boolean) => {
  shareCluster.value = value;
  activeKey.value = ["1"];
  dynamicValidateForm.cluster = [{ ...cloneDeep(FormStates2), id: "1", index: 1 }];
};

const changeType = (value: string) => {
  getResourcesCurrent();
  dynamicValidateForm.cluster = [{ ...cloneDeep(FormStates2), id: "1", index: 1 }];
  if (value !== "MQTT_CLIENT") {
    const { configuration } = dynamicValidateForm.cluster[0];
    value && (configuration.host = "0.0.0.0");
  } else if (isNoCommunity) {
    formData.value.shareCluster = false;
    changeShareCluster(formData.value.shareCluster);
  }
  if (value === "TCP_SERVER") {
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
        (item: any) => !filters.includes(item.clusterNodeId)
      )
    : configClustersList.value?.filter(
        (item: any) => !filters.includes(item.id)
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
  flag?: boolean
) => {
  if (dynamicValidateForm.cluster?.[index]) {
    const { configuration } = dynamicValidateForm.cluster?.[index];
    const _serverId = !shareCluster.value ? configClustersList.value.find(item => {
      if(dynamicValidateForm.cluster?.[index]?.tagsFilter) {
        for(let tag of dynamicValidateForm.cluster?.[index]?.tagsFilter) {
          if(item.tags[tag.column] === tag.value) {
            return true
          }
        }
      }
    })?.id : undefined
    if (!flag) {
      configuration.port = undefined;
    }
    const checked = resourcesClusters.value?.[_serverId || ""];
    if (checked) {
      getPortOptions(checked, index);
    }
  }
};

const changeParserType = (value: string | undefined, index: number) => {
  const configuration: any = dynamicValidateForm.cluster[index].configuration;
  configuration.parserConfiguration = cloneDeep(ParserConfiguration);
  value === "SCRIPT"
    ? (configuration.parserConfiguration.lang = "javascript")
    : "";
};
const changeSecure = (value: string | undefined, index: number) => {
  if (!value) {
    const configuration: any = dynamicValidateForm.cluster[index].configuration;
    configuration.certId = undefined;
    configuration.privateKeyAlias = "";
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
    return onlyMessage($t('Detail.index.258513-64'), "error");
  }

  const { configuration } = formRef2Data?.cluster[0];
  const params = shareCluster.value
    ? { ...formData.value, configuration }
    : { ...formData.value, ...dynamicValidateForm };

  loading.value = true;
  const resp: any =
    id === ":id"
      ? await save(params).catch(() => {})
      : await update({ ...params, id }).catch(() => {});
  loading.value = false;
  if (resp?.status === 200) {
    onlyMessage($t('Detail.index.258513-65'), "success");
    history.back();
    onBack(resp, {
      onBefore: () => {
        return start(resp.result?.id).then(() => true).catch(() => false);
      }
    })
    const sourceId = route.query?.sourceId as string;
    if ((window as any).onTabSaveSuccess && sourceId) {
      if (resp.result?.id) {
        start(resp.result?.id).then(() => {
          (window as any).onTabSaveSuccess(sourceId, resp);
          setTimeout(() => window.close(), 300);
        });
      }
    }
  }
};

const getSupports = async () => {
  const res: any = await supports();
  if (res.status === 200) {
    const queryTypeArr = route.query.type?.includes(',') && route.query.type.split(',')
    typeOptions.value = res.result.filter(item => {
      console.log(queryTypeArr)
      if (queryTypeArr) {
        return queryTypeArr.includes(item.id);
      }
      return true
    }).map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    if (
      !typeOptions.value.every((item: any) => item.value === "UDP") &&
      !NetworkType &&
      id === ':id'
    ) {
      formData.value.type = typeOptions.value[0].value;
    }
  }
};

const getCertificates = async () => {
  const resp: any = await certificates({
    paging: false,
    sorts: [
      { name: 'createTime', order: 'desc' }
    ]
  });
  if (resp.success) {
    certIdOptions.value = resp.result.map((i: any) => ({
      value: i.id,
      label: i.name,
    }));
  }
};

const getResourcesCurrent =async () => {
  allResources().then((resp: any) => {
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
      configClustersList.value.forEach(item => {
        for(let key in item.tags) {
          if(tagList.value.findIndex(val => val.value === key) === -1) {
            tagList.value.push({
              label: key,
              value: key
            })
          }
          if(!tagValueObj.value[key]) {
            tagValueObj.value[key] = [{value: item.tags[key]}];
          } else if(tagValueObj.value[key]?.findIndex(val => val.value === item.tags[key]) === -1) {
            tagValueObj.value[key]?.push({
              value: item.tags[key]
            })
          }
        }
      })
    }
  });
};

const getDetail = () => {
  if (id !== ":id") {
    loading.value = true;
    detail(id).then((resp) => {
      if (resp.status === 200) {
        const result: any = resp.result;
        const { configuration, cluster } = result;
        formData.value = { ...result };
        shareCluster.value = result.shareCluster;
        activeKey.value = ["1"];
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
          dynamicValidateForm.cluster[0].id = "1";
        }
      }
    });
    loading.value = false;
  }
};

watch(
  () => formData.value.shareCluster,
  (value) => {
    const { cluster } = dynamicValidateForm;
    if (cluster) {
      value && (cluster[0].configuration.host = "0.0.0.0");
      updateClustersListIndex();
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => shareCluster.value,
  (value) => {
    formData.value.shareCluster = value;
    value ? getPortOptions(configRef.value) : (portOptionsIndex.value[0] = []);
    updateClustersListIndex();
  },
  { deep: true, immediate: true }
);

watch(
  () => dynamicValidateForm.cluster?.length,
  () => {
    updateClustersListIndex();
  },
  { deep: true, immediate: true }
);

watch(
  () => NetworkType,
  (value) => {
    let _value = value
    if (value && value.includes(',')) {
      const arr = value.split(',');
      _value = arr[0]
    }
    if (_value) {
      const { cluster } = dynamicValidateForm;
      formData.value.type = _value;
      cluster[0].configuration.host = "0.0.0.0";
      if (_value === "MQTT_CLIENT" && isNoCommunity) {
        formData.value.shareCluster = false;
        changeShareCluster(formData.value.shareCluster);
      }
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  getSupports();
  getCertificates();

  if (isNoCommunity) {
    getResourcesClusters();
  }
  await getResourcesCurrent();
  if (id !== ":id") {
    getDetail();
  }
  // else {
  // getResourcesCurrent();
  // }
});
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
      content: " ";
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
