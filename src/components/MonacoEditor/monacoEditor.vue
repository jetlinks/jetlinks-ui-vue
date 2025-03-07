<!-- 代码编辑器 -->
<template>
  <div ref="dom" class="j-monaco-editor"></div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  onUnmounted,
  nextTick
} from 'vue';
import * as monaco from 'monaco-editor';
import { omit } from 'lodash-es';

defineOptions({
  name: 'JMonacoEditor'
})

const props = defineProps({
  modelValue: [String, Number],
  theme: {type: String, default: 'vs-dark'},
  language: {type: String, default: 'json'},
  codeTips: {type: Array, default: () => []},
  init: {type: Function, default: undefined},
  registrationTips: {type: Object, default: () => ({})},
  registrationTypescript: {type: Object, default: () => ({})},
  blurFormat: {type: Boolean, default: true},
  readOnly: {type: Boolean, default: false},
  options: {type: Object, default: () => ({})},
});

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change',
  'errorChange',
]);

const dom = ref();

let instance

const monacoProviderRef = ref();
const monacoTypescriptProviderRef = ref();

// codeTipItem.dispose() // 销毁自定义提示

const handleSuggestions = (suggestions, range) => {
  return Array.isArray(suggestions)
    ? suggestions.map((item) => ({...item, range}))
    : [];
};

const disposeRegister = () => {
  monacoProviderRef.value?.dispose();
  monacoProviderRef.value = null;
};
/**
 * 代码提示注册
 */
const registerCompletionItemProvider = () => {
  disposeRegister();
  if (monaco.languages && props.registrationTips?.suggestions) {
    const {name, suggestions} = props.registrationTips;
    monacoProviderRef.value =
      monaco.languages.registerCompletionItemProvider(name || 'json', {
        provideCompletionItems: function (model, position) {
          const word = model.getWordUntilPosition(position); // 获取提示代码范围位置
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          return {
            suggestions: handleSuggestions(suggestions, range),
          };
        },
      });
  }
};

const disposeTypescript = () => {
  monacoTypescriptProviderRef.value?.dispose();
  monacoTypescriptProviderRef.value = null;
};

const registerTypescript = () => {
  disposeTypescript();
  if (monaco.languages && props.registrationTypescript?.typescript) {
    const {name, typescript} = props.registrationTypescript;
    monacoTypescriptProviderRef.value =
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        typescript,
      );
  }
};

/**
 * 代码格式化
 */
const editorFormat = () => {
  if (!instance) return;
  setTimeout(() => {
    instance.getAction('editor.action.formatDocument')?.run();
  }, 300)
  if (props.hasOwnProperty('readOnly')) {
    setTimeout(() => {
      instance.updateOptions({
        readOnly: props.readOnly !== false,
      });
    }, 400);
  }
};

monaco.editor.onDidChangeMarkers(([uri]) => {
  const markers = monaco.editor.getModelMarkers({resource: uri});
  emit('errorChange', markers);
});

onMounted(async () => {
  const _model = monaco.editor.createModel(props.modelValue, props.language);

  instance = monaco.editor.create(dom.value, {
    model: _model,
    tabSize: 2,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    theme: props.theme, // 主题色: vs(默认高亮), vs-dark(黑色), hc-black(高亮黑色)
    formatOnPaste: true,
    ...(omit(props.options, ['readOnly']) || {}),
  });

  instance.onDidChangeModelContent(() => {
    //
    const value = instance.getValue();
    nextTick(() => {
      emit('update:modelValue', value);
      emit('change', value);
    });
  });

  instance.onDidBlurEditorText(() => {
    emit('blur');
    if (props.blurFormat) {
      editorFormat();
    }
  });

  instance.onDidFocusEditorText(() => {
    emit('focus');
  });

  if (props.modelValue) {
    setTimeout(() => {
      editorFormat();
    }, 200);
  }

  props.init?.(instance, monaco);
});

/**
 * 光标位置插入内容
 * @param {String} val
 * @param position
 */
const insert = (val, position) => {
  if (!instance) return;
  const _position = position || instance.getPosition();
  const value = instance.getValue();

  if (position && position.lineNumber) {
    instance.setPosition(position);
  }

  instance.executeEdits(value, [
    {
      range: new monaco.Range(
        _position?.lineNumber,
        _position?.column,
        _position?.lineNumber,
        _position?.column,
      ),
      text: val,
    },
  ]);
};

watch(
  () => props.modelValue,
  (val) => {
    if (
      !instance ||
      (instance &&
        props.modelValue === instance.getValue())
    )
      return;
    // setValue之前获取光标位置
    const position = instance.getPosition();

    // setValue之后光标位置改变
    instance.setValue(val);
    // 设置光标位置为setValue之前的位置
    instance.setPosition(position);

    editorFormat();
  },
);

watch(
  () => JSON.stringify(props.registrationTips),
  () => {
    registerCompletionItemProvider();
  },
  {immediate: true},
);

watch(
  () => JSON.stringify(props.registrationTypescript),
  () => {
    registerTypescript();
  },
  {immediate: true},
);

onUnmounted(() => {
  disposeRegister();
  disposeTypescript();
  instance.editor?.dispose?.();
});

defineExpose({
  editorFormat,
  insert,
});
</script>
<style scoped>
.j-monaco-editor {
  min-height: 50px;
  height: 100%;
}
</style>
