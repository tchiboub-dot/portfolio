import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/lib/auth/admin'
import { updateTheme } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'

export async function PUT(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await updateTheme(body, auth.session.email)
    try {
      revalidatePath('/', 'layout')
    } catch {}
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  return PUT(request)
}
