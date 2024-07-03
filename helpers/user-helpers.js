const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { resolve, reject } = require('promise');
const { propfind, response, use } = require('../app');
const { ObjectId } = require('mongodb');
const { json } = require('express');

module.exports = {
    doSignup: async (userData) => {
        try {
            // Hash the user's password
            userData.password = await bcrypt.hash(userData.password, 10);

            // Insert the user data into the database
            const result = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
            if (result.insertedId) {
                return result.insertedId;
            } else {
                throw new Error('Failed to insert user data');
            }
        } catch (error) {
            throw error;
        }
    },
  doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let response={}
        let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
        if (user){
           bcrypt.compare(userData.password,user.password).then((status)=>{
           if(status){
            // console.log('login success');
            response.user=user
            response.status=true
            resolve(response)

           }else{
            console.log(response.massage);
            resolve({status:false})
           }
           })
        }else{
            console.log('login failed');
            resolve({status:false})
        }
    })
  },
  addToCart: (proId, userId) => {
    let proObj={
        item: new ObjectId(proId),
        quantity:1
    }
    return new Promise(async(resolve,reject) => {
        let userCart = await db.get().collection(collection.CART_COLLECTION)
            .findOne({ user: new ObjectId(userId) });
        
        if (userCart) {
            let proExist=userCart.products.findIndex(product=> product.item==proId)
            console.log(proExist)
            if(proExist!=-1){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:new ObjectId(userId),'products.item':new ObjectId(proId)},
                {
                    $inc:{'products.$.quantity':1}
                }
            ).then(()=>{
                resolve()
            })

            }else{
            db.get().collection(collection.CART_COLLECTION)
                .updateOne({ user: new ObjectId(userId)},
                    {
                         $push: {products:proObj }

                        }
              
                    ).then((response) => {
                    resolve();
                });
            }
        } else {
            let cartObJ = {
                user: new ObjectId(userId),
                products:[proObj]
            };
            db.get().collection(collection.CART_COLLECTION)
                .insertOne(cartObJ)
                .then((response) => {
                    resolve();
                });
        }
    });
},
getCartProducts: (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let cartItems = await db.get().collection(collection.CART_COLLECTION)
                .aggregate([
                    {
                        $match: { user: new ObjectId(userId) }
                    },
                    {
                        $unwind:'$products'
                    },
                    {
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                        }
                    },
                    {
                        $lookup:{
                            from:collection.PRODUCT_COLLECTION,
                            localField:'item',
                            foreignField:'_id',
                            as:'product'
                        }
                    },
                    {
                        $project:{
                            item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                        }
                    }
            
                ]).toArray();
            resolve(cartItems);
        } catch (error) {
            reject(error);
        }
    });
},
getCartCount:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        let count=0
      let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId})
      if(cart){
        count=cart.products.length

      }
      resolve(count)
    })
},
changeProductQuantity:(details)=>{
    details.count=parseInt(details.count)
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CART_COLLECTION)
        .updateOne({_id:new ObjectId(details.cart),'products.item':new ObjectId(details.product)},
        {
            $inc:{'products.$.quantity':details.count}
        }
    ).then((response)=>{
        resolve(response)
    })



    })
},
 removeProduct: (cartId, productId) => {
    return new Promise((resolve, reject) => {
      const cartObjectId = new ObjectId(cartId);
      const productObjectId = new ObjectId(productId);

      db.get().collection(collection.CART_COLLECTION).updateOne(
        { _id: cartObjectId },
        { $pull: { products: { item: productObjectId } } }
      ).then((response) => {
        if (response.modifiedCount > 0) {
          resolve(response);
        } else {
          reject(new Error('Product not found in cart'));
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
  getTotalAmount:(userId)=>{
    return new Promise(async(resolve, reject) => {
        let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match: { user: new ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id', // Ensure this matches the field type in PRODUCT_COLLECTION
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    price: { $toDouble: '$product.Price' } // Convert price to numeric type
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ['$quantity', '$price'] } }
                }
            }
        ]).toArray();
        
        if (total.length > 0) {
            console.log(total[0].total);
            resolve(total[0].total);
        }else{
            console.log(total)
            resolve(0)
        }
    })
  },
  placeOrder: (order, products, total) => {
    return new Promise((resolve, reject) => {
        console.log(order, products, total);
        let status = order.PaymentMethod === 'COD' ? 'placed' : 'pending';
        let orderObj = {
            DeliveryDetails: {
                mobile: order.mobile,
                address: order.address,
                pincode: order.pincode,
                
            },
            userId: new ObjectId(order.userId),
            PaymentMethod: order.PaymentMethod,
            products: products,
            totalAmount: total,
            status: status,
            Date: new Date() // It's a good practice to store the creation date of the order
        };

        db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj)
            .then((response) => {
                // let orderItems=response
                // console.log(orderItems)
                return db.get().collection(collection.CART_COLLECTION).deleteOne({ user: new ObjectId(order.userId) })
                    .then(() => {
                        resolve(response);
                    });
            })
            .catch((err) => {
                reject(err); // Reject the promise with the error\
            });
    });
},

getCartProductList: (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: new ObjectId(userId) });
            if (cart && cart.products) {
                resolve(cart.products);
            } else {
                resolve([]); // Resolve with an empty array if cart or products are not found
            }
        } catch (error) {
            reject(error); // Reject the promise if there's an error
        }
    });
},
  getUserOrders:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        console.log(userId)
        let orders=await db.get().collection(collection.ORDER_COLLECTION)
        .find({userId:new ObjectId (userId)}).toArray()
        console.log(orders)
        resolve(orders)
    })
  },
  getOrderProducts:(orderId)=>{
    return new Promise(async(resolve, reject) => {
        let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: { user: new ObjectId(orderId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id', // Ensure this matches the field type in PRODUCT_COLLECTION
                    as: 'product'
                }
            },
            
            {
                $unwind: '$product'
            },
           {
            $project:{
                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
            }
           },
           
        ]).toArray();
        
        console.log(orderItems)
        resolve(orderItems)
    })
  },
}