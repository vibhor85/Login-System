const passport = require("passport")


module.exports = checkAuth =(req,res,next)=>{
  if(req.isAuthenticated()){
    next()
  }
  res.redirect('/login')
}

