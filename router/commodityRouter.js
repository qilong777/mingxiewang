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

//更新购物车
router.put("/shopCart", service.updateShopCar)

//删除购物车
router.delete("/shopCart", service.deleteShopCar)

//结算购物车
router.delete("/settlement", service.settleMent)

//搜索商品
router.get("/search", service.search)

module.exports = router;