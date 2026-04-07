<!-- 通知配置 -->
<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="notice-config"
      @search="handleSearch"
    />
    <FullPage>
      <div style="height: 100%;padding-bottom: 10px;">
        <JProTable
          ref="configRef"
          :columns="columns"
          modeValue="CARD"
          :request="ConfigApi.list"
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
          }"
          :params="params"
          :gridColumns="[2, 2, 3]"
        >
          <template #headerLeftRender>
            <a-space>
              <j-permission-button
                type="primary"
                @click="handleAdd"
                hasPermission="notice/Config:add"
              >
                {{ $t('Config.index.133246-0') }}
              </j-permission-button>
              <a-upload
                name="file"
                accept=".json"
                :showUploadList="false"
                :before-upload="beforeUpload"
                :disabled="!hasPerm"
              >
                <j-permission-button hasPermission="notice/Config:import">
                  {{ $t('Config.index.133246-1') }}
                </j-permission-button>
              </a-upload>
              <j-permission-button
                :popConfirm="{
                  title: $t('Config.index.133246-2'),
                  onConfirm: handleExport,
                }"
                hasPermission="notice/Config:export"
              >
                {{ $t('Config.index.133246-3') }}
              </j-permission-button>
            </a-space>
          </template>
          <template #card="slotProps">
            <CardBox
              :showStatus="false"
              :statusNames="{}"
              :value="slotProps"
              :actions="getActions(slotProps, 'card')"
            >
              <template #img>
                <slot name="img">
                  <img
                    :src="getLogo(slotProps.type, slotProps.provider)"
                    class="logo"
                  />
                </slot>
              </template>
              <template #content>
                <h3 class="card-item-content-title">
                  {{ slotProps.name }}
                </h3>
                <a-row>
                  <a-col :span="12">
                    <div class="card-item-content-text">{{ $t('Config.index.133246-4') }}</div>
                    <div>
                      {{ getMethodTxt(slotProps.type) }}
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="card-item-content-text">{{ $t('Config.index.133246-5') }}</div>
                    <j-ellipsis>
                      {{ slotProps.description || '--' }}
                    </j-ellipsis>
                  </a-col>
                </a-row>
              </template>
              <template #actions="item">
                <a-tooltip
                  v-bind="item.tooltip"
                  :title="item.disabled && item.tooltip.title"
                >
                  <a-dropdown
                    placement="bottomRight"
                    v-if="item.key === 'others'"
                  >
                    <a-button>
                      <AIcon :type="item.icon" />
                      <span>{{ item.text }}</span>
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-for="(o, i) in item.children" :key="i">
                          <j-permission-button
                            type="link"
                            @click="o.onClick"
                            :hasPermission="`notice/Config:${o.key}`"
                          >
                            <template #icon>
                              <AIcon :type="o.icon" />
                            </template>
                            <span>{{ o.text }}</span>
                          </j-permission-button>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                  <j-permission-button
                    v-else-if="item.key === 'delete'"
                    :popConfirm="item.popConfirm"
                    :disabled="item.disabled"
                    :hasPermission="`notice/Config:${item.key}`"
                  >
                    <template #icon>
                      <AIcon type="DeleteOutlined" />
                    </template>
                  </j-permission-button>
                  <template v-else>
                    <j-permission-button
                      :disabled="item.disabled"
                      @click="item.onClick"
                      :hasPermission="`notice/Config:${item.key}`"
                    >
                      <template #icon>
                        <AIcon :type="item.icon" />
                      </template>
                      <span>{{ item.text }}</span>
                    </j-permission-button>
                  </template>
                </a-tooltip>
              </template>
            </CardBox>
          </template>
          <template #type="slotProps">
            <span> {{ getMethodTxt(slotProps.type) }}</span>
          </template>
          <template #provider="slotProps">
            <span>
              {{ getProviderTxt(slotProps.type, slotProps.provider) }}
            </span>
          </template>
          <template #description="slotProps">
            <j-ellipsis>
              {{ slotProps.description || '--' }}
            </j-ellipsis>
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                <j-permission-button
                  :danger="i.key === 'delete'"
                  :disabled="i.disabled"
                  :popConfirm="i.popConfirm"
                  :tooltip="{
                    ...i.tooltip,
                  }"
                  @click="i.onClick"
                  type="link"
                  style="padding: 0px"
                  :hasPermission="'notice/Config:' + i.key"
                >
                  <template #icon><AIcon :type="i.icon" /></template>
                </j-permission-button>
              </template>
            </a-space>
          </template>
        </JProTable>
      </div>
    </FullPage>

    <Debug v-model:visible="debugVis" :data="currentConfig" />
    <Log v-if="logVis" :data="currentConfig" @cancel="logVis = false" />
    <SyncUser v-if="syncVis" :data="currentConfig" @cancel="syncVis = false" />
  </j-page-container>
</template>

<script setup lang="ts">
import ConfigApi from "../../api/config";
import { NOTICE_METHOD, MSG_TYPE } from "../const";
import SyncUser from "./SyncUser/index.vue";
import Debug from "./Debug/index.vue";
import Log from "./Log/index.vue";
import { isNoCommunity } from '@jetlinks-web-core/utils/utils';
import { downloadObject } from "../../utils/utils";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { onlyMessage } from "@jetlinks-web/utils";
import { usePermission } from '@jetlinks-web/hooks'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const menuStory = useMenuStore();

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
  providerList = [...providerList, ...MSG_TYPE[key]];
});

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const { hasPerm } = usePermission(
  ref(`notice/Config:import`),
)

const columns = [
  {
    title: $t('Config.index.133246-6'),
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    search: {
      type: "string",
    },
  },
  {
    title: $t('Config.index.133246-4'),
    dataIndex: "type",
    key: "type",
    scopedSlots: true,
    width: 100,
    search: {
      type: "select",
      options: NOTICE_METHOD,
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Config.index.133246-7'),
    dataIndex: "provider",
    key: "provider",
    scopedSlots: true,
    width: 200,
    search: {
      type: "select",
      options: providerList,
      handleValue: (v: any) => {
        return v;
      },
    },
  },
  {
    title: $t('Config.index.133246-5'),
    dataIndex: "description",
    key: "description",
    scopedSlots: true,
    ellipsis: true,
    search: {
      type: "string",
    },
  },
  {
    title: $t('Config.index.133246-8'),
    key: "action",
    fixed: "right",
    width: 300,
    scopedSlots: true,
  },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
  params.value = e;
};

/**
 * 根据通知方式展示对应logo
 */
const getLogo = (type: string, provider: string) => {
  return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};
/**
 * 通知方式字段展示对应文字
 */
const getMethodTxt = (type: string) => {
  return NOTICE_METHOD.find((f) => f.value === type)?.label;
};
/**
 * 根据类型展示对应文案
 * @param type
 * @param provider
 */
const getProviderTxt = (type: string, provider: string) => {
  return MSG_TYPE[type].find((f: any) => f.value === provider)?.label;
};

/**
 * 新增
 */
const handleAdd = () => {
  menuStory.jumpPage("notice/Config/Detail", { params: { id: ":id" } });
};

/**
 * 导入
 */
const beforeUpload = (file: any) => {
  console.log("file: ", file);
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = async (result) => {
    const text = result.target?.result;
    console.log("text: ", text);
    if (!file.type.includes("json")) {
      onlyMessage($t('Config.index.133246-9'), "error");
      return false;
    }
    try {
      const data = JSON.parse(text || "{}");
      const { success } = await ConfigApi.update(data);
      if (success) {
        onlyMessage($t('Config.index.133246-10'));
        configRef.value.reload();
      }
      return true;
    } catch {
      // onlyMessage($t('Config.index.133246-9'), 'error');
    }
    return true;
  };
  return false;
};

/**
 * 导出
 */
const handleExport = () => {
  downloadObject(configRef.value.dataSource, $t('Config.index.133246-11'));
};

const syncVis = ref(false);
const debugVis = ref(false);
const logVis = ref(false);
const currentConfig = ref<Partial<Record<string, any>>>();
const getActions = (
  data: Partial<Record<string, any>>,
  type: "card" | "table"
): any[] => {
  if (!data) return [];
  const actions = [
    {
      key: "update",
      text: $t('Config.index.133246-12'),
      tooltip: {
        title: $t('Config.index.133246-12'),
      },
      icon: "EditOutlined",
      onClick: () => {
        menuStory.jumpPage("notice/Config/Detail", {
          params: {
            id: data.id,
          },
        });
      },
    },
    {
      key: "debug",
      text: $t('Config.index.133246-13'),
      tooltip: {
        title: $t('Config.index.133246-13'),
      },
      icon: "BugOutlined",
      onClick: () => {
        debugVis.value = true;
        currentConfig.value = data;
      },
    },
    {
      key: "delete",
      text: $t('Config.index.133246-14'),
      popConfirm: {
        title: $t('Config.index.133246-15'),
        onConfirm: async () => {
          const resp = await ConfigApi.del(data.id);
          if (resp.status === 200) {
            onlyMessage($t('Config.index.133246-16'));
            configRef.value?.reload();
          } else {
            onlyMessage(resp.message || $t('Config.index.133246-17'), "error");
          }
          return;
        },
      },
      icon: "DeleteOutlined",
    },
  ];

  const others: any = {
    key: "others",
    text: $t('Config.index.133246-18'),
    icon: "EllipsisOutlined",
    children: [
      {
        key: "export",
        text: $t('Config.index.133246-3'),
        tooltip: {
          title: $t('Config.index.133246-3'),
        },
        icon: "ArrowDownOutlined",
        onClick: () => {
          downloadObject(data, `${data.name}`);
        },
      },
      // {
      //   key: "bind",
      //   text: $t('Config.index.133246-20'),
      //   tooltip: {
      //     title: $t('Config.index.133246-20'),
      //   },
      //   icon: "TeamOutlined",
      //   onClick: () => {
      //     syncVis.value = true;
      //     currentConfig.value = data;
      //   },
      // },
      {
        key: "log",
        text: $t('Config.index.133246-19'),
        tooltip: {
          title: $t('Config.index.133246-19'),
        },
        icon: "BarsOutlined",
        onClick: () => {
          logVis.value = true;
          currentConfig.value = data;
        },
      },
    ],
  };
  if(isNoCommunity){
    others.children?.push({
      key: 'bind',
      text: $t('Config.index.133246-20'),
      tooltip: {
        title: $t('Config.index.133246-20'),
      },
      icon: 'TeamOutlined',
      onClick: () => {
        syncVis.value = true;
        currentConfig.value = data;
      },
    })
  }
  if (
    data.provider !== 'dingTalkMessage' &&
    data.provider !== 'corpMessage'
  ) {
    others.children = others.children?.filter(item => item.key !== 'bind')
  }


  if (type === 'card') {
    actions.splice(actions.length - 1, 0, others);
  } else {
    actions.splice(actions.length - 1, 0, ...others.children);
  }
  return actions;
};
</script>
<style lang="less" scoped>
.logo {
  width: 88px;
  height: 88px;
}
</style>
