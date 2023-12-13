const mongoose=require("mongoose");
require("dotenv").config();

const connection=mongoose.connect(`mongodb+srv://chetan:chetan1997@cluster0.08syghj.mongodb.net/management`);

module.exports={connection};