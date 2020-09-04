const passport = require("passport")


module.exports = checkAuth =(req,res,next)=>{
  if(req.isAuthenticated()){
    res.redirect('/users/dashboard')
  }
  next()
}

