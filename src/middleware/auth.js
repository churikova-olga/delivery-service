function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the page
    else {
        res.status(401).json({data: "Пользователь не авторизирован", status:'error'});
    }
}

module.exports = isLoggedIn