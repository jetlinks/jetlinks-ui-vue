<!-- 代码编辑器 -->
<template>
    <div class="editor" ref="dom"></div>
</template>

<script setup>
import * as monaco from 'monaco-editor';

// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
//
// self.MonacoEnvironment = {
//     getWorker(_, label) {
//         if (label === 'json') {
//             return new jsonWorker();
//         }
//         if (label === 'css') {
//             return new cssWorker();
//         }
//         if (label === 'html') {
//             return new htmlWorker();
//         }
//         if (['typescript', 'javascript'].includes(label)) {
//             return new tsWorker();
//         }
//         return new editorWorker();
//     },
// };

const props = defineProps({
    modelValue: [String, Number],
    theme: { type: String, default: 'vs-dark' },
    language: { type: String, default: 'json' },
});

const emit = defineEmits(['update:modelValue']);

const dom = ref();

let instance;

onMounted(() => {
    const _model = monaco.editor.createModel(props.modelValue, props.language);

    instance = monaco.editor.create(dom.value, {
        model: _model,
        tabSize: 2,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        theme: props.theme, // 主题色: vs(默认高亮), vs-dark(黑色), hc-black(高亮黑色)
        formatOnPaste: true,
    });

    instance.onDidChangeModelContent(() => {
        const value = instance.getValue();
        emit('update:modelValue', value);
    });
});

/**
 * 代码格式化
 */
const editorFormat = () => {
    if (!instance) return;
    instance.getAction('editor.action.formatDocument')?.run();
};

watchEffect(() => {
    setTimeout(() => {
        editorFormat();
    }, 300);
});

/**
 * 光标位置插入内容
 * @param {String} val 
 */
const insert = (val) => {
    if (!instance) return;
    const position = instance.getPosition();
    instance.executeEdits(instance.getValue(), [
        {
            range: new monaco.Range(
                position?.lineNumber,
                position?.column,
                position?.lineNumber,
                position?.column,
            ),
            text: val,
        },
    ]);
};

watch(
    () => props.modelValue,
    (val) => {
        if (!instance) return;
        // setValue之前获取光标位置
        const position = instance.getPosition();
        // setValue之后光标位置改变
        instance.setValue(val);
        // 设置光标位置为setValue之前的位置
        instance.setPosition({
            column: position?.column,
            lineNumber: position?.lineNumber,
        });
    },
);

defineExpose({
    editorFormat,
    insert,
});
</script>

<style lang="less" scoped>
.editor {
    height: 100%;
}
</style>
