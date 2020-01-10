const express = require('express');
const router = express.Router();
const service = require('../services/commodityService.js');

//获取一页商品
router.get("/commodity", service.getLists);

//获取页数
router.get("/pageCount", service.getPageCount);

//获取商品详情
router.get("/detail", service.getDetail)

//获取用户购物车
router.get("/shopCart", service.getShopCar)

//添加购物车
router.post("/shopCart", service.addShopCar)

module.exports = router;