import express from 'express';
import 'dotenv/config';
import { router } from './routers/router.js';


let app = express()
let PORT = process.env.PORT || 3000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded( {extended:true} ))


// Rutas
app.use('/',router)


app.listen(PORT,()=> {
    console.log(`Server UP on http://localhost:${PORT}`)
})