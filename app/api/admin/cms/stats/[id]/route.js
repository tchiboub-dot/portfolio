import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { deleteStat } from '@/lib/db/cms'

export async function DELETE(request, { params }) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = params
    await deleteStat(id)
    return NextResponse.json({ success: true, message: 'Statistique supprimée' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
