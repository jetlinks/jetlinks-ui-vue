<template>
  <j-page-container>
    <pro-search :columns="columns" target="scene" @search="handleSearch" />
    <FullPage>
      <JProTable
        ref="sceneRef"
        :columns="columns"
        :gridColumn="3"
        :gridColumns="[1, 2, 3]"
        :request="query"
        modeValue="CARD"
        :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
        :params="params"
      >
        <template #headerLeftRender>
          <a-space>
            <j-permission-button
              type="primary"
              @click="handleAdd"
              :hasPermission="`${permissionKey}:add`"
            >
              <template #icon><AIcon type="PlusOutlined" /></template>
              {{ $t('Scene.index.895630-0') }}
            </j-permission-button>
            <j-permission-button
              @click="handleImport"
              :hasPermission="`${permissionKey}:add`"
            >
              <template #icon><AIcon type="ImportOutlined" /></template>
              导入
            </j-permission-button>
          </a-space>
        </template>
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            @click="handleView(slotProps.id, slotProps.triggerType)"
            :actions="getActions(slotProps, 'card')"
            :status="slotProps.state?.value"
            :statusText="slotProps.state?.text"
            :statusNames="{
              started: 'processing',
              disable: 'error',
            }"
          >
            <template #type>
              <span
                ><img
                  :height="16"
                  :src="typeMap[slotProps.triggerType]?.icon"
                  style="margin-right: 5px"
                />{{ slotProps.trigger?.typeName }}</span
              >
            </template>
            <template #img>
              <img :src="typeMap[slotProps.triggerType]?.img" />
            </template>
            <template #content>
              <j-ellipsis style="width: calc(100% - 100px)">
                <span style="font-size: 16px; font-weight: 600">
                  {{ slotProps.name }}
                </span>
              </j-ellipsis>
              <div class="subTitle">
                <span class="subTitle-title"> {{ $t('Scene.index.895630-1') }} </span>
                <span class="subTitle-content" :style="{textIndent: locale.includes('zh') ? '38px' : '60px'}">
                  <j-ellipsis :lineClamp="2">
                    {{
                      slotProps?.description
                        ? slotProps?.description
                        : typeMap[slotProps.triggerType]?.tip
                    }}
                  </j-ellipsis>
                </span>
              </div>
            </template>
            <template #actions="item">
              <j-permission-button
                :disabled="item.disabled"
                :popConfirm="item.popConfirm"
                :tooltip="{
                  ...item.tooltip,
                }"
                @click="item.onClick"
                :hasPermission="(item.key === 'view' || item.hasPermission) || permissionKey +':' + item.key"
              >
                <AIcon type="DeleteOutlined" v-if="item.key === 'delete'" />
                <template v-else>
                  <AIcon :type="item.icon" />
                  <span>{{ item?.text }}</span>
                </template>
              </j-permission-button>
            </template>
          </CardBox>
        </template>
        <template #triggerType="slotProps">
          {{ slotProps.trigger?.typeName }}
        </template>
        <template #state="slotProps">
          <JBadgeStatus
            :status="slotProps.state?.value"
            :text="slotProps.state?.text"
            :statusNames="{
              started: 'processing',
              disable: 'error',
            }"
          />
        </template>
        <template #action="slotProps">
          <a-space :size="16">
            <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip,
                }"
                @click="i.onClick"
                type="link"
                :danger="i.key === 'delete'"
                style="padding: 0 5px"
                :hasPermission="
                  (i.key === 'view' || i.hasPermission) ? true : permissionKey + ':' + i.key
                "
              >
                <template #icon><AIcon :type="i.icon" /></template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </JProTable>
    </FullPage>
    <SaveModal v-if="visible" @close="visible = false" :data="current" :typeOptions="typeOptions" />
    <ImportModal v-if="importVisible" @close="importVisible = false" @save="importSuccess"/>
  </j-page-container>
</template>

<script setup lang="ts" name="Scene">
import SaveModal from "./Save/save.vue";
import ImportModal from "./Import/index.vue";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import {query, _delete, _action, _execute, queryType, queryAlarmPage} from "../../api/scene";
import { onlyMessage } from "@jetlinks-web/utils";
import { Modal } from "ant-design-vue";
import { sceneImages } from "../../assets/index";
import { useI18n } from 'vue-i18n'
import {useRequest} from "@jetlinks-web/hooks";
import { useScenePermission } from '@rule-engine-manager-ui/hook/usePermission'
import { mergeObjectArrays } from '@jetlinks-web-core/utils'
import { omit } from 'lodash-es';

const images = {
  timer: 'icon-shijian2',
  manual: 'icon-shoudongchufa',
  device: 'icon-shebeixinxi',
  collector: 'icon-caijiqichufa'
}

const { t: $t, locale } = useI18n()
const menuStory = useMenuStore();
const permissionKey = useScenePermission()
const savePageCode = inject('save-page-code', 'rule-engine/Scene/Save')
const importVisible = ref(false)

const typeMap = ref({
  manual: {
    img: sceneImages.TriggerListIconHand,
    icon: sceneImages.TriggerHeaderIconManual,
  },
  timer: {
    img: sceneImages.TriggerListIconTimer,
    icon: sceneImages.TriggerHeaderIconTiming,
  },
  device: {
    img: sceneImages.TriggerListIconDevice,
    icon: sceneImages.TriggerHeaderIconDevice,
  },
  ai: {
    img: sceneImages.TriggerListIconDevice,
    icon: sceneImages.TriggerHeaderIconDevice,
  },
  collector: {
    img: sceneImages.TriggerListIconDevice,
    icon: sceneImages.TriggerHeaderIconDevice,
  }
})
const { data: typeOptions } = useRequest(queryType, {
  onSuccess(resp) {

    return resp.result.map(item => {
      const obj = { label: item.name, value: item.provider, tip: item.description, image: images[item.provider] }
      typeMap.value[item.provider] = Object.assign(typeMap.value[item.provider] || {}, obj)
      return obj
    })
  }
})
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const statusMap = new Map();
statusMap.set("started", "success");
statusMap.set("disable", "error");

const params = ref<Record<string, any>>({});
const sceneRef = ref();

const columns = ref([
  {
    dataIndex: "name",
    fixed: "left",
    ellipsis: true,
    width: 300,
    title: $t('Scene.index.895630-8'),
    search: {
      type: "string",
    },
  },
  {
    dataIndex: "triggerType",
    title: $t('Scene.index.895630-9'),
    scopedSlots: true,
    search: {
      type: "select",
      options: typeOptions
    },
  },
  {
    dataIndex: "state",
    title: $t('Scene.index.895630-10'),
    scopedSlots: true,
    search: {
      type: "select",
      options: [
        { label: $t('Scene.index.895630-11'), value: "started" },
        { label: $t('Scene.index.895630-12'), value: "disable" },
      ],
    },
  },
  {
    dataIndex: "description",
    title: $t('Scene.index.895630-13'),
    ellipsis: true,
    search: {
      type: "string",
    },
    scopedSlots: true,
  },
  {
    title: $t('Scene.index.895630-14'),
    key: "action",
    fixed: "right",
    width: 250,
    scopedSlots: true,
  },
]);

const deleteScene = async (id: string) => {
  const resp = await _delete(id);
  if (resp.status === 200) {
    onlyMessage($t('Scene.index.895630-15'));
    sceneRef.value?.reload();
  } else {
    onlyMessage($t('Scene.index.895630-16'), "error");
  }
};

const deleteModal = (id: string) => {
  Modal.confirm({
    title: $t('Scene.index.895630-17'),
    onOk: async () => {
      await deleteScene(id);
    },
  });
};

const getActions = (
  data: Partial<Record<string, any>>,
  type: "card" | "table"
): any[] => {
  if (!data) return [];

  const parentGetActions = inject('getActions', (_d: any) => []);

  const parentActions = parentGetActions(data)

  let actions: any[] = [
    {
      key: "update",
      text: $t('Scene.index.895630-18'),
      tooltip: {
        title: $t('Scene.index.895630-18'),
      },
      icon: "EditOutlined",
      onClick: () => {
        visible.value = true;
        current.value = data;
      },
    },
    {
      key: "action",
      text: data.state?.value !== "disable" ? $t('Scene.index.895630-12') : $t('Scene.index.895630-19'),
      tooltip: {
        title: !(!!data.triggerType && (data.branches || [])?.length)
          ? $t('Scene.index.895630-20')
          : data.state?.value !== "disable"
          ? $t('Scene.index.895630-12')
          : $t('Scene.index.895630-19'),
      },
      disabled: !(!!data?.triggerType && (data?.branches || [])?.length),
      icon:
        data.state.value !== "disable" ? "StopOutlined" : "CheckCircleOutlined",
      popConfirm: {
        title: `确认${data.state.value !== "disable" ? $t('Scene.index.895630-12') : $t('Scene.index.895630-19')}?`,
        onConfirm: async () => {
          let response = undefined;
          if (data.state.value !== "disable") {
            response = await _action(data.id, "_disable");
          } else {
            response = await _action(data.id, "_enable");
          }
          if (response && response.status === 200) {
            onlyMessage($t('Scene.index.895630-15'));
            sceneRef.value?.reload();
          } else {
            onlyMessage($t('Scene.index.895630-16'), "error");
          }
        },
      },
    },
    {
      key: 'add',
      text: '导出为模版',
      icon: 'ExportOutlined',
      tooltip: {
        title: '导出为模版',
      },
      onClick: () => {
        // json导出为文件
        const _data = omit(data, ['id', 'createTime', 'creatorId', 'creatorName', 'modifierId', 'modifyTime', 'modifierName'])
        const json = JSON.stringify(_data);
        const blob = new Blob([json], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${data.name}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
      },
    },
    {
      key: "delete",
      text: $t('Scene.index.895630-22'),
      disabled: data.state?.value !== "disable",
      tooltip: {
        title:
          data.state.value !== "disable" ? $t('Scene.index.895630-23') : $t('Scene.index.895630-22'),
      },
      onClick: async () => {
        const resp = await queryAlarmPage({
          pageSize: 10,
          pageIndex: 0,
          terms: [
            {
              column: "id$rule-bind-alarm",
              value: `${data.id}`
            },
          ],
        });

        const bindAlarm = resp.success && resp.result?.total

        const title = bindAlarm ? $t('Scene.index.895630-17') : $t('Scene.index.895630-24');
        Modal.confirm({
          title: title,
          onOk: async () => {
            await deleteScene(data.id);
          },
        });
      },
      icon: "DeleteOutlined",
    },
  ];
  if (data.triggerType === "manual") {
    const _item: any = {
      key: "tigger",
      text: $t('Scene.index.895630-2'),
      disabled: data.state?.value === "disable",
      tooltip: {
        title:
          data.state.value !== "disable" ? $t('Scene.index.895630-2') : $t('Scene.index.895630-25'),
      },
      icon: "LikeOutlined",
      popConfirm: {
        title: $t('Scene.index.895630-26'),
        onConfirm: async () => {
          const resp = await _execute(data.id);
          if (resp.status === 200) {
            onlyMessage($t('Scene.index.895630-15'));
            sceneRef.value?.reload();
          } else {
            onlyMessage($t('Scene.index.895630-16'), "error");
          }
        },
      },
    };
    actions.splice(1, 0, _item);
  }
  if (type === "table") {
    actions.splice(0, 0, {
      key: "view",
      text: $t('Scene.index.895630-27'),
      tooltip: {
        title: $t('Scene.index.895630-27'),
      },
      icon: "EyeOutlined",
      onClick: () => {
        handleView(data.id, data.triggerType);
      },
    });
  }

  if (parentActions && parentActions.length > 0) {
    actions = mergeObjectArrays(actions, parentActions);
  }

  return actions;
};

const handleSearch = (_params: any) => {
  params.value = _params;
};

const handleAdd = () => {
  visible.value = true;
  current.value = {};
};

const handleImport = () => {
  importVisible.value = true
}

const importSuccess = (data: any) => {
  importVisible.value = false
  sceneRef.value?.reload()
}

/**
 * 编辑
 * @param id
 * @param triggerType 触发类型
 */
const handleEdit = (id: string, triggerType: string) => {
  menuStory.jumpPage(savePageCode, {
    query: { triggerType: triggerType, id, type: "edit" },
  });
};

/**
 * 查看
 * @param id
 * @param triggerType 触发类型
 */
const handleView = (id: string, triggerType: string) => {
  menuStory.jumpPage(savePageCode, {
    query: { triggerType: triggerType, id, type: "view" },
  });
};
</script>

<style scoped lang="less">
.subTitle {
  position: relative;
  margin-top: 18px;
  display: inline-block;
  height: 50px;

  .subTitle-title {
    position: absolute;
    top: 0;
    left: 0;
  }

  .subTitle-content {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    text-indent: 38px;
  }
}
</style>
