# Vehicle Maintenance Client - Documentation

## Project Overview
A modern Next.js application for managing vehicle maintenance, built with TypeScript, React 19, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: TanStack React Query
- **HTTP Client**: Axios
- **Notifications**: Sonner
- **Authentication**: JWT with cookie-based storage

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   └── providers/
│   │       └── AuthProvider.tsx       # Authentication context provider
│   ├── page.tsx                       # Home page with premium dashboard
│   └── layout.tsx                     # Root layout with Toaster
├── components/
│   └── common/
│       ├── CarStackCarousel.tsx       # 3D rotary card carousel for vehicles
│       └── Header.tsx                 # App header
├── hooks/
│   ├── useAuth.ts                     # Authentication hook
│   └── useUserVehice.ts              # Vehicle CRUD operations hooks
├── lib/
│   └── api/
│       ├── apiService.ts              # Auth API service
│       ├── coreApiService.ts          # Core API service
│       └── services/
│           └── fetchUserVehicle.ts    # Vehicle API endpoints & types
└── .env.local                         # Environment variables
```

## Key Features

### 1. Authentication System
- JWT-based authentication with secure cookie storage
- Auto token refresh on page load
- Protected routes with AuthProvider
- Login, Register, OTP verification flows

**Files:**
- `hooks/useAuth.ts` - Authentication logic
- `app/(auth)/providers/AuthProvider.tsx` - Auth context

### 2. Vehicle Management
- Create, Read, Delete vehicle operations
- Real-time data fetching with React Query
- Pagination support
- Toast notifications for user feedback

**API Endpoints:**
```typescript
POST   /api/v1/user-vehicles        // Create vehicle
GET    /api/v1/user-vehicles        // List vehicles (paginated)
DELETE /api/v1/user-vehicles/:id    // Delete vehicle
```

**Files:**
- `hooks/useUserVehice.ts` - CRUD hooks
- `lib/api/services/fetchUserVehicle.ts` - API service & types

### 3. Premium Dashboard UI
Modern, luxurious design with:
- Gradient mesh backgrounds
- Stagger animations with Framer Motion
- Interactive stat cards with hover effects
- 3D card carousel for vehicle browsing
- Responsive layout (mobile-first)

**Features:**
- Premium badge with Sparkles icon
- Live status indicator
- Gradient icon backgrounds
- Hover glow effects
- Smooth micro-interactions

### 4. 3D Rotary Card Carousel
Interactive carousel with:
- Drag to rotate between vehicles
- 3D depth effect with stacked cards
- Smooth spring animations
- Empty state with "Add Vehicle" card
- Delete confirmation dialog

**Interactions:**
- Swipe/drag to navigate
- Click delete icon to remove vehicle
- Tap card to view details

## Data Flow

### Authentication Flow
```
1. User logs in → JWT token returned
2. Token stored in cookies (auth-token)
3. Token set in both apiService & coreApiService
4. AuthProvider initializes on mount
5. Token validated, user data fetched
6. Protected routes accessible
```

### Vehicle CRUD Flow
```
Create:
  User submits form → POST /api/v1/user-vehicles → React Query cache invalidated → UI updates

Read:
  Component mounts → useUserVehicles hook → GET /api/v1/user-vehicles → Data cached → Render

Delete:
  User clicks delete → Confirmation modal → DELETE /api/v1/user-vehicles/:id →
  Success toast → Cache invalidated → UI updates
```

## API Services

### Authentication API (`apiService`)
Base URL: `process.env.NEXT_PUBLIC_API_URL_AUTH`
- Login, Register, OTP verification
- User profile endpoints

### Core API (`coreApiService`)
Base URL: `process.env.NEXT_PUBLIC_API_URL_CORE`
- Vehicle CRUD operations
- Maintenance records
- Other core features

Both services:
- Auto-inject JWT token in Authorization header
- Handle token refresh
- Error interceptors

## Type Definitions

### User Vehicle Types
```typescript
interface UserVehicle {
  id: string
  userId: string
  licensePlate: string
  nickname: string
  vinNumber: string
  purchaseDate: string
  currentOdometer: number
  averageKmPerDay: number
  userVehicleVariant: {
    imageUrl: string
    color: string
    hexCode: string
    model: {
      brandName: string
      name: string
      typeName: string
      fuelTypeName: string
      transmissionTypeName: string
      // ... more fields
    }
  }
}
```

### API Response Format
```typescript
interface ApiResponse<T> {
  isSuccess: boolean
  message: string
  data: T
  metadata: PaginationMetadata | unknown
}
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL_AUTH=https://localhost:8001
NEXT_PUBLIC_API_URL_CORE=https://localhost:8002
```

## Animation Configurations

### Framer Motion Variants
```typescript
// Container with stagger
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Individual items
itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

### Carousel Physics
- Base scale: 0.92 for background cards
- Rotation: ±2.4° for depth effect
- Snap threshold: 90px
- Animation duration: 180ms (tween for fling)

## Color Scheme

### Primary Colors
- **Red/Orange**: Primary actions, vehicle stats
- **Blue/Cyan**: Maintenance features
- **Green/Emerald**: Scheduling, live status
- **Purple/Pink**: Analytics, reports
- **Slate**: Text, backgrounds (premium feel)

### Design Tokens
```css
/* Gradients */
bg-gradient-to-br from-red-500 to-orange-500
bg-gradient-to-br from-blue-500 to-cyan-500
bg-gradient-to-br from-green-500 to-emerald-500
bg-gradient-to-br from-purple-500 to-pink-500

/* Shadows */
shadow-lg shadow-red-500/30
hover:shadow-2xl hover:shadow-red-500/10

/* Blur effects */
blur-3xl opacity-40
backdrop-blur-sm
```

## Common Patterns

### React Query Usage
```typescript
// Create/Update/Delete
const { mutate, isPending } = useMutation({
  mutationFn: (data) => api.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] })
    toast.success('Success!')
  },
  onError: (err) => toast.error(err.message)
})

// Read/List
const { data, isLoading } = useQuery({
  queryKey: ['resource', params],
  queryFn: () => api.get(params),
  select: (data) => data.data
})
```

### Toast Notifications
```typescript
import { toast } from 'sonner'

toast.success('Xóa xe thành công!')
toast.error('Xóa xe thất bại!')
```

## Git Workflow

Current branch: `epic-kowalevski` (worktree)
Main repository: `D:\FPT EDU\Ky_7\DreamLab\vehicle-maintenance-client`

### Important Notes
- Git worktree does NOT copy `.gitignore` files
- `.env` files must be manually copied to worktree
- Always commit with descriptive messages
- Use `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npm run type-check
```

## Known Issues & Solutions

### Issue 1: Missing .env in Worktree
**Problem**: `.env.local` not present in worktree
**Solution**: Copy from main repo: `cp ../main/.env.local .`

### Issue 2: TypeScript Errors with Framer Motion
**Problem**: `ease` type errors in variants
**Solution**: Remove `ease` from variants or use default easing

### Issue 3: 401 Unauthorized on API Calls
**Problem**: Token not set in coreApiService
**Solution**: Ensure both `apiService` and `coreApiService` get token in AuthProvider

## Best Practices

### Component Design
- Use compound components for complex UI
- Separate concerns (UI, logic, data)
- Keep components under 300 lines
- Extract reusable logic to hooks

### State Management
- Use React Query for server state
- Use React hooks for UI state
- Avoid prop drilling with context
- Keep state close to where it's used

### Styling
- Mobile-first responsive design
- Use Tailwind utility classes
- Group related classes with arrays
- Consistent spacing scale

### API Integration
- Always handle loading states
- Show user feedback (toast)
- Invalidate cache after mutations
- Use TypeScript for type safety

## Future Enhancements

### Planned Features
- [ ] Vehicle detail page
- [ ] Maintenance scheduling
- [ ] Service history tracking
- [ ] Cost analytics dashboard
- [ ] Push notifications
- [ ] Dark mode support
- [ ] PWA capabilities
- [ ] Offline mode with sync

### Technical Improvements
- [ ] Add unit tests (Jest, React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Optimize bundle size
- [ ] Implement service worker
- [ ] Add Sentry error tracking

## Troubleshooting

### TypeScript Errors
1. Restart TS server: `Cmd+Shift+P` → "Restart TS Server"
2. Clear `.next` folder: `rm -rf .next`
3. Reinstall dependencies: `npm install`

### API Issues
1. Check network tab for request/response
2. Verify token in cookies
3. Check CORS settings on backend
4. Validate API base URLs in `.env.local`

### Build Errors
1. Clear Next.js cache: `rm -rf .next`
2. Check for missing dependencies
3. Verify TypeScript config
4. Run `npm run type-check`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Contact & Support

For questions or issues, contact the development team or create an issue in the repository.

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintained By**: Development Team with Claude Sonnet 4.5
