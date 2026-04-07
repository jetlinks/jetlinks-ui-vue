<template>
  <j-page-container>
    <pro-search
      :columns="query.columns"
      target="product-manage"
      @search="handleSearch"
    />
    <FullPage>
      <JProTable
        :columns="columns"
        :request="queryProductList"
        ref="tableRef"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }],
        }"
        modeValue="CARD"
        :params="params"
      >
        <template #headerLeftRender>
          <RegistryComponent is="a-space" code="productAddButton" @save="refresh">
            <j-permission-button
              type="primary"
              key="add"
              @click="add"
              hasPermission="device/Product:add"
            >
              <template #icon>
                <AIcon type="PlusOutlined" />
              </template>
              {{ $t("Product.index.660348-0") }}
            </j-permission-button>
            <j-permission-button
                key="quick"
              v-if="sourceMenu && isNoCommunity && type === 'iot'"
              hasPermission="device/Product:add"
              @click="menuStory.jumpPage('device/Product/QuickCreate', {})"
            >
              {{ $t("Product.index.660348-35") }}
            </j-permission-button>

            <BatchDropdown
                key="batch"
              :actions="batchActions"
            />
            </RegistryComponent>
        </template>
        <template #deviceType="slotProps">
          <div>{{ slotProps.deviceType.text }}</div>
        </template>
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            :actions="getActions(slotProps, 'card')"
            v-bind="slotProps"
            :active="_selectedRowKeys.includes(slotProps.id)"
            :status="slotProps.state"
            @click="handleView(slotProps.id)"
            :statusText="
              slotProps.state === 1
                ? $t('Product.index.660348-2')
                : $t('Product.index.660348-3')
            "
            :statusNames="{
              1: 'processing',
              0: 'error',
            }"
          >
            <template #img>
              <slot name="img">
                <Image
                  :src="slotProps.photoUrl || device.deviceProduct"
                  class="card-list-img-80"
                />
              </slot>
            </template>
            <template #content>
              <j-ellipsis style="width: calc(100% - 100px); margin-bottom: 18px"
                ><span style="font-weight: 600; font-size: 16px">
                  {{ slotProps.name }}
                </span></j-ellipsis
              >
              <a-row>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t("Product.index.660348-4") }}
                  </div>
                  <div>{{ slotProps?.deviceType?.text }}</div>
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t("Product.index.660348-5") }}
                  </div>
                  <j-ellipsis>
                    <div>
                      {{
                        slotProps?.accessName
                          ? slotProps?.accessName
                          : $t("Product.index.660348-6")
                      }}
                    </div>
                  </j-ellipsis>
                </a-col>
              </a-row>
            </template>
            <template #actions="item">
              <j-permission-button
                :disabled="item.disabled"
                :popConfirm="item.popConfirm"
                :tooltip="{
                  ...item.tooltip,
                }"
                @click="item.onClick"
                :hasPermission="item.permission ||
                  item.key === 'view' ? true : 'device/Product:' + item.key
                "
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
        <template #state="slotProps">
          <j-badge-status
            :text="
              slotProps.state === 1
                ? $t('Product.index.660348-2')
                : $t('Product.index.660348-3')
            "
            :status="slotProps.state"
            :statusNames="{
              1: 'processing',
              0: 'error',
            }"
          />
        </template>
        <template #action="slotProps">
          <a-space>
            <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :hasPermission="i.permission ||
                  i.key === 'view' ? true : 'device/Product:' + i.key
                "
                :tooltip="{
                  ...i.tooltip,
                }"
                type="link"
                style="padding: 0; margin: 0"
                :danger="i.key === 'delete'"
                @click="i.onClick"
              >
                <template #icon>
                  <AIcon :type="i.icon" />
                </template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </JProTable>
    </FullPage>
    <!-- {{ $t('Product.index.660348-0') }}、{{ $t('Product.index.660348-13') }} -->
    <Save ref="saveRef" :isAdd="isAdd" :type="type" :title="title" @success="refresh" ></Save>

    <!-- 同步缓存组件 -->
    <SyncCache v-if="syncCacheVisible" :params="params" @success="refresh" @close="syncCacheVisible = false"/>
  </j-page-container>
</template>

<script setup lang="ts">
import { onlyMessage } from "@jetlinks-web/utils";
import {
  getProviders,
  category,
  queryOrgThree,
  queryGatewayList,
  queryProductList,
  _deploy,
  _undeploy,
  deleteProduct,
  updateDevice,
} from "../../../api/product";
import { downloadJson, accessConfigTypeFilter, isNoCommunity, mergeObjectArrays } from "@jetlinks-web-core/utils";
import { omit, cloneDeep } from "lodash-es";
import Save from "./Save/index.vue";
import SyncCache from "./components/SyncCache.vue";
import { useMenuStore, useAuthStore } from "@jetlinks-web-core/store";
import { useRouterParams } from "@jetlinks-web/hooks";
import { device } from "../../../assets";
import TagSearch from "../Instance/components/TagSearch.vue";
import { accessType } from "../data";
import { useI18n } from "vue-i18n";
import { useTermOptions } from '@jetlinks-web/components/es/Search/hooks/useTermOptions'
import BatchDropdown from "@jetlinks-web-core/components/BatchDropdown/index.vue";
import { useMircoAppData } from '@jetlinks-web-core/hooks/useMircoApp'
import {isSass} from '@jetlinks-web-core/utils/consts'

const { t: $t } = useI18n();

const slots = useSlots();
const { data: type } = useMircoAppData('platformName')
/**
 * 表格数据
 */
const menuStory = useMenuStore();
const isAdd = ref<number>(0);
const title = ref<string>("");
const params = ref<Record<string, any>>({});
const { termOptions } = useTermOptions({ pick: ['eq', 'not']})
const { termOptions: dimAssetsTermOptions } = useTermOptions({ pick: ['eq']})

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    scopedSlots: true,
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("Product.index.660348-7"),
    dataIndex: "name",
    key: "name",
    width: 220,
    ellipsis: true,
  },
  {
    title: $t("Product.index.660348-5"),
    dataIndex: "accessName",
    key: "accessName",
    width: 220,
    ellipsis: true,
  },
  {
    title: $t("Product.index.660348-4"),
    dataIndex: "deviceType",
    key: "deviceType",
    scopedSlots: true,
    ellipsis: true,
    width: 120,
  },
  {
    key: "id$dev-instance",
    dataIndex: "id$dev-instance",
    title: $t("Product.index.660348-8"),
    hideInTable: true,
    search: {
      type: "component",
      components: TagSearch,
      termOptions: termOptions,
      defaultTermType: 'eq'
    },
  },
  {
    title: $t("Product.index.660348-9"),
    dataIndex: "state",
    key: "state",
    scopedSlots: true,
    ellipsis: true,
    width: 90,
  },
  {
    title: $t("Product.index.660348-10"),
    dataIndex: "describe",
    key: "describe",
    ellipsis: true,
  },
  {
    title: $t("Product.index.660348-11"),
    key: "action",
    fixed: "right",
    width: 250,
    scopedSlots: true,
    ellipsis: true,
  },
];
const permission = useAuthStore().hasPermission(`device/Product:import`);
const sourceMenu = menuStory.hasMenu(`resource/Resource`);
const _selectedRowKeys = ref<string[]>([]);
const currentForm = ref({});
const syncCacheVisible = ref(false)

// 批量操作配置
const batchActions = computed(() => {
  const arr = []
  if(!isSass){
    arr.push({
      key: 'import',
      text: $t("Product.index.660348-1"),
      icon: 'UploadOutlined',
      permission: type === 'iot' ? 'device/Product:import' : true,
      onClick: () => {
        // 触发文件选择
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            beforeUpload(file);
          }
        };
        input.click();
      }
    })
  }
  if(type === 'iot') {
    arr.push({
      key: 'syncCache',
      text: '同步缓存',
      icon: 'SyncOutlined',
      permission: 'device/Product:update',
      onClick: () => {
        syncCacheVisible.value = true;
      }
    })
  }
  return arr
});

const getActions = (
  data: Partial<Record<string, any>>,
  type: "card" | "table",
): any[] => {
  if (!data) {
    return [];
  }
  const parentGetActions = inject('getActions', {}).getActions;
  const parentActions = parentGetActions?.(data);
  let actions = [
    {
      key: "view",
      text: $t("Product.index.660348-12"),
      tooltip: {
        title: $t("Product.index.660348-12"),
      },
      icon: "EyeOutlined",
      onClick: () => {
        handleView(data.id);
      },
    },
    {
      key: "update",
      text: $t("Product.index.660348-13"),
      tooltip: {
        title: $t("Product.index.660348-13"),
      },
      icon: "EditOutlined",
      onClick: () => {
        title.value = $t("Product.index.660348-13");
        isAdd.value = 2;
        nextTick(() => {
          saveRef.value.show(data);
        });
      },
    },
    {
      key: "export",
      text: $t("Product.index.660348-14"),
      tooltip: {
        title: $t("Product.index.660348-14"),
      },

      icon: "icon-xiazai",
      onClick: () => {
        const extra = omit(data, [
          "transportProtocol",
          "protocolName",
          "accessId",
          "accessName",
          "accessProvider",
          "messageProtocol",
        ]);
        downloadJson(extra, data.name + $t("Product.index.660348-15"));
      },
    },
    {
      key: "action",
      text:
        data.state !== 0
          ? $t("Product.index.660348-3")
          : $t("Product.index.660348-16"),
      tooltip: {
        title:
          data.state !== 0
            ? $t("Product.index.660348-3")
            : $t("Product.index.660348-16"),
      },
      icon: data.state !== 0 ? "StopOutlined" : "CheckCircleOutlined",
      popConfirm: {
        title: `确认${data.state !== 0 ? $t("Product.index.660348-3") : $t("Product.index.660348-16")}?`,
        onConfirm: () => {
          let response = undefined;
          if (data.state !== 0) {
            response = _undeploy(data.id);
          } else {
            response = _deploy(data.id);
          }
          response.then((res) => {
            if (res && res.status === 200) {
              onlyMessage($t("Product.index.660348-18"));
              tableRef.value?.reload();
            } else {
              onlyMessage($t("Product.index.660348-19"), "error");
            }
          });
          return response;
        },
      },
    },
    {
      key: "delete",
      text: $t("Product.index.660348-20"),
      disabled: data.state !== 0,
      tooltip: {
        title:
          data.state !== 0
            ? $t("Product.index.660348-21")
            : $t("Product.index.660348-20"),
      },
      popConfirm: {
        title: $t("Product.index.660348-22"),
        onConfirm: () => {
          const response = deleteProduct(data.id);
          response.then((resp) => {
            if (resp.status === 200) {
              onlyMessage($t("Product.index.660348-18"));
              tableRef.value?.reload();
            } else {
              onlyMessage($t("Product.index.660348-19"), "error");
            }
          });
          return response;
        },
      },
      icon: "DeleteOutlined",
    },
  ];
  if (parentActions && parentActions.length > 0) {
    actions = mergeObjectArrays(actions, parentActions)
  }
  if (type === "card") return actions.filter((i: any) => i.key !== "view");
  return actions;
};

/**
 * 新增
 */
const add = () => {
  isAdd.value = 1;
  title.value = $t("Product.index.660348-0");
  nextTick(() => {
    saveRef.value.show(currentForm.value);
  });
};

const handleAdd = () => {
  add();
};

/**
 * 导入
 */
const beforeUpload = (file: any) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = async (result) => {
    const text = result.target?.result as string;
    // console.log(text);
    if (!file.type.includes("json")) {
      onlyMessage($t("Product.index.660348-23"), "error");
      return false;
    }
    if (!text) {
      onlyMessage($t("Product.index.660348-24"), "error");
      return false;
    }
    const data = JSON.parse(text);
    // 设置导入的产品状态为未发布
    data.state = 0;
    if (Array.isArray(data)) {
      onlyMessage($t("Product.index.660348-25"), "error");
      return false;
    }
    delete data.state;
    if (!data?.name) {
      data.name = $t("Product.index.660348-15") + Date.now();
    }
    if (!data?.deviceType || JSON.stringify(data?.deviceType) === "{}") {
      onlyMessage($t("Product.index.660348-26"), "error");
      return false;
    }
    const res = await updateDevice(data);
    if (res.status === 200) {
      onlyMessage($t("Product.index.660348-27"));
      tableRef.value?.reload();
    }
    return true;
  };
  return false;
};
/**
 * 查看
 */
const handleView = (id: string) => {
  menuStory.jumpPage("device/Product/Detail", { params: { id } });
};

/**
 * 刷新数据
 */
const refresh = () => {
  tableRef.value?.reload();
};
// 筛选
const listData = ref([]);
const typeList = ref([]);
const tableRef = ref<Record<string, any>>({});
const query = reactive({
  columns: [
    {
      title: $t("Product.index.660348-28"),
      dataIndex: "name",
      key: "name",
      search: {
        first: true,
        type: "string",
      },
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      search: {
        type: "string",
        defaultTermType: "eq",
      },
    },
    {
      title: $t("Product.index.660348-29"),
      key: "accessProvider",
      dataIndex: "accessProvider",
      search: {
        type: "select",
        options: async () => {
          return new Promise((resolve) => {
            getProviders().then((resp: any) => {
              const data = resp.result || [];
              resolve(
                accessConfigTypeFilter(data).filter((i: any) => {
                  return accessType.includes(i.value);
                }),
              );
            });
          });
        },
      },
    },
    {
      title: $t("Product.index.660348-5"),
      key: "accessId",
      dataIndex: "accessId",
      search: {
        type: "select",
        options: async () => {
          return new Promise((res) => {
            queryGatewayList({
              paging: false,
            }).then((resp: any) => {
              typeList.value = [];
              typeList.value = resp.result.map((item: any) => ({
                label: item.name,
                value: item.id,
              }));
              res(typeList.value);
            });
          });
        },
      },
    },
    {
      title: $t("Product.index.660348-4"),
      key: "deviceType",
      dataIndex: "deviceType",
      search: {
        type: "select",
        options: [
          {
            label: $t("Product.index.660348-30"),
            value: "device",
          },
          {
            label: $t("Product.index.660348-31"),
            value: "childrenDevice",
          },
          {
            label: $t("Product.index.660348-32"),
            value: "gateway",
          },
        ],
      },
    },
    {
      title: $t("Product.index.660348-9"),
      key: "state",
      dataIndex: "state",
      search: {
        type: "select",
        options: [
          {
            label: $t("Product.index.660348-2"),
            value: 1,
          },
          {
            label: $t("Product.index.660348-3"),
            value: 0,
          },
        ],
      },
    },
    {
      title: $t("Product.index.660348-10"),
      key: "describe",
      dataIndex: "describe",
      search: {
        type: "string",
      },
    },
    {
      title: $t("Product.index.660348-33"),
      key: "classified",
      dataIndex: "classifiedId",
      search: {
        type: "treeSelect",
        options: async () => {
          return new Promise((res) => {
            category({
              paging: false,
            }).then((resp) => {
              res(resp.result);
            });
          });
        },
      },
    },
    {
      title: $t("Product.index.660348-11"),
      key: "action",
      fixed: "right",
      width: 250,
      scopedSlots: true,
    },
  ],
});
const saveRef = ref();
const fileRef = ref();

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    beforeUpload(file);
  }
};



const handleSearch = (e: any) => {
  // console.log(e, 'e')
  const newTerms = cloneDeep(e);
  if (newTerms.terms?.length) {
    newTerms.terms.forEach((a: any) => {
      a.terms = a.terms.map((b: any) => {
        if (b.column === "id$dev-instance") {
          return {
            column: "id$dev-instance",
            options: ["productId"],
            value: b.value,
            type: b.type,
          };
        }
        if (b.column === "id$dim-assets") {
          const value = b.value;
          b = {
            ...b,
            column: "id",
            termType: "dim-assets",
            value: {
              assetType: "product",
              targets: [
                {
                  type: "org",
                  id: value,
                },
              ],
            },
          };
        }
        if (b.column === "accessProvider") {
          if (b.value === "collector-gateway") {
            b.termType = b.termType === "eq" ? "in" : "nin";
            b.value = ["opc-ua", "modbus-tcp", "collector-gateway"];
          } else if (
            Array.isArray(b.value) &&
            b.value.includes("collector-gateway")
          ) {
            b.value = ["opc-ua", "modbus-tcp", ...b.value];
          }
        }
        return b;
      });
    });
  }

  params.value = newTerms;
};
const routerParams = useRouterParams();

onMounted(() => {
  if (routerParams.params.value?.save) {
    add();
  }
  if (routerParams.params.value?.resourceId) {
    setTimeout(() => {
      params.value = {
        terms: [
          {
            column: "id$in-res-quick$product",
            value: [routerParams.params.value.resourceId],
          },
        ],
      };
    });
  }
  if (isNoCommunity) {
    query.columns.splice(query.columns.length - 2, 0, {
      title: $t("Product.index.660348-34"),
      key: "id$dim-assets",
      dataIndex: "id$dim-assets",
      search: {
        first: true,
        type: "treeSelect",
        termOptions: dimAssetsTermOptions,
        options: async () => {
          return new Promise((res) => {
            queryOrgThree({ paging: false }).then((resp: any) => {
              const formatValue = (list: any[]) => {
                const _list: any[] = [];
                list.forEach((item) => {
                  if (item.children) {
                    item.children = formatValue(item.children);
                  }
                  _list.push({
                    ...item,
                    value: JSON.stringify({
                      assetType: "product",
                      targets: [
                        {
                          type: "org",
                          id: item.id,
                        },
                      ],
                    }),
                  });
                });
                return _list;
              };
              res(formatValue(resp.result));
            });
          });
        },
      },
    });
  }
});
</script>

<style lang="less" scoped>
.box {
  padding: 20px;
  background: #f0f2f5;
}

.productImg {
  width: 80px;
  height: 80px;
}

.productName {
  white-space: nowrap; /*强制在同一行内显示所有文本，直到文本结束或者遭遇br标签对象才换行。*/
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /*隐藏部分以省略号代替*/
}
</style>
