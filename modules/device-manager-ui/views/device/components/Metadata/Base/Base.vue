<template>
  <div class="metadata-base">
    <EditTable
      v-if="!heavyLoad"
      ref="tableRef"
      :data-source="dataSource"
      :columns="columns"
      :height="560"
      :disableMenu="!hasOperate('add', type)"
      :openGroup="type === 'properties'"
      :scroll="{ x: 'max-content' }"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
      }"
      :readonly="hasOperate('add', type)"
      :target="_target"
      @scrollDown="scrollDown"
      @rightMenuClick="rightMenuClick"
      @groupEdit="groupEdit"
      @groupDelete="groupDelete"
    >
      <template #extra="{ isFullscreen, fullScreenToggle }">
        <div class="extra-header">
          <div class="extra-left">
            <a-space>
              <Import
                v-if="type === 'properties'"
                :target="target"
                :metadata="dataSource"
                @ok="importMetadata"
                :permission="permission"
                :disabled="hasOperate('add', type)"
              />
              <span v-if="searchData.show">
                {{ $t("Base.Base.640395-0") }}
                <span style="color: #ff7875">{{ searchData.len }}</span>
                {{ $t("Base.Base.640395-1") }}
              </span>
            </a-space>
          </div>
          <div class="extra-center">
            <div v-if="copyDetail.index" class="extra-copy-tip">
              <div class="extra-copy-tip-context">
                <span> {{ $t("Base.Base.640395-2") }} </span>
                <template v-if="type === 'properties'">
                  <j-ellipsis style="max-width: 120px">
                    {{ copyDetail.groupName }}
                  </j-ellipsis>
                  <span>,</span>
                </template>
                <span>
                  {{ $t("Base.Base.640395-3", [copyDetail.index]) }}
                </span>
              </div>
              <div></div>
              <div class="extra-copy-tip-icon" @click="copyDetail.index = 0">
                <AIcon type="CloseOutlined" />
              </div>
            </div>
          </div>
          <div class="extra-right">
            <a-button @click="() => fullToggle(isFullscreen, fullScreenToggle)">
              <template #icon>
                <AIcon
                  :type="
                    isFullscreen
                      ? 'FullscreenExitOutlined'
                      : 'FullscreenOutlined'
                  "
                />
              </template>
            </a-button>

            <j-permission-button
              type="primary"
              key="update"
              placement="topRight"
              :hasPermission="`${permission}:update`"
              :loading="loading"
              :disabled="hasOperate('add', type)"
              :tooltip="{
                title: hasOperate('add', type)
                  ? $t('Base.Base.640395-5')
                  : $t('Base.Base.640395-6'),
                placement: hasOperate('add', type) ? 'topRight' : 'top',
                getPopupContainer: getPopupContainer,
              }"
              @click="handleSaveClick()"
            >
              {{ $t("Base.Base.640395-6") }}
            </j-permission-button>
          </div>
        </div>
      </template>
      <template #bodyExtra v-if="hasOperate('add', type)">
        <div class="noEdit-tip">
          <div>
            {{ $t("Base.Base.640395-7") }}
          </div>
          <div style="pointer-events: auto">
            <a-button
              type="link"
              @click="jumpProduct"
              style="font-size: 20px"
              >{{ $t("Base.Base.640395-8") }}</a-button
            >
          </div>
        </div>
      </template>
      <template #id="{ record, index }">
        <EditTableFormItem :name="[index, 'id']" @change="metadataChange">
          <a-input
            v-model:value="record.id"
            :placeholder="$t('Base.Base.640395-9')"
            :disabled="record.expands?.isProduct"
          />
        </EditTableFormItem>
      </template>
      <template #name="{ record, index }">
        <EditTableFormItem :name="[index, 'name']" @change="metadataChange">
          <a-input
            v-model:value="record.name"
            :placeholder="$t('Base.Base.640395-10')"
            :disabled="record.expands?.isProduct"
          />
        </EditTableFormItem>
      </template>
      <template #valueType="{ record, index }">
        <EditTableFormItem
          :name="[index, 'valueType']"
          @change="metadataChange"
        >
          <div
            style="display: flex; align-items: center"
            v-if="['properties', 'tags'].includes(type)"
          >
            <TypeSelect
              v-model:value="record.valueType"
              style="flex: 1 1 0; min-width: 0"
              :disabled="record.expands?.isProduct"
              @valueChange="onTypeChange(index)"
            />
            <IntegerParams
              v-if="['int', 'long'].includes(record.valueType.type)"
              v-model:value="record.valueType.unit"
              :disabled="record.expands?.isProduct"
            />
            <DoubleParams
              v-else-if="['float', 'double'].includes(record.valueType.type)"
              v-model:value="record.valueType"
              :disabled="record.expands?.isProduct"
            />
            <StringParams
              v-else-if="['string', 'password'].includes(record.valueType.type)"
              v-model:value="record.valueType"
              :disabled="record.expands?.isProduct"
            />
            <DateParams
              v-else-if="record.valueType.type === 'date'"
              v-model:value="record.valueType.format"
              :disabled="record.expands?.isProduct"
            />
            <FileParams
              v-else-if="record.valueType.type === 'file'"
              v-model:value="record.valueType"
              :disabled="record.expands?.isProduct"
            />
            <EnumParams
              v-else-if="record.valueType.type === 'enum'"
              v-model:value="record.valueType.elements"
              :disabled="record.expands?.isProduct"
            />
            <BooleanParams
              v-else-if="record.valueType.type === 'boolean'"
              v-model:falseText="record.valueType.falseText"
              v-model:falseValue="record.valueType.falseValue"
              v-model:trueText="record.valueType.trueText"
              v-model:trueValue="record.valueType.trueValue"
              :disabled="record.expands?.isProduct"
            />
            <ObjectParams
              v-else-if="record.valueType.type === 'object'"
              v-model:value="record.valueType.properties"
              :disabled="record.expands?.isProduct"
              :level="2"
            />
            <ArrayParams
              v-else-if="record.valueType.type === 'array'"
              v-model:value="record.valueType.elementType"
              :disabled="record.expands?.isProduct"
              :level="2"
            />
          </div>
          <div v-else-if="type === 'events'">
            <ObjectParams v-model:value="record.valueType.properties" :level="2">
              <a-button
                type="primary"
                :disabled="record.expands?.isProduct"
                :danger="!record.valueType.properties?.length && record.id"
              >
                <template #icon>
                  <AIcon
                    type="EditOutlined"
                    :class="{
                      'table-form-required-aicon':
                        !record.valueType.properties?.length,
                    }"
                  />
                </template>
                {{ $t("Base.Base.640395-11") }}
              </a-button>
            </ObjectParams>
          </div>
        </EditTableFormItem>
      </template>
      <template #expands="{ record, index }">
        <EditTableFormItem :name="[index, 'expands']" @change="metadataChange">
          <Source
            v-if="props.type === 'properties'"
            v-model:value="record.expands"
            :isProduct="record.expands?.isProduct"
            :target="target"
            :record="record"
            :disabled="record.expands?.isProduct"
          />
          <a-select
            v-else-if="props.type === 'events' && !_isFullscreen"
            v-model:value="record.expands.level"
            style="width: 100%"
            :options="EventLevel"
            :disabled="record.expands?.isProduct"
          />
          <a-select
            v-else-if="props.type === 'events' && _isFullscreen"
            v-model:value="record.expands.level"
            style="width: 100%"
            :options="EventLevel"
            :getPopupContainer="getPopupContainer"
            :disabled="record.expands?.isProduct"
          />
        </EditTableFormItem>
      </template>
      <template #other="{ record }">
        <div style='z-index: 6; position: relative'>
          <OtherSetting
            v-model:value="record.expands"
            :type="
              ['functions', 'events'].includes(props.type)
                ? 'object'
                : record.valueType?.type
            "
            :id="record.id"
            :name="record.name"
            :metadataType="props.type"
            :isProduct="record.expands?.isProduct"
            :target="props.target"
            :record="record"
            :disabled="
              record.expands?.isProduct &&
              !['int', 'long', 'float', 'double'].includes(
                record.valueType?.type,
              )
            "
            @change="metadataChange"
          />
        </div>
      </template>
      <template #async="{ record }">
        <BooleanSelect
          v-model:value="record.async"
          style="width: 100%"
          :trueLabel="$t('Base.Base.640395-12')"
          :falseLabel="$t('Base.Base.640395-13')"
          :true-value="true"
          :false-value="false"
          :disabled="record.expands?.isProduct"
          @change="metadataChange"
        />
      </template>
      <template #inputs="{ record, index }">
        <EditTableFormItem :name="[index, 'inputs']" @change="metadataChange">
          <ObjectParams v-model:value="record.inputs" :type="type" :level="2">
            <a-button type="primary" :disabled="record.expands?.isProduct">
              <template #icon>
                <AIcon
                  type="EditOutlined"
                  :class="{
                    'table-form-required-aicon': !record.inputs.length,
                  }"
                />
              </template>
              {{ $t("Base.Base.640395-11") }}
            </a-button>
          </ObjectParams>
        </EditTableFormItem>
      </template>
      <template #output="{ record, index }">
        <EditTableFormItem :name="[index, 'output']" @change="metadataChange">
          <div style="display: flex; align-items: center">
            <TypeSelect
              v-model:value="record.output"
              style="flex: 1 1 0; min-width: 0"
              :disabled="record.expands?.isProduct"
            />
            <IntegerParams
              v-if="['int', 'long'].includes(record.output.type)"
              v-model:value="record.output.unit"
              :disabled="record.expands?.isProduct"
            />
            <DoubleParams
              v-else-if="['float', 'double'].includes(record.output.type)"
              v-model:value="record.output"
              :disabled="record.expands?.isProduct"
            />
            <StringParams
              v-else-if="['string', 'password'].includes(record.output.type)"
              v-model:value="record.output.maxLength"
              :disabled="record.expands?.isProduct"
            />
            <DateParams
              v-else-if="record.output.type === 'date'"
              v-model:value="record.output.format"
              :disabled="record.expands?.isProduct"
            />
            <FileParams
              v-else-if="record.output.type === 'file'"
              v-model:value="record.output"
              :disabled="record.expands?.isProduct"
            />
            <EnumParams
              v-else-if="record.output.type === 'enum'"
              v-model:value="record.output.elements"
              :disabled="record.expands?.isProduct"
            />
            <BooleanParams
              v-else-if="record.output.type === 'boolean'"
              v-model:falseText="record.output.falseText"
              v-model:falseValue="record.output.falseValue"
              v-model:trueText="record.output.trueText"
              v-model:trueValue="record.output.trueValue"
              :disabled="record.expands?.isProduct"
            />
            <ObjectParams
              v-else-if="record.output.type === 'object'"
              v-model:value="record.output.properties"
              :disabled="record.expands?.isProduct"
              :level="2"
            />
            <ArrayParams
              v-else-if="record.output.type === 'array'"
              v-model:value="record.output.elementType"
              :disabled="record.expands?.isProduct"
              :level="2"
            />
          </div>
        </EditTableFormItem>
      </template>
      <template #description="{ record, index }">
        <EditTableFormItem :name="[index, 'description']">
          <a-input
            v-model:value="record.description"
            :placeholder="$t('Base.Base.640395-14')"
            :disabled="record.expands?.isProduct"
            @change="metadataChange"
          />
        </EditTableFormItem>
      </template>
      <template #properties="{ record, index }">
        <EditTableFormItem
          :name="[index, 'properties']"
          @change="metadataChange"
        >
          <ObjectParams
            v-model:value="record.valueType.properties"
            :disabled="record.expands?.isProduct"
            :level="1"
          />
        </EditTableFormItem>
      </template>
      <template #group="{ record }">
        <GroupSelect
          v-model:value="record.expands.group"
          :disabled="record.expands?.isProduct"
          @change="metadataChange"
        />
      </template>
    </EditTable>
    <div>
      {{ $t("Base.Base.640395-15") }}
      <span class="metadata-result-total">{{ effectiveDataLength }}</span>
      {{ $t("Base.Base.640395-16") }}
    </div>
    <PropertiesModal
      v-if="type === 'properties' && detailData.visible"
      :data="detailData.data"
      :type="target"
      :getPopupContainer="getPopupContainer"
      :unitOptions="unitOptions"
      @cancel="cancelDetailModal"
    />
    <FunctionModal
      v-else-if="type === 'functions' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      @cancel="cancelDetailModal"
    />
    <EventModal
      v-else-if="type === 'events' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      @cancel="cancelDetailModal"
    />
    <TagsModal
      v-else-if="type === 'tags' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      :unitOptions="unitOptions"
      @cancel="cancelDetailModal"
    />
  </div>
</template>

<script setup lang="ts" name="MetadataBase">
import type {
  MetadataItem,
  MetadataType,
  ProductItem,
} from "../../../Product/typings";
import type { PropType } from "vue";
import type { DeviceInstance } from "../../../Instance/typings";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { useMetadata, useOperateLimits, useGroup } from "./hooks";
import { useColumns, useSaveUnit } from "./columns";
import { getMetadataItemByType, limitsMap } from "./utils";
import { Source, OtherSetting } from "./components";
import {saveProductVirtualProperty} from "../../../../../api/product";
import { saveDeviceVirtualProperty } from "../../../../../api/instance";
import { useInstanceStore } from "../../../../../store/instance";
import { useProductStore } from "../../../../../store/product";
import { asyncUpdateMetadata, updateMetadata } from "../metadata";
import { onlyMessage, getToken, EventEmitter } from "@jetlinks-web/utils";
import { omit } from "lodash-es";
import {
  PropertiesModal,
  FunctionModal,
  EventModal,
  TagsModal,
} from "./DetailModal";
import {Modal, notification} from "ant-design-vue";
import { watch } from "vue";
import { useSystemStore, useMenuStore, useAuthStore } from "@jetlinks-web-core/store";
import { storeToRefs } from "pinia";
import {
  EditTable,
  TypeSelect,
  IntegerParams,
  StringParams,
  DateParams,
  FileParams,
  EnumParams,
  BooleanParams,
  ObjectParams,
  ArrayParams,
  DoubleParams,
  GroupSelect,
  EditTableFormItem,
  BooleanSelect,
} from "../../../../../components/Metadata";
import { EventLevel } from "../../../data";
import { message } from "ant-design-vue";
import { Import } from "./components/Import";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const props = defineProps({
  target: {
    type: String as PropType<"device" | "product">,
    default: "product",
  },
  type: {
    type: String as PropType<MetadataType>,
    default: undefined,
  },
  permission: {
    type: [String, Array] as PropType<string | string[]>,
    default: undefined,
  },
});

const _target = inject<"device" | "product">("_metadataType", props.target);

const system = useSystemStore();
const { layout: basicLayout } = storeToRefs(system);
const router = useRouter();

const { unitOptions } = useSaveUnit();

const {
  data: metadata,
  noEdit,
  productNoEdit,
} = useMetadata(_target, props.type);
const { data: tagsMetadata } = useMetadata(_target, "tags");
const { hasOperate } = useOperateLimits(_target);

const permissionStore = useAuthStore();
const instanceStore = useInstanceStore();
const productStore = useProductStore();

const dataSource = ref<MetadataItem[]>(
  JSON.parse(JSON.stringify(metadata.value || "[]")) || [],
);
const tableRef = ref();
const loading = ref(false);
const editStatus = ref(false); // 编辑表格的编辑状态
const selectedRowKeys = ref<string[]>([]);

const _isFullscreen = ref(false);

const copyDetail = reactive({
  key: undefined,
  index: 0,
  groupName: undefined,
});

const searchData = reactive({
  len: 0,
  show: false,
});

const { initOptions } = useGroup();

const { columns } = useColumns(
  dataSource,
  props.type,
  _target,
  noEdit,
  productNoEdit,
);

const detailData = reactive({
  data: {},
  visible: false,
});

const heavyLoad = ref<Boolean>(false);

const effectiveDataLength = computed(() => {
  return dataSource.value.filter((item) => item.id).length;
});

const getPopupContainer = () => {
  if (_isFullscreen.value) {
    return tableRef.value.getTableWrapperRef() || document.body;
  }
  return document.body;
};

provide("_tagsDataSource", tagsMetadata);
provide("metadataSource", dataSource);

const cancelDetailModal = () => {
  detailData.data = {};
  detailData.visible = false;
};

const operateLimits = (action: "add" | "updata", types: MetadataType) => {
  return (
    _target === "device" &&
    (instanceStore.detail.features || []).find(
      (item: { id: string; name: string }) =>
        item.id === limitsMap.get(`${types}-${action}`),
    )
  );
};

// const handleSearch = (searchValue: string) => {
//   const keys: string[] = []
//   if (searchValue) {
//     dataSource.value.forEach(item => {
//       if (item.name && item.name.includes(searchValue)) {
//         keys.push(item.id)
//       }
//     })
//   }
//
//   if (keys.length) {
//     tableRef.value.scrollToById(keys[0])
//   }
//   selectedRowKeys.value = keys
//
//   searchData.len = keys.length
//   searchData.show = true
// };

const scrollDown = (len: number = 5) => {
  if (!hasOperate("add", props.type)) {
    dataSource.value.push(
      ...new Array(len).fill(1).map(() => getMetadataItemByType(props.type!)),
    );
  }
};

const rightMenuClick = (
  type: string,
  record: Record<string, any>,
  copyRecord: Record<string, any>,
) => {
  const _index = record.__dataIndex;
  switch (type) {
    case "add":
      dataSource.value.splice(
        _index + 1,
        0,
        getMetadataItemByType(props.type!),
      );
      editStatus.value = true;
      nextTick(() => {
        if (copyDetail.key) {
          const copyItem = dataSource.value.find(
            (item) => item.__key === copyDetail.key,
          );
          copyDetail.index = copyItem!.__serial;
          copyDetail.groupName = copyItem!.expands.groupName;
        }
      });
      break;
    case "paste":
      const cloneRecord = JSON.parse(JSON.stringify(copyRecord));
      cloneRecord.id = `copy_${cloneRecord.id}`;
      if (props.type === "properties") {
        // 获取当前分组id和name
        const expandsItem = dataSource.value[_index + 1].expands;
        cloneRecord.expands.groupName = expandsItem.groupName;
        cloneRecord.expands.groupId = expandsItem.groupId;
      }

      if (record.id) {
        dataSource.value.splice(_index + 1, 0, cloneRecord);
        // Modal.confirm({
        //   title: '当前行存在数据',
        //   onOk() {
        //     dataSource.value.splice(_index, 1, cloneRecord)
        //   },
        //   onCancel() {
        //     console.log('Cancel');
        //   },
        // })
      } else {
        dataSource.value.splice(_index, 1, cloneRecord);
      }

      editStatus.value = true;
      break;
    case "copy":
      copyDetail.index = record.__serial;
      copyDetail.key = record.__key;
      copyDetail.groupName =
        dataSource.value[record.__dataIndex].expands.groupName;
      selectedRowKeys.value = [record.id];
      break;
    case "detail":
      detailData.data = record;
      detailData.visible = true;
      break;
    case "delete":
      // Modal.confirm({
      //   title: `确认删除【${record.id}】？`,
      //   onOk() {
      //     dataSource.value.splice(_index, 1)
      //   },
      //   onCancel() {
      //     console.log('Cancel');
      //   },
      // })
      if (copyDetail.key === record.__key) {
        copyDetail.key = undefined;
        copyDetail.groupName = undefined;
        copyDetail.index = 0;
      }
      dataSource.value.splice(_index, 1);
      editStatus.value = true;
      break;
  }
};

const handleSaveClick = async (next?: Function) => {
  let resp = await tableRef.value.validate();

  if (resp) {
    const virtual: any[] = [];
    const arr = resp.map((item: any) => {
      if (item.expands?.virtualRule) {
        const triggerProperties = item.expands.virtualRule.triggerProperties;
        const rule = omit(item.expands.virtualRule, ["triggerProperties"]);
        virtual.push({
          triggerProperties,
          rule,
          type: rule.type,
          propertyId: item.id,
        });
      }
      return {
        ...item,
        expands: {
          ...omit(item.expands, ["virtualRule"]),
        },
      };
      // return item
    });
    // 保存规则
    if (virtual.length) {
      let res = undefined;
      if (_target === "device") {
        res = await saveDeviceVirtualProperty(
          instanceStore.current.productId,
          instanceStore.current.id,
          virtual,
        );
      } else {
        res = await saveProductVirtualProperty(
          productStore.current.id,
          virtual,
        );
      }
    }
    // 保存属性
    const updateStore = (metadata: string) => {
      if (_target === "device") {
        const detail = instanceStore.current;
        detail.metadata = metadata;
        instanceStore.setCurrent(detail);
      } else {
        const detail = productStore.current || ({} as ProductItem);
        detail.metadata = metadata;
        productStore.setCurrent(detail);
      }
    };

    const _detail: ProductItem | DeviceInstance =
      _target === "device" ? instanceStore.detail : productStore.current;
    let _data = updateMetadata(props.type!, arr, _detail, updateStore);
    loading.value = true;

    const result = await asyncUpdateMetadata(_target, _data).finally(() => {
      loading.value = false;
    });
    if (result.success) {
      // dataSource.value = resp
      // tableRef.value.cleanEditStatus()
      editStatus.value = false;
      message.config({
        getContainer() {
          return getPopupContainer();
        },
      });
      onlyMessage($t("Base.Base.640395-17"));
      next?.();
    }
  }
};

const metadataChange = () => {
  editStatus.value = true;
};

const jumpProduct = () => {
  useMenuStore().jumpPage("device/Product/Detail", {
    params: { id: instanceStore.detail.productId, tab: "Device" },
  });
};

const parentTabsChange = (next?: Function) => {
  if (
    editStatus.value &&
    permissionStore.hasPermission(`${props.permission}:update`) &&
    getToken()
  ) {
    const modal = Modal.confirm({
      content: $t("Base.Base.640395-18"),
      okText: $t("Base.Base.640395-6"),
      cancelText: $t("Base.Base.640395-19"),
      zIndex: 1400,
      closable: true,
      onOk: () => {
        handleSaveClick(next as Function);
      },
      onCancel: (e: any) => {
        if (!e.triggerCancel) {
          // 取消按钮
          modal.destroy();
          (next as Function)?.();
        } else {
          // 右上角取消按钮
          const paths = router.currentRoute.value.matched;
          // basicLayout.value.selectedKeys = paths.map(item => item.path)
          basicLayout.value.openKeys = paths.map((item) => item.path);
        }
      },
    });
  } else {
    (next as Function)?.();
  }
};

const fullToggle = (type: boolean, cb: Function) => {
  cb();
  _isFullscreen.value = !type;
  notification.destroy()
  notification.config({
    getContainer() {
      return getPopupContainer();
    },
  });
};

const groupEdit = (record: { value: string; label: string, oldValue: string }) => {
  dataSource.value.forEach((item) => {
    if (item.expands?.groupId === record.oldValue) {
      item.expands.groupName = record.label;
      item.expands.groupId = record.value;
    }
  });
};

const groupDelete = (id: string) => {
  dataSource.value = dataSource.value.filter(
    (item) => item.expands?.groupId !== id || item.expands?.isProduct,
  );
};

const importMetadata = (_metadata: any[]) => {
  dataSource.value = _metadata;
};

EventEmitter.subscribe(["MetadataTabs"], parentTabsChange);

onUnmounted(() => {
  message.config({
    getContainer() {
      return document.body;
    },
  });
  notification.destroy()
  notification.config({
    getContainer() {
      return document.body;
    },
  });
  EventEmitter.unSubscribe(["MetadataTabs"], parentTabsChange);
});

watch(
  () => metadata.value,
  () => {
    dataSource.value = JSON.parse(JSON.stringify(metadata.value || "[]")).map(
      (item) => {
        if (!item.expands) {
          item["expands"] = {
            group: undefined,
          };
        }
        if (props.type === "functions" && !item.output) {
          item["output"] = {};
        }
        return item;
      },
    );
    initOptions(dataSource.value);
  },
  { immediate: true },
);

onBeforeRouteUpdate((to, from, next) => {
  // 设备管理内路由跳转
  parentTabsChange(next as Function);
});

onBeforeRouteLeave((to, from, next) => {
  // 设备管理外路由跳转
  parentTabsChange(next as Function);
});

const onTypeChange = (index) => {
  // 清除其他配置和指标
  dataSource.value[index] = {
    ...dataSource.value[index],
    expands: {
      ...omit(dataSource.value[index]?.expands, ["metrics", "expands"]),
    },
  };
};
</script>

<style scoped lang="less">
.extra-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  position: relative;
}

.extra-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.extra-copy-tip {
  position: absolute;
  display: flex;
  align-items: center;
  width: 300px;
  justify-content: space-between;
  padding: 8px 24px;
  background-color: #fff;
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  transform: translateX(-150px);

  .extra-copy-tip-icon {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }

  .extra-copy-tip-context {
    display: flex;
    gap: 4px;
  }
}

.noEdit-tip {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 22px;
  color: #6f6f6f;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 5;
}

.metadata-base {
  :deep(.ant-message) {
    z-index: 1073;
  }
}

.metadata-result-total {
  color: @primary-color;
}
</style>
