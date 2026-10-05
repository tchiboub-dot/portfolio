import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  if (!getAdminSession()) redirect('/')
  return <AdminDashboard />
}
