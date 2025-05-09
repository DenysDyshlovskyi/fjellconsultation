import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import 'dotenv/config';
import { Pool } from 'pg';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Defines variables for later use
const app = express();
const PORT = process.env.PORT || 5000;
const authServerURL = process.env.AUTH_SERVER;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

app.use(
    cors({
        credentials: true,
        origin: authServerURL,
    }),
);
app.use(cookieParser());
app.use(express.json());

// Set up database connection
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// makes sure user is authenticated and does a get request to auth server
const isAuthenticated: RequestHandler = (req, res, next) => {
    const sessionToken = req.cookies['user_session'];

    axios
        .post(`${authServerURL}/validate-session`, {
            token: sessionToken,
        })
        .then((response) => {
            const responseData = response.data.data;
            // @ts-expect-error
            req.userId = responseData.user_id;
            next();
        })
        .catch((err) => {
            next(err);
        });
};

// Endpoint for submitting a ticket
app.post('/tickets', isAuthenticated, async (req, res) => {
    // Retrieve post data
    const { title, category_id, description } = req.body;
    // @ts-expect-error
    const user_id = req.userId;

    // Check if inputs are empty
    if (!title || !category_id || !description) {
        res.status(400).json({
            error: {
                code: 'BAD_REQUEST',
                message: 'The submitted data was malformed or empty.',
            },
        });
        return;
    }

    // Sanitize inputs
    const cleanTitle = purify.sanitize(title);
    const cleanDescription = purify.sanitize(description);

    // Insert into database
    const client = await pool.connect();
    const ticketId = crypto.randomUUID();
    const ticketMessageId = crypto.randomUUID();

    try {
        await client.query('BEGIN');
        await client.query(
            'INSERT INTO tickets (id, title, category_id, user_id) VALUES ($1::uuid, $2::text, $3::uuid, $4::uuid)',
            [ticketId, cleanTitle, category_id, user_id],
        );
        await client.query(
            'INSERT INTO ticket_messages (id, user_id, ticket_id, message, is_description) VALUES ($1::uuid, $2::uuid, $3::uuid, $4::text, $5::boolean)',
            [ticketMessageId, user_id, ticketId, cleanDescription, true],
        );
        await client.query('COMMIT');
        res.status(201).json({
            message: 'Ticket successfully submitted.',
            data: {
                ticket_id: ticketId,
                ticket_title: cleanTitle,
                ticket_category: category_id,
                ticket_description: cleanDescription,
            },
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
});

app.get('/cookie_test', (req, res) => {
    console.log(req.cookies['test']);
    res.cookie('test', 'heisann', {
        httpOnly: false,
        sameSite: 'strict',
        maxAge: 100000000,
    });

    res.status(200).json({
        hei: 'micheal',
    });
});

// Endpoint for retrieving a ticket
app.get('/tickets/:id', async (req, res) => {
    const ticket_id = req.params.id;

    // Check if ticket exists
    const { rows } = await pool.query(
        'SELECT * FROM tickets WHERE id=$1::uuid',
        [ticket_id],
    );

    const ticket = rows[0];
    if (!ticket) {
        res.status(404).json({
            error: {
                code: 'NOT_FOUND',
                message:
                    "The resource you're looking for is either missing or no longer available.",
            },
        });
        return;
    }

    // Get user details like email
    const { rows: user_rows } = await pool.query(
        'SELECT email, first_name, last_name FROM users WHERE id=$1::uuid',
        [ticket.user_id],
    );
    const user = user_rows[0];

    // Return json of ticket
    res.status(200).json({
        message: 'fetch successful',
        data: {
            ticket_title: ticket.title,
            ticket_category: ticket.category,
            ticket_description: ticket.description,
            user: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_id: ticket.user_id,
            },
        },
    });
});

// Endpoint for retriving users
app.get('/users', async (req, res) => {
    try {
        const { rows } = await pool.query(`
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
        console.log(err);
        res.status(500).json({
            status: 500,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error.',
            },
        });
    }
});

// Endpoint for retriving specific user
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
        const { rows } = await pool.query(
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
        console.log(err);
        res.status(500).json({
            status: 500,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error.',
            },
        });
    }
});

// Endpoint to retrieve a users tickets
app.get('/tickets', isAuthenticated, async (req, res) => {
    // @ts-expect-error
    const userID = req.userId;

    // Get tickets with user id
    const { rows } = await pool.query(
        `SELECT 
            tickets.id,
            tickets.title,
            tickets.category_id,
            ticket_categories.name AS category_name,
            ticket_messages.message AS description
        FROM tickets
        JOIN ticket_categories ON tickets.category_id = ticket_categories.id
        JOIN ticket_messages ON tickets.id = ticket_messages.ticket_id
        WHERE tickets.user_id = $1::uuid AND ticket_messages.is_description = $2::boolean`,
        [userID, true],
    );

    // Check if user has any tickets
    if (rows.length === 0) {
        res.status(200).json({
            message: "You have no tickets."
        });
        return
    }

    // Define ticket type
    type Ticket = {
        ticketId: any;
        ticketTitle: string;
        ticketCategory: string;
        ticketDescription: string;
    };

    // Loop through tickets and add to response
    const responseJson: { message: string; data: Ticket[] } = {
        message: "Tickets successfully retrieved!",
        data: []
    };

    // Push relevant info to data array
    rows.forEach((row) => {
        responseJson.data.push({
            ticketId: row.id,
            ticketTitle: row.title,
            ticketCategory: row.category_name,
            ticketDescription: row.description
        });
    })

    // Respond with the json
    res.status(200).json(responseJson)
});



// If route was not found
app.all(/(.*)/, (req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message:
                "The resource you're looking for is either missing or no longer available.",
        },
    });
});

// Responds with internal server error if any errors arise
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
        },
    });
});

// Run server on port const
app.listen(5000, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
