const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

  try {
    const token = req.headers['authorization'];
    const ver = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    
    req.user = ver
    next();


    // if (ver.role !== "student") {
    //   res.status(403).json({ error: { message: 'Unauthorized User' } });
    // } else {
    //   req.user = ver
    //   next();
    // }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) return res.sendStatus(401).json({ error: {message:'Access denied'} });

//   jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

const authenticateuser = (req, res, next) => {
  const { userId } = req.body;
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401).json({ error: { message: 'Access denied' } });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403);
    if (decodedToken.userId !== userId) {
      return res.status(403).json({ error: { message: 'Unauthorized User' } });
    }
    req.user = decodedToken;
    next();
  });
};

const authenticateAdminToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401).json({ error: { message: 'Access denied' } });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403);
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Unauthorized Admin' } });
    }
    req.user = decodedToken;
    next();
  });
};

module.exports = { authenticateToken, authenticateAdminToken, authenticateuser };
