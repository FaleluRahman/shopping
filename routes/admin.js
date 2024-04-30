const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const productHelpers = require('../helpers/product-helpers.js');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify the directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // use current timestamp as filename
  }
});
 const mv= require('mv')
const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
   console.log(products)
    res.render('admin/view-proudcts', { admin: true, products });

  })
 
});

router.get('/add-product', function(req, res) {
  res.render('admin/add-product');
});

router.post('/add-product', upload.single('image'), function (req, res) {
  console.log('Form Data:', req.body);
  console.log('Uploaded File:', req.file);

  productHelpers.addProduct(req.body, (id) => {
    let image = req.file;// Access uploaded file using req.file
    console.log(id);
    // Use mv to move the uploaded file
    mv(image.path, './public/product-images/' + id + '.jpg', function (err) {
      if (err) {
         res.render('admin/add-product');
      }else{
        console.log(err)
      }
      console.log('File moved successfully') 
      res.render('admin/add-product');
    });
    res.send("set aayi")
  });
});

router.get('/delete-product/:id',(req,res)=>{
   let prold=req.params.id
   console.log(prold)
   productHelpers.deleteProduct(prold).then((response)=>{
    res.redirect('/admin/')
  })
})
module.exports = router;
