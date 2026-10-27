import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyAdminSession } from '@/lib/auth/admin'
import { updateSectionsOrderAndVisibility } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'

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
    try {
      revalidatePath('/', 'layout')
    } catch {}
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  return PUT(request)
}
