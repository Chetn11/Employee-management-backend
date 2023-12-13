const mongoose=require("mongoose");

const employeeSchema=mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    department:{type:String,enum:["Tech","Marketing","Operation"]},
    salary:{type:Number,required:true},
    date:{type:String, require:true}
});


const EmployeeModel=mongoose.model("employee",employeeSchema);

module.exports={EmployeeModel};