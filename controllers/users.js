const user = require("../models/user"); 

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => { 
    try {
        const { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust! " + registeredUser.username);  
        res.redirect("/");
        });
    } catch (e) {   
        req.flash("error", e.message);
        res.redirect("/auth/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};


module.exports.login =  (req, res) => {
    req.flash("success", "Welcome back! "  +  req.user.username);
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl); 
};


module.exports.logout =  (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Goodbye!");
        res.redirect("/auth/login");
    });
}

