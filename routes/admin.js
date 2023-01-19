var express = require("express");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");


/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render("admin/view-products", { admin: true, products });
  })
});

router.get("/add-products", (req, res) => {
  res.render("admin/add-products");
});

router.post("/add-products", (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image);
  productHelpers.addProducts(req.body, (id) => {
    const image = req.files.Image;
    console.log(id);
    image.mv("./public/images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/add-products");
      } else {
        console.log(err);
      }
    });
  });
});

router.get('/delete-product/:id',(req,res)=>{
  let proid = req.params.id
  console.log(proid)
  productHelpers.deleteProduct(proid).then(((response)=>{
    res.redirect('/admin/')
  }))
})

router.get('/edit-product/:id',async(req,res)=>{
  let product =await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  console.log(product.name)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id
  console.log(req.params.id)
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image;
      image.mv("./public/images/" + id + ".jpg")
    }
  })
})
module.exports = router;
