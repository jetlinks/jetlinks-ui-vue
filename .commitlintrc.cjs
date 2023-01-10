module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // 编译相关修改（新版本发布）
        'feat', // 新功能
        'fix', // 修复bug
        'update', // 更新某功能
        'refactor', // 重构
        'docs', // 文档
        'chore', // 增加依赖或库
        'style', // 格式（不影响代码变动）
        'revert', // 撤销commit 回滚上一版本
        'perf', // 性能优化
      ]
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72]
  }
}