import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { saveSkill } from '@/lib/db/cms'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, message: 'Nom et catégorie requis' }, { status: 400 })
    }

    const result = await saveSkill(body, auth.session.email || 'admin')
    return NextResponse.json({ success: true, id: result.id, message: 'Compétence enregistrée' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
