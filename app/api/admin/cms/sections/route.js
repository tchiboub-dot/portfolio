import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { updateSectionsOrderAndVisibility } from '@/lib/db/cms'

export async function PUT(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { sections } = body || {}
    if (!Array.isArray(sections)) {
      return NextResponse.json({ success: false, message: 'Format invalide' }, { status: 400 })
    }

    const result = await updateSectionsOrderAndVisibility(sections, auth.session.email)
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
