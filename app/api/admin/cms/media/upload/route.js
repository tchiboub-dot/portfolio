import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { getDatabaseClient } from '@/lib/db'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
}

export async function POST(request) {
  const auth = verifyAdminSession(request)
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'Fichier requis' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Le fichier dépasse la taille maximale de 5 Mo' },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Type de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, SVG, PDF' },
        { status: 400 }
      )
    }

    // Protection contre le path traversal et génération d'un nom sécurisé
    const extension = MIME_TO_EXT[file.type] || path.extname(file.name).toLowerCase()
    const safeId = crypto.randomUUID()
    const safeFilename = `${safeId}${extension}`

    // Répertoire de destination
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, safeFilename)
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    const publicUrl = `/uploads/${safeFilename}`
    const now = new Date().toISOString()

    // Enregistrer les métadonnées dans la base de données
    const db = getDatabaseClient()
    await db.execute({
      sql: `INSERT INTO portfolio_media (
        id, filename, original_name, mime_type, size_bytes, url, alt_text, uploaded_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        safeId,
        safeFilename,
        file.name.slice(0, 100),
        file.type,
        file.size,
        publicUrl,
        file.name,
        auth.session.email || 'admin',
        now,
      ],
    })

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      id: safeId,
      message: 'Fichier téléversé avec succès',
    })
  } catch (err) {
    console.error('Erreur upload:', err)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
