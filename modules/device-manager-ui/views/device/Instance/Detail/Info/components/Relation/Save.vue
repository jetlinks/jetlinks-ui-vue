<template>
  <a-drawer placement="right" :closable="false" :open="true">
    <template #title>
      <div
          style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                "
      >
                <span
                ><AIcon
                    type="CloseOutlined"
                    style="margin-right: 5px"
                    @click="onClose"
                />{{ $t('Product.index.660348-13') }}</span
                >
        <a-button type="primary" @click="saveBtn">{{ $t('DeviceAccess.index.594346-16') }}</a-button>
      </div>
    </template>
    <a-form layout="vertical" ref="formRef" :model="modelRef">
      <a-form-item
          :name="item.relation"
          :label="item.relationName"
          v-for="(item, index) in dataSource"
          :key="index"
      >
        <a-select
            showSearch
            mode="multiple"
            v-model:value="modelRef[item.relation]"
            :placeholder="`请选择${item.relationName}`"
        >
          <a-select-option
              :value="item.value"
              v-for="item in _userList"
              :key="item.id"
              :disabled="item.extra"
          >{{ item.name }}
          </a-select-option
          >
        </a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
import {saveRelations} from '../../../../../../../api/instance';
import {queryUserListNoPaging} from '@jetlinks-web-core/api/system/user';
import {useInstanceStore} from '../../../../../../../store/instance';
import {onlyMessage} from '@jetlinks-web-core/utils/comm';
import {useI18n} from 'vue-i18n';
import {map} from "lodash-es";

const {t: $t} = useI18n();
const emit = defineEmits(['close', 'save']);

const formRef = ref();
const modelRef = reactive<any>({});
const userList = ref<Record<string, any>[]>([]);
const allData = ref<any[]>([])
const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);

watch(
    () => instanceStore.current?.relations,
    () => {
      allData.value = [];
      const arr = (instanceStore.current?.relations || [])
      dataSource.value = arr as Record<any, any>[];
      arr.map((item) => {
        modelRef[item.relation] = [];
        (item?.related || []).map(i => {
          const _item = JSON.stringify(i);
          modelRef[item.relation].push(_item)
          if(!map(allData.value, 'id').includes(i.id)){
            allData.value.push({
              ...i,
              label: i.name,
              value: _item,
              extra: true
            })
          }
        })
      });
    }, {
      deep: true,
      immediate: true
    })

const _userList = computed(() => {
  const arr = allData.value.filter(i => {
    return !map(userList.value, 'id').includes(i.id)
  })
  return [...userList.value, ...arr]
})

onMounted(() => {
  queryUserListNoPaging().then((resp) => {
    if (resp.success) {
      userList.value = (resp.result as Record<string, any>[]).map(
          (item) => {
            return {
              ...item,
              label: item.name,
              value: JSON.stringify({
                id: item.id,
                name: item.name,
              }),
            };
          },
      );
    }
  });
});

const onClose = () => {
  emit('close');
  formRef.value.resetFields();
};

const saveBtn = () => {
  formRef.value.validate().then(async () => {
    const values = toRaw(modelRef);
    if (Object.keys(values).length > 0) {
      const param: any[] = [];
      Object.keys(values).forEach((key) => {
        const item = dataSource.value.find((i) => i.relation === key);
        const items = (values[key] || []).map((i: string) =>
            JSON.parse(i),
        );
        if (item) {
          param.push({
            relatedType: 'user',
            relation: item.relation,
            description: '',
            related: [...items],
          });
        }
      });
      if (param.length && instanceStore.current.id) {
        const resp = await saveRelations(instanceStore.current.id, param);
        if (resp.status === 200) {
          onlyMessage($t('Product.index.660348-18'));
          emit('save');
          formRef.value.resetFields();
        }
      }
    }
  });
};
</script>
