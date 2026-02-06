# Database Schema & API Documentation

## Supabase Database Tables

### 1. Users Table
Stores user profile information and authentication metadata.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'citizen' CHECK (role IN ('citizen', 'worker', 'admin')),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Roles:**
- `citizen` - Regular users reporting potholes
- `worker` - City workers managing repairs
- `admin` - Administrative access

---

### 2. Reports Table
Stores pothole reports submitted by users.

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location GEOMETRY(POINT, 4326),
  latitude FLOAT,
  longitude FLOAT,
  severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'fixed', 'rejected')),
  image_url VARCHAR(500),
  detection_confidence FLOAT,
  affected_area_pixels INT,
  ai_summary TEXT,
  ai_risk_level VARCHAR(50),
  ai_recommended_action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
```

---

### 3. Tasks Table
Stores worker task assignments for report repairs.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  deadline DATE,
  notes TEXT,
  proof_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

### 4. Leaderboard Table
Stores user rankings and points.

```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  points INT DEFAULT 0,
  reports_count INT DEFAULT 0,
  fixed_count INT DEFAULT 0,
  rank INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_points ON leaderboard(points DESC);
```

---

### 5. Chat Messages Table
Stores conversation history with the AI chatbot.

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role VARCHAR(50) CHECK (role IN ('user', 'ai')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
```

---

## Storage Buckets

### Reports Bucket
```
Name: reports
Description: Pothole report images
Access: public
```

### Proofs Bucket
```
Name: proofs
Description: Proof of completed work images
Access: public
```

### Avatars Bucket
```
Name: avatars
Description: User profile pictures
Access: public
```

---

## Frontend API Integration

### Supabase Client
**File:** [frontend/src/lib/supabaseClient.ts](frontend/src/lib/supabaseClient.ts)

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Authentication Context
**File:** [frontend/src/context/SupabaseAuthContext.tsx](frontend/src/context/SupabaseAuthContext.tsx)

**Exported Hook:**
```typescript
const { user, loading, signIn, signOut } = useAuth()
```

### Gemini API Functions
**File:** [frontend/src/lib/gemini.ts](frontend/src/lib/gemini.ts)

#### generateAIReport()
```typescript
async function generateAIReport(
  complaintText: string,
  severity: string,
  location: { lat: number; lng: number },
  detectionResult: any
): Promise<{
  summary: string
  riskLevel: string
  recommendedAction: string
  civicImpact: string
}>
```

#### generateChatResponse()
```typescript
async function generateChatResponse(
  message: string,
  conversationHistory: Array<{ role: 'user'|'ai', message: string }>
): Promise<string>
```

---

## Backend API Endpoints

### FastAPI Server
**Base URL:** `http://127.0.0.1:8000`

**Key Endpoints:**
- `GET /` - Health check
- `POST /api/predict` - Run AI model inference
- `POST /api/reports` - Create new report
- `GET /api/reports/{id}` - Get report details
- `GET /api/leaderboard` - Get rankings

---

## Row-Level Security (RLS) Configuration

### Users Table RLS
- Users can view their own profile
- Only authenticated users can view
- Admin users can view all profiles

### Reports Table RLS
- Users can view reports from any location (public)
- Users can only edit their own reports
- Workers can view assigned reports
- Admins can view and edit all reports

### Chat Messages Table RLS
- Users can only view their own chat history
- Users can insert new messages only for themselves

### Tasks Table RLS
- Workers can view their assigned tasks
- Admins can view all tasks
- Only admins can modify task assignments

---

## Real-time Subscriptions

All tables have real-time enabled for:
- Leaderboard updates (new scores)
- Report status changes
- Task assignment changes
- Chat message delivery

### Frontend Subscription Example
```typescript
supabase
  .from('leaderboard')
  .on('*', payload => {
    console.log('Leaderboard updated:', payload)
  })
  .subscribe()
```

---

## Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=https://bseoamuimizmnozvzldk.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_GEMINI_API_KEY=<gemini-api-key>
VITE_API_URL=http://127.0.0.1:8000
```

### Backend (.env)
```
SUPABASE_URL=https://bseoamuimizmnozvzldk.supabase.co
SUPABASE_KEY=<service-key>
GEMINI_API_KEY=<gemini-api-key>
ONNX_MODEL_PATH=./models/best.onnx
```

---

## Data Flow Diagrams

### User Registration
```
User → SignupPage → Supabase Auth → Insert users table → Redirect to Login
```

### Report Submission
```
User → ReportPage → Validate → Gemini API (generateAIReport) → 
  Insert reports table → Supabase Storage (image) → Update leaderboard
```

### Chat Interaction
```
User → Chatbot → Gemini API (generateChatResponse) → 
  Insert chat_messages → Display response → Update UI
```

### Profile View
```
User → ProfilePage → Query users table → 
  Count reports (status) → Query leaderboard → Display all data
```

---

## Error Handling

### Common Errors & Solutions

**"user_id foreign key constraint failed"**
- User ID doesn't exist in users table
- Ensure signup creates both auth.user and users table record

**"chat_messages table not found"**
- Table doesn't exist in Supabase
- Run SQL setup script in Supabase dashboard

**"Permission denied for schema public"**
- RLS policies not set correctly
- Check Row Level Security settings in Supabase dashboard

**"Gemini API error"**
- Invalid API key
- Check VITE_GEMINI_API_KEY in .env.local
- Ensure Gemini API is enabled in Google Cloud console

---

## Performance Optimization

### Indexes Created
- `reports.user_id` - Fast lookup of user's reports
- `reports.status` - Fast filtering by status
- `tasks.assigned_to` - Fast lookup of worker tasks
- `tasks.status` - Fast filtering by task status
- `chat_messages.user_id` - Fast chat history lookup
- `leaderboard.points` - Fast ranking queries

### Query Optimization Tips
1. Always filter by `user_id` first for chat/reports
2. Use `.limit()` to paginate large result sets
3. Select only needed columns with `.select()`
4. Use real-time subscriptions for live updates instead of polling

---

## Migration & Deployment

### Database Setup
1. Create Supabase project
2. Run SQL schema creation scripts
3. Enable real-time on all tables
4. Create storage buckets
5. Set up RLS policies
6. Create functions for leaderboard calculations

### Frontend Deployment
1. Set environment variables in host platform
2. Run `npm run build`
3. Deploy `dist/` folder to hosting service
4. Configure CORS in Supabase

### Backend Deployment
1. Set environment variables
2. Install Python dependencies
3. Run with uvicorn or deploy to cloud function

---

**Last Updated:** May 2, 2026
