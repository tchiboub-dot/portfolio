import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/lib/auth/admin'
import { saveProject } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.title || !body.category) {
      return NextResponse.json({ success: false, message: 'Titre et catégorie requis' }, { status: 400 })
    }

    const result = await saveProject(body, auth.session.email || 'admin')
    try {
      revalidatePath('/', 'layout')
    } catch {}
    return NextResponse.json({ success: true, id: result.id, message: 'Projet enregistré' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function PUT(request) {
  return POST(request)
}
