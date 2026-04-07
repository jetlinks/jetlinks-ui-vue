<template>
  <pro-search
    type="simple"
    :columns="columns"
    target="category-bind-modal"
    noMargin
    @search="search"
  />
  <div style="height: 500px">
    <j-pro-table ref="tableRef" :request="requestFun" :gridColumn="2" :gridColumns="[2]" :params="queryParams"
                 :columns="columns">
      <template #card="slotProps">
        <CardBox :value="slotProps" v-bind="slotProps"
                 :status="slotProps.state?.value" :statusText="slotProps.state?.text"
                 :statusNames="{
          online: 'processing',
          offline: 'error',
          notActive: 'warning',
        }">
          <template #img>
            <slot name="img">
              <img :src="systemImg.deviceProductImg" style="cursor: pointer" alt="" />
            </slot>
          </template>
          <template #content>
            <h3 class="card-item-content-title" style='margin-bottom: 18px;'>
              <j-ellipsis style="width: calc(100% - 100px);">
                {{ slotProps.name }}
              </j-ellipsis>
            </h3>
            <a-row>
              <a-col :span="12">
                <div class="card-item-content-text">ID</div>
                <div style="cursor: pointer" class="card-item-content-value">
                  {{ slotProps.id }}
                </div>
              </a-col>
              <a-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('components.AddDeviceOrProductDialog.314014-5') }}
                </div>
                <div style="cursor: pointer; height: 30px" class="card-item-content-value"
                     @click="(e) => e.stopPropagation()">
                  <!--                                    <a-checkbox-group v-model:value="slotProps.selectPermissions-->
                  <!--                                        " :options="slotProps.permissionList" />-->
                  <ButtonCheckBox :options="slotProps.permissionList"
                                  :value="bulkList"
                  />
                </div>
              </a-col>
            </a-row>
          </template>
        </CardBox>
      </template>

      <template #permission="slotProps">
        <div style="cursor: pointer" class="card-item-content-value" @click="(e) => e.stopPropagation()">
          <!--                    <a-checkbox-group v-model:value="slotProps.selectPermissions" :options="slotProps.permissionList" />-->
          <ButtonCheckBox :options="slotProps.permissionList"
                          :value="bulkList"
          />
        </div>
      </template>
      <template #state="slotProps">
        <j-badge-status :status="slotProps.state.value" :text="slotProps.state.text" :statusNames="{
        online: 'processing',
        offline: 'error',
        notActive: 'warning',
      }"></j-badge-status>
      </template>
      <template #registryTime="slotProps">
      <span>{{
          slotProps.registryTime ? dayjs(slotProps.registryTime).format('YYYY-MM-DD HH:mm:ss') : "--"
        }}</span>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup lang="ts">
import {
  getDeviceOrProductList_api,
  getDeviceList_api,
  getBindingsPermission,
} from '@authentication-manager-ui/api/system/department';
import { dictType } from '../../typings';
import { useI18n } from 'vue-i18n';
import ButtonCheckBox from './ButtonCheckBox.vue'
import { systemImg } from '@authentication-manager-ui/assets/index'
import dayjs from 'dayjs';

const { t: $t } = useI18n();
const props = defineProps<{
  visible: boolean;
  queryColumns: any[];
  parentId: string;
  allPermission: dictType;
  assetType: 'product' | 'device';
  bulkBool: boolean;
  bulkList: string[];
  request: {
    listApi: any,
    noPagingListApi: any,
  }
}>();
const queryCount = ref(0);
const queryParams = ref({});
const columns = props.queryColumns.filter(
  (item) => item.dataIndex !== 'action',
);

const _selectedRowKeys = ref<string[]>([]) // 选中项的id
const backRowKeys = ref<string[]>([]) // 旧选中项的id
const selectedRows = ref<any[]>([]) // 选中项
const tableData = ref<any[]>([]) // 列表的浅拷贝
const tableRef = ref();

// 获取并整理数据
const getData = (params: object, parentId: string) =>
  new Promise((resolve) => {
    props.request.listApi(params).then((resp: any) => {
      type resultType = {
        data: any[];
        total: number;
        pageSize: number;
        pageIndex: number;
      };
      const { pageIndex, pageSize, total, data } =
        resp.result as resultType;
      const ids = data.map((item) => item.id);
      // 资产权限排序: 查看/编辑/删除/共享
      const idxMap = {
        read: 0,
        save: 1,
        delete: 2,
        share: 3,
      };
      // fix: bug#10706
      getBindingsPermission(props.assetType, ids).then(
        (perResp: any) => {
          data.forEach((item) => {
            item.permissionList = perResp.result
              .find((f: any) => f?.assetId === item.id)
              ?.permissionInfoList?.map((m: any) => ({
                label: m.name,
                value: m.id,
                disabled: true,
              })) || [];
            item.selectPermissions = ['read'];
            // 资产排序
            item.permissionList = item.permissionList
              ?.map((m: any) => {
                return {
                  ...m,
                  idx: idxMap[m.value],
                };
              })
              ?.sort((a: any, b: any) => a.idx - b.idx);

            // 产品的状态进行转换处理
            if (props.assetType === 'product') {
              item.state = {
                value:
                  item.state === 1
                    ? 'online'
                    : item.state === 0
                      ? 'offline'
                      : '',
                text:
                  item.state === 1
                    ? $t('components.AddDeviceOrProductDialog.314014-9')
                    : item.state === 0
                      ? $t('components.AddDeviceOrProductDialog.314014-10')
                      : '',
              };
            }
          });
          resolve({
            code: 200,
            result: {
              data: data.sort(
                (a, b) => b.createTime - a.createTime
              ),
              pageIndex,
              pageSize,
              total,
            },
            status: 200,
          });
        },
      );
    });
  })

// 整理参数并获取数据
const requestFun = async (oParams: any) => {
    queryCount.value += 1;
    if (props.parentId) {
      let terms: any[] = [{
        column: 'id',
        termType: 'dim-assets$not',
        value: {
          assetType: props.assetType,
          targets: [
            {
              type: 'org',
              id: props.parentId,
            },
          ],
        },
        type: 'and'
      }]

      // if (
      //     props.assetType !== 'device' ||
      //     !departmentStore.productId ||
      //     queryCount.value > 1 ||
      //     departmentStore.optType === 'handle'
      // ) {
      //     // 非设备|产品id不存在|有其他查询操作(queryCount+1)|设备页面手动点击资产分配, 均删除产品带入的id
      //     terms[0].terms.pop();
      // }
      if (oParams.terms && oParams.terms.length > 0) {
        terms = [...oParams.terms, ...terms]
      }

      const params = {
        ...oParams,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms,
      };

      const resp: any = await getData(params, props.parentId);
      tableData.value = resp.result.data;
      return {
        code: resp.status,
        result: resp.result,
        status: resp.status,
        success: true
      };
    } else {
      return {
        code: 200,
        result: {
          data: [],
          pageIndex: 0,
          pageSize: 0,
          total: 0,
        },
        status: 200,
      };
    }
  }

// 获取搜索条件下的所有对应资产
const getAllAssets = async () => {
  const resp: any = await props.request.noPagingListApi({
    paging: false,
    terms: [
      ...(queryParams.value?.terms || []),
      {
        column: 'id',
        termType: 'dim-assets$not',
        value: {
          assetType: props.assetType,
          targets: [
            {
              type: 'org',
              id: props.parentId,
            },
          ],
        },
        type: 'and'
      }
    ]
  });
  const ids = resp.result.map((item: any) => item.id);
  const perRes = await getBindingsPermission(props.assetType, ids);
  resp.result.forEach((item: any) => {
    item.permissionList = perRes.result
      .find((f: any) => f?.assetId === item.id)
      ?.permissionInfoList?.map((m: any) => ({
        label: m.name,
        value: m.id,
        disabled: true,
      })) || [];
  })
  return resp.result;
}


watch(
  () => [props.bulkBool, props.bulkList, _selectedRowKeys.value],
  (n) => {
    const nValue = <string[]>n[2];
    const oValue = backRowKeys.value;
    console.log(tableRef.value?.dataSource)
    tableRef.value?.dataSource.forEach((item: any) => {
      // 启用批量设置
      if (props.bulkBool) {
        // 将已勾选的权限和批量设置的权限进行合并，并与自己可选的权限进行比对，取交集作为当前选中的权限
        // fix: bug#10756
        item.selectPermissions = n[1];
        // 禁用单独勾选
        (item.permissionList || []).forEach((permission: any) => {
          permission.disabled = true;
        });
      } else {
        // 取消批量设置
        // 放开自己权限的勾选限制，查看为必选
        (item.permissionList || []).forEach((permission: any) => {
          permission.disabled = permission.value === 'read';
        });
      }
    });

    // 取消勾选时触发
    if (nValue && nValue.length < oValue.length) {
      // 拿到取消选中的项的id
      const removedKeys = oValue.filter(
        (key: string) => !nValue.includes(key),
      );
      // 将取消勾选的项的权限重置
      removedKeys.forEach((removedKey: string) => {
        const removedItem = tableData.value.find(
          (item: any) => item.id === removedKey,
        );
        removedItem.permissionList.forEach(
          (permission: any) => (permission.disabled = true),
        );
        removedItem.selectPermissions = ['read'];
      });
    }
    if (!nValue.length) {
      // 列表取消全部选择
      tableData.value.forEach((item: any) => {
        item.selectPermissions = ['read'];
      });
    }
  },
  { deep: true },
);

const search = (e: any) => {
  queryParams.value = e;
}

defineExpose({
  _selectedRowKeys: _selectedRowKeys.value,
  selectedRows: selectedRows.value,
  getAllAssets
})
</script>

<style scoped lang="less"></style>
