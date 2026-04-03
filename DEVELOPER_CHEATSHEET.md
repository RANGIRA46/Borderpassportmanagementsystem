# Developer Cheat Sheet - Border Passport Management System

## 🚀 Quick Commands

### Start Development
```bash
# All in one
npm run dev:full

# Or separately
npm run dev:backend  # Backend on 3001
npm run dev         # Frontend on 3002
```

### Initialize Database
```bash
npm run db:init
```

### Build for Production
```bash
npm run build
```

---

## 🌈 Theme Usage

### Using Theme in Components
```typescript
import { useTheme, ThemeToggle } from '@/components/utils/ThemeProvider';

export function MyComponent() {
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <>
      <ThemeToggle 
        variant="outline" 
        size="sm" 
        showLabel={true}
      />
      <p>Current theme: {theme}</p>
      <p>Mode: {themeMode}</p>
    </>
  );
}
```

### CSS Variables Available

**Dark Theme:**
```css
--obsidian-void: #05070A
--obsidian-navy: #0F172A
--obsidian-slate: #1E293B
--obsidian-blue: #3B82F6
--obsidian-text-primary: #FFFFFF
--obsidian-text-secondary: #E2E8F0
--obsidian-text-muted: #94A3B8
--obsidian-success: #10B981
--obsidian-error: #EF4444
--obsidian-warning: #F59E0B
--obsidian-info: #06B6D4
```

**Light Theme:**
```css
--light-bg-primary: #FFFFFF
--light-bg-secondary: #F8FAFC
--light-accent-primary: #2563EB
--light-text-primary: #0F172A
--light-text-secondary: #475569
--light-success: #10B981
--light-error: #EF4444
```

**Spacing Grid:**
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
--spacing-3xl: 64px
```

---

## 📱 Responsive Utilities

### Use Responsive Classes

```html
<!-- Responsive Grid -->
<div class="grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
  <!-- 1 col mobile, 2 col tablet+, 3 col desktop+ -->
</div>

<div class="grid-3">
  <!-- 1 col mobile, 2 col tablet, 3 col desktop+ -->
</div>

<div class="grid-4">
  <!-- 1 col mobile, 2 col tablet, 4 col desktop+ -->
</div>

<!-- Responsive Flex -->
<div class="flex-responsive">
  <div>Item 1</div>
  <div>Item 2</div>
  <!-- Stacks on mobile, horizontal on tablet+ -->
</div>

<!-- Sidebar Layout -->
<div class="sidebar-layout">
  <aside>Sidebar</aside>
  <main>Content</main>
  <!-- Full width on mobile, sidebar+content on desktop -->
</div>

<!-- Hide/Show -->
<div class="hidden-mobile">Desktop only</div>
<div class="hidden-desktop">Mobile only</div>
```

---

## 🗄️ Database Operations

### Access Database File
```bash
cat server/data/db.json
```

### Add Sample Data
Edit `server/data/db.json` directly or modify `scripts/init-db.mjs` and run:
```bash
npm run db:init
```

### Database Structure
```javascript
{
  meta: { version, timestamps },
  users: [...],
  passports: [...],
  applications: [...],
  borderCrossings: [...],
  appointments: [...],
  documents: [...],
  alerts: [...],
  sessions: [],
  settings: {}
}
```

---

## 🔐 Authentication

### Check Auth Status
```typescript
import { useAuth } from '@/components/UserAuth';

export function MyComponent() {
  const { isAuthenticated, isAdmin, isOfficer, user } = useAuth();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  if (isAdmin) return <div>Admin features</div>;
  return <div>Welcome {user.firstName}</div>;
}
```

### Protected Routes
```typescript
// Check in App.tsx getPageAccess function
const adminPages = ['admin-dashboard', 'analytics', ...];
const officerPages = ['records', 'entry-exit', ...];
```

---

## 🎨 Styling Guide

### CSS Classes Available

```css
/* Text Colors */
.text-primary      /* Primary text color */
.text-secondary    /* Secondary text color */
.text-muted        /* Muted text color */

/* Backgrounds */
.bg-accent         /* Accent background */
.bg-success        /* Success background */
.bg-error          /* Error background */
.bg-warning        /* Warning background */
.bg-info           /* Info background */

/* Layouts */
.container         /* Full-width container */
.max-width-container  /* Constrained width */
.flex-center       /* Centered flex */
.flex-between      /* Space-between flex */
.grid              /* Grid layout */
.grid-2, .grid-3, .grid-4  /* Responsive grids */

/* Spacing */
.px-responsive     /* Responsive horizontal padding */
.py-responsive     /* Responsive vertical padding */

/* Shadows */
.shadow-obsidian   /* Large dark shadow */

/* Typography */
.text-responsive-h1    /* Responsive heading 1 */
.text-responsive-h2    /* Responsive heading 2 */
.text-responsive-body  /* Responsive body text */

/* Animations */
.animate-fade-in   /* Fade in animation */
.animate-slide-in  /* Slide in animation */
.animate-glow      /* Glowing animation */

/* Visibility */
.hidden-mobile     /* Hide on mobile */
.hidden-desktop    /* Hide on desktop */

/* Aspect Ratio */
.aspect-square     /* 1:1 aspect ratio */
.aspect-video      /* 16:9 aspect ratio */
```

---

## 📝 Component Examples

### Theme Toggle Button
```typescript
import { ThemeToggle } from '@/components/utils/ThemeProvider';

// Simple toggle
<ThemeToggle />

// With options
<ThemeToggle 
  variant="outline"
  size="sm"
  showLabel={true}
  showTooltip={true}
/>

// Expanded view
<ThemeToggle 
  expanded={true}
  className="my-custom-class"
/>
```

### Responsive Grid
```typescript
<div className="grid-3">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

### Card Component
```typescript
<div className="card">
  <h2>Title</h2>
  <p>Content here</p>
  <button className="primary">Action</button>
</div>
```

### Alert Component
```typescript
import { Alert, AlertDescription } from '@/components/ui/alert';

<Alert className="alert-success">
  <AlertDescription>Success message</AlertDescription>
</Alert>

<Alert className="alert-error">
  <AlertDescription>Error message</AlertDescription>
</Alert>

<Alert className="alert-warning">
  <AlertDescription>Warning message</AlertDescription>
</Alert>
```

---

## 🔌 API Integration

### API Base URL
```
Development: http://localhost:3001/api/v1
Production: (set in .env)
```

### API Endpoints Structure
```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

GET    /api/v1/passports
POST   /api/v1/applications
GET    /api/v1/appointments
GET    /api/v1/border-crossings
```

### Fetch Examples
```typescript
// Authentication
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Get data
const users = await fetch('/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Create data
const newUser = await fetch('/api/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData)
});
```

---

## 🐛 Debugging

### Check Browser Console
```javascript
// Check theme
localStorage.getItem('border-system-theme-mode')

// Check user
localStorage.getItem('border-system-user')

// Check token
localStorage.getItem('borderpassport_token')
```

### Common Breakpoints
```typescript
// Mobile
@media (max-width: 767px) { }

// Tablet
@media (min-width: 768px) { }

// Desktop
@media (min-width: 1024px) { }

// Large
@media (min-width: 1280px) { }
```

### Logging API Requests
```typescript
// Add to fetch interceptor
console.log('Request:', method, url);
console.log('Response:', status, data);
```

---

## 📂 File Organization

### Add New Page
1. Create component: `src/components/MyPage.tsx`
2. Import in `App.tsx`
3. Add route case in `renderPage()`
4. Add to `getPageAccess()` for permissions
5. Import in Navigation component

### Add New Component
1. Create: `src/components/MyComponent.tsx`
2. Import in parent
3. Use context if needed: `useTheme()`, `useAuth()`
4. Apply responsive classes

### Add New Style
1. Edit theme files or create utility CSS
2. Define CSS variables in `:root`
3. Use `@media` queries for responsive
4. Test on all breakpoints

---

## 🚀 Deployment Checklist

- [ ] Update API_BASE_URL in .env
- [ ] Build: `npm run build`
- [ ] Test dist/ folder locally
- [ ] Deploy dist/ to web server
- [ ] Configure backend endpoint
- [ ] Test authentication flow
- [ ] Verify responsive layout
- [ ] Check theme switching
- [ ] Test on mobile devices
- [ ] Verify performance
- [ ] Enable analytics
- [ ] Setup SSL certificate
- [ ] Configure CORS properly

---

## 📊 Performance Tips

### Frontend
- Use lazy loading for routes
- Minimize re-renders with React.memo()
- Use useCallback for handlers
- Optimize images
- Split large components

### CSS
- Keep CSS bundle small
- Use CSS variables for theming
- Minimize specificity
- Avoid !important
- Use efficient selectors

### Database
- Limit API responses
- Use pagination
- Cache frequently accessed data
- Optimize query indices
- Monitor query performance

---

## 🎯 Common Tasks

### Change Primary Color
Edit `src/theme-obsidian.css`:
```css
--obsidian-blue: #YOUR_COLOR;
```

### Change Spacing
Edit `src/theme-responsive.css`:
```css
--spacing-md: 20px; /* Was 16px */
```

### Add New User Role
1. Update `UserAuth.tsx` types
2. Add role in database
3. Update access control in `App.tsx`
4. Create new route if needed

### Add New Database Table
1. Add array in `server/data/db.json`
2. Update `scripts/init-db.mjs`
3. Create API endpoints
4. Update components if needed

---

## 💡 Best Practices

### Code
- Use TypeScript strict mode
- Follow component naming conventions
- Keep components under 300 lines
- Extract logic to hooks
- Use meaningful variable names

### UI/UX
- Test all breakpoints
- Maintain color contrast
- Keep animations under 400ms
- Use semantic HTML
- Provide loading states

### Performance
- Minimize bundle size
- Use CSS variables
- Cache API responses
- Lazy load components
- Monitor Core Web Vitals

### Security
- Validate all inputs
- Sanitize HTML
- Use HTTPS in production
- Secure tokens
- Rate limit APIs

---

## 📚 File Reference

### Key Files
```
src/main.tsx                    Entry point
src/App.tsx                     Main component
src/components/utils/ThemeProvider.tsx  Theme system
src/theme-obsidian.css          Dark theme
src/theme-light.css             Light theme
src/theme-responsive.css        Responsive system
server/index.mjs                Backend entry
server/src/app.mjs              API setup
server/data/db.json             Database
package.json                    Dependencies
```

---

## 🔄 Git Workflow

### Before Committing
```bash
# Check for errors
npm run build

# Test the app
npm run dev

# Check responsiveness
# Check theme switching
# Check authentication
```

### Commit Message Template
```
[feature/fix/docs] Brief description

- What changed
- Why it changed
- Any side effects
```

---

## 🎓 Learning Resources

### Documentation Files
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `QUICKSTART.md` - Quick start guide
- `ARCHITECTURE_COMPLETE.md` - Deep dive
- `docs/API.md` - API documentation
- `docs/DATABASE.md` - Database schema

### Code Examples
Check existing components:
- `src/components/AdminNavigation.tsx`
- `src/components/ModernHomePage.tsx`
- `src/components/ui/button.tsx`

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Kill process: `Get-Process -Name node \| Stop-Process -Force` |
| Theme not changing | Clear localStorage: `localStorage.clear()` |
| Components not rendering | Check console for errors |
| Responsive not working | Verify CSS file is imported in main.tsx |
| Database error | Run `npm run db:init` |
| API not found | Check backend is running on 3001 |

---

**Cheat Sheet Version**: 1.0
**Last Updated**: April 3, 2026
**Status**: ✅ Ready to Use

