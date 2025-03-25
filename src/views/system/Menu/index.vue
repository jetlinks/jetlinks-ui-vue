 <template>
  <j-page-container>
    <div class="menu-container">
      <pro-search
        :labelWidth="56"
        :columns="columns"
        target="category"
        @search="handleSearch"
      />
      <FullPage>
        <j-pro-table
          ref="tableRef"
          :columns="columns"
          :request="getList"
          :params="queryParams"
          :defaultParams="defaultParams"
          type="TREE"
          mode="TABLE"
          noPagination
          v-model:expandedRowKeys="expandedRowKeys"
          :scroll="{ y: 'calc(100% - 60px)' }"
        >
          <template #headerLeftRender>
            <j-permission-button
              type="primary"
              :hasPermission="`${permission}:add`"
              @click="toDetails({})"
            >
              <AIcon type="PlusOutlined" />{{ $t('Menu.index.599742-0') }}
            </j-permission-button>
            <a-button
              v-if="admin"
              style="margin-left: 12px"
              @click="router.push('/system/Menu/Setting')"
            >{{ $t('Menu.index.599742-17') }}</a-button
            >
          </template>
          <template #createTime="slotProps">
            <span v-time-format="'YYYY-MM-DD HH:mm:ss'">
              {{ slotProps.createTime }}
            </span>
          </template>
          <template #name="slotProps">
            {{ slotProps?.i18nName || slotProps?.name }}
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <j-permission-button
                type="link"
                :hasPermission="`${permission}:add`"
                @click="toDetails(slotProps)"
                style="padding: 0"
                :tooltip="{ title: $t('Menu.index.599742-1') }"
              >
                <AIcon type="EditOutlined" />
              </j-permission-button>

              <j-permission-button
                type="link"
                :hasPermission="`${permission}:add`"
                :tooltip="{ title: slotProps.level >= 3 ? $t('Setting.index.113436-9') : $t('Menu.index.599742-2') }"
                style="padding: 0"
                @click="addChildren(slotProps)"
                :disabled="slotProps.level >= 3"
              >
                <AIcon type="PlusCircleOutlined" />
              </j-permission-button>
              <j-permission-button
                type="link"
                :hasPermission="`${permission}:delete`"
                :tooltip="{ title: $t('Menu.index.599742-3') }"
                danger
                style="padding: 0"
                :popConfirm="{
                  title: $t('Menu.index.599742-4'),
                  onConfirm: () => clickDel(slotProps),
                }"
              >
                <AIcon type="DeleteOutlined" />
              </j-permission-button>
            </a-space>
          </template>
        </j-pro-table>
      </FullPage>
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="Menu">
import { getMenuTree, delMenu } from '@/api/system/menu'
import { useMenuStore } from '@/store/menu'
import { onlyMessage } from '@jetlinks-web/utils'
import {OWNER_KEY} from "@/utils/consts";
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia'

const { t: $t } = useI18n();
const permission = 'system/Menu'

const menuStore = useMenuStore()
const router = useRouter();

const userInfoStore = useUserStore();
const { userInfo } = storeToRefs(userInfoStore);

const admin = computed(() => {
  return userInfo.value?.username === 'admin';
});

const columns = [
  {
    title: $t('Menu.index.599742-5'),
    dataIndex: 'code',
    key: 'code',
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
      componentProps: {
        placeholder: $t('Menu.index.599742-6'),
      },
    },
    width: 300,
  },
  {
    title: $t('Menu.index.599742-7'),
    dataIndex: 'name',
    key: 'name',
    scopedSlots: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: $t('Menu.index.599742-8'),
      },
    },
  },
  {
    title: $t('Menu.index.599742-9'),
    dataIndex: 'url',
    key: 'url',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: $t('Menu.index.599742-10'),
      },
    },
  },
  {
    title: $t('Menu.index.599742-11'),
    dataIndex: 'sortIndex',
    key: 'sortIndex',
    ellipsis: true,
    search: {
      type: 'number',
      componentProps: {
        placeholder: $t('Menu.index.599742-12'),
      },
    },
    width: 80,
  },
  {
    title: $t('Menu.index.599742-13'),
    dataIndex: 'describe',
    key: 'describe',
    ellipsis: true,
  },
  {
    title: $t('Menu.index.599742-14'),
    dataIndex: 'createTime',
    key: 'createTime',
    search: {
      type: 'date',
    },
    width: 200,
    scopedSlots: true,
  },
  {
    title: $t('Menu.index.599742-15'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    scopedSlots: true,
    width: 140,
  },
]
const queryParams = ref({ terms: [] })
const defaultParams = {
  terms: [
    {
      value: "%show\":false%",
      termType: "nlike",
      column: "options"
    }
  ],
  type:'and'
}
const expandedRowKeys = ref<string[]>([])
const tableRef = ref<Record<string, any>>({}) // 表格实例
const total = ref<number>(0)

const handleSearch = (e: any) => {
  queryParams.value = e
  if (!e.length) {
    expandedRowKeys.value = []
  }
}

const getList = async (_params: any) => {
  //过滤非集成的菜单
  const item = {
    terms: [
      {
        terms: [
          {
            column: 'owner',
            termType: 'eq',
            value: OWNER_KEY,
          },
          {
            column: 'owner',
            termType: 'isnull',
            value: '1',
            type: 'or',
          },
        ],
      },
      {
        type: 'or',
        terms: [
          {
            value: '%show":false%',
            termType: 'nlike',
            column: 'options',
          },
        ],
      }
    ],
  }
  const params = {
    ..._params,
    terms:
      _params.terms && _params.length !== 0 ? [..._params.terms, item] : [item],
    sorts: [{ name: 'sortIndex', order: 'asc' }],
    paging: false,
  }
  const resp: any = await getMenuTree(params)
  const menuArr = resp.result.filter(
    (i: any) => i.code !== 'account-center',
  );
  const lastItem = menuArr[menuArr.length - 1];
  //个人中心排序为9999需要做过滤特殊处理
  total.value = lastItem
    ? lastItem.sortIndex + 1 === 9999
      ? 10000
      : lastItem.sortIndex + 1
    : 1;

  return {
    code: resp.message,
    result: resp.result,
    status: resp.status,
    success: resp.status === 200
  }
}
const addChildren = (row: any) => {
  let sortIndex = 0
  if (row && row.children) {
    sortIndex = row.children.filter(a => a.sortIndex !== 9999).sort((a, b) => a.sortIndex - b.sortIndex).pop().sortIndex
  }
  menuStore.jumpPage('system/Menu/Detail', {
    params: {
      id: ':id',
    },
    query: {
      pid: row.id,
      basePath: row.url || '',
      sortIndex: sortIndex + 1,
    },
  })
}
// 跳转至详情页
const toDetails = (row: any) => {
  menuStore.jumpPage('system/Menu/Detail', {
    params: {
      id: row.id || ':id',
    },
    query: {
      pid: row.parentId,
      basePath: row.url || '',
      sortIndex: total.value,
    },
  })
}
// 删除
const clickDel = (row: any) => {
  delMenu(row.id).then((resp: any) => {
    if (resp.status === 200) {
      tableRef.value?.reload()
      onlyMessage($t('Menu.index.599742-16'))
    }
  })
}
</script>
