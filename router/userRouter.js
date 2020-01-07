const express = require('express');
const router = express.Router();
const service = require('../services/userService.js');

//登录
router.post("/login", service.login);

//注册
router.post("/register", service.register)

//获取验证码图片
router.get("/verifyImg", service.verifyImg)

//获取邮箱验证码
router.get('/verifyEmail', service.verifyEmail);

//测试
router.get("/user", service.getUser)

module.exports = router;