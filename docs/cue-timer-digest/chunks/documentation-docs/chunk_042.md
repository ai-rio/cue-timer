# Chunk 42: documentation_docs

## Metadata

- **Files**: 1
- **Size**: 29,249 characters (~7,312 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/development/guides/powersync-implementation-guide.md`

---

## File: `docs/development/guides/powersync-implementation-guide.md`

```markdown
# PowerSync + Supabase Implementation Guide for CueTimer

**Based on**: Validated PowerSync Supabase demo implementation **Target**:
CueTimer offline-first real-time sync functionality **Timeline**: 3-4 weeks
additional development **Complexity**: Medium (with PowerSync handling complex
sync logic)

---

## 🎯 Overview

This guide provides a step-by-step implementation approach for adding PowerSync
to CueTimer, based on the complete working demo analyzed in our feasibility
study. The demo shows a React + Supabase + PowerSync todo list that maps
directly to CueTimer's timer session and event requirements.

## 🏗️ Architecture Overview
```

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │ Controller │ │
Presenter │ │ Supabase │ │ (Mobile) │ │ (Any Device) │ │ (Backend) │ │ │ │ │ │ │
│ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ │ PowerSync │
│◄──►│ │ PowerSync │ │◄──►│ │ PostgreSQL │ │ │ │ Client │ │ │ │ Client │ │ │ │ +
RLS │ │ │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │ │ │ │ │ │ │
│ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ │ IndexedDB │ │ │
│ IndexedDB │ │ │ │ PowerSync │ │ │ │ (Offline) │ │ │ │ (Offline) │ │ │ │
Service │ │ │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │
└─────────────────┘ └─────────────────┘ └─────────────────┘

````

## 📋 Phase 1: Supabase + PowerSync Setup (Week 1)

### 1.1 Initialize Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project
supabase init
supabase start
````

### 1.2 Create Database Schema for CueTimer

Based on the demo schema, adapted for timer functionality:

```sql
-- migrations/20250101000001_cuetimer_schema.sql

-- Timer Sessions (replaces demo's 'lists')
CREATE TABLE public.timer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL, -- e.g., "Main Conference Keynote"
  owner_id UUID NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 300, -- 5 minutes default
  status TEXT NOT NULL DEFAULT 'created', -- created, running, paused, completed
  PRIMARY KEY (id),
  CONSTRAINT timer_sessions_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Timer Events (replaces demo's 'todos')
CREATE TABLE public.timer_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL, -- start, stop, pause, adjust, join
  event_data JSONB, -- { "adjustment_seconds": 60, "device_id": "controller_1" }
  session_id UUID NOT NULL,
  created_by UUID NULL,
  PRIMARY KEY (id),
  CONSTRAINT timer_events_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES timer_sessions (id) ON DELETE CASCADE,
  CONSTRAINT timer_events_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users (id) ON DELETE SET NULL
);

-- Presenter Messages (NEW - Essential Feature)
CREATE TABLE public.presenter_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id UUID NOT NULL,
  message_type TEXT NOT NULL, -- 'preset' or 'custom'
  message_text TEXT NOT NULL,
  icon_emoji TEXT, -- 🎤, ⏱️, 📄, ⚡, etc.
  category TEXT NOT NULL, -- 'time', 'presentation', 'content', 'urgent', 'positive'
  acknowledged_at TIMESTAMP WITH TIME ZONE NULL,
  acknowledged_by UUID NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 seconds'),
  auto_dismiss BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1, -- 1=normal, 2=high, 3=urgent
  PRIMARY KEY (id),
  CONSTRAINT presenter_messages_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES timer_sessions (id) ON DELETE CASCADE,
  CONSTRAINT presenter_messages_acknowledged_by_fkey
    FOREIGN KEY (acknowledged_by) REFERENCES auth.users (id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.timer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presenter_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own timer sessions" ON public.timer_sessions
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own timer sessions" ON public.timer_sessions
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own timer sessions" ON public.timer_sessions
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view events for their sessions" ON public.timer_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.timer_sessions
      WHERE timer_sessions.id = timer_events.session_id
      AND timer_sessions.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert events for their sessions" ON public.timer_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.timer_sessions
      WHERE timer_sessions.id = timer_events.session_id
      AND timer_sessions.owner_id = auth.uid()
    )
  );

-- Additional RLS Policies for Messages
CREATE POLICY "Users can view messages for their sessions" ON public.presenter_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.timer_sessions
      WHERE timer_sessions.id = presenter_messages.session_id
      AND timer_sessions.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages for their sessions" ON public.presenter_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.timer_sessions
      WHERE timer_sessions.id = presenter_messages.session_id
      AND timer_sessions.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can acknowledge messages" ON public.presenter_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.timer_sessions
      WHERE timer_sessions.id = presenter_messages.session_id
      AND timer_sessions.owner_id = auth.uid()
    )
  );

-- PowerSync Publication (Updated with Messages)
CREATE PUBLICATION powersync FOR TABLE public.timer_sessions, public.timer_events, public.presenter_messages;
```

### 1.3 Configure PowerSync

Create `config/powersync.yaml`:

```yaml
# PowerSync Configuration for CueTimer
telemetry:
  disable_telemetry_sharing: false

replication:
  connections:
    - type: postgresql
      uri: !env PS_DATA_SOURCE_URI
      sslmode: disable

storage:
  type: mongodb
  uri: !env PS_MONGO_URI

port: !env PS_PORT

sync_rules:
  path: sync_rules.yaml

client_auth:
  supabase: true
  supabase_jwt_secret: !env PS_SUPABASE_JWT_SECRET
  audience: ['powersync-dev', 'powersync']
```

### 1.4 Configure Sync Rules

Create `config/sync_rules.yaml`:

```yaml
# Sync Rules for CueTimer
bucket_definitions:
  user_timer_sessions:
    # One bucket per user's timer sessions
    parameters:
      select id as session_id from timer_sessions where owner_id =
      request.user_id()
    data:
      - select * from timer_sessions where id = bucket.session_id
      - select * from timer_events where session_id = bucket.session_id
      - select * from presenter_messages where session_id = bucket.session_id
```

### 1.5 Environment Configuration

Create `.env`:

```bash
# Supabase Configuration
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key_here
PS_SUPABASE_JWT_SECRET=your_jwt_secret_here

# Database Connection
PG_DATABASE_HOSTNAME=supabase_db_cuetimer
PG_DATABASE_NAME=postgres
PG_DATABASE_PORT=5432
PG_DATABASE_USER=postgres
PG_DATABASE_PASSWORD=postgres
PS_DATA_SOURCE_URI=postgres://${PG_DATABASE_USER}:${PG_DATABASE_PASSWORD}@${PG_DATABASE_HOSTNAME}:${PG_DATABASE_PORT}/${PG_DATABASE_NAME}

# PowerSync Configuration
PS_PORT=8080
PS_MONGO_URI=mongodb://localhost:27017/powersync
```

## 📱 Phase 2: Client Integration (Week 2)

### 2.1 Install Dependencies

```bash
# For Next.js/React app
npm install @powersync/react @supabase/supabase-js
```

### 2.2 PowerSync Client Setup

Create `lib/powersync.ts`:

```typescript
import { PowerSyncDatabase } from '@powersync/react-native';
import { SupabaseConnector } from '@powersync/extension-supabase';
import { supabase } from './supabase';

export const PowerSync = new PowerSyncDatabase({
  database: {
    filename: 'cuetimer.db',
  },
  logger: {
    level: 'debug',
  },
});

export const connector = new SupabaseConnector({
  supabaseClient: supabase,
  credentials: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    return {
      token: session.access_token,
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined,
    };
  },
});

PowerSync.connect(connector);
```

### 2.3 React Hooks for Timer Management

Create `hooks/useTimerSessions.ts`:

```typescript
import { usePowerSync, useQuery } from '@powersync/react';
import { usePowerSyncWatchedQuery } from '@powersync/react';

export interface TimerSession {
  id: string;
  name: string;
  duration_seconds: number;
  status: 'created' | 'running' | 'paused' | 'completed';
  created_at: string;
  owner_id: string;
}

export interface TimerEvent {
  id: string;
  event_type: 'start' | 'stop' | 'pause' | 'adjust' | 'join';
  event_data: any;
  session_id: string;
  created_at: string;
}

export interface PresenterMessage {
  id: string;
  message_type: 'preset' | 'custom';
  message_text: string;
  icon_emoji?: string;
  category: 'time' | 'presentation' | 'content' | 'urgent' | 'positive';
  acknowledged_at?: string;
  acknowledged_by?: string;
  expires_at: string;
  auto_dismiss: boolean;
  priority: number; // 1=normal, 2=high, 3=urgent
  session_id: string;
  created_at: string;
}

export const useTimerSessions = () => {
  const powerSync = usePowerSync();

  // Watch for changes to user's timer sessions
  const { data: sessions } = usePowerSyncWatchedQuery<TimerSession>(`
    SELECT * FROM timer_sessions
    WHERE owner_id = auth.uid()
    ORDER BY created_at DESC
  `);

  const createSession = async (name: string, durationSeconds: number) => {
    const { data, error } = await powerSync.execute(
      `
      INSERT INTO timer_sessions (name, duration_seconds, owner_id)
      VALUES (?, ?, auth.uid())
      RETURNING *
    `,
      [name, durationSeconds]
    );

    return { data: data[0], error };
  };

  const startSession = async (sessionId: string) => {
    await powerSync.execute(
      `
      INSERT INTO timer_events (event_type, session_id, created_by)
      VALUES ('start', ?, auth.uid())
    `,
      [sessionId]
    );

    await powerSync.execute(
      `
      UPDATE timer_sessions
      SET status = 'running'
      WHERE id = ? AND owner_id = auth.uid()
    `,
      [sessionId]
    );
  };

  const stopSession = async (sessionId: string) => {
    await powerSync.execute(
      `
      INSERT INTO timer_events (event_type, session_id, created_by)
      VALUES ('stop', ?, auth.uid())
    `,
      [sessionId]
    );

    await powerSync.execute(
      `
      UPDATE timer_sessions
      SET status = 'completed'
      WHERE id = ? AND owner_id = auth.uid()
    `,
      [sessionId]
    );
  };

  return {
    sessions,
    createSession,
    startSession,
    stopSession,
  };
};

export const usePresenterMessaging = (sessionId: string) => {
  const powerSync = usePowerSync();

  // Watch for active messages in this session
  const { data: messages } = usePowerSyncWatchedQuery<PresenterMessage>(
    `
    SELECT * FROM presenter_messages
    WHERE session_id = ?
    AND acknowledged_at IS NULL
    AND expires_at > NOW()
    ORDER BY priority DESC, created_at ASC
  `,
    [sessionId]
  );

  const sendMessage = async (
    messageText: string,
    messageType: 'preset' | 'custom' = 'preset',
    iconEmoji?: string,
    category: string = 'presentation',
    priority: number = 1
  ) => {
    const { data, error } = await powerSync.execute(
      `
      INSERT INTO presenter_messages (
        session_id, message_type, message_text, icon_emoji, category, priority
      )
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `,
      [sessionId, messageType, messageText, iconEmoji, category, priority]
    );

    return { data: data[0], error };
  };

  const acknowledgeMessage = async (messageId: string) => {
    const { error } = await powerSync.execute(
      `
      UPDATE presenter_messages
      SET acknowledged_at = NOW(), acknowledged_by = auth.uid()
      WHERE id = ?
    `,
      [messageId]
    );

    return { error };
  };

  return {
    messages,
    sendMessage,
    acknowledgeMessage,
  };
};
```

### 2.4 Timer Component

Create `components/TimerDisplay.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useTimerSessions, TimerSession } from '../hooks/useTimerSessions';

interface TimerDisplayProps {
  session: TimerSession;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ session }) => {
  const [timeRemaining, setTimeRemaining] = useState(session.duration_seconds);
  const [isRunning, setIsRunning] = useState(session.status === 'running');
  const powerSync = usePowerSync();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // Auto-stop when timer reaches zero
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = async () => {
    try {
      // Log event locally first (works offline)
      await powerSync.execute(`
        INSERT INTO timer_events (event_type, session_id, created_by, event_data)
        VALUES ('start', ?, auth.uid(), ?)
      `, [session.id, JSON.stringify({ device_id: 'controller', timestamp: Date.now() })]);

      // Update session status
      await powerSync.execute(`
        UPDATE timer_sessions
        SET status = 'running'
        WHERE id = ? AND owner_id = auth.uid()
      `, [session.id]);

      setIsRunning(true);
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  const stopTimer = async () => {
    try {
      await powerSync.execute(`
        INSERT INTO timer_events (event_type, session_id, created_by, event_data)
        VALUES ('stop', ?, auth.uid(), ?)
      `, [session.id, JSON.stringify({ device_id: 'controller', timestamp: Date.now() })]);

      await powerSync.execute(`
        UPDATE timer_sessions
        SET status = 'paused'
        WHERE id = ? AND owner_id = auth.uid()
      `, [session.id]);

      setIsRunning(false);
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  const adjustTime = async (seconds: number) => {
    try {
      await powerSync.execute(`
        INSERT INTO timer_events (event_type, session_id, created_by, event_data)
        VALUES ('adjust', ?, auth.uid(), ?)
      `, [session.id, JSON.stringify({ adjustment_seconds: seconds, device_id: 'controller' })]);

      setTimeRemaining(prev => Math.max(0, prev + seconds));
    } catch (error) {
      console.error('Failed to adjust time:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-display">
      <h2>{session.name}</h2>
      <div className="timer-time">{formatTime(timeRemaining)}</div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={startTimer} className="btn-start">
            Start Timer
          </button>
        ) : (
          <button onClick={stopTimer} className="btn-stop">
            Stop Timer
          </button>
        )}

        <div className="timer-adjustments">
          <button onClick={() => adjustTime(60)}>+1 min</button>
          <button onClick={() => adjustTime(-60)}>-1 min</button>
          <button onClick={() => adjustTime(300)}>+5 min</button>
        </div>
      </div>

      {/* Sync Status Indicator */}
      <SyncStatusIndicator />
    </div>
  );
};

const SyncStatusIndicator = () => {
  const { status } = usePowerSyncStatus();

  return (
    <div className={`sync-status sync-${status}`}>
      {status === 'connected' && '🟢 Synced'}
      {status === 'syncing' && '🔄 Syncing...'}
      {status === 'offline' && '🔴 Offline'}
    </div>
  );
};

// Message Presets Configuration
export const MESSAGE_PRESETS = {
  time: [
    { text: "2 minutes left", icon: "⏰", priority: 2 },
    { text: "30 seconds remaining", icon: "⚠️", priority: 2 },
    { text: "Time's up - wrap up", icon: "⏹️", priority: 3 },
    { text: "5 minute warning", icon: "⏱️", priority: 1 }
  ],
  presentation: [
    { text: "Move closer to microphone", icon: "🎤", priority: 2 },
    { text: "Speak up / louder", icon: "🔊", priority: 2 },
    { text: "Slow down your pace", icon: "🐌", priority: 1 },
    { text: "Speed up a bit", icon: "⚡", priority: 1 },
    { text: "Look at camera/audience", icon: "👀", priority: 1 }
  ],
  content: [
    { text: "Wrap up current point", icon: "📄", priority: 2 },
    { text: "Move to next slide", icon: "📑", priority: 1 },
    { text: "Great point - expand on it", icon: "✨", priority: 1 },
    { text: "Skip to conclusion", icon: "⏭️", priority: 2 }
  ],
  urgent: [
    { text: "Technical issue - hold on", icon: "⚠️", priority: 3 },
    { text: "Change in schedule", icon: "🔄", priority: 3 },
    { text: "Emergency announcement", icon: "🚨", priority: 3 }
  ],
  positive: [
    { text: "Great point!", icon: "👏", priority: 1 },
    { text: "Perfect pace", icon: "✅", priority: 1 },
    { text: "Excellent engagement", icon: "🌟", priority: 1 },
    { text: "Well done!", icon: "🎉", priority: 1 }
  ]
};

// Manager Messaging Component
export const ManagerMessagingPanel: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { sendMessage } = usePresenterMessaging(sessionId);
  const [customMessage, setCustomMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<keyof typeof MESSAGE_PRESETS>('presentation');

  const sendPresetMessage = async (preset: typeof MESSAGE_PRESETS.time[0]) => {
    await sendMessage(
      preset.text,
      'preset',
      preset.icon,
      activeCategory,
      preset.priority
    );
  };

  const sendCustomMessage = async () => {
    if (customMessage.trim()) {
      await sendMessage(customMessage, 'custom', '💬', 'custom', 1);
      setCustomMessage('');
    }
  };

  return (
    <div className="manager-messaging">
      <h3>💬 Quick Messages</h3>

      {/* Category Tabs */}
      <div className="message-categories">
        {Object.keys(MESSAGE_PRESETS).map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category as keyof typeof MESSAGE_PRESETS)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Preset Messages Grid */}
      <div className="preset-messages-grid">
        {MESSAGE_PRESETS[activeCategory].map((preset, index) => (
          <button
            key={index}
            className="preset-message-btn"
            onClick={() => sendPresetMessage(preset)}
          >
            <span className="message-icon">{preset.icon}</span>
            <span className="message-text">{preset.text}</span>
          </button>
        ))}
      </div>

      {/* Custom Message Input */}
      <div className="custom-message-section">
        <h4>✏️ Custom Message</h4>
        <div className="custom-message-input">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type a custom message..."
            maxLength={100}
          />
          <button
            onClick={sendCustomMessage}
            disabled={!customMessage.trim()}
            className="send-custom-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Presenter Message Display Component
export const PresenterMessageDisplay: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { messages, acknowledgeMessage } = usePresenterMessaging(sessionId);
  const [visibleMessage, setVisibleMessage] = useState<PresenterMessage | null>(null);

  // Show highest priority unacknowledged message
  useEffect(() => {
    if (messages.length > 0) {
      const topMessage = messages[0]; // Already ordered by priority
      setVisibleMessage(topMessage);

      // Auto-dismiss after 30 seconds or message expiry
      const dismissTime = new Date(topMessage.expires_at).getTime() - Date.now();
      const timeout = setTimeout(() => {
        setVisibleMessage(null);
      }, Math.min(dismissTime, 30000));

      return () => clearTimeout(timeout);
    }
  }, [messages]);

  const handleAcknowledge = async () => {
    if (visibleMessage) {
      await acknowledgeMessage(visibleMessage.id);
      setVisibleMessage(null);
    }
  };

  if (!visibleMessage) return null;

  return (
    <div className={`presenter-message priority-${visibleMessage.priority}`}>
      <div className="message-content">
        <span className="message-icon">{visibleMessage.icon_emoji}</span>
        <span className="message-text">{visibleMessage.message_text}</span>
      </div>
      <button
        className="acknowledge-btn"
        onClick={handleAcknowledge}
      >
        ✓ Got it
      </button>
    </div>
  );
};

// Enhanced Timer Display with Messages
export const TimerDisplayWithMessaging: React.FC<{ session: TimerSession }> = ({ session }) => {
  const [timeRemaining, setTimeRemaining] = useState(session.duration_seconds);
  const [isRunning, setIsRunning] = useState(session.status === 'running');
  const powerSync = usePowerSync();
  const [showMessaging, setShowMessaging] = useState(false);

  // Timer logic (same as before)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Timer controls (same as before)
  const startTimer = async () => { /* implementation */ };
  const stopTimer = async () => { /* implementation */ };
  const adjustTime = async (seconds: number) => { /* implementation */ };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-display-messaging">
      <div className="timer-header">
        <h2>{session.name}</h2>
        <button
          className="messaging-toggle"
          onClick={() => setShowMessaging(!showMessaging)}
        >
          💬 Messages
        </button>
      </div>

      <div className="timer-time">{formatTime(timeRemaining)}</div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={startTimer} className="btn-start">Start Timer</button>
        ) : (
          <button onClick={stopTimer} className="btn-stop">Stop Timer</button>
        )}

        <div className="timer-adjustments">
          <button onClick={() => adjustTime(60)}>+1 min</button>
          <button onClick={() => adjustTime(-60)}>-1 min</button>
          <button onClick={() => adjustTime(300)}>+5 min</button>
        </div>
      </div>

      {/* Messaging Panel */}
      {showMessaging && (
        <ManagerMessagingPanel sessionId={session.id} />
      )}

      <SyncStatusIndicator />
    </div>
  );
};
```

## 🔄 Phase 3: Real-time Sync & Conflict Resolution (Week 3)

### 3.1 Sync Status Hook

Create `hooks/useSyncStatus.ts`:

```typescript
import { usePowerSyncStatus } from '@powersync/react';

export const useSyncStatus = () => {
  const status = usePowerSyncStatus();

  const isOnline = status.connected;
  const isSyncing = status.syncStatus === 'syncing';
  const hasPendingOperations = status.hasPendingOperations;

  return {
    isOnline,
    isSyncing,
    hasPendingOperations,
    status: status.connected ? 'connected' : 'offline',
  };
};
```

### 3.2 Conflict Resolution Strategy

For timer conflicts, use last-write-wins with device priority:

```typescript
// Add to useTimerSessions hook
const resolveTimerConflict = async (
  sessionId: string,
  localState: any,
  remoteState: any
) => {
  // For timer state, latest timestamp wins
  if (localState.last_updated > remoteState.last_updated) {
    // Local state is newer, push to server
    await powerSync.execute(
      `
      UPDATE timer_sessions
      SET status = ?, duration_seconds = ?
      WHERE id = ? AND owner_id = auth.uid()
    `,
      [localState.status, localState.duration_seconds, sessionId]
    );
  }
  // Otherwise, accept remote state (will be synced automatically)
};
```

## 🧪 Phase 4: Testing & Deployment (Week 4)

### 4.1 Offline Testing Scenarios

```typescript
// Test scenarios to validate:
describe('CueTimer Offline Functionality', () => {
  test('Timer continues running when offline', async () => {
    // Start timer online
    // Disconnect network
    // Verify timer continues counting down
    // Reconnect network
    // Verify events sync to server
  });

  test('Multiple devices sync timer state', async () => {
    // Start timer on controller device
    // Join session on presenter device
    // Adjust time on controller
    // Verify presenter sees changes
  });

  test('Conflict resolution handles concurrent adjustments', async () => {
    // Two devices adjust time simultaneously
    // Verify conflict resolution applies correctly
    // Verify final state is consistent
  });
});
```

### 4.2 Performance Monitoring

```typescript
// Add to timer components
const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    syncLatency: 0,
    localOperationTime: 0,
    batteryImpact: 'low',
  });

  useEffect(() => {
    const measurePerformance = () => {
      // Measure sync performance
      const startTime = performance.now();
      // Perform sync operation
      const endTime = performance.now();
      setMetrics((prev) => ({
        ...prev,
        syncLatency: endTime - startTime,
      }));
    };

    // Measure every 30 seconds
    const interval = setInterval(measurePerformance, 30000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
};
```

## 🚀 Production Deployment

### Supabase Production Setup

1. **Create Production Project**:

   ```bash
   supabase projects create cuetimer-prod
   supabase link --project-ref your-project-ref
   supabase db push
   ```

2. **PowerSync Production**:
   - Deploy PowerSync service to your preferred cloud provider
   - Configure production MongoDB instance
   - Update environment variables for production

3. **Environment Variables**:
   ```bash
   # Production
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
   POWERSYNC_URL=https://your-powersync-instance.com
   ```

## 📊 Monitoring & Analytics

### Sync Health Monitoring

```typescript
const useSyncHealthCheck = () => {
  const [health, setHealth] = useState({
    lastSyncTime: null,
    failedOperations: 0,
    averageLatency: 0,
  });

  // Monitor sync health and report issues
  return health;
};
```

## 🎯 Success Metrics

Based on the project brief's SLA requirements:

- **Sync Performance**: < 500ms (measured with PowerSync metrics)
- **Offline Reliability**: 100% core timer functionality
- **Cross-device Sync**: > 99% consistency within 5 seconds
- **Battery Impact**: < 5% additional drain over 1 hour usage

## 📋 Implementation Checklist

### Week 1: Setup

- [ ] Supabase project initialized
- [ ] Database schema created
- [ ] PowerSync service configured
- [ ] Local development environment running

### Week 2: Client Integration

- [ ] PowerSync client integrated
- [ ] Timer session management working
- [ ] Basic offline functionality working
- [ ] Real-time sync between devices

### Week 3: Advanced Features

- [ ] Conflict resolution implemented
- [ ] Sync status indicators added
- [ ] Performance optimization complete
- [ ] Error handling robust

### Week 4: Testing & Polish

- [ ] End-to-end testing complete
- [ ] Performance validation (< 500ms sync)
- [ ] User acceptance testing
- [ ] Production deployment ready

---

**Result**: Complete offline-first timer app with real-time sync, matching all
requirements from the project brief with validated implementation approach.

```

```
