import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { savePage } from '@/lib/db/cms'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body?.slug || !body?.title) {
      return NextResponse.json({ success: false, message: 'Titre et slug requis' }, { status: 400 })
    }

    const result = await savePage(body, auth.session.email)
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
