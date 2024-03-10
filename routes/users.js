var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Apple iphone 14 Pro Max 256Gb",
      category:"Mobile",
      description:"Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image:"https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600",
      price:'79000'
     },
     {
      name:"Samsung Galaxy S23 5G (Green, 8GB, 256GB Storage)",
      category:"Mobile",
      description:"Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image:"https://m.media-amazon.com/images/I/61RZDb2mQxL._SL1500_.jpg",
      price:'88000'
     },
     {
      name:"TECNO Spark GO 2024 (Mystery White,8GB* RAM, 128GB ROM)",
      category:"Mobile",
      description:"Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image:"https://m.media-amazon.com/images/I/41XU-QOw01L._SX300_SY300_QL70_FMwebp_.jpg",
      price:'9000'
     },
     {
      name:"OPPO A59 5G (Silk Gold, 4GB RAM, 128GB Storage)",
      category:"Mobile",
      description:"Brand New Seal Pack. 12 months Apple Global Warranty. Physical SIM & eSIM",
      image:"https://m.media-amazon.com/images/I/81ZQ45FUSkL._SL1500_.jpg",
      price:'15000'
     }
  ]
  res.render('index', {products,admin:false });
});

module.exports = router;
