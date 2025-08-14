==============================
🛠️  Footer Mechanism – Apna Store
==============================

> Interactive, Smooth, Mobile-Friendly Footer Design

------------------------------
🔍  1. Concept: Partial Reveal Footer
------------------------------

📱 Footer initially shows a compact preview  
🔓 Fully expands only when:
- User reaches bottom of page
- User scrolls further down or taps footer

🎯 Goal: Save space + modern app-like UX

------------------------------
🧱  2. Layout & Structure (HTML/CSS)
------------------------------

📐 Sticky Footer Setup:
- <body> → display: flex; flex-direction: column; min-height: 100vh;
- <main class="page-content"> → flex: 1 0 auto; (fills space above footer)
- Footer placeholder:  
  ✅ <div id="main-footer-placeholder"> — placed after </main>

📏 Bottom Space Fix:
- body { padding-bottom: 60px; }  
  🚫 Prevents bottom nav bar from overlapping footer preview

------------------------------
🎨  3. States & Animations (CSS)
------------------------------

🧊 Compact State (Default):
- .footer-expandable-area  
  → max-height: 0; overflow: hidden;  
  → Fully hidden, but present in DOM
- .footer-compact-bar  
  → Always visible  
  → White background, border-top

🔓 Expanded State (.is-expanded):
- .footer-expandable-area  
  → max-height: 500px; with transition for smooth reveal  
- .footer-content  
  → opacity fade-in
  → transform: translateY(15px); (starts 15px lower and slides up to 0)
- .footer-wrapper  
  → Background: white → dark gray
- .footer-compact-bar  
  → display: none when expanded

------------------------------
🧠  4. Interaction Logic (JavaScript)
------------------------------

🔄 Main Controller: handleFooterGestures(event)

- Works on:
  - wheel (mouse scroll)
  - touchmove (mobile swipe)

- Tracks in real-time:
  1. isExpanded — current footer state  
  2. atBottom — page scroll position

📊 Decision Flow:
- 🟢 If: atBottom & scroll down & not expanded  
  → Call: expandFooter()
- 🔴 If: isExpanded & scroll up  
  → Call: collapseFooter()

🔒 Uses event.preventDefault() to block scroll bounce

------------------------------
✋ Tap/Click-Based Controls
------------------------------

🖱️ .footer-compact-bar → tap to expand  
⬇️ <i class="fas fa-chevron-down"> → tap to collapse  
🕳️ Click outside footer → also collapses (good UX for small pages)

------------------------------
✅  Final Result
------------------------------

✨ A neat, responsive footer with:
- Minimal default view  
- Smooth expandable behavior  
- Clean mobile-first experience


// Another Machanism write here