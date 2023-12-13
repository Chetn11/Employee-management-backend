const express=require("express");
const {EmployeeModel}=require("../models/employeesModels");

const employeeRouter=express.Router();


// get employ data
employeeRouter.get("/", async(req,res)=>{

    try{
        const q=req.query.q || "";  // search query
        const page=parseInt(req.query.page)-1||0; // for pagination
        const limit=parseInt(req.query.limit) || 5;  // page limit default 5
        var sort=req.query.sort ;               // for sort
        let department=req.query.department || "ALL";

        const departmentOption=[
            "Tech",
            "Marketing",
            "Operation",
            "Other "
        ]
         
        department==="ALL"?(department=[...departmentOption]):(department=req.query.department.split(","));

        req.query.sort?(sort=req.query.sort.split(",")):(sort=[sort]);
        let sortBy={};
        if(sort[1]){
            sortBy[sort[0]]=sort[1];
        }
        else{
            sortBy[sort[0]]="asc";
        }

        const employee=await EmployeeModel.find({$or:[{first_name:{$regex:q,$options:"i"}},{department:{$regex:q,$options:"i"}}]})
        .where("department").in([...department]).sort(sortBy).skip(page*limit).limit(limit);

        const total=await EmployeeModel.countDocuments({
            department:{$in:[...department]},
            first_name:{$regex:q,$options:"i"},
        })
        const response={
            error:false,
            employee,
            total,
            page:page+1,
            limit
        }
        res.send(response);
    }
    catch(error){
        res.send({error:true,message:"Sorry for issue there is a server Error"});
    }

    // const data=await EmployeeModel.find();
    // res.send({data:data});
})

// create data
employeeRouter.post("/create", async (req,res)=>{
    const{first_name,last_name,email,department,salary,date}=req.body;

    const Employee_data=await EmployeeModel.create({first_name,last_name,email,department,salary,date});
    res.send({data:Employee_data});
} );

//update data
employeeRouter.post("/update/:employeeId", async (req,res)=>{
     const employeeId=req.params.employeeId;
     const payload=req.body;

    const Employee_data=await EmployeeModel.findOneAndUpdate({_id:employeeId},payload);
    res.send({message:`Employee ${Employee_data.first_name}'s data updated!`});
} );

// delete data
employeeRouter.delete("/delete/:employeeId",async (req,res)=>{
    const employeeId=req.params.employeeId;

    const Employee_data=await EmployeeModel.findOneAndDelete({_id:employeeId});
    res.send({message:`Employee ${Employee_data.first_name}'s data is  deleted`});
})

module.exports={employeeRouter};