const fs = require("fs");
const path = require('path');
fs.readFile(path.join(__dirname, 'data.json'), "utf8", (err, data) => {
  if (err) return;
  let list = JSON.parse(data);
  let sqls = list.map(ele => {
    return `insert into booklist(name,author,category,description) values ('${ele.name}','${ele.author}','${ele.category}','${ele.description}');`
  }).join("\n");
  fs.writeFile(path.join(__dirname, 'data.sql'), sqls, "utf8", () => {
    console.log("写入完成");

  });
})