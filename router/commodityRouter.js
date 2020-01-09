const express = require('express');
const router = express.Router();
const service = require('../services/commodityService.js');

//获取一页商品
router.get("/commodity", service.getLists);

//获取页数
router.get("/pageCount", service.getPageCount);

module.exports = router;