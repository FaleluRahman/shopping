const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { resolve, reject } = require('promise');
const { propfind, response } = require('../app');
const { ObjectId } = require('mongodb');

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
                console.log(cartItems[0].products);
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
    ).then(()=>{
        resolve()
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
  }
}



