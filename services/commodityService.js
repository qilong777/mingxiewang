const db = require('../tools/db.js');

const pageSize = 20;
//获取商品列表
let getLists = async (req, res) => {
  let { classId, mode, page, what } = req.query;
  let maxPage = page * pageSize;
  mode = mode || "default";
  mode = mode == "default" ? "" : "order by " + what + " " + mode;
  let sql = `select id,className,bigSrc,smallSrc,description,sold,price,del,size from commodity where classId=? ${mode} limit ${maxPage - pageSize},${pageSize};`;
  let data = [classId];
  let result = await db.base(sql, data);
  if (result) {
    res.send({
      status: 1,
      msg: "查询成功",
      data: result
    });
  }
  else {
    res.send({
      status: 0,
      msg: "查询失败"
    });
  }
}

//获取页数和该类商品总数
let getPageCount = async (req, res) => {
  let { classId } = req.query;
  let sql = `select count(*) as count from commodity where classId=?`;
  let data = [classId];
  let result = await db.base(sql, data);
  res.send({
    status: 1,
    msg: "获取页数成功",
    data: {
      count: result[0].count,
      pageCount: Math.ceil(result[0].count / pageSize)
    }
  })
}

//获取商品详情
let getDetail = async (req, res) => {
  let { id } = req.query;
  let sql = `select classId,name,bigSrc,smallSrc,del,price,score,commentCount,size,color,brand from commodity where id=?`;
  let data = [id];
  let result = await db.base(sql, data);
  if (result.length == 1 && result[0].name != null) {
    res.send({
      status: 1,
      msg: "获取商品详情成功",
      data: result[0]
    })
  } else {
    res.send({
      status: 0,
      msg: "尚未导入该商品数据，我不是数据库大神，sorry，请去点击休闲鞋前两个数据，谢谢合作",
      data: result[0].classId
    })
  }

}


//获取用户购物车
let getShopCar = async (req, res) => {
  // let username = req.session.username;
  let username = "qilong3";
  if (username == undefined) {
    res.send({
      status: 0,
      msg: "用户尚未登录"
    })
    return;
  }
  let sql = `select name,bigSrc,price,count,selectSize,color 
  from shopCart,commodity
  where username=? and shopCart.commodityId = commodity.id;`;
  let data = [username];
  let result = await db.base(sql, data);
  res.send({
    status: 1,
    msg: "获取购物车数据成功",
    data: result
  })
}

//获取添加购物车
let addShopCar = async (req, res) => {
  // let username = req.session.username;
  let username = "qilong3";
  if (username == undefined) {
    res.send({
      status: 0,
      msg: "用户尚未登录"
    })
    return;
  }
  let { commodityId, count, selectSize } = req.body;
  commodityId *= 1;
  count *= 1;
  let sql = `select count from shopCart where username=? and commodityId=? and selectSize=?`;
  let data = [username, commodityId, selectSize];
  let result = await db.base(sql, data);


  if (result.length == 1) {
    sql = `update shopCart set count=${count + result[0].count} where username=? and commodityId=? and selectSize=?;`
  } else {
    sql = `insert into shopCart set?`;
    data = { username, commodityId, count, selectSize };
  }
  result = await db.base(sql, data);
  if (result.affectedRows == 1) {
    res.send({
      status: 1,
      msg: "加入购物车成功"
    })
  } else {
    res.send({
      msg: "加入购物车失败",
      status: -1
    })
  }
}

module.exports = {
  getLists,
  getPageCount,
  getDetail,
  getShopCar,
  addShopCar
}