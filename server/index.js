import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import initializeSocket from './src/socket.js';
import noauthRouter from './src/noauth.js';
import router from './src/route.js';
import getDBConnection from './src/database.js';

const PORT = 9000;

const app = express();
app.use(cors());
app.use(express.json()); // <-- This parses JSON request bodies

const server = http.createServer(app);

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// app.use('/', (req, res) => {
//     console.log('Hello world!');
//     res.send('Hello from route.js!');
// })

// const playDoc = async (data) => {
//     const db = await getDBConnection('MSH_CONTACTAPP');
//     db.collection('Schema').updateMany({ tabItems: { $exists: true } }, {
//         $addToSet: {
//             tabItems: {
//                 $each: [
//                     {
//                         name: "Documents",
//                         icon: "file alternate outline",
//                         tabColor: "#3c4184",
//                         schemaName: "document"
//                     },
//                     {
//                         name: "Notes",
//                         icon: "sticky note outline",
//                         tabColor: "#e1bd50",
//                         schemaName: "note"
//                     }
//                 ]
//             }
//         }
//     });
// };
// playDoc();

app.use('/api/noauth', noauthRouter);

app.use('/api', authenticateToken, router);

initializeSocket(server);

// app.listen(3000, () => console.log('REST API running on port 3000'));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});