const express = require("express");
const users=require("../data/users.json");
const books=require("../data/books.json");
const router=express.Router();


router.get("/", (req, res) => {
      res.status(200).json({ sucess: true,data:users });
    });
router.get("/:id", (req, res) => {
    const {id}=req.params;
    const user=users.find((each)=>each.id===id);
    if(!user){
        return res.status(404).json({
            sucess:false,message:"User doesnot exist",
        });
    }
     return res.status(200).json({ sucess: true,message:"User Found",data:user });
  });
  router.post("/", (req, res) => {
    const {id,name,surname,email,subscriptionType,subscriptionDate}=req.body;
    const user=users.find((each)=>each.id===id);
    
    if(user){
        return res.status(404).json({
            sucess:false,message:"User already exist",
        });
    }
    users.push({id,name,surname,email,subscriptionType,subscriptionDate});
      return res.status(201).json({ sucess: true,message:"User added sucessfully",data:users });
  });
  router.put("/:id", (req, res) => {
    const {id}=req.params;
    const {data}=req.body;

    const user=users.find((each)=>each.id===id);
    if(!user){
        return res.status(404).json({
            sucess:false,message:"User doesnot exist",
        });
    }
    const updateUserData=users.map((each)=>{
      if(each.id===id){
        return{
          ...each,...data,
        };
      }
      return each;
    });
      return res.status(200).json({ sucess: true,message:"User updated",data:updateUserData });
  });
  router.delete("/:id", (req, res) => {
    const {id}=req.params;

    const user=users.find((each)=>each.id===id);
    if(!user){
        return res.status(404).json({
            sucess:false,message:"User doesnot exist",
        });
      }
      const index=users.indexOf(user);
      users.splice(index,1);
      return res.status(200).json({sucess:true,message:"User deleted sucessfully",data:users})
    });
router.get("/subscription-details/:id",(req,res)=>{
      const{id}=req.params;
      const user=users.find((each)=>each.id===id);
      if(!user){
        return res.status(404).json({
          sucess:false,message:"User not Found"
        });
      };
const getDateInDays =  (data="") =>{
      let date;
      if(data===""){
        date=new Date();
      }else
      {
        date=new Date(data);
      }
      let days=Math.floor(date/(1000*60*60*24));
      return days;
      };
const subscriptionType=(date)=>{
        if((user.subscriptionType=='Basic')){
          date=date+90;
        }else if((user.subscriptionType=='Standard')){
          date=date+180; 
        }else if((user.subscriptionType=='Premium')){
          date=date+365;
        }
        return date;
      };
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate=getDateInDays(user.subscriptionDate);
    let subscriptionExpiration=subscriptionType(subscriptionDate);

    const data={ ...user,
      isSubscriptionExpired: subscriptionExpiration<=currentDate,
      daysLeftForExpiration: subscriptionExpiration<=currentDate?0:subscriptionExpiration-currentDate,
      fine:returnDate<=currentDate?subscriptionExpiration<=currentDate?100:50:0,
    };
    return res.status(200).json({
      sucess:true,message:"Subscription Details",data,
    });
    });
    module.exports=router;






