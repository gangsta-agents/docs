<script setup lang="ts">
const platforms = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: 'i-custom-claude',
    status: 'supported',
    steps: [
      { label: 'Add marketplace', code: '/plugin marketplace add kucherenko/gangsta' },
      { label: 'Install plugin', code: '/plugin install gangsta@gangsta-marketplace' },
    ],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    icon: 'i-simple-icons-github',
    status: 'supported',
    steps: [
      { label: 'Add marketplace', code: 'copilot plugin marketplace add kucherenko/gangsta' },
      { label: 'Install plugin', code: 'copilot plugin install gangsta@gangsta-marketplace' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    icon: 'i-custom-gemini',
    status: 'supported',
    steps: [
      { label: 'Install extension', code: 'gemini extensions install https://github.com/kucherenko/gangsta' },
    ],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    icon: 'i-custom-opencode',
    status: 'supported',
    steps: [
      { label: 'OpenCode 2.x — install plugin', code: 'opencode plugin add gangsta@git+https://github.com/kucherenko/gangsta.git' },
      {
        label: 'OpenCode 1.x — tell OpenCode in a new session',
        code: 'Fetch and follow instructions from https://raw.githubusercontent.com/kucherenko/gangsta/refs/heads/master/.opencode/INSTALL.md',
        lang: 'text',
      },
    ],
  },
  {
    id: 'antigravity',
    name: 'Antigravity CLI',
    icon: 'i-lucide-orbit',
    status: 'supported',
    steps: [
      { label: 'Install plugin', code: 'agy plugin install https://github.com/kucherenko/gangsta' },
    ],
  },
  {
    id: 'codex',
    name: 'Codex',
    icon: 'i-simple-icons-openai',
    status: 'supported',
    steps: [
      {
        label: 'Tell Codex in a new session',
        code: 'Fetch and follow instructions from https://raw.githubusercontent.com/kucherenko/gangsta/refs/heads/master/.codex/INSTALL.md',
        lang: 'text',
      },
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    icon: 'i-lucide-mouse-pointer-click',
    status: 'supported',
    steps: [
      { label: 'Install all skills via npx', code: 'npx skills add https://github.com/kucherenko/gangsta' },
    ],
  },
]

const selectedId = ref('claude-code')
const selected = computed(() => platforms.find(p => p.id === selectedId.value))

const copiedSteps = ref(new Set())

async function copyCode(platformId: string, stepIndex: number, code: string) {
  await navigator.clipboard.writeText(code)
  const key = `${platformId}-${stepIndex}`
  copiedSteps.value.add(key)
  copiedSteps.value = new Set(copiedSteps.value)
  setTimeout(() => {
    copiedSteps.value.delete(key)
    copiedSteps.value = new Set(copiedSteps.value)
  }, 2000)
}

function isCopied(platformId: string, stepIndex: number) {
  return copiedSteps.value.has(`${platformId}-${stepIndex}`)
}

function selectPlatform(id: string) {
  const platform = platforms.find(p => p.id === id)
  if (platform?.status === 'coming-soon') return
  selectedId.value = id
}
</script>

<template>
  <div class="platform-install">
    <!-- Platform selector row -->
    <div class="platform-tabs" role="tablist">
      <button
        v-for="platform in platforms"
        :key="platform.id"
        role="tab"
        :aria-selected="selectedId === platform.id"
        :class="[
          'platform-tab',
          selectedId === platform.id && 'platform-tab--active',
          platform.status === 'coming-soon' && 'platform-tab--coming-soon',
        ]"
        :disabled="platform.status === 'coming-soon'"
        @click="selectPlatform(platform.id)"
      >
        <Icon :name="platform.icon" class="platform-tab__icon" />
        <span class="platform-tab__name">{{ platform.name }}</span>
      </button>
    </div>

    <!-- Content panel -->
    <div class="platform-panel">
      <Transition name="fade" mode="out-in">
        <div :key="selectedId" class="platform-panel__content">
          <!-- Supported platform steps -->
          <div v-if="selected?.status === 'supported'" class="platform-steps">
            <div
              v-for="(step, i) in selected.steps"
              :key="i"
              class="platform-step"
            >
              <div class="platform-step__header">
                <span class="platform-step__num">{{ i + 1 }}</span>
                <span class="platform-step__label">{{ step.label }}</span>
              </div>
              <div class="platform-code">
                <code class="platform-code__text">{{ step.code }}</code>
                <button
                  class="platform-code__copy"
                  @click="copyCode(selected!.id, i, step.code)"
                >
                  {{ isCopied(selected!.id, i) ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Coming soon message -->
          <div v-else-if="selected?.status === 'coming-soon'" class="platform-coming-soon">
            <div class="platform-coming-soon__icon">
              <Icon name="i-lucide-clock" />
            </div>
            <p class="platform-coming-soon__text">Support is in progress.</p>
            <a
              href="https://github.com/kucherenko/gangsta"
              target="_blank"
              rel="noopener noreferrer"
              class="platform-coming-soon__link"
            >
              Follow GitHub for updates
              <Icon name="i-lucide-arrow-right" class="platform-coming-soon__arrow" />
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.platform-install {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 100%;
}

/* ── Tab row ── */
.platform-tabs {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.5rem;
}

.platform-tabs::-webkit-scrollbar {
  display: none;
}

.platform-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  border-radius: 0.75rem 0.75rem 0 0;
  border: 1px solid var(--site-border);
  border-bottom: none;
  background: var(--site-surface);
  color: var(--site-fg);
  opacity: 0.6;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
  flex-shrink: 0;
}

.platform-tab:hover:not(:disabled) {
  opacity: 0.85;
  background: oklch(0.780 0.188 70 / 0.08);
}

.platform-tab--active {
  background: var(--color-amber-500);
  color: oklch(0.15 0 0);
  opacity: 1;
  box-shadow: 0 0 16px oklch(0.780 0.188 70 / 0.35);
}

.platform-tab--active:hover {
  background: var(--color-amber-400);
}

.platform-tab--coming-soon {
  cursor: not-allowed;
  opacity: 0.4;
}

.platform-tab__icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.platform-tab__name {
  line-height: 1;
}

/* ── Content panel ── */
.platform-panel {
  background: var(--site-surface);
  border: 1px solid var(--site-border);
  border-top: 3px solid var(--color-amber-500);
  border-radius: 0 0.75rem 0.75rem 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 0 24px oklch(0.780 0.188 70 / 0.08);
  overflow: hidden;
}

.platform-panel__content {
  display: flex;
  flex-direction: column;
}

/* ── Steps ── */
.platform-steps {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.platform-step {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.platform-step__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.platform-step__num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--color-amber-500);
  color: oklch(0.15 0 0);
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
}

.platform-step__label {
  font-size: 0.875rem;
  color: var(--site-fg);
  opacity: 0.8;
}

.platform-code {
  position: relative;
  background: oklch(0.08 0.003 250);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-left: 1.5rem;
}

.platform-code__text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  color: var(--color-amber-300);
  white-space: pre-wrap;
  word-break: break-all;
}

.platform-code__copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: oklch(0.780 0.188 70 / 0.15);
  color: oklch(0.780 0.188 70);
  border: none;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.platform-code__copy:hover {
  background: oklch(0.780 0.188 70 / 0.25);
}

/* ── Coming soon ── */
.platform-coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.platform-coming-soon__icon {
  color: var(--color-amber-500);
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  opacity: 0.7;
}

.platform-coming-soon__text {
  font-size: 0.9375rem;
  color: var(--site-fg);
  opacity: 0.6;
  margin: 0;
}

.platform-coming-soon__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-amber-500);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  margin-top: 0.25rem;
  transition: opacity 0.15s ease;
}

.platform-coming-soon__link:hover {
  opacity: 0.75;
}

.platform-coming-soon__arrow {
  width: 0.875rem;
  height: 0.875rem;
}

/* ── Dark mode border boost ── */
:global(.dark) .platform-tab {
  border-color: oklch(0.32 0.008 250);
}

:global(.dark) .platform-panel {
  border-color: oklch(0.32 0.008 250);
}

/* ── Fade transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
