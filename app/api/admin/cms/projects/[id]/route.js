import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/lib/auth/admin'
import { deleteProject, saveProject } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'

export async function PUT(request, { params }) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = params
    const body = await request.json()
    const result = await saveProject({ ...body, id }, auth.session.email || 'admin')
    try {
      revalidatePath('/', 'layout')
    } catch {}
    return NextResponse.json({ success: true, id: result.id, message: 'Projet mis à jour' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request, context) {
  return PUT(request, context)
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = params
    await deleteProject(id, auth.session.email || 'admin')
    try {
      revalidatePath('/', 'layout')
    } catch {}
    return NextResponse.json({ success: true, message: 'Projet supprimé' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
