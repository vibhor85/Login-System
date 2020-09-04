require('dotenv').config()
var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); 
var flash = require('express-flash')
var session = require('express-session')
const passport = require('passport');
var   LocalStrategy = require('passport-local').Strategy;

var router = express.Router();
const checkAuth = require('../checkAuth/checkAuth');
const checkNotAuth = require('../checkAuth/checkNotAuth');



const User = require('../models/user');

router.use(flash())
router.use(session({
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave:true,
  saveUninitialized:false,
  cookie:{sameSite:true}
}))
router.use(passport.initialize());

router.use(passport.session());

passport.use(new LocalStrategy({
  passReqToCallback:true
},
  function(req,username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false,req.flash('message','Incorrect Username'));
      }
      bcrypt.compare(password,user.password,(err,result)=>{
        if(err){return done(err)}
        else if(result)
        return done(null, user);
        else{
          return done(null, false,req.flash('message','Incorrect Password'));
        }


      })
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
router.use((req,res,next)=>{
  res.locals.user = req.user
  next()
})

router.get('/',checkNotAuth,function(req, res, next) {
  res.render('signup');
});

router.get('/login',checkNotAuth, function(req, res, next) {
  res.render('login');
});


router.get('/logout',(req,res,next)=>{
  req.logout()
  res.redirect('/login')
})

router.post('/',checkNotAuth,async (req,res,next)=>{
  try{
    if(req.body.name===''||req.body.email===''||req.body.username===''||req.body.password===''){
      req.flash('message',"Please Fill all The Entries");
      res.redirect('/')
      return
    }
    const emailresult = await User.findOne({email:req.body.email}).exec();
    if(emailresult){
      req.flash('message',"Email already exists");
      res.redirect('/')
      return
    }
    const result = await User.findOne({username:req.body.username}).exec();
    if(result){
      req.flash('message',"Username already exists");
      res.redirect('/')
      return
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    var user = new User({
      _id:mongoose.Types.ObjectId(),
      name:req.body.name,
      email:req.body.email,
      username:req.body.username,
      password:hashedPassword
    })
    await user.save()
    console.log(user)
    req.flash('success',"You have successfully Registered");

    res.redirect('login');
     
  }
  catch(err){
    err=>console.log(err)
  }
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/users/dashboard',
  failureRedirect:'/login',
  failureFlash:true
}));



module.exports = router;
