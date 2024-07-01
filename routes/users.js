var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers.js');
const userHelpers = require('../helpers/user-helpers');
const { response } = require('../app.js');
const { log } = require('handlebars/runtime');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  console.log(user);
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  // let cartCount=await userHelpers.getCartCount(req.session.user._id)
  productHelpers.getAllProducts().then((products) => {
    // console.log(products)
    res.render('user/view-products', { products, user, cartCount });

  })
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')

    } else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('/login')
    }

  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelpers.getCartProducts(req.session.user._id,)
  let totalValue = await userHelpers.getTotalAmount(req.session.user._id)

  console.log(totalValue);
  res.render('user/cart', { products, user: req.session.user, totalValue })
})
router.get('/add-to-cart/:id', (req, res) => {
  console.log("api call");
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true })
  })

})
router.post('/change-product-quantity',verifyLogin, (req, res, next) => {
  userHelpers.changeProductQuantity(req.body).then(async (response) => {
    let total=await userHelpers.getTotalAmount(req.session.user._id)
    console.log(total);
    res.json({success:true,...response,total})
  })
})

router.get('/cart', verifyLogin, async (req, res) => {
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);
    // Assuming getCartProducts filters out products with quantity 0
    res.render('user/cart', { products, user: req.session.user });
  } catch (error) {
    console.error('Error fetching cart products:', error);
    res.redirect('/');
  }
});

router.delete('/remove-product/:cartId/:productId', (req, res) => {
  const { cartId, productId } = req.params;

  userHelpers.removeProduct(cartId, productId).then((response) => {
    res.status(201).send({ success: true }) // Redirect to the cart page after removal
  }).catch((error) => {
    console.error('Error removing product from cart:', error);
    res.status(500).send('Error removing product from cart');
  });
});

// router.get('/remove-product/:id', (req, res) => {
//   let prold = req.params.id
//   console.log(prold)
//   productHelpers.deleteProduct(prold).then((response) => {
//     // res.redirect('/admin/')
//   })
// })
router.get('/place-order',verifyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
})
router.post('/place-order',async(req,res)=>{
  let products=await userHelpers.getcartProductList(req.body.userId)
  let totalprice= await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalprice).then((response)=>{
    res.json({ status: true })
  })
console.log(req.body)

})
module.exports = router;