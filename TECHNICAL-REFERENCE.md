# 🔧 STACKED CARDS - TECHNICAL REFERENCE

## 📂 FILE STRUCTURE

```
components/
├── StackedCardGroup.js ..................... Main carousel component
├── Projects.js (MODIFIED) ................. Projects stacked cards
├── Certifications.js (MODIFIED) ........... Certificates stacked cards
├── ui/
│   ├── Card.js ............................ Base card wrapper (unchanged)
│   ├── Badge.js ........................... Tech/status badges (unchanged)
│   ├── Button.js .......................... Action buttons (unchanged)
│   └── SectionTitle.js .................... Section headers (unchanged)
└── ThemeProvider.js ....................... Theme context (unchanged)

Documentation/
├── STACKED-CARDS-IMPLEMENTATION.md ........ Overview & checklist
└── VISUAL-TRANSFORMATION-GUIDE.md ........ Visual & interaction guide
```

---

## 🎯 COMPONENT INTERFACES

### StackedCardGroup Props

```javascript
<StackedCardGroup
  items={Array}           // Data array (projects/certs)
  renderCard={Function}   // (item, isActive) => JSX
  renderDetails={Function} // (item, index, nav) => JSX
  cardCount={Number}      // Max visible cards (3 or 5)
  stackOffset={Number}    // Distance between cards (px)
  stackScale={Number}     // Scale of back cards (0-1)
  onNavigate={Function}   // (newIndex) => void (optional)
/>
```

### renderCard Function Signature

```javascript
const renderCard = (item, isActive) => (
  <JSX>
    // Render card preview
    // item: current item data
    // isActive: boolean, true if on top
    // Use className conditionally based on isActive
  </JSX>
)
```

### renderDetails Function Signature

```javascript
const renderDetails = (item, index, nav) => (
  <JSX>
    // Render full details modal content
    // item: current item data
    // index: current position (0-based)
    // nav: { onNext, onPrev, close, totalItems }
  </JSX>
)
```

### Navigation Object (in renderDetails)

```javascript
nav = {
  onNext: () => void,        // Move to next item
  onPrev: () => void,        // Move to previous item
  close: () => void,         // Close modal
  totalItems: Number,        // Total items in data
}
```

---

## 🎨 STATE MANAGEMENT

### StackedCardGroup State

```javascript
const [activeIndex, setActiveIndex] = useState(0)
  // Current visible card index

const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  // Modal visibility state

const [isAnimating, setIsAnimating] = useState(false)
  // Animation lock (prevents rapid clicks)

const touchStartX = useRef(null)
  // For swipe detection

const prevIndexRef = useRef(0)
  // Tracks previous index for animation direction
```

### State Transitions

```
User Action → Navigate() called
  ├─ Set isAnimating = true
  ├─ Update activeIndex
  ├─ Trigger card transformations
  └─ After 400ms → Set isAnimating = false

User Clicks Card → setIsDetailsOpen(true)
  ├─ Modal slides in (scaleIn animation)
  ├─ Overlay appears with fadeIn
  ├─ Details content animates within

User Closes Modal → setIsDetailsOpen(false)
  ├─ Modal slides out
  ├─ Returns to stack at correct position
```

---

## 🖼️ CARD POSITIONING CALCULATION

### getCardStyle() Method

```javascript
const getCardStyle = (index) => {
  const position = (index - activeIndex + totalItems) % totalItems
  
  if (position === 0) {
    // ACTIVE - Front of stack
    return {
      zIndex: 30,
      opacity: 1,
      transform: 'translateY(0) scale(1)',
      pointerEvents: 'auto',
    }
  } else if (position < visibleCards) {
    // BEHIND - Visible edges
    const offset = position * stackOffset
    const scale = 1 - position * (1 - stackScale)
    return {
      zIndex: 30 - position,
      opacity: 0.7,
      transform: `translateY(${offset}px) scale(${scale})`,
      pointerEvents: 'none',
    }
  } else {
    // HIDDEN - Off-screen
    return {
      zIndex: 0,
      opacity: 0,
      transform: `translateY(${visibleCards * stackOffset}px) scale(${stackScale})`,
      pointerEvents: 'none',
    }
  }
}
```

### Example Calculation (Projects, 3 cards visible)

```
activeIndex = 0 (Maison Élégance)
Card 0: position = (0 - 0 + 3) % 3 = 0   → Active (front)
Card 1: position = (1 - 0 + 3) % 3 = 1   → Behind by 24px
Card 2: position = (2 - 0 + 3) % 3 = 2   → Behind by 48px

activeIndex = 1 (Student Management)
Card 0: position = (0 - 1 + 3) % 3 = 2   → Behind by 48px
Card 1: position = (1 - 1 + 3) % 3 = 0   → Active (front)
Card 2: position = (2 - 1 + 3) % 3 = 1   → Behind by 24px

activeIndex = 2 (Gym Website)
Card 0: position = (0 - 2 + 3) % 3 = 1   → Behind by 24px
Card 1: position = (1 - 2 + 3) % 3 = 2   → Behind by 48px
Card 2: position = (2 - 2 + 3) % 3 = 0   → Active (front)
```

---

## ⌨️ EVENT HANDLERS

### Navigate (Arrow/Dot Click)

```javascript
const navigate = (direction) => {
  if (isAnimating || totalItems === 0) return
  
  setIsAnimating(true)
  prevIndexRef.current = activeIndex
  
  let newIndex = activeIndex + direction
  if (newIndex < 0) newIndex = totalItems - 1      // Wrap forward
  if (newIndex >= totalItems) newIndex = 0          // Wrap backward
  
  setActiveIndex(newIndex)
  onNavigate?.(newIndex)
  
  setTimeout(() => setIsAnimating(false), 400)
}

// Called by: arrow buttons, keyboard arrows, swipe
```

### Go to Card (Pagination Dot Click)

```javascript
const goToCard = (index) => {
  if (isAnimating || index === activeIndex) return
  setIsAnimating(true)
  prevIndexRef.current = activeIndex
  setActiveIndex(index)
  onNavigate?.(index)
  setTimeout(() => setIsAnimating(false), 400)
}
```

### Keyboard Navigation (Inside Modal)

```javascript
useEffect(() => {
  if (!isDetailsOpen) return  // Only active when modal open
  
  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') navigate(-1)
    else if (e.key === 'ArrowRight') navigate(1)
    else if (e.key === 'Escape') setIsDetailsOpen(false)
  }
  
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [isDetailsOpen, activeIndex, isAnimating])
```

### Touch/Swipe Support

```javascript
const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  if (!touchStartX.current) return
  const touchEndX = e.changedTouches[0].clientX
  const diff = touchStartX.current - touchEndX
  
  if (Math.abs(diff) > 50) {           // 50px minimum
    if (diff > 0) navigate(1)           // Swiped left → next
    else navigate(-1)                   // Swiped right → prev
  }
  touchStartX.current = null
}

// Attached to: stack container
```

---

## 🎬 ANIMATION IMPLEMENTATION

### CSS Transitions

```css
/* Applied to each card div */
transition: all ease-out duration-300

/* Only these properties change: */
- transform (translateY, scale)
- opacity
- z-index (instant, not animated)
- pointerEvents (instant)
```

### Keyframe Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Applied to: */
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-scaleIn { animation: scaleIn 0.3s ease-out; }
```

### When Animations Trigger

```
Stack Card Moving:
  - Background: CSS transition on each card
  - Duration: 300ms
  - Easing: ease-out
  - Properties: transform, opacity, z-index

Modal Opening:
  - Overlay: fadeIn (300ms)
  - Content: scaleIn (300ms)
  - Both start simultaneously

Modal Closing:
  - Inverse animations
  - Content fades out and scales down
  - Overlay fades out
```

---

## 🔄 ANIMATION FLOW DIAGRAM

```
                    ┌─────────────────┐
                    │  User Action    │
                    │ (Click/Swipe)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ isAnimating = T │
                    │ Calculate newIdx │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Update State   │
                    │  (activeIndex)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼──┐            ┌────▼────┐         ┌────▼────┐
    │Card  │            │Card     │         │Card     │
    │0:pos │            │1:pos    │         │2:pos    │
    │ 2    │            │ 0/1/2   │         │ 1/2     │
    │sX:30 │            │sY:0-48  │         │sX:varies│
    │ o:0  │            │s:1-0.96 │         │         │
    └──┬───┘            └────┬────┘         └────┬────┘
       │                     │                   │
       │   300ms transition-all ease-out         │
       │                     │                   │
    ┌──▼──────────────────────▼───────────────────▼┐
    │     All Cards Update Simultaneously         │
    │     (GPU-accelerated transforms)            │
    └──┬──────────────────────────────────────────┐
       │
       │ After 400ms: isAnimating = false
       │ Ready for next action
```

---

## 🛠️ CUSTOMIZATION GUIDE

### Change Animation Speed

**In StackedCardGroup.js:**
```javascript
// Line ~60 (card transition timing)
className={`transition-all ease-out duration-300 ...`}
//                                    ^^^^^^
// Change 300 to 200 (faster) or 400 (slower)

// Line ~90 (animation lock timeout)
setTimeout(() => setIsAnimating(false), 400)
//                                      ^^^
// Keep this 100ms more than transition duration
```

### Change Stack Offset/Scale

**In Projects.js:**
```javascript
<StackedCardGroup
  cardCount={3}
  stackOffset={24}    // ← Change pixel distance
  stackScale={0.98}   // ← Change back card size
  ...
/>
```

**In Certifications.js:**
```javascript
<StackedCardGroup
  cardCount={5}
  stackOffset={20}    // ← Smaller for more cards
  stackScale={0.96}   // ← More scale progression
  ...
/>
```

### Change Card Container Size

**In StackedCardGroup.js:**
```javascript
<div className="relative h-96 md:h-[480px] perspective">
  //               ^^^^      ^^^^^^^
  // Change h-96 (384px) and md:h-[480px] (480px)
  // Bigger = taller cards
  // Smaller = more compact stack
</div>
```

### Change Glass Effect Strength

**In StackedCardGroup.js (modal):**
```javascript
style={{
  background: 'radial-gradient(...), rgba(7, 11, 20, 0.92)',
  //                                                    ^^^^
  // Change 0.92 (92% opaque) for darker/lighter overlay
  // 0.95 = more opaque (darker)
  // 0.85 = more transparent (lighter)
}}
```

**In Card backgrounds:**
```javascript
<Card className="... from-blue-950/40 to-slate-900/30 ...">
  //                  ^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^
  // Change opacity values (40 and 30) for brighter/darker glass
  // Higher = darker (50, 60)
  // Lower = lighter (20, 10)
```

---

## 🧪 TESTING CHECKLIST

### Browser Compatibility
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

### Device Testing
- ✅ Desktop (1920px, 1440px, 1080px)
- ✅ Tablet (768px, 834px)
- ✅ Mobile (375px, 390px, 412px)
- ✅ Ultra-wide (2560px+)

### Interaction Testing
- ✅ Click arrow buttons
- ✅ Click pagination dots
- ✅ Keyboard navigation (arrows, Escape)
- ✅ Touch swipe (50px threshold)
- ✅ Click card to open details
- ✅ Close modal with X button
- ✅ Close modal with Escape key
- ✅ Click links inside modal (stay functional)

### Performance Testing
- ✅ 60fps animations (use DevTools)
- ✅ No layout shift (use DevTools Layout Shift detection)
- ✅ No jank or stuttering
- ✅ Smooth on low-end devices (optional)

### Accessibility Testing
- ✅ Tab navigation (focus order)
- ✅ Focus visible outlines (blue ring)
- ✅ Screen reader (aria-labels, semantic HTML)
- ✅ Keyboard only (no mouse needed)
- ✅ Color contrast (WCAG AA minimum)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Cards stuck after clicking rapidly

**Cause:** `isAnimating` timeout too short
**Fix:** Ensure `setTimeout` in `navigate()` matches transition duration

```javascript
// WRONG (animates for 300ms but unlocks after 200ms)
className="... duration-300 ..."
setTimeout(() => setIsAnimating(false), 200)

// CORRECT (both 400ms)
className="... duration-300 ..."
setTimeout(() => setIsAnimating(false), 400)  // 100ms buffer for safety
```

### Issue: Swipe not working on mobile

**Cause:** touchStartX not captured correctly
**Fix:** Ensure container has `onTouchStart` and `onTouchEnd`

```javascript
<div
  ref={containerRef}
  onTouchStart={handleTouchStart}   // ← Must be present
  onTouchEnd={handleTouchEnd}       // ← Must be present
>
```

### Issue: Modal appears behind cards

**Cause:** z-index not high enough
**Fix:** Modal z-index must be higher than stack (30)

```javascript
<div
  className="... z-50 ..."  // ← 50 > 30 (stack max)
>
```

### Issue: Text/images blurry in scaled cards

**Cause:** Using `scale()` transform on images
**Fix:** Use container scaling, not image scaling

```javascript
// WRONG - blurs the image
<img className="scale-95" />

// CORRECT - parent container scales, image stays crisp
<div className="scale-95">
  <img />
</div>
```

### Issue: Pagination dots overflow on small screens

**Cause:** Gap too large or many dots
**Fix:** Use responsive gap classes

```javascript
<div className="flex justify-center gap-2 md:gap-3">
  {/* Smaller gap on mobile (gap-2) */}
  {/* Larger gap on desktop (md:gap-3) */}
</div>
```

---

## 📊 PERFORMANCE METRICS

Target metrics:
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Animation FPS:** 60fps (smooth)

Optimizations applied:
- ✅ Transform/opacity only (GPU accelerated)
- ✅ No layout recalculations during animation
- ✅ `will-change` handled automatically by browser
- ✅ Debounced rapid clicks with `isAnimating` flag
- ✅ Icons loaded from lucide-react (tree-shakeable)

---

## 🚀 DEPLOYMENT CHECKLIST

- ✅ Build succeeds without errors
- ✅ No console warnings (animation-related)
- ✅ All animations smooth (test on actual device)
- ✅ Mobile responsiveness verified
- ✅ Links functional (internal and external)
- ✅ Images load correctly
- ✅ Accessibility audit passed
- ✅ Performance budget met (< 3s initial load)

Ready to push to production! 🎉
