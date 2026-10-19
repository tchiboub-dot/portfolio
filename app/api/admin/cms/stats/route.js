import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { saveStat } from '@/lib/db/cms'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.label || body.value === undefined) {
      return NextResponse.json({ success: false, message: 'Libellé et valeur requis' }, { status: 400 })
    }

    const result = await saveStat(body, auth.session.email || 'admin')
    return NextResponse.json({ success: true, id: result.id, message: 'Statistique enregistrée' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
