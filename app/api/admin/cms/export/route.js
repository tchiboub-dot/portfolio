import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { exportAllData } from '@/lib/db/cms'

export async function GET(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await exportAllData()
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
