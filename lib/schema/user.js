let mongoose=require("mongoose"),Schema=mongoose.Schema,userSchema=new Schema({name:{type:String,default:""},petname:{type:String,default:""},password:{type:String,default:""},speech:{type:String,default:""},position:{type:String,default:""},date:{type:String,default:""},role:{type:String,default:""},url:{type:String,default:"/images/dt.png"},sex:{type:String,default:""},email:{type:String,default:""},wechat:{type:String,default:""},qq:{type:String,default:""},mark:{type:String,default:""},web:{type:String,default:""},phone:{type:String,default:""},bid:{type:String,default:""},git:{type:String,default:""},admin:{type:String,default:"0"}});module.exports=mongoose.model("swd_users",userSchema);