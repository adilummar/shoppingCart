var db = require("../config/connection")
var collection = require('../config/collection');
const { PRODUCT_COLLECCTION } = require("../config/collection");
var objectId = require("mongodb").ObjectId

module.exports={
    addProducts:(product,callback)=>{
        console.log(product);
        
        db.get().collection(collection.PRODUCT_COLLECCTION).insertOne(product).then((data)=>{
            callback(data.insertedId);
        })
    },

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
           let products = await db.get().collection(collection.PRODUCT_COLLECCTION).find().toArray()
           resolve(products)
        })
    },

    deleteProduct:(proid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECCTION).remove({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(prodid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(PRODUCT_COLLECCTION).findOne({_id:objectId(prodid)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(prodId,prodDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(PRODUCT_COLLECCTION).updateOne({_id:objectId(prodId)},{
                $set:{
                    name:prodDetails.name,
                    description:prodDetails.description,
                    price:prodDetails.price,
                    category:prodDetails.category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
}