import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { reorderItems } from '@/lib/db/cms'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { tableName, orderedIds } = await request.json()
    if (!tableName || !Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, message: 'Table et liste des identifiants requis' }, { status: 400 })
    }

    await reorderItems(tableName, orderedIds)
    return NextResponse.json({ success: true, message: 'Ordre mis à jour' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
