const {Router} = require('express')
const router = Router()
const passport = require('passport')


//вход
router.post('/signin',(req, res, next) =>{
    passport.authenticate(
        'local-login', function (err, user) {
            if(user) {
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err)
                    }
                    req.user = user
                    res.json({data: user, status: 'OK'})
                })
            }else res.json({data: req.flash('loginMessage')[0], status: 'error'})
        })(req, res, next)
})

//регитсрация
router.post('/signup', (req, res, next)=>{
    passport.authenticate('local-signup', function (err, user) {
        if(user){
            res.json({data: user, status: 'OK'})
        }
        else res.json({data: req.flash('signupMessage')[0], status: 'error'})
    })(req, res, next)
})

module.exports = router