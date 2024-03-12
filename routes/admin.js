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

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Your existing route handling code
  let products = [
    {
      name: "Apple iphone 14 Pro Max 256Gb",
      category: "Mobile",
      description: "Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image: "https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600"
    },
    {
      name: "Samsung Galaxy S23 5G (Green, 8GB, 256GB Storage)",
      category: "Mobile",
      description: "Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image: "https://m.media-amazon.com/images/I/61RZDb2mQxL.SL1500.jpg"
    },
    {
      name: "TECNO Spark GO 2024 (Mystery White,8GB* RAM, 128GB ROM)",
      category: "Mobile",
      description: "Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image: "https://m.media-amazon.com/images/I/41XU-QOw01L.SX300_SY300_QL70_FMwebp.jpg"
    },
    {
      name: "OPPO A59 5G (Silk Gold, 4GB RAM, 128GB Storage)",
      category: "Mobile",
      description: "Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image: "https://m.media-amazon.com/images/I/81ZQ45FUSkL.SL1500.jpg"
    }


  ];
  res.render('admin/view-proudcts', { admin: true, products });
});

router.get('/add-product', function(req, res) {
  res.render('admin/add-product');
});

router.post('/add-product', upload.single('image'), function (req, res) {
  console.log('Form Data:', req.body);
  console.log('Uploaded File:', req.file);

  productHelpers.addProduct(req.body, (result) => {
    if (result) {
      res.render("admin/add-product", { success: true }); // Render success page
    } else {
      res.render("admin/add-product", { success: false }); // Render failure page
    }

    res.send('File uploaded successfully!');

  });
});

  



module.exports = router;