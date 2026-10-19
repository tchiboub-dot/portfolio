import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { updateTheme } from '@/lib/db/cms'

export async function PUT(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await updateTheme(body, auth.session.email)
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
