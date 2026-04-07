<template>
  <div class="scene-center-detail">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          <a @click="onClick" class="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            返回广场
          </a>
          <a @click="onClick" class="logo">
            <div class="logo-icon">JL</div>
            <span class="logo-text">JetLinks</span>
          </a>
        </div>

        <div class="header-actions">
          <!--          <button-->
          <!--              class="btn-login"-->
          <!--              v-show="!isLoggedIn"-->
          <!--              @click="showLoginModal"-->
          <!--          >-->
          <!--            登录-->
          <!--          </button>-->

          <div class="user-menu">
            <div class="user-avatar">旱</div>
            <span class="user-name">旱獭科技</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <div class="main-layout">
      <div class="content-main">
        <!-- Scene Header -->
        <div class="scene-header">
          <div class="scene-cover">
            <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=600&fit=crop"
                alt="交通违章识别"
            />
            <div class="scene-cover-content">
              <div class="scene-badges">
                <span class="scene-badge hot">热门</span>
                <span class="scene-badge industry">智慧交通</span>
              </div>
              <h1 class="scene-title">交通违章停车智能识别</h1>
              <p class="scene-subtitle">
                基于机器视觉 + 多模态AI复判的高精度违章检测方案
              </p>
            </div>
          </div>

          <div class="scene-info">
            <div class="scene-meta-row">
              <span class="scene-meta-item"><strong>328</strong> 次部署</span>
              <span class="scene-meta-item"><strong>4.9</strong> 评分</span>
              <span class="scene-meta-item">更新于 2025-01-15</span>
            </div>

            <div class="scene-tags">
              <span class="scene-tag vision">机器视觉</span>
              <span class="scene-tag ai">多模态AI</span>
              <span class="scene-tag video">视频中台</span>
              <span class="scene-tag edge">边缘计算</span>
            </div>
          </div>
        </div>

        <!-- 场景概述 -->
        <div class="content-section">
          <h2 class="section-title">场景概述</h2>
          <p class="section-text">
            交通违章停车智能识别场景是基于 JetLinks 物联网平台核心能力构建的智慧交通解决方案。
          </p>
          <p class="section-text">
            通过边缘计算与多模态 AI 复判，将识别准确率提升至 99.2% 以上。
          </p>
        </div>

        <!-- 核心功能 -->
        <div class="content-section">
          <h2 class="section-title">核心功能</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="(f,i) in features" :key="i">
              <div class="feature-icon">{{ f.icon }}</div>
              <h3 class="feature-title">{{ f.title }}</h3>
              <p class="feature-desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 应用价值 -->
        <div class="content-section">
          <h2 class="section-title">应用价值</h2>
          <div class="values-grid">
            <div class="value-card" v-for="(v,i) in values" :key="i">
              <div class="value-number" v-html="v.value"></div>
              <div class="value-label">{{ v.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <div class="create-card">
          <div class="create-card-header">
            <h3 class="create-card-title">创建场景实例</h3>
            <p class="create-card-desc">
              基于此场景模板快速创建您的专属实例
            </p>
          </div>
          <div class="preset-info">
            <div class="preset-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              已预置能力组件
            </div>
            <div class="preset-list">
              <div class="preset-item">违停检测CV算法模型 (YOLOv8-parking)</div>
              <div class="preset-item">车牌识别模型 (LPR-v3)</div>
              <div class="preset-item">多模态复判智能体 (GPT-4V)</div>
              <div class="preset-item">证据链生成规则模板</div>
              <div class="preset-item">告警推送通知模板</div>
            </div>
          </div>
          <button
              class="btn-create"
              :class="{ 'is-creating': isCreating }"
              :disabled="isCreating"
              @click="handleCreateScene"
          >
            {{ isCreating ? '创建中' : '开始创建场景' }}
          </button>

          <button class="btn-demo">
            观看演示视频
          </button>
        </div>
        <div class="related-section">
          <h3 class="related-title">相关场景推荐</h3>
          <div class="related-list">
            <a href="#" class="related-item">
              <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=200&h=150&fit=crop" class="related-thumb">
              <div>
                <div class="related-name">交通信号自适应控制</div>
                <div class="related-meta">智慧交通 · 45次部署</div>
              </div>
            </a>
            <a href="#" class="related-item">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop" class="related-thumb">
              <div>
                <div class="related-name">智慧路灯管控系统</div>
                <div class="related-meta">智慧城市 · 156次部署</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-text">
          © 2025 旱獭信息技术有限公司 · JetLinks 物联网平台
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <CreationBanner v-if="loginModalVisible" @close="loginModalVisible = false"/>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import CreationBanner from './CreationBanner.vue'

const isLoggedIn = ref(false);
const loginModalVisible = ref(false);
const pendingCreateScene = ref(false);
const isCreating = ref(false);

const features = [
  {icon: "🎯", title: "智能违章检测", desc: "基于深度学习算法自动识别违停行为。"},
  {icon: "🧠", title: "多模态AI复判", desc: "理解复杂场景语义，有效降低误报。"},
  {icon: "📹", title: "证据链生成", desc: "自动生成视频与图片证据链。"},
  {icon: "⚡", title: "边缘实时处理", desc: "毫秒级响应，支持断网续传。"},
  {icon: "📊", title: "数据可视化", desc: "实时统计与大屏展示。"},
  {icon: "🔗", title: "系统对接", desc: "标准 API 对接交管系统。"}
];

const values = [
  {value: "99.2<span class='value-unit'>%</span>", label: "识别准确率"},
  {value: "80<span class='value-unit'>%</span>", label: "人工成本降低"},
  {value: "&lt;3<span class='value-unit'>秒</span>", label: "平均响应时间"}
];

onMounted(() => {
  isLoggedIn.value = localStorage.getItem("isLoggedIn") === "true";
});

const router = useRouter();
const onClick = () => {
  router.push("/scene/center");
}

function showLoginModal() {
  loginModalVisible.value = true;
}

function hideLoginModal() {
  loginModalVisible.value = false;
}

function handleLogin() {
  isLoggedIn.value = true;
  localStorage.setItem("isLoggedIn", "true");
  hideLoginModal();

  if (pendingCreateScene.value) {
    pendingCreateScene.value = false;
    window.location.href =
        "create-wizard.html?template=traffic-parking-violation";
  }
}

function handleCreateScene() {
  // if (!isLoggedIn.value) {
  //   pendingCreateScene.value = true;
  //   showLoginModal();
  // } else {
  //   window.location.href =
  //       "create-wizard.html?template=traffic-parking-violation";
  // }
  isCreating.value = true;
  loginModalVisible.value = true;
}

// 监听弹窗关闭,恢复按钮状态
watch(loginModalVisible, (newVal) => {
  if (!newVal) {
    isCreating.value = false;
  }
});
</script>

<style lang="less">
// Less 变量定义
@primary: #1890ff;
@primary-dark: #0d6efd;
@primary-light: #69c0ff;
@primary-bg: #e6f4ff;
@secondary: #00d9ff;
@accent: #722ed1;
@success: #52c41a;
@warning: #faad14;
@error: #ff4d4f;
@dark: #0a1628;
@dark-secondary: #111d32;
@gray-100: #f8fafc;
@gray-200: #e2e8f0;
@gray-300: #cbd5e1;
@gray-400: #94a3b8;
@gray-500: #64748b;
@gray-600: #475569;
@text-primary: #1e293b;
@text-secondary: #64748b;
@card-bg: #ffffff;
@border-color: #e2e8f0;
@radius-sm: 6px;
@radius-md: 10px;
@radius-lg: 16px;
@radius-xl: 24px;

.scene-center-detail {
  .header {
    background: @card-bg;
    border-bottom: 1px solid @border-color;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: @radius-sm;
    color: @text-secondary;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: @gray-100;
    color: @text-primary;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: @text-primary;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, @primary, @secondary);
    border-radius: @radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }

  .logo-text {
    font-weight: 600;
    font-size: 18px;
  }

  .user-menu {
    display: none;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .user-menu.show {
    display: flex;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, @primary, @accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  .user-name {
    font-size: 14px;
  }

  .main-layout {
    max-width: 1440px;
    margin: 0 auto;
    padding: 32px;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 32px;
  }

  .scene-header {
    background: @card-bg;
    border-radius: @radius-lg;
    border: 1px solid @border-color;
    overflow: hidden;
  }

  .scene-cover {
    height: 300px;
    position: relative;
    overflow: hidden;
  }

  .scene-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .scene-cover::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  }

  .scene-cover-content {
    position: absolute;
    bottom: 28px;
    left: 28px;
    right: 28px;
    z-index: 2;
  }

  .scene-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .scene-badge {
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .scene-badge.hot {
    background: linear-gradient(135deg, #ff4d4f, #ff7a45);
    color: white;
  }

  .scene-badge.industry {
    background: rgba(255, 255, 255, 0.95);
    color: @text-primary;
  }

  .scene-title {
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 10px;
  }

  .scene-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.8);
  }

  .scene-info {
    padding: 24px 28px;
  }

  .scene-meta-row {
    display: flex;
    align-items: center;
    gap: 28px;
    margin-bottom: 20px;
  }

  .scene-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: @text-secondary;
  }

  .scene-meta-item svg {
    width: 16px;
    height: 16px;
  }

  .scene-meta-item strong {
    color: @text-primary;
    font-weight: 600;
  }

  .scene-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .scene-tag {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    background: @gray-100;
    color: @gray-600;
    border: 1px solid @border-color;
  }

  .scene-tag.vision {
    background: #fff0f6;
    color: #c41d7f;
    border-color: #ffadd2;
  }

  .scene-tag.ai {
    background: #f0f5ff;
    color: #2f54eb;
    border-color: #adc6ff;
  }

  .scene-tag.video {
    background: #fff7e6;
    color: #d46b08;
    border-color: #ffd591;
  }

  .scene-tag.edge {
    background: #f6ffed;
    color: #389e0d;
    border-color: #b7eb8f;
  }

  .content-section {
    background: @card-bg;
    border-radius: @radius-lg;
    border: 1px solid @border-color;
    padding: 28px;
    margin-top: 24px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::before {
    content: '';
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, @primary, @secondary);
    border-radius: 2px;
  }

  .section-text {
    font-size: 14px;
    color: @text-secondary;
    line-height: 1.9;
  }

  .section-text + .section-text {
    margin-top: 12px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 8px;
  }

  .feature-card {
    padding: 20px;
    background: @gray-100;
    border-radius: @radius-md;
    border: 1px solid @border-color;
    transition: all 0.2s;
  }

  .feature-card:hover {
    background: @primary-bg;
    border-color: @primary-light;
  }

  .feature-icon {
    width: 44px;
    height: 44px;
    border-radius: @radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 14px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .feature-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .feature-desc {
    font-size: 13px;
    color: @text-secondary;
    line-height: 1.6;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
  }

  .value-card {
    text-align: center;
    padding: 24px 16px;
    background: linear-gradient(135deg, @primary-bg, white);
    border-radius: @radius-md;
    border: 1px solid @primary-light;
  }

  .value-number {
    font-size: 36px;
    font-weight: 700;
    color: @primary;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
  }

  .value-unit {
    font-size: 16px;
    color: @primary;
  }

  .value-label {
    font-size: 13px;
    color: @text-secondary;
    margin-top: 8px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .create-card {
    background: @card-bg;
    border-radius: @radius-lg;
    border: 1px solid @border-color;
    padding: 28px;
    position: sticky;
    top: 96px;
  }

  .create-card-header {
    margin-bottom: 24px;
  }

  .create-card-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .create-card-desc {
    font-size: 14px;
    color: @text-secondary;
    line-height: 1.7;
  }

  .preset-info {
    background: @primary-bg;
    border: 1px solid @primary-light;
    border-radius: @radius-md;
    padding: 18px;
    margin-bottom: 24px;
  }

  .preset-title {
    font-size: 13px;
    font-weight: 600;
    color: @primary-dark;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .preset-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .preset-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: @text-secondary;
    line-height: 1.5;
  }

  .preset-item::before {
    content: '✓';
    color: @success;
    font-weight: 700;
  }

  .btn-create {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, @primary, @primary-dark);
    color: white;
    border: none;
    border-radius: @radius-md;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-create:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(24, 144, 255, 0.35);
  }

  .btn-create:disabled,
  .btn-create.is-creating {
    background: @gray-300;
    color: @gray-500;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn-create:disabled:hover,
  .btn-create.is-creating:hover {
    transform: none;
    box-shadow: none;
  }

  .btn-demo {
    width: 100%;
    padding: 14px 24px;
    background: @card-bg;
    color: @text-primary;
    border: 1px solid @border-color;
    border-radius: @radius-md;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-demo:hover {
    background: @gray-100;
  }

  .related-section {
    background: @card-bg;
    border-radius: @radius-lg;
    border: 1px solid @border-color;
    padding: 24px;
  }

  .related-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .related-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .related-item {
    display: flex;
    gap: 14px;
    padding: 12px;
    background: @gray-100;
    border-radius: @radius-md;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .related-item:hover {
    background: @primary-bg;
  }

  .related-thumb {
    width: 72px;
    height: 54px;
    border-radius: 6px;
    object-fit: cover;
  }

  .related-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .related-meta {
    font-size: 12px;
    color: @text-secondary;
  }

  .footer {
    background: @dark;
    color: rgba(255, 255, 255, 0.7);
    padding: 40px 32px;
    margin-top: 60px;
  }

  .footer-inner {
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-text {
    font-size: 13px;
  }

  .footer-links {
    display: flex;
    gap: 24px;
  }

  .footer-link {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
  }

  .footer-link:hover {
    color: white;
  }

  .modal-overlay.active .modal {
    transform: scale(1);
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @gray-400;
    z-index: 10;
  }

  .modal-close:hover {
    background: @gray-100;
    color: @text-primary;
  }

  .modal-header {
    padding: 28px 24px 0;
    text-align: center;
  }

  .modal-logo {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, @primary, @secondary);
    border-radius: @radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 20px;
    margin: 0 auto 16px;
  }

  .modal-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .modal-subtitle {
    font-size: 14px;
    color: @text-secondary;
  }

  .modal-body {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid @border-color;
    border-radius: @radius-sm;
    font-size: 14px;
    transition: all 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: @primary;
    box-shadow: 0 0 0 3px @primary-bg;
  }

  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .form-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: @text-secondary;
    cursor: pointer;
  }

  .form-checkbox input {
    width: 16px;
    height: 16px;
    accent-color: @primary;
  }

  .form-link {
    font-size: 13px;
    color: @primary;
    text-decoration: none;
  }

  .btn-submit {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, @primary, @primary-dark);
    color: white;
    border: none;
    border-radius: @radius-md;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-footer {
    padding: 16px 24px 24px;
    text-align: center;
    font-size: 13px;
    color: @text-secondary;
  }

  .modal-footer a {
    color: @primary;
    text-decoration: none;
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    .main-layout {
      grid-template-columns: 1fr;
    }

    .create-card {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .main-layout {
      padding: 16px;
    }

    .scene-title {
      font-size: 24px;
    }

    .features-grid, .values-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
