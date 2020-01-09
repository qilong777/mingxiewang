const fs = require("fs");
const path = require('path');

fs.readFile(path.join(__dirname, 'data4.json'), "utf8", (err, data) => {
  if (err) return;
  let list = JSON.parse(data);
  let sqls = list.map((ele, index) => {
    return `insert into commodity(id,classId,name,bigSrc,smallSrc,description,sold,price,del,size) values (${index + 1},1,'休闲鞋','${ele.bigSrc}','${ele.smallSrc}','${ele.desc}',${ele.sell},${ele.price},${ele.del},'${ele.size}');`;
  }).join("\n");
  fs.writeFile(path.join(__dirname, 'data.sql'), sqls, "utf8", () => {
    console.log("写入完成");

  });
})