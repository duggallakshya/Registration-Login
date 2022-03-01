const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        console.log(token);
        this.tokens = this.tokens.concat({
            token:token
        })
        await this.save();
        return token;
    }catch(err){
        res.send(err);
        console.log(err);
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log("prev"+"  "+ this.password);
        this.password = await bcrypt.hash(this.password,10);
        // console.log("new"+"  "+ this.password);
 
    }
    next();
    
})
const Register = new mongoose.model("Register",userSchema);

module.exports = Register;