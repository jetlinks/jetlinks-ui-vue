#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logWithPrefix(message, prefix, color = 'cyan') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors[color]}[${prefix}]${colors.reset} ${message}`);
}

function scanModules() {
  const modulesPath = path.resolve(__dirname, '../../modules');
  const modules = [];

  try {
    const folders = fs.readdirSync(modulesPath);

    folders.forEach((folder) => {
      const modulePath = path.resolve(modulesPath, folder);
      const packageJsonPath = path.resolve(modulePath, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        try {
          const content = fs.readFileSync(packageJsonPath, 'utf-8');
          const pkg = JSON.parse(content);
          modules.push({
            name: pkg.name || folder,
            folder: folder,
            description: pkg.description || '暂无描述',
            version: pkg.version || '0.0.0',
            // 优先使用 package.json 中的 id 字段，如果没有则使用 name，再没有则从文件夹名提取
            id: pkg.id || folder.replace(/-ui$/, ''),
            selected: false,
          });
        } catch (error) {
          log(`  ⚠️  警告: 读取 ${folder} 的 package.json 失败`, 'yellow');
        }
      }
    });
  } catch (error) {
    log(`❌ 错误: 扫描模块目录失败`, 'red');
    process.exit(1);
  }

  return modules;
}

function displayModuleList(modules, currentIndex) {
  console.clear();
  console.log('\n' + '='.repeat(80));
  log('🚀 微模块选择器', 'bright');
  console.log('='.repeat(80) + '\n');

  log(`📦 共找到 ${modules.length} 个子模块:\n`, 'cyan');

  modules.forEach((mod, index) => {
    const checkbox = mod.selected ? `${colors.green}✓${colors.reset}` : `${colors.dim}✓${colors.dim}`;
    const num = `${index + 1}`.padStart(2, ' ');

    // 高亮当前选中的行
    if (index === currentIndex) {
      console.log(`  ${colors.blue}[${num}]${colors.reset} ${checkbox} ${colors.bright}${colors.yellow}▶ ${mod.name}${colors.reset}：${colors.white}${mod.description}${colors.reset}`);
    } else {
      console.log(`  ${colors.blue}[${num}]${colors.reset} ${checkbox} ${colors.bright}【${mod.name}】：${colors.white}${mod.description}${colors.reset}`);
    }
  });

  console.log('\n' + '='.repeat(80));
  log('\n📋 操作说明:', 'bright');
  console.log('  • ↑↓ 键：上下移动光标');
  console.log('  • 空格键：选择/取消选择当前模块（不移动光标）');
  console.log('  • 回车键：确认选择并启动');
  console.log('  • 输入 all：选择所有模块');
  console.log('  • 输入 q：退出');
  console.log('\n' + '='.repeat(80));
  log('\n🚀 启动参数:', 'bright');
  console.log('  • --backend-url <地址>: 指定后端服务地址（如: http://localhost:8080）');
  console.log('    示例: node scripts/start-micro.js --backend-url http://localhost:8080');
  console.log('='.repeat(80) + '\n');

  const selectedCount = modules.filter(m => m.selected).length;
  const prompt = `${colors.green}已选择 ${selectedCount} 个模块，请操作: ${colors.reset}`;
  console.log(prompt);
}

function promptSelection(modules) {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let currentIndex = 0;
    let isRawMode = false;

    function redisplay() {
      displayModuleList(modules, currentIndex);
    }

    // 初始显示
    redisplay();

    rl.on('line', (input) => {
      const trimmed = input.trim().toLowerCase();

      if (trimmed === 'q' || trimmed === 'quit' || trimmed === 'exit') {
        log('\n👋 退出中...', 'yellow');
        process.exit(0);
      }

      if (trimmed === 'ok' || trimmed === 'enter') {
        const selectedModules = modules.filter(m => m.selected);
        if (selectedModules.length === 0) {
          log('\n⚠️  请至少选择一个模块！\n', 'yellow');
          return;
        }
        // 恢复原始模式
        if (isRawMode && process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        rl.close();
        return resolve(selectedModules);
      }

      if (trimmed === 'all') {
        modules.forEach(m => m.selected = true);
        redisplay();
        return;
      }

      // 纯数字输入，跳转到指定模块
      if (/^\d+$/.test(trimmed)) {
        const num = parseInt(trimmed, 10);
        if (num >= 1 && num <= modules.length) {
          currentIndex = num - 1;
        }
        redisplay();
        return;
      }

      redisplay();
    });

    // 监听特殊按键
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      isRawMode = true;

      process.stdin.on('keypress', (str, key) => {
        if (key.name === 'up') {
          currentIndex = currentIndex === 0 ? modules.length - 1 : currentIndex - 1;
          redisplay();
        } else if (key.name === 'down') {
          currentIndex = currentIndex === modules.length - 1 ? 0 : currentIndex + 1;
          redisplay();
        } else if (key.name === 'space') {
          modules[currentIndex].selected = !modules[currentIndex].selected;
          // 选择后不移动光标，让用户手动控制
          redisplay();
        } else if (key.name === 'return') {
          const selectedModules = modules.filter(m => m.selected);
          if (selectedModules.length > 0) {
            // 恢复原始模式
            if (isRawMode) {
              process.stdin.setRawMode(false);
              isRawMode = false;
            }
            rl.close();
            resolve(selectedModules);
          }
        } else if (key.name === 'q' && key.ctrl) {
          log('\n\n👋 退出中...', 'yellow');
          process.exit(0);
        }
      });
    }
  });
}

function startModule(module, index, total, allModuleIds) {
  return new Promise((resolve, reject) => {
    log(`\n${colors.bright}▶ 启动模块 ${index + 1}/${total}: ${module.name}${colors.reset}`, 'bright');

    // 解析命令行参数中的后端地址
    const backendUrlIndex = process.argv.indexOf('--backend-url')
    let backendUrl = backendUrlIndex !== -1 ? process.argv[backendUrlIndex + 1] : null

    // 自动添加 http:// 前缀（如果用户未输入）
    if (backendUrl && !backendUrl.match(/^https?:\/\//)) {
      backendUrl = `http://${backendUrl}`
    }

    // 构建启动参数
    const devArgs = ['dev', '--filter', 'jetlinks-web-core', '--', '--module-name', allModuleIds || module.name]
    if (backendUrl) {
      devArgs.push('--backend-url', backendUrl)
    }

    // 使用 spawn 以支持实时输出，传递所有模块ID
    const child = spawn('pnpm', devArgs, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      cwd: path.resolve(__dirname, '..'),
    });

    let serverReady = false;
    let serverUrl = '';

    child.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        // 检查是否是服务器启动信息
        if (output.includes('Local:') || output.includes('Network:')) {
          if (!serverReady) {
            serverReady = true;
            log(`\n${colors.green}✅ 服务器已启动！${colors.reset}\n`, 'green');
          }
          log(`${colors.bright}${output}${colors.reset}`, 'cyan');
          if (output.includes('http')) {
            serverUrl = output.match(/http[^\s]+/)?.[0] || '';
            if (serverUrl) {
              log(`\n${colors.green}📝 模块访问地址: ${colors.bright}${serverUrl}${colors.reset}`, 'green');
              log(`${colors.dim}模块ID: ${module.id}${colors.reset}\n`, 'dim');
            }
          }
        } else {
          logWithPrefix(output, module.name, 'cyan');
        }
      }
    });

    child.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        logWithPrefix(output, module.name, 'yellow');
      }
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ 模块 ${module.name} 退出成功`, 'green');
        resolve();
      } else {
        log(`❌ 模块 ${module.name} 退出，代码 ${code}`, 'red');
        reject(new Error(`模块 ${module.name} 退出，代码 ${code}`));
      }
    });

    child.on('error', (error) => {
      log(`❌ 启动模块 ${module.name} 失败: ${error.message}`, 'red');
      reject(error);
    });

    // 存储进程引用以便后续清理
    global.moduleProcesses = global.moduleProcesses || [];
    global.moduleProcesses.push({ module, process: child });
  });
}

async function startModules(selectedModules) {
  log('\n' + '='.repeat(80));
  log('🎯 已选择的模块:', 'bright');
  console.log('='.repeat(80) + '\n');

  // 调试：输出已选择模块的详细信息
  console.log(`\n${colors.yellow}[DEBUG] 已选择模块数量: ${selectedModules.length}${colors.reset}`);
  selectedModules.forEach((mod, index) => {
    console.log(`  ${index + 1}. ${colors.green}✓${colors.reset} ${colors.bright}【${mod.id}】：${colors.white}${mod.description}${colors.reset}`);
    console.log(`     ${colors.dim}路径:${colors.reset} ${mod.folder}`);
    console.log(`     ${colors.dim}版本:${colors.reset} ${mod.version}`);
  });

  console.log('='.repeat(80));

  if (selectedModules.length === 1) {
    log('\n🚀 正在启动选中的模块...\n', 'bright');
  } else {
    log(`\n🚀 正在并行启动 ${selectedModules.length} 个选中的模块...\n`, 'bright');
  }

  // 启动所有选中的模块
  try {
    // 将多个模块名合并为逗号分隔的字符串传递给单个Vite实例
    const moduleIds = selectedModules.map(m => m.name).join(',');

    // 使用第一个模块作为启动代表，但传递所有模块ID
    const mainModule = selectedModules[0];
    await startModule(mainModule, 0, 1, moduleIds);

    log('\n✨ 所有模块启动成功！', 'green');
    log('\n💡 按 Ctrl+C 停止所有模块\n', 'yellow');
  } catch (error) {
    log(`\n❌ 启动模块时出错: ${error.message}`, 'red');
    await stopAllModules();
    process.exit(1);
  }

  // 保持脚本运行
  return new Promise(() => {});
}

function stopAllModules() {
  return new Promise((resolve) => {
    if (!global.moduleProcesses || global.moduleProcesses.length === 0) {
      resolve();
      return;
    }

    log('\n\n🛑 正在停止所有模块...', 'yellow');
    global.moduleProcesses.forEach(({ module, process }) => {
      log(`  停止 ${module.name}...`, 'yellow');
      process.kill();
    });

    setTimeout(() => {
      global.moduleProcesses = [];
      resolve();
    }, 1000);
  });
}

// 监听退出信号
process.on('SIGINT', async () => {
  log('\n\n⚡ 收到 SIGINT 信号', 'yellow');
  await stopAllModules();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log('\n\n⚡ 收到 SIGTERM 信号', 'yellow');
  await stopAllModules();
  process.exit(0);
});

async function main() {
  try {
    log('\n🔍 正在扫描模块...', 'cyan');
    const modules = scanModules();

    if (modules.length === 0) {
      log('❌ 在 modules 目录中未找到任何模块', 'red');
      process.exit(1);
    }

    log(`✅ 找到 ${modules.length} 个模块`, 'green');

    const selectedModules = await promptSelection(modules);

    await startModules(selectedModules);
  } catch (error) {
    log(`\n❌ 错误: ${error.message}`, 'red');
    await stopAllModules();
    process.exit(1);
  }
}

main();
