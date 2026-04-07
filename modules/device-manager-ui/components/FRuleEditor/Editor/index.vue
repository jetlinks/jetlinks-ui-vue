<template>
    <div class="editor-box">
        <div class="top">
            <div class="left">
                <span
                    v-for="item in symbolList.filter((t: SymbolType, i: number) => i <= 3)"
                    :key="item.key"
                    @click="addOperatorValue(item.value)"
                >
                    {{ item.value }}
                </span>
                <span>
                    <a-dropdown
                        :getPopupContainer="(node) => node || document.body"
                    >
                        <AIcon type="MoreOutlined" />
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    v-for="item in symbolList.filter((t: SymbolType, i: number) => i > 6)"
                                    :key="item.key"
                                    @click="addOperatorValue(item.value)"
                                >
                                    {{ item.value }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </span>
            </div>
            <div class="right">
                <span v-if="mode !== 'advance'">
                    <a-tooltip :title="!id ? $t('Editor.index.306905-0') : $t('Editor.index.306905-1')">
                        <AIcon
                            type="FullscreenOutlined"
                            :class="!id ? 'disabled' : ''"
                            @click="fullscreenClick"
                        />
                    </a-tooltip>
                </span>
            </div>
        </div>
        <div class="editor">
            <monaco-editor
                v-if="loading"
                v-model:model-value="_value"
                theme="vs"
                ref="editor"
                language="javascript"
                :registrationTypescript="typescriptTip"
                :registrationTips="registrationTips"
                :init="editorInit"
            />
        </div>
    </div>
</template>
<script setup lang="ts" name="Editor">
import { queryTypescript, queryProductTs } from '../../../api/instance';
import { useInstanceStore } from '../../../store/instance';
import { useProductStore } from '../../../store/product';
import { cloneDeep } from 'lodash-es';
import { inject } from 'vue';
import * as monaco from 'monaco-editor'
interface Props {
    mode?: 'advance' | 'simple';
    id?: string;
    value?: string;
    tips?: Array<any>;
}
const props = defineProps<Props>();
const target = inject('target');
const instanceStore = useInstanceStore();
const productStore = useProductStore();
interface Emits {
    (e: 'change', data: string): void;
    (e: 'update:value', data: string): void;
}

const emit = defineEmits<Emits>();

type editorType = {
    insert(val: string): void;
};
const editor = ref<editorType>();

type SymbolType = {
    key: string;
    value: string;
};

const typescriptTip = reactive({
    typescript: '',
});
const registrationTips = ref<any>({
    name: 'javascript',
});
const editorInit = (editor: any, monaco: any) => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });
};

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
    },
});

const loading = ref(false);
const queryCode = () => {
    registrationTips.value.suggestions = [...(props.tips || []), {
      label: 'for (for loop)',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      insertText: 'for (let i = 0; i < ${1:len}; i++) {\n\t$0\n}'
    }];
    let id = '';
    if (target === 'device') {
        id = instanceStore.current.id;
        queryTypescript(id).then((res) => {
            if (res.status === 200) {
                typescriptTip.typescript = res.result;
            }
        });
    } else if (target === 'product') {
        id = productStore.current.id;
        queryProductTs(id).then((res) => {
            if (res.status === 200) {
                typescriptTip.typescript = res.result;
            }
        });
    }
};

const addOperatorValue = (val: string) => {
    editor.value?.insert(val);
};

const fullscreenClick = () => {
    if (props.id) {
        emit('change', 'advance');
    }
};

defineExpose({
    addOperatorValue,
});

onMounted(() => {
    setTimeout(() => {
        loading.value = true;
    }, 100);
});

queryCode();
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
