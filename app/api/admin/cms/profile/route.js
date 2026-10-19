import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { updateProfile } from '@/lib/db/cms'

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    await updateProfile(body, auth.session.email || 'admin')
    return NextResponse.json({ success: true, message: 'Profil mis à jour' })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function PUT(request) {
  return POST(request)
}

