<template>
  <div class="hierarchy-tree" role="img" aria-label="The Borgata Hierarchy — Don, Consigliere, Underboss, Capo, Soldiers">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 450" width="100%" style="display:block;max-width:100%">
      <defs>
        <linearGradient id="ht-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   :stop-color="c.bg1"/>
          <stop offset="100%" :stop-color="c.bg2"/>
        </linearGradient>
        <linearGradient id="ht-gl" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   :stop-color="c.glowStart" stop-opacity="0"/>
          <stop offset="30%"  :stop-color="c.glowMid"   stop-opacity="0.9"/>
          <stop offset="50%"  :stop-color="c.glowMid"   stop-opacity="1"/>
          <stop offset="70%"  :stop-color="c.glowMid"   stop-opacity="0.9"/>
          <stop offset="100%" :stop-color="c.glowStart" stop-opacity="0"/>
        </linearGradient>
        <!-- Arrowhead — rightward in local space, orient=auto rotates to match path direction -->
        <marker id="ht-arr" viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" :fill="c.connector"/>
        </marker>
        <!-- Don glow filter -->
        <filter id="ht-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="960" height="450" fill="url(#ht-bg)"/>

      <!-- ── DON ─────────────────────────────────────────────────────── -->
      <!-- Outer amber glow -->
      <rect x="379" y="29" width="202" height="84" fill="none" :stroke="c.donBorder" stroke-width="3" opacity="0.25" rx="3" filter="url(#ht-glow)"/>
      <!-- Card -->
      <rect x="380" y="30" width="200" height="82" :fill="c.cardBg" :stroke="c.donBorder" stroke-width="1.5" rx="2"/>
      <rect x="380" y="30" width="200" height="3" fill="url(#ht-gl)"/>
      <!-- Crown -->
      <polygon points="466,58 468,46 475,53 480,42 485,53 492,46 494,58" :fill="c.crown"/>
      <rect x="466" y="58" width="28" height="5" rx="1" :fill="c.crown"/>
      <!-- Title -->
      <text x="480" y="86" text-anchor="middle" font-size="15" :fill="c.donTitle" font-weight="800" letter-spacing="0.1em" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">DON</text>
      <text x="480" y="101" text-anchor="middle" font-size="10.5" :fill="c.donSubtitle" font-style="italic" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Supreme authority</text>

      <!-- ── CONNECTORS: Don → Level 2 ─────────────────────────────── -->
      <!-- Drop from Don bottom to horizontal bus -->
      <line x1="480" y1="112" x2="480" y2="128" :stroke="c.connector" stroke-width="1.5"/>
      <!-- Horizontal bus -->
      <line x1="210" y1="128" x2="750" y2="128" :stroke="c.connector" stroke-width="1.5"/>
      <!-- Drops with arrowheads to each child (22 px — enough room for arrowhead) -->
      <line x1="210" y1="128" x2="210" y2="150" :stroke="c.connector" stroke-width="1.5" marker-end="url(#ht-arr)"/>
      <line x1="480" y1="128" x2="480" y2="150" :stroke="c.connector" stroke-width="1.5" marker-end="url(#ht-arr)"/>
      <line x1="750" y1="128" x2="750" y2="150" :stroke="c.connector" stroke-width="1.5" marker-end="url(#ht-arr)"/>
      <!-- Junction dots -->
      <circle cx="210" cy="128" r="3" :fill="c.dot"/>
      <circle cx="480" cy="128" r="3" :fill="c.dot"/>
      <circle cx="750" cy="128" r="3" :fill="c.dot"/>

      <!-- ── CONSIGLIERE (dashed — outside chain of command) ─────────── -->
      <rect x="110" y="150" width="200" height="66" :fill="c.cardBg" :stroke="c.consBorder" stroke-width="1.2" stroke-dasharray="5,3" rx="2"/>
      <text x="120" y="171" font-size="13" :fill="c.consTitle" font-weight="700" font-style="italic" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Consigliere</text>
      <text x="120" y="187" font-size="8.5" :fill="c.skillText">gangsta:</text>
      <text x="120" y="198" font-size="8.5" :fill="c.skillText">:the-consigliere</text>
      <text x="120" y="210" font-size="8" :fill="c.outsideNote" font-style="italic">Outside chain of command</text>

      <!-- ── UNDERBOSS ────────────────────────────────────────────────── -->
      <rect x="380" y="150" width="200" height="66" :fill="c.cardBg" :stroke="c.underbossStroke" stroke-width="0.5" rx="2"/>
      <rect x="380" y="150" width="200" height="2" fill="url(#ht-gl)"/>
      <!-- Left accent bar -->
      <rect x="380" y="150" width="2.5" height="66" :fill="c.accentBar" opacity="0.6" rx="2"/>
      <text x="394" y="171" font-size="13" :fill="c.underbossTitle" font-weight="700" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Underboss</text>
      <text x="394" y="187" font-size="8.5" :fill="c.skillText">gangsta:</text>
      <text x="394" y="198" font-size="8.5" :fill="c.skillText">:the-underboss</text>

      <!-- ── THE LEDGER ──────────────────────────────────────────────── -->
      <rect x="650" y="150" width="200" height="66" :fill="c.cardBg" :stroke="c.underbossStroke" stroke-width="0.5" rx="2"/>
      <rect x="650" y="150" width="200" height="2" fill="url(#ht-gl)"/>
      <!-- Book icon -->
      <rect x="660" y="162" width="11" height="14" rx="1" fill="none" :stroke="c.ledgerIcon" stroke-width="1"/>
      <line x1="665" y1="162" x2="665" y2="176" :stroke="c.ledgerIcon" stroke-width="0.8"/>
      <text x="677" y="171" font-size="13" :fill="c.ledgerTitle" font-weight="700" font-style="italic" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">The Ledger</text>
      <text x="660" y="187" font-size="8.5" :fill="c.skillText">gangsta:</text>
      <text x="660" y="198" font-size="8.5" :fill="c.skillText">:the-ledger</text>
      <text x="660" y="210" font-size="8" :fill="c.outsideNote" font-style="italic">Institutional memory</text>

      <!-- ── CONNECTOR: Underboss → Capo ───────────────────────────── -->
      <line x1="480" y1="216" x2="480" y2="278" :stroke="c.connector" stroke-width="1.5" marker-end="url(#ht-arr)"/>

      <!-- ── CAPO ───────────────────────────────────────────────────── -->
      <rect x="380" y="278" width="200" height="64" :fill="c.cardBg" :stroke="c.underbossStroke" stroke-width="0.5" rx="2"/>
      <rect x="380" y="278" width="200" height="2" fill="url(#ht-gl)"/>
      <!-- Left accent bar (dimmer) -->
      <rect x="380" y="278" width="2.5" height="64" :fill="c.accentBar" opacity="0.4" rx="2"/>
      <text x="394" y="299" font-size="13" :fill="c.capoTitle" font-weight="700" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Capo</text>
      <text x="394" y="315" font-size="8.5" :fill="c.skillText">gangsta:</text>
      <text x="394" y="326" font-size="8.5" :fill="c.skillText">:the-capo</text>

      <!-- ── CONNECTOR: Capo → Soldiers ────────────────────────────── -->
      <line x1="480" y1="342" x2="480" y2="380" :stroke="c.connector" stroke-width="1.5" marker-end="url(#ht-arr)"/>

      <!-- ── SOLDIERS / ASSOCIATES ──────────────────────────────────── -->
      <rect x="340" y="380" width="280" height="64" :fill="c.soldierBg" :stroke="c.soldierStroke" stroke-width="0.8" rx="2"/>
      <rect x="340" y="380" width="280" height="2" :fill="c.soldierAccent" opacity="0.6"/>
      <text x="480" y="402" text-anchor="middle" font-size="13" :fill="c.soldierTitle" font-weight="600" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Soldiers / Associates</text>
      <text x="480" y="418" text-anchor="middle" font-size="9.5" :fill="c.soldierSub" font-style="italic" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Stateless code execution</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const c = computed(() => {
  const dark = colorMode.value === 'dark'
  return {
    // Background
    bg1:         dark ? '#0a0a0a' : '#f8f9fc',
    bg2:         dark ? '#111111' : '#eef0f8',
    // Card
    cardBg:      dark ? '#0d0d0d' : '#ffffff',
    cardStroke:  dark ? '#222222' : '#e2e8f0',
    // Glow
    glowStart:   dark ? '#e8a020' : '#b45309',
    glowMid:     dark ? '#f0be50' : '#d97706',
    // Don
    donBorder:   dark ? '#e8a020' : '#b45309',
    donGlow:     dark ? '#e8a020' : '#b45309',
    donTitle:    dark ? '#e8a020' : '#b45309',
    donSubtitle: dark ? '#c47a18' : '#92400e',
    // Connector & dot
    connector:   dark ? '#a05c10' : '#b45309',
    dot:         dark ? '#c47a18' : '#d97706',
    // Consigliere
    consBorder:  dark ? '#e8a020' : '#b45309',
    consTitle:   dark ? '#f0be50' : '#92400e',
    // Text helpers
    skillText:   dark ? '#555555' : '#64748b',
    outsideNote: dark ? '#444444' : '#94a3b8',
    // Underboss
    underbossTitle: dark ? '#f0be50' : '#b45309',
    capoTitle:      dark ? '#d4a030' : '#92400e',
    accentBar:   dark ? '#c47a18' : '#d97706',
    // Ledger
    ledgerTitle: dark ? '#f0be50' : '#b45309',
    ledgerIcon:  dark ? '#e8a020' : '#b45309',
    // Soldiers
    soldierBg:    dark ? '#080808' : '#f1f5f9',
    soldierStroke: dark ? '#2a2a2a' : '#cbd5e1',
    soldierAccent: dark ? '#2a2a2a' : '#cbd5e1',
    soldierTitle:  dark ? '#888888' : '#64748b',
    soldierSub:    dark ? '#555555' : '#94a3b8',
    // Misc
    crown:           dark ? '#e8a020' : '#b45309',
    underbossStroke: dark ? '#a05c10' : '#b45309',
  }
})
</script>

<style scoped>
.hierarchy-tree {
  width: 100%;
  margin: 2rem 0;
  border-radius: 4px;
  overflow: hidden;
}
.hierarchy-tree svg text {
  font-family: "SF Mono", "Fira Code", Menlo, "Courier New", monospace;
}
</style>