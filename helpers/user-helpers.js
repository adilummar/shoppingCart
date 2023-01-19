var db = require("../config/connection")
var collection = require('../config/collection')
var bcrybt = require('bcrypt')
const { ObjectId } = require("mongodb")
var objectId = require("mongodb").ObjectId

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password =await bcrybt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(userData)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrybt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('login success')
                        response.status = true
                        response.user = user
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve(response.status = false)
                    }
                })
            }else{
                console.log('email is not matching');
                resolve(response.status = false)
            }
        })
    },
    addToCart:(prodId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},{
                    $push:{
                        products:objectId(prodId)
                    }
                }).then((response)=>{
                    resolve()
                })
            }else{
                let cartObj = {
                    user: objectId(userId),
                    products:[objectId(prodId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECCTION,
                        let:{prodList:"$products"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }
                        ],
                        as:'cartitems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartitems)
        })
    }
}
