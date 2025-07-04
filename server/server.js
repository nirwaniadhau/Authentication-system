import express from "express"
import dotenv from "dotenv"
dotenv.config();
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRoute from "./routes/user.routes.js";


const app= express();

const port=process.env.PORT ||4000;
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
]

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials:true}));

app.get("/",(req,res)=>{
    res.send("Hello World");
});


app.use("/api/auth",userRoute);


app.listen(port,()=>{
    console.log("Backend server is running on port",port);
});
