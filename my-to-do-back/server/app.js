const express = require('express');
const cors = require('cors');
const app = express();
const toDoRoutes  = require('./routes/toDoRoutes');

require('dotenv').config({path:__dirname + '/.env'});
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());
app.use('/api',toDoRoutes);
app.listen(port,()=>{
    console.log('server started ')
})