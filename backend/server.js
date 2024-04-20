import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import connectToDB from "./db/config.js";

const app=express();
const PORT =process.env.PORT || 8000 ;

dotenv.config();

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("api/messages",messageRoutes);

app.listen(PORT,()=> {
    connectToDB();
    console.log(`Server is running on port ${PORT}`)
});