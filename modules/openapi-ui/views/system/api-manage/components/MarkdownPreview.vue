<template>
  <div class="markdown-preview-wrapper">
    <div class="markdown-content" v-html="renderedHtml" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
})

// 简单的 Markdown 渲染器
const renderedHtml = computed(() => {
  if (!props.content) return ''

  let text = props.content

  // 代码块处理 ```...``` （必须首先处理，避免内部内容被转义）
  const codeBlocks: string[] = []
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    const escapedCode = code.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
    codeBlocks.push(`<pre><code>${escapedCode}</code></pre>`)
    return placeholder
  })

  // 转义 HTML 特殊字符
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  // 标题处理 #, ##, ###, ...
  text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
  text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
  text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>')

  // 行内代码处理 `...`
  text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // 加粗处理 **...**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 斜体处理 *...*
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 下划线处理 __...__
  text = text.replace(/__([^_]+)__/g, '<u>$1</u>')

  // 链接处理 [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // 无序列表处理
  text = text.replace(/^\- (.*?)$/gm, '<li>$1</li>')
  text = text.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')

  // 有序列表处理
  text = text.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')

  // 段落处理
  const lines = text.split('\n')
  let result: string[] = []
  let i = 0

  while (i < lines.length) {
    let line = lines[i]

    if (line.includes('__CODE_BLOCK_')) {
      // 代码块占位符
      const match = line.match(/__CODE_BLOCK_(\d+)__/)
      if (match) {
        result.push(codeBlocks[parseInt(match[1])])
      }
      i++
    } else if (line.match(/^<h[1-6]|^<ul|^<ol|^<li|^<pre|^<table/)) {
      result.push(line)
      i++
    } else if (line.trim() === '') {
      i++
    } else {
      // 段落
      result.push(`<p>${line}</p>`)
      i++
    }
  }

  return result.join('\n')
})
</script>


<style scoped lang="less">
.markdown-preview-wrapper {
  width: 100%;
  height: 100%;

  .markdown-content {
    font-size: 14px;
    line-height: 1.8;
    color: #262626;

    // 标题样式
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 24px 0 12px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 20px 0 10px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    h4,
    h5,
    h6 {
      font-size: 14px;
      font-weight: 600;
      margin: 12px 0 6px 0;
    }

    // 段落样式
    p {
      margin: 12px 0;
    }

    // 代码样式
    code {
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 12px;
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 2px;
      color: #c41d7f;

      &.inline-code {
        padding: 2px 6px;
      }
    }

    pre {
      background-color: #f5f5f5;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      padding: 12px;
      overflow-x: auto;
      margin: 12px 0;

      code {
        background-color: transparent;
        padding: 0;
        color: #262626;
        display: block;
        line-height: 1.5;
      }
    }

    // 列表样式
    ul,
    ol {
      margin: 12px 0;
      padding-left: 32px;

      li {
        margin: 6px 0;
      }
    }

    ul li {
      list-style-type: disc;
    }

    ol li {
      list-style-type: decimal;
    }

    // 链接样式
    a {
      color: #1890ff;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    // 强调样式
    strong {
      font-weight: 600;
      color: #262626;
    }

    em {
      font-style: italic;
      color: #595959;
    }

    u {
      text-decoration: underline;
      color: #262626;
    }

    // 分隔线
    hr {
      margin: 24px 0;
      border: none;
      border-top: 2px solid #f0f0f0;
    }

    // 引用样式
    blockquote {
      margin: 12px 0;
      padding: 12px 16px;
      background-color: #f5f5f5;
      border-left: 4px solid #1890ff;
      color: #595959;
    }

    // 表格样式
    table {
      border-collapse: collapse;
      margin: 12px 0;
      width: 100%;

      th,
      td {
        border: 1px solid #d9d9d9;
        padding: 12px;
        text-align: left;
      }

      th {
        background-color: #fafafa;
        font-weight: 600;
      }

      tr:nth-child(even) {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
