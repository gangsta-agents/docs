<script setup>
const items = [
  {
    label: 'What are Gangsta Agents and why "gangsta"?',
    content: 'Gangsta Agents is a skills framework for spec-driven AI development. The mob metaphor — the Don, the Heist, Omerta — is intentional. It replaces vague AI "agents" with clear hierarchy, strict pipelines, and enforced discipline. Every skill has a role, every phase has a gate, and the Don approves it all.'
  },
  {
    label: 'Do I need to run all 6 phases for every task?',
    content: 'For minor fixes or known patterns, you can run a lightweight version of the Heist. But for any new feature, architectural change, or non-trivial bug: yes. All 6 phases. No skips. The pipeline exists because skipped steps are where bugs hatch.'
  },
  {
    label: "What's the 1% Rule?",
    content: 'If there is even a 1% chance a Gangsta skill applies to your current task, you invoke it. No rationalizing. No "this is simple so I will skip it." Simple tasks have root causes too. The 1% Rule prevents the "quick fix" mentality that compounds into technical debt.'
  },
  {
    label: 'Can I use Gangsta Agents with my existing AI setup?',
    content: 'Yes. Gangsta Agents integrates with Claude Code, GitHub Copilot, Gemini CLI, OpenCode, and Codex natively. Cursor is supported via `npx skills add`. The framework is platform-agnostic — skills are pure markdown files that any agent can invoke.'
  },
  {
    label: 'Is this just another AI framework?',
    content: 'No. Gangsta Agents does not replace your AI tools — it disciplines them. You keep your models, your editors, your workflows. What changes is how your agents operate: specs before code, tests before fixes, hierarchy before chaos.'
  }
]

const openIndex = ref(null)

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="faq-list">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="faq-item"
    >
      <button
        class="faq-trigger"
        :aria-expanded="openIndex === index"
        @click="toggle(index)"
      >
        <span class="faq-label">{{ item.label }}</span>
        <span
          class="faq-chevron"
          :class="{ 'faq-chevron--open': openIndex === index }"
        >
          <Icon name="i-lucide-chevron-down" />
        </span>
      </button>
      <Transition
        name="faq"
        @enter="el => { el.style.height = el.scrollHeight + 'px' }"
        @after-enter="el => { el.style.height = 'auto' }"
        @before-leave="el => { el.style.height = el.scrollHeight + 'px' }"
        @leave="el => { el.style.height = '0px' }"
      >
        <div
          v-show="openIndex === index"
          class="faq-body"
        >
          <p class="faq-content">{{ item.content }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 48rem;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid var(--site-border);
  border-radius: 0.625rem;
  overflow: hidden;
  background: color-mix(in oklch, var(--site-bg) 97%, #000);
  transition: border-color 150ms ease;
}

.faq-item:hover {
  border-color: color-mix(in oklch, var(--site-border) 70%, var(--color-amber-500));
}

.faq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--site-heading-h1h2);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 150ms ease;
}

.faq-trigger:hover {
  color: var(--color-amber-500);
}

.faq-chevron {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--site-fg);
  opacity: 0.4;
  transition: transform 200ms ease, opacity 150ms ease;
}

.faq-chevron--open {
  transform: rotate(180deg);
  opacity: 0.7;
}

.faq-body {
  overflow: hidden;
  will-change: height;
}

.faq-content {
  padding: 0 1.25rem 1.125rem;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--site-fg);
  opacity: 0.75;
}

.faq-enter-active,
.faq-leave-active {
  transition: height 250ms ease;
}
</style>
