// const db = require('../config/connection');
// const collection = require('../config/collections');
// const bcrypt = require('bcrypt');

// module.exports = {
//     doSignup: async (userData) => {
//         try {
//             // Hash the user's password
//             userData.password = await bcrypt.hash(userData.password, 10);

//             // Insert the user data into the database
//             const result = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
//             if (result.insertedId) {
//                 return result.insertedId;
//             } else {
//                 throw new Error('Failed to insert user data');
//             }
//         } catch (error) {
//             throw error;
//         }
//     },
//     doLogin: async (userData) => {
//         console.log('Login attempt with userData:', userData); // Log userData object
//         try {
//             let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
//             if (user) {
//                 let status = await bcrypt.compare(userData.password, user.password);
//                 if (status) {
//                     console.log('Login successful'); // Log successful login
//                     return user;
//                 } else {
//                     console.log('Login failed: Incorrect password'); // Log incorrect password
//                     return null;
//                 }
//             } else {
//                 console.log('Login failed: User not found'); // Log user not found
//                 return null;
//             }
//         } catch (error) {
//             console.error('Error during login:', error); // Log any errors that occur during login
//             throw error;
//         }
//     }
// };




const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { resolve, reject } = require('promise');

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
            console.log('login success');
            response.user=user
            response.status=true
            resolve(response)

           }else{
            console.log('login failed');
            resolve({status:false})
           }
           })
        }else{
            console.log('login failed');
            resolve({status:false})
        }
    })
  }
};



// const db = require('../config/connection');
// const collection = require('../config/collections');
// const bcrypt = require('bcrypt');

// module.exports = {
//     doSignup: async (userData) => {
//         try {
//             // Hash the user's password
//             userData.password = await bcrypt.hash(userData.password, 10);

//             // Insert the user data into the database
//             const result = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
//             if (result.insertedId) {
//                 return result.insertedId;
//             } else {
//                 throw new Error('Failed to insert user data');
//             }
//         } catch (error) {
//             throw error;
//         }
//     },
//     doLogin: async (userData) => {
//         try {
//             let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
//             if (user) {
//                 let status = await bcrypt.compare(userData.password, user.password);
//                 if (status) {
//                     console.log('login success');
//                     return user; // Return the user object on successful login
//                 } else {
//                     console.log('login failed');
//                     return null; // Return null or false to indicate login failure
//                 }
//             } else {
//                 console.log('login failed');
//                 return null; // Return null or false to indicate login failure
//             }
//         } catch (error) {
//             throw error;
//         }
//     }
// };
