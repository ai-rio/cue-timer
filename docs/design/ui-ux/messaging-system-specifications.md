# CueTimer Messaging System UI/UX Specifications

**Document Version:** 1.0 **Date:** 2025-10-23 **Status:** Essential Feature -
Ready for Implementation **Target Users:** Event Managers, Presenters, Stage
Managers

---

## 🎯 Executive Summary

The CueTimer messaging system enables event managers to send real-time visual
cues to presenters without disrupting the flow of presentations. This essential
feature transforms CueTimer from a simple timer into a complete event
communication platform, addressing a critical need in professional event
management.

## 👥 User Personas & Use Cases

### Primary User: Event Manager/Stage Manager

**Role:** Controls presentation timing and flow **Device:** Mobile phone or
tablet (controller view) **Key Needs:**

- Subtle presenter communication without interruption
- Quick access to common presentation cues
- Custom messaging for unique situations
- Real-time feedback on message delivery

### Secondary User: Presenter/Speaker

**Role:** Delivers presentation content **Device:** Any device with web browser
(presenter view) **Key Needs:**

- Clear, unobtrusive visual cues
- Non-disruptive message delivery
- Quick acknowledgment capability
- Minimal cognitive overhead

## 📱 Screen Designs & Interactions

### Manager Controller Interface

#### Primary Timer Screen with Messaging Access

```
┌─────────────────────────┐
│ [CueTimer]   [⚙️ Settings] │
│                         │
│    Main Conference      │
│       05:42             │
│    ━━━━━━━━━━━━━━━━━    │
│                         │
│  [▶️ START] [⏸️ PAUSE]  │
│    [⏹️ STOP] [🔄 RESET] │
│                         │
│  [+1min] [+5min] [-1min] │
│                         │
│  💬 Messages (3)         │ ← Quick Access Badge
│                         │
│  📱 Share Screen        │
│  🎤 Mic Check           │ ← Quick Actions
│                         │
│  🟢 3 devices connected  │
│  🔄 Syncing...          │
└─────────────────────────┘
```

#### Expanded Messaging Panel

```
┌─────────────────────────┐
│ ← Back to Timer         │
│                         │
│ 💬 Quick Messages       │
│ ┌─────────────────────┐ │
│ │ ⏱️ ⏰ 📄 ⚠️ 🎤      │ │ ← Category Tabs
│ │ Time Present Content│ │
│ │   Urgent  Positive  │ │
│ └─────────────────────┘ │
│                         │
│ 📑 Presentation Cues   │
│ ┌─────────────────────┐ │
│ │ 🎤 Move closer to   │ │
│ │    microphone       │ │
│ │ 🔊 Speak up         │ │
│ │ 🐌 Slow down        │ │
│ │ ⚡ Speed up         │ │
│ │ 👀 Look at camera   │ │
│ └─────────────────────┘ │
│                         │
│ ✏️ Custom Message       │
│ ┌─────────────────────┐ │
│ │ Type your message.. │ │
│ │        [SEND]       │ │
│ └─────────────────────┘ │
│                         │
│ 📊 Recent Messages     │
│ • "Move closer to mic"  │ ← Delivered ✅
│ • "2 minutes left"      │ ← Acknowledged ✓
│ • "Great point!"        │ ← Delivered ✅
└─────────────────────────┘
```

### Presenter Display Interface

#### Fullscreen Timer with Message Overlay

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│           05:42                 │
│       (Large, Centered)         │
│                                 │
│    ┌─────────────────────┐      │ ← Message Overlay
│    │ 🎤                   │      │   Appears when message sent
│    │ Move closer to      │      │   Non-intrusive positioning
│    │ microphone          │      │   Auto-dismiss after 30s
│    │                     │      │   Or when acknowledged
│    │      [✓ Got it]     │      │
│    └─────────────────────┘      │
│                                 │
│               05:38             │ ← Timer continues counting
│                                 │
│               CueTimer           │ ← Subtle branding
└─────────────────────────────────┘
```

## 🎨 Visual Design Specifications

### Color Coding by Message Priority

#### High Priority (Red/Orange)

- **Use Cases:** Urgent technical issues, time critical warnings
- **Colors:** #F56565 (Warning Red), #FF6B35 (Spotlight Orange)
- **Animation:** Gentle pulse to draw attention
- **Duration:** 30 seconds or until acknowledged

#### Normal Priority (Blue/Gray)

- **Use Cases:** Presentation cues, timing reminders
- **Colors:** #4299E1 (Info Blue), #2D3748 (Professional Gray)
- **Animation:** Slide in from top
- **Duration:** 20 seconds or until acknowledged

#### Positive Reinforcement (Green)

- **Use Cases:** Encouragement, positive feedback
- **Colors:** #48BB78 (Success Green)
- **Animation:** Brief highlight effect
- **Duration:** 10 seconds auto-dismiss

### Typography Specifications

#### Message Text

- **Font:** Inter Medium
- **Size:** 18px on desktop, 16px on mobile
- **Color:** White on colored background
- **Max Length:** 80 characters for optimal readability

#### Timer Display

- **Font:** Space Grotesk Medium
- **Size:** 120px minimum for primary display
- **Weight:** Medium for readability
- **Color:** Professional Gray (light theme), White (dark theme)

### Icon System

#### Message Categories

- **⏰ Time Management:** Clock emojis for timing-related messages
- **🎤 Audio/Technical:** Microphone and speaker emojis
- **📄 Content:** Document and slide emojis
- **⚡ Pacing:** Speed and movement emojis
- **✨ Positive:** Celebration and encouragement emojis
- **⚠️ Urgent:** Warning and attention emojis

#### Interactive Elements

- **✓ Acknowledge:** Checkmark for message confirmation
- **💬 Messages:** Speech bubble for messaging access
- **🔄 Sync Status:** Rotation arrows for connection status

## 🔄 Interaction Patterns

### Manager Workflows

#### Quick Message Sending

1. **Tap "💬 Messages"** button from timer screen
2. **Select category tab** (Presentation, Time, Content, etc.)
3. **Tap preset message** → Instant delivery to all presenters
4. **Visual confirmation** → Message appears in "Recent Messages"

#### Custom Message Creation

1. **Expand messaging panel**
2. **Tap "✏️ Custom Message"**
3. **Type message** (max 100 characters)
4. **Tap "SEND"** → Delivered to all presenter devices

#### Message Priority Management

- **Default:** Normal priority (1)
- **Urgent:** Long-press preset → High priority (2)
- **Critical:** Hold 3 seconds → Urgent priority (3)

### Presenter Workflows

#### Message Reception

1. **Message appears** as overlay on timer display
2. **Auto-positioning** avoids covering timer numbers
3. **Presenter reads message** → No action required for auto-dismiss
4. **Optional acknowledgment** → Tap "✓ Got it" to dismiss immediately

#### Multi-Message Handling

- **Priority queue:** Urgent messages interrupt lower priority
- **Stacking:** Multiple messages show in sequence
- **Timeout management:** Messages expire based on priority

## 📱 Responsive Design Specifications

### Mobile Manager Interface (320px - 767px)

- **Single column layout** for messaging panel
- **Large touch targets** (44px minimum) for message buttons
- **Thumb-friendly positioning** for quick access
- **Swipe gestures** for category navigation

### Tablet Manager Interface (768px - 1023px)

- **Two-column layout** with timer visible while messaging
- **Expanded message grid** for quicker selection
- **Keyboard support** for custom message typing
- **Split-screen capability** for timer + messaging

### Desktop Presenter Interface (1024px+)

- **Fullscreen timer display** with overlay positioning
- **Multiple monitor support** for different display needs
- **Keyboard shortcuts** for message acknowledgment
- **High contrast mode** for stage visibility

## 🎭 Animation & Micro-interactions

### Message Delivery Animations

- **Slide-in effect:** Messages slide down from top (0.3s ease-out)
- **Fade-in:** Background color fades smoothly (0.2s ease-in)
- **Scale effect:** Brief scale-up on appearance (0.1s)

### Message Dismissal Animations

- **Fade-out:** Smooth fade to transparent (0.3s ease-out)
- **Slide-up:** Message slides up and disappears (0.3s ease-in)
- **Scale-down:** Brief scale-down before dismissal (0.1s)

### Status Indicators

- **Delivery confirmation:** Brief green checkmark on manager screen
- **Acknowledgment received:** Message turns from blue to green
- **Sync status:** Rotating arrows during sync, solid when complete

## 🔔 Accessibility Specifications

### Screen Reader Support

- **ARIA labels:** "New message from event manager: Move closer to microphone"
- **Live regions:** Timer updates announced as they change
- **Keyboard navigation:** Full tab navigation and Enter/Space activation
- **Focus management:** Logical focus order for message interactions

### Visual Accessibility

- **Color contrast:** 4.5:1 minimum for all text combinations
- **High contrast mode:** Enhanced contrast for stage visibility
- **Text scaling:** Support for 200% zoom without layout break
- **Motion reduction:** Respect prefers-reduced-motion preferences

### Motor Accessibility

- **Touch targets:** 44px minimum for all interactive elements
- **Alternatives:** Keyboard alternatives for all touch gestures
- **Voice control:** "Send message: move closer to microphone"
- **Switch control:** Full navigation support for switch users

## 📊 Performance Specifications

### Message Delivery Speed

- **Local sync:** < 100ms for devices on same network
- **Remote sync:** < 500ms for devices across internet
- **Offline queuing:** Messages queued when offline, sent on reconnection
- **Batch processing:** Multiple messages processed efficiently

### Resource Usage

- **Memory impact:** < 5MB additional memory for messaging system
- **Battery impact:** < 2% additional drain over 1 hour usage
- **Network usage:** < 1MB per hour for typical messaging usage
- **CPU impact:** < 1% additional processing load

## 🧪 Testing Scenarios

### Core Functionality Testing

1. **Message Delivery:** Manager sends message → Presenter receives within 500ms
2. **Priority Handling:** Urgent message interrupts normal priority message
3. **Offline Behavior:** Messages work offline, sync when connection restored
4. **Multi-device:** Message appears on all connected presenter devices
5. **Acknowledgment:** Presenter acknowledgment reflected on manager screen

### Edge Case Testing

1. **Network Interruption:** Messages queued during connection loss
2. **High Volume:** 50+ messages sent in rapid succession
3. **Cross-platform:** iOS, Android, desktop compatibility
4. **Accessibility:** Screen reader and keyboard navigation
5. **Performance:** Battery and memory usage under load

### User Experience Testing

1. **Event Manager Workflow:** Complete timer + messaging session
2. **Presenter Experience:** Message reception during live presentation
3. **Stress Testing:** High-pressure presentation scenarios
4. **Multi-presenter:** Several presenters with different devices
5. **International Use:** Emoji and text rendering across languages

## 🎯 Success Metrics

### Performance Metrics

- **Message delivery rate:** > 99.5% successful delivery
- **Latency:** < 500ms average delivery time
- **Uptime:** > 99.9% messaging system availability
- **Error rate:** < 0.1% message delivery failures

### User Experience Metrics

- **Manager satisfaction:** > 4.5/5 rating for ease of use
- **Presenter comprehension:** > 95% message understanding rate
- **Workflow efficiency:** > 30% reduction in verbal interruptions
- **Adoption rate:** > 80% of active sessions use messaging

### Business Impact Metrics

- **Session completion rate:** > 90% sessions stay on time
- **Presenter satisfaction:** > 4.0/5 rating for communication clarity
- **Event manager retention:** > 85% annual retention rate
- **Feature utilization:** > 70% of managers use messaging regularly

---

## 🔄 Implementation Roadmap

### Phase 1: Core Messaging (Week 1-2)

- Database schema and PowerSync integration
- Basic preset messages and custom messaging
- Real-time delivery between devices
- Simple presenter message display

### Phase 2: Enhanced UX (Week 3-4)

- Message categories and priority system
- Advanced animations and transitions
- Message acknowledgment system
- Offline message queuing

### Phase 3: Professional Features (Week 5-6)

- Message analytics and history
- Custom message templates
- Multi-language emoji support
- Advanced accessibility features

This messaging system transforms CueTimer into an essential event communication
tool, providing significant competitive advantage and addressing critical needs
in professional event management.

---

**Document Status:** Ready for Implementation **Next Steps:** Begin Phase 1
development with database schema and basic messaging functionality
**Dependencies:** PowerSync integration, React component development, UI/UX
design implementation
