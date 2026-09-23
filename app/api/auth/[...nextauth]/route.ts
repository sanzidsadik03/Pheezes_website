import { handlers } from '@/lib/auth'

// These handle all NextAuth routes: /api/auth/signin, /api/auth/signout, /api/auth/session, etc.
export const { GET, POST } = handlers
