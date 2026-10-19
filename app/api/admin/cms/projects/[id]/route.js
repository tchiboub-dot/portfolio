import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { deleteProject, saveProject } from '@/lib/db/cms'

export async function PUT(request, { params }) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = params
    const body = await request.json()
    const result = await saveProject({ ...body, id }, auth.session.email || 'admin')
    return NextResponse.json({ success: true, id: result.id, message: 'Projet mis à jour' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = params
    await deleteProject(id, auth.session.email || 'admin')
    return NextResponse.json({ success: true, message: 'Projet supprimé' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

