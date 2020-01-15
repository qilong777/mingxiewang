const express = require("express");
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/userRouter.js');
const commodityRouter = require('./router/commodityRouter.js');
// const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src"));

//配置express-session
app.use(session({
  name: 'sessionId',
  //加密
  secret: 'qilong#!4396',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));

app.use(cookieParser());


app.use("/users", userRouter);
app.use("/commodities", commodityRouter);

app.listen(80, () => {
  console.log("服务器已开启");
})
