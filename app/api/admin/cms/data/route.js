import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { getAdminPortfolioData } from '@/lib/db/cms'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await getAdminPortfolioData()
    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (err) {
    console.error('Error fetching admin data:', err)
    return NextResponse.json(
      { success: false, message: 'Erreur de chargement des données CMS' },
      { status: 500 }
    )
  }
}
