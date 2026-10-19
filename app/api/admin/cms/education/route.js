import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { saveEducation } from '@/lib/db/cms'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.degree || !body.institution) {
      return NextResponse.json({ success: false, message: 'Diplôme et établissement requis' }, { status: 400 })
    }

    const result = await saveEducation(body, auth.session.email || 'admin')
    return NextResponse.json({ success: true, id: result.id, message: 'Formation enregistrée' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
