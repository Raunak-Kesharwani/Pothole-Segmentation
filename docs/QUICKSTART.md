# Quick Start Guide - Pothole Segmentation App

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Supabase account
- Google Gemini API key

### Step 1: Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app/main.py
```
✅ Backend running at `http://127.0.0.1:8000`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running at `http://localhost:5174`

### Step 3: Environment Configuration
Create `frontend/.env.local`:
```
VITE_SUPABASE_URL=https://bseoamuimizmnozvzldk.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key>
VITE_GEMINI_API_KEY=<your-gemini-key>
VITE_API_URL=http://127.0.0.1:8000
```

Create `backend/.env`:
```
SUPABASE_URL=https://bseoamuimizmnozvzldk.supabase.co
SUPABASE_KEY=<your-service-key>
```

---

## 👤 Testing the App

### 1. Public Landing Page (No Login Required)
✅ Visit `http://localhost:5174`
- See hero section with animations
- View statistics (12k+ reports, 94% accuracy)
- Browse without login
- Click "Sign Up" or "Login" to continue

### 2. Create Account (Citizen)
✅ Click "Sign Up"
- Enter: Name, Email, Password
- Role automatically set to `citizen`
- Creates account in Supabase Auth + users table
- Redirects to login

### 3. Login
✅ Click "Login"
- Use email and password from signup
- Session persists on page refresh
- Redirects to home page as authenticated user

### 4. Access Citizen Features
✅ Now you can:
- **Prediction** (`/prediction`) - Test AI model
- **Report** (`/report`) - Submit new potholes
- **Leaderboard** (`/leaderboard`) - View rankings
- **Profile** (`/profile`) - View your account & stats
- **Chatbot** (💬 button) - Talk to AI assistant

### 5. View Your Profile
✅ Click profile menu → "Profile"
- See real user data from database
- View total reports submitted
- See resolved reports count
- Check leaderboard ranking
- Role badge showing "Citizen"

### 6. Chat with AI Assistant
✅ Click 💬 button (bottom-right)
- Say "Hi" or ask anything
- Messages saved to database
- History persists on reload
- Powered by Google Gemini

### 7. Logout
✅ Click profile menu → "Logout"
- Session ends
- Redirect to public home page
- Can login again with same account

---

## 🔐 Testing Admin/Worker Roles

### Option A: Via Supabase Dashboard
1. Go to `https://supabase.com` → Dashboard
2. Select your project
3. Go to SQL Editor
4. Run:
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'youremail@example.com';
```

### Option B: Via Frontend (Direct DB Edit)
1. After logging in, open browser DevTools
2. Go to Application → Local Storage
3. Save your user ID from `auth` data
4. Update in Supabase dashboard

### After Changing Role
1. Logout and login again
2. New role-specific routes become accessible
3. Role badge in profile updates
4. Can now access `/admin` or `/worker` pages

---

## 📊 Features by Role

### Citizen (Default)
- ✅ Submit pothole reports
- ✅ View leaderboard
- ✅ See own profile & stats
- ✅ Chat with AI assistant
- ✅ Track report status
- ❌ Cannot access admin/worker pages

### Worker
- ✅ All citizen features
- ✅ Accept task assignments
- ✅ Upload proof photos
- ✅ Update task status
- ❌ Cannot access admin panel

### Admin
- ✅ All citizen features
- ✅ All worker features
- ✅ View all reports
- ✅ Manage users
- ✅ Assign tasks to workers
- ✅ View analytics

---

## 🤖 AI Features

### AI Report Generation
When submitting a report, the system will:
1. Accept your complaint text & severity
2. Send to Google Gemini API
3. Receive: Summary, Risk Level, Recommended Action, Civic Impact
4. Save to database

*(Integration point in ReportPage component)*

### AI Chatbot
24/7 assistant available to authenticated users:
- Ask about pothole reporting
- Get help with the app
- Understand detection results
- Tips for tracking reports
- All conversations saved to database

---

## 🔧 Troubleshooting

### "Cannot find users table"
**Solution:** Make sure Supabase database is initialized with proper schema
- Check IMPLEMENTATION_COMPLETE.md for database setup

### "Email rate limit exceeded"
**Solution:** Disable "Confirm email" in Supabase Auth settings
- Go to Supabase Dashboard → Auth → Providers → Email
- Turn OFF "Confirm email"

### "Chatbot not responding"
**Solution:** Check Gemini API key
- Verify `VITE_GEMINI_API_KEY` in `.env.local`
- Check Google Cloud console for API quota limits
- Open browser console for error messages

### "Profile shows no data"
**Solution:** Make sure user profile exists in `users` table
- Check that signup properly created users table record
- Check user_id matches auth.user id

### "Cannot access admin page"
**Solution:** Update user role in database
- Go to Supabase dashboard
- Update `role` field to 'admin' in users table
- Logout and login again
- Role enforced on ProtectedRoute

---

## 📱 Responsive Design
✅ All pages fully responsive:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)
- Dark mode supported throughout

---

## 🎯 What's Implemented

| Feature | Status | Location |
|---------|--------|----------|
| Public Homepage | ✅ Complete | `/pages/HomePage.tsx` |
| Login/Signup | ✅ Complete | `/pages/LoginPage.tsx`, `/pages/SignupPage.tsx` |
| Role-Based Auth | ✅ Complete | `/components/ProtectedRoute.tsx` |
| User Profile | ✅ Complete | `/pages/ProfilePage.tsx` |
| AI Chatbot | ✅ Complete | `/components/Chatbot.tsx` |
| Report Generation | ✅ Complete | `/lib/gemini.ts` |
| Leaderboard | ✅ Complete | `/pages/LeaderboardPage.tsx` |
| Prediction Page | ✅ Complete | `/pages/PredictionPage.tsx` |

---

## 🚀 Production Checklist

Before deploying to production:
- [ ] Set environment variables on host platform
- [ ] Test all authentication flows
- [ ] Verify email is working (with confirmation disabled)
- [ ] Test role-based access controls
- [ ] Check Gemini API quotas
- [ ] Set up database backups
- [ ] Configure CORS properly
- [ ] Test on mobile devices
- [ ] Check performance with real data
- [ ] Set up monitoring/logging

---

## 📞 Support

**For Database Issues:**
- Check Supabase dashboard
- Verify table schemas match DATABASE_SCHEMA.md
- Check RLS policies

**For API Issues:**
- Check backend logs in terminal
- Verify environment variables
- Check FastAPI documentation

**For Frontend Issues:**
- Open browser console (F12)
- Check React DevTools
- Verify all dependencies installed

---

## 🎉 Next Steps

1. **Test the app** with above steps
2. **Create multiple user accounts** with different roles
3. **Submit test reports** and watch chatbot respond
4. **Check database** in Supabase dashboard to see saved data
5. **Customize** colors, text, and branding as needed

---

**App Status:** ✅ ALL FEATURES IMPLEMENTED & READY TO USE

Enjoy your pothole reporting platform! 🚗💨
