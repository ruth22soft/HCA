import jwt from 'jsonwebtoken';

// Simple in-memory cache for verified tokens
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const auth = (roles = []) => {
  // roles param can be a single role string (e.g. 'Admin') or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
      // Check cache first
      const cachedData = tokenCache.get(token);
      if (cachedData && cachedData.expires > Date.now()) {
        req.user = cachedData.user;
        if (roles.length && !roles.includes(cachedData.user.role)) {
          return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
        }
        return next();
      }

      // If not in cache or expired, verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Cache the verified token
      tokenCache.set(token, {
        user: decoded,
        expires: Date.now() + CACHE_TTL
      });

      // Clean up expired cache entries
      for (const [key, value] of tokenCache.entries()) {
        if (value.expires <= Date.now()) {
          tokenCache.delete(key);
        }
      }

      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid.' });
    }
  };
};

export default auth; 