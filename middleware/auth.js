// middleware/auth.js

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  // Fixed path to match your server mounting
  res.redirect("/auth/login"); 
};

const ensureRole = (role) => {
  return (req, res, next) => {
    // Check if user exists and roles match (Case-Insensitive)
    if (req.user && req.user.role.toLowerCase() === role.toLowerCase()) {
      return next();
    }
    // Access Denied message
    res.status(403).send(`Access denied. ${role} permissions required.`);
  };
};

module.exports = {
  ensureAuthenticated,
  ensureRole,
  
  // Aliases updated to match your system naming
  isAdmin: ensureRole('admin'),
  isManager: ensureRole('manager'),
  isSalesAttendant: ensureRole('attendant'),
  
  // Backwards compatibility for lowercase roles
  isManagerOld: ensureRole('manager'),
  isAttendantOld: ensureRole('attendant')
};