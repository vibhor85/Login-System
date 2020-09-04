var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:"String",required:true},
    email:{type:"String",required:true,unique:true},
    username:{type:"String",required:true,unique:true},
    password:{type:'String',required:true}
})

module.exports= mongoose.model('User',userSchema);