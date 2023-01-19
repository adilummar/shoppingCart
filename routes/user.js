var express = require("express");
const session = require("express-session");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
var userHelpers = require("../helpers/user-helpers");
var verifyLogin = ((req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else(
    res.redirect('/login')
  )
})

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user
  console.log(user)
  productHelpers.getAllProducts().then((products) => {
    res.render("users/view-products", { products,user});
  });
});

router.get("/login", (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render("users/login",{err:req.session.loginError});
    console.log(req.session.loginError)
    req.session.loginError = false
    console.log(req.session.loginError)
  }
});

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/');
  });
});

router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      // console.log(response.user)
      res.redirect("/");
    } else {
      res.redirect("/login");
      req.session.loginError = true;
      console.log(req.session.loginError)
    }
  });
});

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async(req,res)=>{
    let products = await userHelpers.getCartProducts(req.session.user._id)
    console.log(products)
    res.render('users/cart',{products})
  
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})



module.exports = router;
