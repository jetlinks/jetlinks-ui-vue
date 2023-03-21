<template>
  <div class="editor-box">
    <div class="top">
      <div class="left">
        <span v-for="item in symbolList.filter((t: SymbolType, i: number) => i <= 3)" :key="item.key"
          @click="addOperatorValue(item.value)">
          {{ item.value }}
        </span>
        <span>
          <j-dropdown>
            <AIcon type="MoreOutlined" />
            <template #overlay>
              <j-menu>
                <j-menu-item v-for="item in symbolList.filter((t: SymbolType, i: number) => i > 6)" :key="item.key"
                  @click="addOperatorValue(item.value)">
                  {{ item.value }}
                </j-menu-item>
              </j-menu>
            </template>
          </j-dropdown>
        </span>
      </div>
      <div class="right">
        <span v-if="mode !== 'advance'">
          <j-tooltip :title="!id ? '请先输入标识' : '设置属性规则'">
            <AIcon type="FullscreenOutlined" :class="!id ? 'disabled' : ''" @click="fullscreenClick" />
          </j-tooltip>
        </span>
      </div>
    </div>
    <div class="editor">
      <j-monaco-editor v-if="loading" v-model:model-value="_value" theme="vs" ref="editor" language="javascript"/>
    </div>
  </div>
</template>
<script setup lang="ts" name="Editor">

interface Props {
  mode?: 'advance' | 'simple';
  id?: string;
  value?: string;
}
const props = defineProps<Props>()

interface Emits {
  (e: 'change', data: string): void;
  (e: 'update:value', data: string): void;
}

const emit = defineEmits<Emits>()

type editorType = {
  insert(val: string): void
}
const editor = ref<editorType>()

type SymbolType = {
  key: string,
  value: string
}
const symbolList = [
  {
    key: 'add',
    value: '+',
  },
  {
    key: 'subtract',
    value: '-',
  },
  {
    key: 'multiply',
    value: '*',
  },
  {
    key: 'divide',
    value: '/',
  },
  {
    key: 'parentheses',
    value: '()',
  },
  {
    key: 'cubic',
    value: '^',
  },
  {
    key: 'dayu',
    value: '>',
  },
  {
    key: 'dayudengyu',
    value: '>=',
  },
  {
    key: 'dengyudengyu',
    value: '==',
  },
  {
    key: 'xiaoyudengyu',
    value: '<=',
  },
  {
    key: 'xiaoyu',
    value: '<',
  },
  {
    key: 'jiankuohao',
    value: '<>',
  },
  {
    key: 'andand',
    value: '&&',
  },
  {
    key: 'huohuo',
    value: '||',
  },
  {
    key: 'fei',
    value: '!',
  },
  {
    key: 'and',
    value: '&',
  },
  {
    key: 'huo',
    value: '|',
  },
  {
    key: 'bolang',
    value: '~',
  },
] as SymbolType[];

const _value = computed({
  get: () => props.value || '',
  set: (data: string) => {
    emit('update:value', data);
  }
})

const loading = ref(false)
onMounted(() => {
  setTimeout(() => {
    loading.value = true;
  }, 100);
})

const addOperatorValue = (val: string) => {
  editor.value?.insert(val)
}

const fullscreenClick = () => {
  if (props.id) {
    emit('change', 'advance');
  }
}

defineExpose({
  addOperatorValue
})

</script>
<style lang="less" scoped>
.editor-box {
  margin-bottom: 10px;
  border: 1px solid lightgray;

  .top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid lightgray;

    .left {
      display: flex;
      align-items: center;
      width: 60%;
      margin: 0 5px;

      span {
        display: inline-block;
        height: 40px;
        margin: 0 10px;
        line-height: 40px;
        cursor: pointer;
      }
    }

    .right {
      display: flex;
      align-items: center;
      width: 10%;
      margin: 0 5px;

      span {
        margin: 0 5px;
      }
    }

    .disabled {
      color: rgba(#000, 0.5);
      cursor: not-allowed;
    }
  }

  .editor {
    height: 300px;
  }
}
</style>