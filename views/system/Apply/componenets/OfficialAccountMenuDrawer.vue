<template>
  <a-drawer
    :open="visible"
    :title="drawerTitle"
    width="840"
    :body-style="{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }"
    @close="onClose"
  >
    <template #extra>
      <a-button type="primary" :loading="saveLoading" @click="handleSave">
        {{ $t('Apply.components.OfficialAccountMenuDrawer.saveAndPublish') }}
      </a-button>
    </template>
    <a-spin :spinning="loading" style="flex: 1; min-height: 0; display: flex">
      <div v-if="!appId" class="drawer-empty">{{ $t('Apply.components.OfficialAccountMenuDrawer.noApp') }}</div>
      <template v-else>
        <div class="menu-layout">
          <!-- 左侧：手机预览 -->
          <div class="phone-panel">
            <div class="phone-frame">
              <div class="phone-status-bar">
                <span class="status-time">9:41</span>
                <span class="status-icons">
                  <span class="status-signal"></span>
                  <span class="status-wifi"></span>
                  <span class="status-battery"></span>
                </span>
              </div>
              <div class="phone-nav-bar">
                <span class="nav-back">＜</span>
                <span class="nav-title">{{ appName || $t('Apply.components.OfficialAccountMenuDrawer.title') }}</span>
                <span class="nav-more">···</span>
              </div>
              <div class="phone-content" @click="enterWelcomeEdit">
                <div class="phone-chat">
                  <div class="chat-tip">
                    {{ $t('Apply.components.OfficialAccountMenuDrawer.selectMenuHint') }}
                  </div>
                  <div class="chat-bubble chat-bubble-left">
                    <span class="chat-avatar"></span>
                    <div class="chat-text">{{ followAutoReply || '欢迎关注公众号，这里展示的是菜单预览。' }}</div>
                  </div>
                </div>
              </div>
              <!-- 子菜单悬浮层：紧贴底部栏上方 -->
              <div
                v-if="showSubFloating"
                class="phone-sub-floating"
              >
                <div
                  v-for="(sub, subIdx) in (menuButtons[selectedRootIndex!]?.subButtons || [])"
                  :key="subIdx"
                  class="phone-sub-item draggable"
                  :class="{ active: selectedSubIndex === subIdx }"
                  :draggable="true"
                  @dragstart="onSubDragStart(selectedRootIndex!, subIdx)"
                  @dragover.prevent
                  @drop="onSubDrop(selectedRootIndex!, subIdx)"
                  @click="selectSub(selectedRootIndex!, subIdx)"
                >
                  <span class="sub-name">{{ sub.name || $t('Apply.components.OfficialAccountMenuDrawer.subMenuNamePlaceholder') }}</span>
                  <span class="sub-drag-handle" title="拖动排序">≡</span>
                  <span class="sub-del" role="button" tabindex="0" @click.stop.prevent="removeSub(selectedRootIndex!, subIdx)">
                    <AIcon type="DeleteOutlined" />
                  </span>
                </div>
                <div
                  v-if="(menuButtons[selectedRootIndex!]?.subButtons?.length || 0) < 5"
                  class="phone-sub-item add"
                  @click="addSubButton(selectedRootIndex!)"
                >
                  {{ $t('Apply.components.OfficialAccountMenuDrawer.subMenuNamePlaceholder') }}
                </div>
              </div>
              <div class="phone-bottom-bar">
                <div
                  v-for="(btn, idx) in displayRootSlots"
                  :key="idx"
                  :class="['phone-main-btn', { active: selectedRootIndex === idx && selectedSubIndex === null, draggable: !!btn }]"
                  :draggable="!!btn"
                  @dragstart="btn && onRootDragStart(idx)"
                  @dragover.prevent
                  @drop="onRootDrop(idx)"
                  @click="btn ? selectRoot(idx) : addRootButton()"
                >
                  <template v-if="btn">
                    <span class="main-name">
                      {{ btn.name || $t('Apply.components.OfficialAccountMenuDrawer.unnamed') }}
                    </span>
                    <span class="main-drag-handle" title="拖动排序">≡</span>
                  </template>
                  <template v-else>
                    +
                  </template>
                </div>
              </div>
            </div>
            <div class="phone-hint">
              <div class="phone-hint-line">· 点击底部主菜单或子菜单可编辑</div>
              <div class="phone-hint-line">· 拖动「≡」可调整排序</div>
            </div>
          </div>
          <!-- 右侧：配置面板（欢迎语 / 菜单配置） -->
          <div class="config-panel">
            <!-- 欢迎语配置 -->
            <template v-if="editMode === 'welcome'">
              <h4 class="config-title">公众号欢迎语配置</h4>
              <a-form layout="vertical" class="config-form">
                <a-form-item label="关注自动回复">
                  <a-textarea
                    v-model:value="followAutoReply"
                    :rows="4"
                    placeholder="用户首次关注公众号时自动回复的内容"
                  />
                </a-form-item>
                <a-form-item label="授权自动回复">
                  <a-textarea
                    v-model:value="authAutoReply"
                    :rows="4"
                    placeholder="用户授权登录成功后自动回复的内容"
                  />
                </a-form-item>
              </a-form>
            </template>

            <!-- 菜单配置 -->
            <template v-else>
              <template v-if="selectedItem">
                <h4 class="config-title">
                  {{ isEditingSub ? $t('Apply.components.OfficialAccountMenuDrawer.subMenuInfo') : $t('Apply.components.OfficialAccountMenuDrawer.mainMenuInfo') }}
                </h4>
                <a-form layout="vertical" class="config-form">
                  <a-form-item :label="$t('Apply.components.OfficialAccountMenuDrawer.namePlaceholder')">
                    <a-input
                      v-model:value="selectedItem.name"
                      :placeholder="$t('Apply.components.OfficialAccountMenuDrawer.namePlaceholder')"
                      :maxlength="isEditingSub ? 60 : 16"
                      show-count
                    />
                    <div class="form-hint">{{ $t('Apply.components.OfficialAccountMenuDrawer.nameHint') }}</div>
                  </a-form-item>
                <a-form-item
                  v-if="!isRootWithSub"
                  :label="$t('Apply.components.OfficialAccountMenuDrawer.messageType')"
                >
                  <a-radio-group v-model:value="selectedItem.type">
                    <a-radio value="click">{{ $t('Apply.components.OfficialAccountMenuDrawer.sendMessage') }}</a-radio>
                    <a-radio value="view">{{ $t('Apply.components.OfficialAccountMenuDrawer.jumpWebpage') }}</a-radio>
                    <a-radio value="miniprogram">{{ $t('Apply.components.OfficialAccountMenuDrawer.jumpMiniprogram') }}</a-radio>
                  </a-radio-group>
                </a-form-item>
                <template v-if="!isRootWithSub && selectedItem.type === 'click'">
                    <a-form-item :label="$t('Apply.components.OfficialAccountMenuDrawer.menuContent')">
                      <a-radio-group v-model:value="selectedItem.menuContentType" class="menu-content-type">
                        <a-radio-button value="text">{{ $t('Apply.components.OfficialAccountMenuDrawer.contentTypeText') }}</a-radio-button>
                        <a-radio-button value="image">{{ $t('Apply.components.OfficialAccountMenuDrawer.contentTypeImage') }}</a-radio-button>
                        <a-radio-button value="voice">{{ $t('Apply.components.OfficialAccountMenuDrawer.contentTypeVoice') }}</a-radio-button>
                        <a-radio-button value="video">{{ $t('Apply.components.OfficialAccountMenuDrawer.contentTypeVideo') }}</a-radio-button>
                        <a-radio-button value="news">{{ $t('Apply.components.OfficialAccountMenuDrawer.contentTypeArticle') }}</a-radio-button>
                      </a-radio-group>
                      <a-textarea
                        v-if="selectedItem.menuContentType === 'text'"
                        v-model:value="selectedItem.menuContentValue"
                        :placeholder="$t('Apply.components.OfficialAccountMenuDrawer.menuContentValueTextPlaceholder')"
                        :rows="4"
                        style="margin-top: 8px"
                      />
                      <template v-else-if="selectedItem.menuContentType === 'news'">
                        <div class="article-list">
                          <div
                            v-for="(art, idx) in (selectedItem.menuArticles || [])"
                            :key="idx"
                            class="article-item"
                          >
                            <div class="article-item-header">
                              <span>图文 {{ idx + 1 }}</span>
                              <a-button
                                type="link"
                                size="small"
                                danger
                                @click.prevent.stop="removeArticle(selectedItem, idx)"
                              >
                                删除
                              </a-button>
                            </div>
                            <a-input
                              v-model:value="art.title"
                              placeholder="标题"
                              style="margin-bottom: 4px"
                            />
                            <a-textarea
                              v-model:value="art.description"
                              placeholder="描述"
                              :rows="2"
                              style="margin-bottom: 4px"
                            />
                            <div class="article-pic-row">
                              <a-input
                                v-model:value="art.picUrl"
                                placeholder="封面图地址（可选）"
                                style="margin-bottom: 4px"
                              />
                              <MUpload
                                v-model:modelValue="art.picUrl"
                                style="margin-left: 8px"
                              />
                            </div>
                            <a-input
                              v-model:value="art.url"
                              placeholder="跳转链接"
                            />
                          </div>
                          <a-button
                            type="dashed"
                            block
                            style="margin-top: 8px"
                            @click.prevent.stop="addArticle(selectedItem)"
                          >
                            新增图文
                          </a-button>
                        </div>
                      </template>
                      <a-input
                        v-else
                        v-model:value="selectedItem.menuContentValue"
                        :placeholder="$t('Apply.components.OfficialAccountMenuDrawer.menuContentValueMediaPlaceholder')"
                        style="margin-top: 8px"
                      />
                    </a-form-item>
                  </template>
                <template v-else-if="!isRootWithSub && selectedItem.type === 'view'">
                    <a-form-item :label="$t('Apply.components.OfficialAccountMenuDrawer.webpageLink')">
                      <a-input v-model:value="selectedItem.url" placeholder="https://" />
                    </a-form-item>
                  </template>
                <template v-else-if="!isRootWithSub && selectedItem.type === 'miniprogram'">
                    <a-form-item label="小程序 AppId">
                      <a-input v-model:value="selectedItem.appId" placeholder="wx..." />
                    </a-form-item>
                    <a-form-item label="小程序页面路径">
                      <a-input v-model:value="selectedItem.pagePath" placeholder="pages/index/index" />
                    </a-form-item>
                  </template>
                  <a-form-item>
                    <a-button danger @click="handleDeleteSelected">
                      {{ $t('Apply.components.OfficialAccountMenuDrawer.deleteMenu') }}
                    </a-button>
                  </a-form-item>
                </a-form>
              </template>
              <div v-else class="config-empty">
                {{ $t('Apply.components.OfficialAccountMenuDrawer.selectMenuHint') }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { getAppInfo_api, updateApp_api, getMenu_api, saveMenu_api } from '@authentication-manager-ui/api/system/apply';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';
import MUpload from '@authentication-manager-ui/views/system/Apply/Save/components/ApplyList/MUpload.vue';

const { t: $t } = useI18n();

const props = defineProps<{
  visible: boolean;
  appId?: string;
  appName?: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'done'): void;
}>();

const visible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v),
});

const drawerTitle = computed(() =>
  props.appName ? `${$t('Apply.components.OfficialAccountMenuDrawer.title')} - ${props.appName}` : $t('Apply.components.OfficialAccountMenuDrawer.title')
);

const loading = ref(false);
const saveLoading = ref(false);
const selectedRootIndex = ref<number | null>(null);
const selectedSubIndex = ref<number | null>(null);
const draggingRootIndex = ref<number | null>(null);
const draggingSubRootIndex = ref<number | null>(null);
const draggingSubIndex = ref<number | null>(null);
type EditMode = 'welcome' | 'menu';
const editMode = ref<EditMode>('welcome');
const followAutoReply = ref<string>('');
const authAutoReply = ref<string>('');

interface MenuButton {
  name?: string;
  type?: string;
  key?: string;
  url?: string;
  appId?: string;
  pagePath?: string;
  menuContentType?: string;
  menuContentValue?: string;
  menuArticles?: ArticleItem[];
  subButtons?: MenuButton[];
}

interface ClickMenuRule {
  key: string;
  menuContentType?: string;
  menuContentValue?: string;
}

interface ArticleItem {
  title?: string;
  description?: string;
  picUrl?: string;
  url?: string;
}

const menuButtons = ref<MenuButton[]>([]);

/** 底部 3 个主菜单槽位（空位用 null 占位便于点击添加） */
const displayRootSlots = computed(() => {
  const list = menuButtons.value || [];
  const slots: (MenuButton | null)[] = [];
  for (let i = 0; i < 3; i++) {
    slots.push(list[i] ?? null);
  }
  return slots;
});

/** 是否显示子菜单悬浮层：当前选中的主菜单可含子菜单时，在底部栏上方浮层展示 */
const showSubFloating = computed(() => {
  const r = selectedRootIndex.value;
  if (r == null) return false;
  const root = menuButtons.value?.[r];
  return root && root.type !== 'miniprogram';
});

/** 当前正在编辑的菜单项（响应式引用到 menuButtons 中的对象） */
const selectedItem = computed(() => {
  const r = selectedRootIndex.value;
  const s = selectedSubIndex.value;
  if (r == null) return null;
  if (s != null) {
    const sub = menuButtons.value?.[r]?.subButtons?.[s];
    return sub ?? null;
  }
  return menuButtons.value?.[r] ?? null;
});

const isEditingSub = computed(() => selectedSubIndex.value !== null);

const isRootWithSub = computed(() => {
  const r = selectedRootIndex.value;
  if (r == null || selectedSubIndex.value !== null) return false;
  const root = menuButtons.value?.[r];
  return !!(root && root.subButtons && root.subButtons.length);
});

function generateMenuKey() {
  return `MENU_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function selectRoot(idx: number) {
  const btn = menuButtons.value?.[idx];
  if (!btn) return;
  editMode.value = 'menu';
  selectedRootIndex.value = idx;
  selectedSubIndex.value = null;
}

function selectSub(rootIdx: number, subIdx: number) {
  editMode.value = 'menu';
  selectedRootIndex.value = rootIdx;
  selectedSubIndex.value = subIdx;
}

function addRootButton() {
  if ((menuButtons.value?.length || 0) >= 3) return;
  menuButtons.value = [
    ...(menuButtons.value || []),
    { name: '', type: 'click', key: generateMenuKey() },
  ];
  const idx = menuButtons.value.length - 1;
  selectedRootIndex.value = idx;
  selectedSubIndex.value = null;
}

function removeRoot(idx: number) {
  menuButtons.value = menuButtons.value?.filter((_, i) => i !== idx) || [];
  if (selectedRootIndex.value === idx) {
    selectedRootIndex.value = null;
    selectedSubIndex.value = null;
  } else if (selectedRootIndex.value != null && selectedRootIndex.value > idx) {
    selectedRootIndex.value--;
  }
}

function addSubButton(rootIdx: number) {
  const root = menuButtons.value?.[rootIdx];
  if (!root || root.type === 'miniprogram') return;
  const sub = root.subButtons || [];
  if (sub.length >= 5) return;
  if (!root.subButtons) root.subButtons = [];
  root.subButtons = [
    ...root.subButtons,
    { name: '', type: 'click', key: generateMenuKey() },
  ];
  menuButtons.value = [...(menuButtons.value || [])];
  selectedSubIndex.value = root.subButtons.length - 1;
}

function removeSub(rootIdx: number, subIdx: number) {
  const list = menuButtons.value || [];
  const root = list[rootIdx];
  if (!root?.subButtons || subIdx < 0 || subIdx >= root.subButtons.length) return;
  const newSubs = root.subButtons.filter((_, i) => i !== subIdx);
  const newRoot = { ...root, subButtons: newSubs };
  menuButtons.value = list.map((r, i) => (i === rootIdx ? newRoot : r));
  if (selectedSubIndex.value === subIdx) {
    selectedSubIndex.value = null;
  } else if (selectedSubIndex.value != null && selectedSubIndex.value > subIdx) {
    selectedSubIndex.value--;
  }
}

function handleDeleteSelected() {
  const r = selectedRootIndex.value;
  const s = selectedSubIndex.value;
  if (r == null) return;
  if (s != null) {
    removeSub(r, s);
    selectedSubIndex.value = null;
  } else {
    removeRoot(r);
    selectedRootIndex.value = null;
  }
}

function addArticle(btn: MenuButton) {
  if (!btn.menuArticles) {
    btn.menuArticles = [];
  }
  btn.menuArticles.push({
    title: '',
    description: '',
    picUrl: '',
    url: '',
  });
}

function removeArticle(btn: MenuButton, idx: number) {
  if (!btn.menuArticles) return;
  btn.menuArticles = btn.menuArticles.filter((_, i) => i !== idx);
}

function enterWelcomeEdit() {
  editMode.value = 'welcome';
  selectedRootIndex.value = null;
  selectedSubIndex.value = null;
}

function onRootDragStart(idx: number) {
  const btn = menuButtons.value?.[idx];
  if (!btn) return;
  draggingRootIndex.value = idx;
}

function onRootDrop(idx: number) {
  const from = draggingRootIndex.value;
  if (from == null || from === idx) return;
  const list = [...(menuButtons.value || [])];
  if (from < 0 || from >= list.length) {
    draggingRootIndex.value = null;
    return;
  }
  const [item] = list.splice(from, 1);
  if (!item) {
    draggingRootIndex.value = null;
    return;
  }
  const to = Math.min(idx, list.length);
  list.splice(to, 0, item);
  menuButtons.value = list;
  selectedRootIndex.value = to;
  selectedSubIndex.value = null;
  draggingRootIndex.value = null;
}

function onSubDragStart(rootIdx: number, subIdx: number) {
  const root = menuButtons.value?.[rootIdx];
  if (!root?.subButtons || !root.subButtons[subIdx]) return;
  draggingSubRootIndex.value = rootIdx;
  draggingSubIndex.value = subIdx;
}

function onSubDrop(rootIdx: number, subIdx: number) {
  const fromRoot = draggingSubRootIndex.value;
  const from = draggingSubIndex.value;
  if (fromRoot == null || from == null) return;
  const list = [...(menuButtons.value || [])];
  const root = list[rootIdx];
  if (!root?.subButtons || from < 0 || from >= root.subButtons.length) {
    draggingSubRootIndex.value = null;
    draggingSubIndex.value = null;
    return;
  }
  // 目前仅支持同一父菜单内排序
  if (fromRoot !== rootIdx) {
    draggingSubRootIndex.value = null;
    draggingSubIndex.value = null;
    return;
  }
  const subs = [...root.subButtons];
  const [item] = subs.splice(from, 1);
  if (!item) {
    draggingSubRootIndex.value = null;
    draggingSubIndex.value = null;
    return;
  }
  const to = Math.min(subIdx, subs.length);
  subs.splice(to, 0, item);
  list[rootIdx] = { ...root, subButtons: subs };
  menuButtons.value = list;
  selectedRootIndex.value = rootIdx;
  selectedSubIndex.value = to;
  draggingSubRootIndex.value = null;
  draggingSubIndex.value = null;
}

function isValidHttpUrl(url?: string) {
  if (!url) return false;
  return /^https?:\/\//.test(url);
}

function validateButtonsBeforeSave(buttons: MenuButton[]): boolean {
  let ok = true;
  const walk = (list?: MenuButton[]) => {
    if (!list || !ok) return;
    for (const b of list) {
      if (b.type === 'view') {
        if (!isValidHttpUrl(b.url)) {
          ok = false;
          return;
        }
      }
      if (b.subButtons && b.subButtons.length) {
        walk(b.subButtons);
        if (!ok) return;
      }
    }
  };
  walk(buttons);
  return ok;
}

async function loadMenu() {
  if (!props.appId) return;
  loading.value = true;
  try {
    // 同时获取公众号菜单和应用配置信息（含 sso.configuration.clickMenuRules）
    const [menuRes, appRes]: any[] = await Promise.all([
      getMenu_api(props.appId),
      getAppInfo_api(props.appId),
    ]);
    const menuData = menuRes?.result ?? menuRes;
    const appData = appRes?.result ?? appRes;

    const rawButtons: MenuButton[] = Array.isArray(menuData?.buttons) ? menuData.buttons : [];
    const rulesFromMenu: ClickMenuRule[] = Array.isArray(menuData?.clickMenuRules) ? menuData.clickMenuRules : [];
    const conf = appData?.configurations || {};
    const rulesFromApp: ClickMenuRule[] = Array.isArray(conf?.clickMenuRules) ? conf.clickMenuRules : [];

    const allRules: ClickMenuRule[] = (rulesFromApp.length ? rulesFromApp : rulesFromMenu) || [];
    const ruleMap = new Map<string, ClickMenuRule>();
    allRules.forEach((r) => {
      if (r && r.key) {
        ruleMap.set(r.key, r);
      }
    });
    const applyRules = (buttons: MenuButton[]): MenuButton[] =>
      (buttons || []).map((btn) => {
        const cloned: MenuButton = { ...btn };
        if (cloned.type === 'click' && cloned.key && ruleMap.has(cloned.key)) {
          const rule = ruleMap.get(cloned.key)!;
          cloned.menuContentType = rule.menuContentType;
          cloned.menuContentValue = rule.menuContentValue;
          if (rule.menuContentType === 'news' && rule.menuContentValue) {
            try {
              const arr = JSON.parse(rule.menuContentValue as any);
              if (Array.isArray(arr)) {
                cloned.menuArticles = arr;
              }
            } catch {
              // ignore parse error, fallback to raw value
            }
          }
        }
        if (cloned.subButtons && cloned.subButtons.length) {
          cloned.subButtons = applyRules(cloned.subButtons);
        }
        return cloned;
      });
    menuButtons.value = applyRules(rawButtons);
    selectedRootIndex.value = null;
    selectedSubIndex.value = null;
    editMode.value = 'welcome';

    // 欢迎语配置：从应用 configurations 读取
    followAutoReply.value = conf.followWelcomeMsg || '欢迎关注公众号，这里展示的是菜单预览。';
    authAutoReply.value = conf.welcomeMsg || '点击底部菜单可配置回复内容。';
  } catch (e) {
    menuButtons.value = [];
  } finally {
    loading.value = false;
  }
}

function collectClickMenuRules(buttons: MenuButton[]): ClickMenuRule[] {
  const rules: ClickMenuRule[] = [];
  const walk = (list?: MenuButton[]) => {
    if (!list) return;
    list.forEach((b) => {
      if (b.type === 'click' && b.key && b.menuContentType) {
        let value = b.menuContentValue;
        if (b.menuContentType === 'news') {
          const articles = (b.menuArticles || []).filter(
            (a) => a && (a.title || a.description || a.picUrl || a.url),
          );
          if (!articles.length) {
            return;
          }
          value = JSON.stringify(articles);
        }
        if (!value) return;
        rules.push({
          key: b.key,
          menuContentType: b.menuContentType,
          menuContentValue: value,
        });
      }
      if (b.subButtons && b.subButtons.length) {
        walk(b.subButtons);
      }
    });
  };
  walk(buttons);
  return rules;
}

async function handleSave() {
  if (!props.appId) return;
  const buttons = menuButtons.value?.filter((b) => b?.name) || [];
  if (buttons.length === 0) {
    onlyMessage($t('Apply.components.OfficialAccountMenuDrawer.atLeastOne'), 'warning');
    return;
  }
  if (!validateButtonsBeforeSave(buttons)) {
    onlyMessage('跳转网页菜单必须填写合法的 URL（以 http:// 或 https:// 开头）', 'warning');
    return;
  }
  saveLoading.value = true;
  try {
    const clickMenuRules = collectClickMenuRules(buttons);
    // 1. 先把菜单结构同步到微信
    await saveMenu_api(props.appId, { buttons });

    // 2. 再通过应用保存接口，只更新 configurations（点击规则和欢迎语）
    try {
      const appRes: any = await getAppInfo_api(props.appId);
      const appData = appRes?.result ?? appRes;
      if (appData) {
        const nextConfigurations: any = {
          ...(appData.configurations || {}),
          clickMenuRules,
          followWelcomeMsg: followAutoReply.value,
          welcomeMsg: authAutoReply.value,
        };
        await updateApp_api(props.appId, { configurations: nextConfigurations });
      }
    } catch (e) {
      // 应用配置保存失败时，仅提示错误，不影响菜单已同步到微信
      // 这里直接抛给外层统一提示
      throw e;
    }

    onlyMessage($t('Apply.components.OfficialAccountMenuDrawer.saveSuccess'));
    // 保存后不关闭抽屉，仅提示成功
  } catch (e: any) {
    onlyMessage(e?.message || $t('Apply.components.OfficialAccountMenuDrawer.saveFail'), 'error');
  } finally {
    saveLoading.value = false;
  }
}

function onClose() {
  visible.value = false;
  emit('done');
}

watch(
  () => [props.visible, props.appId],
  ([v, id]) => {
    if (v && id) loadMenu();
    if (!v) {
      menuButtons.value = [];
      selectedRootIndex.value = null;
      selectedSubIndex.value = null;
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.drawer-empty {
  padding: 24px;
  color: rgba(0, 0, 0, 0.45);
}
.menu-layout {
  display: flex;
  height: 100%;
  min-height: 400px;
}
.phone-panel {
  width: 280px;
  padding: 20px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #f5f5f7;
  align-self: flex-start;
  flex-direction: column;
}
.phone-hint {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
  text-align: left;
}
.phone-hint-line {
  line-height: 1.4;
}
.phone-frame {
  width: 240px;
  border-radius: 32px;
  border: 6px solid #111;
  background: #f5f5f7;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 460px;
  position: relative;
}
.phone-status-bar {
  height: 24px;
  padding: 0 10px;
  background: #f5f5f7;
  color: #111;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.status-time {
  font-weight: 600;
}
.status-notch {
  flex: 0 0 64px;
  height: 18px;
  background: #111;
  border-radius: 0 0 12px 12px;
  margin: 0 auto;
}
.status-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-signal,
.status-wifi,
.status-battery {
  width: 12px;
  height: 8px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.25);
}
.status-battery {
  width: 18px;
}
.phone-nav-bar {
  height: 32px;
  padding: 0 8px;
  background: #f5f5f7;
  border-bottom: 1px solid #e5e5ea;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.nav-back,
.nav-more {
  width: 24px;
  text-align: center;
  color: #007aff;
}
.nav-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #111;
}
.phone-content {
  flex: 1;
  padding: 8px 6px;
  overflow-y: auto;
  min-height: 120px;
  background: #e5e5ea;
}
.chat-tip {
  text-align: center;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.4);
  margin-bottom: 4px;
}
.chat-bubble {
  display: flex;
  align-items: flex-end;
  margin: 4px 0;
  font-size: 11px;
}
.chat-avatar {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: #bbb;
}
.chat-avatar.self {
  background: #6ac04f;
}
.chat-text {
  max-width: 150px;
  padding: 6px 8px;
  border-radius: 8px;
  line-height: 1.4;
  background: #fff;
  margin: 0 6px;
}
.chat-bubble-left .chat-text {
  border-bottom-left-radius: 2px;
}
.chat-bubble-right {
  justify-content: flex-end;
}
.chat-bubble-right .chat-text {
  background: #95ec69;
  border-bottom-right-radius: 2px;
}
.phone-chat {
  padding: 6px;
  min-height: 120px;
}
.phone-placeholder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  color: #999;
  font-size: 18px;
}
.phone-back,
.phone-user {
  cursor: default;
}
/* 子菜单悬浮层：紧贴底部栏上方 */
.phone-sub-floating {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 48px;
  background: #fefefe;
  border-radius: 8px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.12);
  padding: 8px;
  max-height: 220px;
  overflow-y: auto;
  z-index: 2;
  border: 1px solid #eee;
}
.phone-sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 4px;
  cursor: pointer;
  font-size: 14px;
  &.active {
    background: #e6f7ff;
    color: #1890ff;
  }
  &.add {
    color: #999;
    border: 1px dashed #d9d9d9;
  }
  &.draggable {
    cursor: move;
  }
  .sub-del {
    margin-left: 8px;
    color: #ff4d4f;
    opacity: 0.7;
    cursor: pointer;
    display: inline-flex;
    padding: 2px;
    &:hover {
      opacity: 1;
    }
  }
}
.sub-drag-handle {
  margin-left: 8px;
  color: #999;
  font-size: 16px;
  cursor: move;
}
.sub-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.phone-bottom-bar {
  flex-shrink: 0;
  display: flex;
  border-top: 1px solid #eee;
  height: 48px;
  background: #fff;
  z-index: 1;
}
.phone-main-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  border-right: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
  &:last-child {
    border-right: none;
  }
  &.active {
    background: #e6f7ff;
    color: #1890ff;
  }
  &.draggable {
    cursor: move;
    justify-content: space-between;
    padding: 0 8px;
  }
}
.main-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.main-drag-handle {
  margin-left: 4px;
  color: #999;
  font-size: 16px;
  cursor: move;
}
.article-list {
  margin-top: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 8px;
  background: #fafafa;
  max-height: 260px;
  overflow-y: auto;
}
.article-item {
  border-radius: 4px;
  background: #fff;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.article-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}
.article-pic-row {
  display: flex;
  align-items: center;
}
.article-pic-row :deep(.upload-image-warp) {
  margin-bottom: 4px;
}
.config-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-width: 0;
}
.config-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
}
.config-form {
  max-width: 400px;
}
.menu-content-type {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.menu-content-type :deep(.ant-radio-button-wrapper) {
  margin-bottom: 4px;
}
.form-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}
.config-empty {
  color: #999;
  font-size: 14px;
  padding: 40px 0;
  text-align: center;
}
</style>
