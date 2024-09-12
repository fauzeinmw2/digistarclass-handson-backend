require('dotenv').config(); // Memuat variabel lingkungan dari .env
const jwt = require('jsonwebtoken');

function authorizeRoles(...roles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        // Cek apakah header Authorization ada
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        // Cek apakah formatnya Bearer <token>
        const tokenParts = authHeader.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
            return res.status(401).json({ message: 'Invalid authorization format' });
        }

        const token = tokenParts[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Cek apakah role user sesuai dengan role yang diizinkan
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            // Simpan informasi user di request object
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
}

module.exports = authorizeRoles;
