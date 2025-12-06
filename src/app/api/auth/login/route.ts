import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { signSession } from '@/lib/auth'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()
        console.log('Login attempt for:', username)

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        const admin = await prisma.admin.findUnique({
            where: { username },
        })
        console.log('Admin found in DB:', !!admin)

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isValid = await bcrypt.compare(password, admin.password)
        console.log('Password valid:', isValid)

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Create session
        const token = await signSession({ id: admin.id, username: admin.username })

            // Set cookie
            ; (await cookies()).set('admin-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/'
            })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
