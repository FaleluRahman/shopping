const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

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
      image: "https://m.media-amazon.com/images/I/61RZDb2mQxL._SL1500_.jpg"
    },
    {
      name: "TECNO Spark GO 2024 (Mystery White,8GB* RAM, 128GB ROM)",
      category: "Mobile",
      description: "Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image: "https://m.media-amazon.com/images/I/41XU-QOw01L._SX300_SY300_QL70_FMwebp_.jpg"
    },
    {
      name: "OPPO A59 5G (Silk Gold, 4GB RAM, 128GB Storage)",
      category: "Mobile",
      description: "Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image: "https://m.media-amazon.com/images/I/81ZQ45FUSkL._SL1500_.jpg"
    }


  ];
  res.render('admin/view-proudcts', { admin: true, products });
});

router.get('/add-product', function(req, res) {
  res.render('admin/add-product');
});

router.post('/add-product', function(req, res) {
  const form = formidable({ multiples: true, uploadDir: path.join(__dirname, '..', 'uploads') });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Now you have access to fields and files
    console.log(fields);
    console.log(files);

    // Process the form data or handle file uploads here

    res.send('Form data received successfully');
  });
});

module.exports = router;
