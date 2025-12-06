import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'super-secret-key-change-me-12345'
)

export async function signSession(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret)
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch (e) {
        return null
    }
}
