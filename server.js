const express = require("express");
const userRouter = require("./routes/user");
const showRouter = require("./routes/user");
const app = express();

//very important tp include these!! We need this to read the body in our routers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//set up  routers
app.use('/users', userRouter);
app.use('/shows', showRouter);

app.listen(5001);

module.exports = app;