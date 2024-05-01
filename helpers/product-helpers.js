const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { reject, resolve } = require('promise');
const { response } = require('express');

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.insertedId);
        });
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        });
    },
    deleteProduct: (prodId) => {
    return new Promise((resolve, reject) => {
      const objectId = new ObjectId(prodId);
       console.log(prodId)
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId }).then((response) => {
          resolve(response);
      }).catch((error) => {
          reject(error);
      });
    });
  },
  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(proId) }).then((product) => {
            resolve(product);
        }).catch((error) => {
            console.error(error);
            resolve(null); // Returning null in case of error
        });
    });
},
updateProduct: (proId, proDetails) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: new ObjectId(proId) }, {
            $set: {
                name: proDetails.name,
                description: proDetails.description,
                price: proDetails.price,
                category: proDetails.category
              
            }
        }).then((response) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}


}








// const db = require('../config/connection')
// var collection=require('../config/collections');
// const { resolve, reject } = require('promise');
// const { objectId } = require('mongodb').ObjectId
// // var ObjectId=require('mongodb')

// module.exports = {

//   addProduct:(product,callback)=>{
//     // console.log(product);

//     db.get().collection('product').insertOne(product).then((data)=>{
//       callback(data.insertedId)

//     })
//   },
//   getAllProducts:()=>{
//   return new Promise(async(resolve,reject)=>{
//     let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
//      resolve (products)
//   })
//   },
//   deleteProduct: (prodId) => {
//     return new Promise((resolve, reject) => {
//         console.log(prodId);
//         console.log(objectId(prodId));
//         db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(prodId) }).then((response) => {            // console.log(response)
//             resolve(response);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// }

// }

// // const db = require('../config/connection');
// // const collection = require('../config/collections');
// // const { ObjectId } = require('mongodb');

// // module.exports = {
// //     addProduct: (product, callback) => {
// //         db.get().collection('product').insertOne(product).then((data) => {
// //             callback(data.insertedId);
// //         });
// //     },
// //     getAllProducts: () => {
// //         return new Promise(async (resolve, reject) => {
// //             let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
// //             resolve(products);
// //         });
// //     },
// //     deleteProduct: (prodId) => {
// //       return new Promise((resolve,reject)=>{
// //           try {
// //               const objectId = new ObjectId(prodId);
// //               db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId }).then((response) => {
// //                   resolve(response);
// //               }).catch((error) => {
// //                   reject(error);
// //               });
// //           } catch (error) {
// //               reject(error);
// //           }
// //       });
// //   }
  
// // };
