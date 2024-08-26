const express = require("express");
const books=require("../data/books.json");
const users=require("../data/users.json");
const router=express.Router();


router.get("/", (req, res) => {
    res.status(200).json({ sucess: true, message:"Got all the books", data:books});
  });
router.get("/issued",(req,res)=>{
    const userWithTheIssuedBooks=users.filter((each)=>{
      if(each.issuedBook)  return each;
    });
    const issuedBooks=[];

    userWithTheIssuedBooks.map((each)=>{
      const book=books.find((book)=>(book.id===each.issuedBook));

       book.issuedBy=each.name;
       book.issuedDate=each.issuedDate;
       book.returnDate=each.returnDate;

       issuedBooks.push(book);
    });
      if(issuedBooks.length===0){
        return res.status(404).json({
          sucess:false,message:"No books found",
        });
      }
      return res.status(200).json({
        sucess:true,message:"User with issued book",data:issuedBooks
      });
    });
router.get("/:id", (req, res) => {
    const {id}=req.params;
    const book=books.find((each)=> each.id === id);
    if(!book){
        return res.status(404).json({
            sucess:false,message:"book not found",
        });
    }
     return res.status(200).json({ sucess: true,message:"book Found",data:book});
  });
  router.post("/",(req,res)=>{
    const {data}=req.body
    if(!data){
      return res.status(400).json({sucess:false,message:"no data to add"})
    }
    const book=books.find((each)=> each.id === data.id);
    if(book){
      return res.status(404).json({sucess:false,message:"book already exist"})
    }
    const allBooks={...books,data};
    return res.status(201).json({sucess:true,messgae:"book added sucessfully",data: allBooks,})
  })
router.put("/updateBook/:id",(req,res)=>{
  const {id}=req.params;
  const {data}=req.body;
  const book=books.find((each)=>each.id===id);

if(!book){
  return res.status(400).json({
    sucess:false,message:"Book not found"
  });
}
  const updateData=books.map((each)=>{
    if(each.id===id){
      return{...each,...data};
    }

    return each;
  });
  return res.status(200).json({
    sucess:true,message:"Book updated sucessfully",data:updateData,
  });
});



module.exports=router;