<template>
  <a-modal :width="700" visible :title="$t('components.AddDialog.956922-11')" @cancel="emits('close')" @ok="onSave" :confirm-loading="loading">
    <div class="alert-info">
      <div>
        <AIcon style="margin-right: 8px" type="InfoCircleFilled"/>
        {{$t('components.AddDialog.956922-12')}}
      </div>
      <div style="font-weight: 600; min-width: 200px">
        <j-ellipsis>{{ data.name }}</j-ellipsis>
      </div>
    </div>
    <a-form ref="formRef" :model="formData" layout="vertical">
      <a-form-item
          name="name"
          :label="$t('components.AddDialog.956922-2')"
          :rules="[
                    { required: true, message: $t('components.AddDialog.956922-3') },
                    { max: 64, message: $t('components.AddDialog.956922-4') },
                ]"
      >
        <a-input
            v-model:value="formData.name"
            :placeholder="$t('components.AddDialog.956922-5')"
            allow-clear
        />
      </a-form-item>
      <a-form-item
          name="groupId"
          :label="$t('components.AddDialog.956922-6')"
          :rules="[
                    { required: true, message: $t('components.AddDialog.956922-7') },
                ]"
      >
        <a-select
            show-search
            v-model:value="formData.groupId"
            :placeholder="$t('components.AddDialog.956922-7')"
            :options="groupOptions"
            optionFilterProp="label"
        />
      </a-form-item>
      <a-form-item name="name" :label="$t('components.AddDialog.956922-8')">
        <a-textarea
            v-model:value="formData.description"
            :placeholder="$t('components.AddDialog.956922-9')"
            allow-clear
            :maxlength="200"
            show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {
  bindUser_api,
  getPermissionTree_api,
  getUserByRoleNoPaging_api,
  queryRoleGroup, saveRole_api, updatePermissionTree_api
} from "@authentication-manager-ui/api/system/role";
import {paramsEncodeQuery} from "@jetlinks-web-core/utils";
import {onlyMessage} from "@jetlinks-web/utils";
import {map} from "lodash-es";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['close', 'save'])
const {t: $t} = useI18n();
const formRef = ref()
const loading = ref(false);
const formData = reactive({
  name: '',
  groupId: undefined,
  description: ''
});
const groupOptions = ref([])
const _data = reactive({
  user: [],
  menu: [],
})

const getGroupOptions = async () => {
  const resp = await queryRoleGroup({sorts: [{name: 'createTime', order: 'desc'}]})
  if (resp.success) {
    groupOptions.value = resp.result.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  }
}

// 铺平数据
const flattenArray = (arr = []) => {
  return (arr || []).reduce((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenArray(item.children));
    }
    return acc;
  }, []);
}
// 查询角色的权限菜单
const queryGrant = async (id) => {
  // 查询权限树
  const resp = await getPermissionTree_api(id, paramsEncodeQuery({
    terms: [
      {
        value: "%show\":false%",
        termType: "nlike",
        column: "options"
      }
    ]
  }));
  if (resp.success) {
    _data.menu = flattenArray(resp.result).filter(i => i.granted);
  }
  // 查询绑定用户
  const resp2 = await getUserByRoleNoPaging_api({
    terms: [
      {
        "terms": [
          {
            "column": "id$in-dimension$role",
            "value": id
          }
        ]
      }
    ]
  })
  if (resp2.success) {
    _data.user = map(resp2.result, 'id');
  }
}

const onSave = async () => {
  // 校验
  const resp = await formRef.value.validate();
  if (resp) {
    loading.value = true
    // 保存新增基本信息
    const resp1 = await saveRole_api(formData).catch(() => {
      loading.value = false
    })
    if (resp1.success) {
      const id = resp1.result?.id
      if (id) {
        let resp2, resp3;
        if (_data.menu.length) {
          // 保存权限信息
          resp2 = await updatePermissionTree_api(id, {
            menus: _data.menu,
          }).catch(() => {
            loading.value = false
          })
        }
        // 保存绑定用户
        if (_data.user.length) {
          resp3 = await bindUser_api(id, _data.user).catch(() => {
            loading.value = false
          })
        }
        if ((resp2 === undefined || resp2.success) && (resp3 === undefined || resp3.success)) {
          onlyMessage($t('Permission.index.071527-2'))
          loading.value = false
          emits('save', id)
        }
      } else {
        loading.value = false
      }
    } else {
      loading.value = false
    }
  }
}

watch(() => JSON.stringify(props.data), () => {
  formData.groupId = props.data.groupId
  queryGrant(props.data.id)
}, {
  immediate: true
})

onMounted(() => {
  getGroupOptions()
})
</script>

<style lang="less" scoped>
.alert-info {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 16px;
  background-color: rgba(#bfbfbf, .5);
  align-items: center;
}
</style>
