<template>
  <j-page-container>
    <div class="relationship-container">
      <pro-search
        :columns="columns"
        target="system-relationship"
        @search="(params: any) => (queryParams = { ...params })"
      />
      <FullPage>
        <j-pro-table
          ref="tableRef"
          :columns="columns"
          :request="getRelationshipList_api"
          mode="TABLE"
          :params="queryParams"
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
          }"
        >
          <template #headerLeftRender>
            <j-permission-button
              type="primary"
              :hasPermission="`${permission}:add`"
              @click="table.openDialog(undefined)"
            >
              <AIcon type="PlusOutlined" />{{
                $t("Relationship.index.710824-0")
              }}
            </j-permission-button>
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <j-permission-button
                :hasPermission="`${permission}:update`"
                type="link"
                :tooltip="{
                  title: $t('Relationship.index.710824-1'),
                }"
                @click="table.openDialog(slotProps)"
              >
                <AIcon type="EditOutlined" />
              </j-permission-button>

              <j-permission-button
                :danger="true"
                :hasPermission="`${permission}:delete`"
                type="link"
                :tooltip="{ title: $t('Relationship.index.710824-2') }"
                :popConfirm="{
                  title: $t('Relationship.index.710824-3'),
                  onConfirm: () => table.clickDel(slotProps),
                }"
                :disabled="slotProps.status"
              >
                <AIcon type="DeleteOutlined" />
              </j-permission-button>
            </a-space>
          </template>
        </j-pro-table>
      </FullPage>

      <EditDialog
        v-if="dialog.visible"
        v-model:visible="dialog.visible"
        :data="dialog.selectRow"
        @refresh="table.refresh"
      />
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="Relationship">
import {
  getRelationshipList_api,
  delRelation_api,
} from "@/api/system/relationship";
import EditDialog from "./components/EditDialog.vue";
import { onlyMessage } from "@/utils/comm";
import { useI18n } from "vue-i18n";
import { useRelationTypes } from "./hooks/useRelationTypes";

const { relationTypes, beRelationTypes } = useRelationTypes();

const { t: $t } = useI18n();
const permission = "system/Relationship";

const columns = [
  {
    title: $t("Relationship.index.710824-4"),
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    fixed: "left",
    search: {
      type: "string",
    },
  },
  {
    title: $t("Relationship.index.710824-5"),
    dataIndex: "reverseName",
    key: "reverseName",
    ellipsis: true,
    fixed: "left",
    search: {
      type: "string",
    },
  },
  {
    title: $t("Relationship.index.710824-6"),
    dataIndex: "objectTypeName",
    key: "objectTypeName",
    ellipsis: true,
    fixed: "left",
    search: {
      rename: "objectType",
      type: "select",
      options: () => {
        return relationTypes.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    },
  },
  {
    title: $t("Relationship.index.710824-7"),
    dataIndex: "targetTypeName",
    key: "targetTypeName",
    ellipsis: true,
    fixed: "left",
    search: {
      rename: "targetType",
      type: "select",
      options: async () => {
        return beRelationTypes.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    },
  },
  {
    title: $t("Relationship.index.710824-8"),
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    fixed: "left",
    search: {
      type: "string",
    },
  },
  {
    title: $t("Relationship.index.710824-9"),
    dataIndex: "action",
    key: "action",
    scopedSlots: true,
    width: 100,
  },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
  // 打开编辑弹窗
  openDialog: (row: object | undefined = {}) => {
    dialog.selectRow = { ...row };
    dialog.visible = true;
  },
  // 删除
  clickDel: (row: any) => {
    const response = delRelation_api(row.id);
    response.then((resp: any) => {
      if (resp.status === 200) {
        tableRef.value?.reload();
        onlyMessage($t("Relationship.index.710824-10"));
      } else {
        onlyMessage(resp.message, "error");
      }
    });
    return response;
  },
  // 刷新列表
  refresh: () => {
    tableRef.value.reload();
  },
};

const dialog = reactive({
  selectRow: {} as any,
  visible: false,
});
</script>

<style lang="less" scoped>
.relationship-container {
  :deep(.ant-table-cell) {
    .ant-btn-link {
      padding: 0;
    }
  }
}
</style>
