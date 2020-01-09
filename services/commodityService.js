const db = require('../tools/db.js');

const pageSize = 20;
//获取商品列表
let getLists = async (req, res) => {
  let { classId, mode, page, what } = req.query;
  let maxPage = page * pageSize;
  mode = mode || "default";
  mode = mode == "default" ? "" : "order by " + what + " " + mode;
  let sql = `select * from commodity where classId=? ${mode} limit ${maxPage - pageSize},${pageSize};`;
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
      pageCount: result[0].count / pageSize
    }
  })
}

module.exports = {
  getLists,
  getPageCount
}