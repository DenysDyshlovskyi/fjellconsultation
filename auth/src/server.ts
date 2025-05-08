import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import db from './config/db';
import argon2 from 'argon2';
import crypto from 'crypto';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

function generateHashedToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(lifetimeMs: number) {
    const token = crypto.randomBytes(32).toString('base64url');
    const id = crypto.randomUUID();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + lifetimeMs);
    return {
        token,
        tokenHash: hashedToken,
        id,
        issuedAt,
        expiresAt,
        expiresInMs: lifetimeMs,
    };
}

function generateSessionToken() {
    const lifetimeMs = 1000 * 60 * 60 * 24; // 24 hrs
    return generateToken(lifetimeMs);
}

async function createSession({
    req,
    userId,
}: {
    req: Request;
    userId: string;
}) {
    const sessionToken = generateSessionToken();
    const sessionId = crypto.randomUUID();
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Insert session
        await client.query(
            `INSERT INTO sessions (id, user_id, user_agent, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [sessionId, userId, userAgent, ipAddress],
        );

        // Insert auth token
        await client.query(
            `INSERT INTO session_tokens (id, token_hash, user_id, session_id, issued_at, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                sessionToken.id,
                sessionToken.tokenHash,
                userId,
                sessionId,
                sessionToken.issuedAt,
                sessionToken.expiresAt,
            ],
        );

        await client.query('COMMIT');

        return { sessionToken, sessionId };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function validateSession(sessionToken: string) {
    const hashedRequestToken = generateHashedToken(sessionToken);

    try {
        const { rows } = await db.query(
            `SELECT user_id, session_id, expires_at, issued_at
             FROM session_tokens st
             WHERE st.token_hash = $1
               AND st.expires_at > NOW()`,
            [hashedRequestToken],
        );

        return {
            valid: true,
            id: rows[0].session_id,
            userId: rows[0].user_id,
            token: {
                issuedAt: rows[0].issued_at,
                expiresAt: rows[0].expires_at,
            },
        };
    } catch (err) {
        throw err;
    }
}

app.post('/validate-session', async (req, res) => {
    console.log('test');
    const sessionToken = req.body.token;
    console.log(sessionToken);

    if (!sessionToken) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Session token is required.',
            },
        });
        return;
    }

    try {
        const session = await validateSession(sessionToken);

        if (!session) {
            res.status(401).json({
                error: { message: 'Session is invalid or expired.' },
            });
            return;
        }

        res.status(200).json({
            message: 'Session is valid.',
            data: {
                valid: session.valid,
                id: session.id,
                user_id: session.userId,
                token: {
                    issued_at: session.token.issuedAt,
                    expires_at: session.token.expiresAt,
                },
            },
        });
    } catch (err) {
        throw err;
    }
});

app.post('/register', async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
        res.status(400).json({
            status: 400,
            error: {
                code: 'VALIDATION_ERROR',
                message:
                    'Request body is missing required fields: email, first_name, last_name, password.',
            },
        });
        return;
    }

    const user_id = crypto.randomUUID();
    const hashed_password = await argon2.hash(password);

    try {
        await db.query(
            `
                INSERT INTO users (id, email, first_name, last_name, password)
                VALUES ($1, $2, $3, $4, $5)
            `,
            [user_id, email, first_name, last_name, hashed_password],
        );
        res.status(201).json({
            message: 'User registered successfully!',
            data: { user: { user_id, email, first_name, last_name } },
        });
    } catch (err) {
        // Fix later
        // @ts-expect-error
        if (err.code === '23505' && err.constraint === 'users_email_key') {
            res.status(409).json({
                status: 409,
                error: {
                    code: 'EMAIL_EXISTS',
                    message: 'Email is already in use.',
                },
            });
        } else {
            throw err;
        }
    }
});

app.get('/users', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT u.id,
                   u.email,
                   u.first_name,
                   u.last_name,
                   u.password,
                   u.created_at,
                   COALESCE(JSON_AGG(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
            FROM users u
                     LEFT JOIN user_roles ur ON u.id = ur.user_id
                     LEFT JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at
            ORDER BY u.created_at, u.id
        `);
        res.status(200).json({
            status: 200,
            message: 'Users fetched successfully.',
            data: { users: rows },
        });
    } catch (err) {
        throw err;
    }
});

app.get('/users/:id', async (req, res) => {
    const user_id = req.params.id;

    if (
        !user_id ||
        !/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(
            user_id,
        )
    ) {
        res.status(400).json({
            status: 400,
            error: {
                code: 'INVALID_PARAMS',
                message: 'User id is missing or is not a valid UUID.',
            },
        });
        return;
    }

    try {
        const { rows } = await db.query(
            `
                SELECT u.id,
                       u.email,
                       u.first_name,
                       u.last_name,
                       u.created_at,
                       COALESCE(JSON_AGG(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
                FROM users u
                         LEFT JOIN user_roles ur ON u.id = ur.user_id
                         LEFT JOIN roles r ON ur.role_id = r.id
                WHERE u.id = $1
                GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at
                ORDER BY u.created_at, u.id
            `,
            [user_id],
        );

        const user = rows[0];

        if (!user) {
            res.status(500).json({
                status: 500,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User with this id does not exist.',
                },
            });
        }

        res.status(200).json({
            status: 200,
            message: 'User fetched successfully.',
            data: { user: user },
        });
    } catch (err) {
        throw err;
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: 400,
            error: {
                code: 'VALIDATION_ERROR',
                message:
                    'Request body is missing required fields: email, password.',
            },
        });
        return;
    }

    try {
        const { rows } = await db.query(
            'SELECT id, password FROM users WHERE email = $1',
            [email],
        );

        if (!rows.length) {
            res.status(401).json({
                status: 401,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email or password is incorrect.',
                },
            });
            return;
        }

        const user = rows[0];

        const hashed_password = user.password;
        if (!(await argon2.verify(hashed_password, password))) {
            res.status(401).json({
                status: 401,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email or password is incorrect.',
                },
            });
            return;
        }

        const { sessionToken } = await createSession({ req, userId: user.id });

        res.cookie('user_session', sessionToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: sessionToken.expiresInMs,
            domain: '10.2.2.49:5000',
        });

        res.status(200).json({
            message: 'Logged in successfully!',
        });
    } catch (err) {
        throw err;
    }
});

app.post('/logout', async (req, res) => {
    const sessionToken = req.cookies['user_session'];

    if (!sessionToken) {
        res.status(400).json({
            error: { message: 'You are already logged out.' },
        });
        return;
    }
    res.clearCookie('user_session');

    const session = await validateSession(sessionToken);

    console.log(session.id);

    try {
        await db.query('DELETE FROM sessions WHERE id = $1', [session.id]);

        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (err) {
        throw err;
    }
});

app.all(/(.*)/, (req, res) => {
    res.status(404).json({
        status: 404,
        error: { code: 'NOT_FOUND', message: 'Endpoint not found.' },
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
        },
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
5;
