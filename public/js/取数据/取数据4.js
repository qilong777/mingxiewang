//获取商品列表的数据
var list = document.querySelectorAll(".product_list dl");

var arr = [];
for (let i = 0; i < list.length; i++) {
  const ele = list[i];
  var obj = {};
  obj.bigSrc = ele.querySelector("dt img").src;
  obj.smallSrc = ele.querySelectorAll("dt img")[1].src;
  obj.price = ele.querySelector(".price").innerText.slice(1) * 1;
  obj.del = ele.querySelector(".del_price").innerText.slice(1) * 1;
  obj.desc = ele.querySelector(".r2").innerText;
  obj.sell = ele.querySelector(".r3 i").innerText * 1;
  obj.size = ele.querySelector(".r4").innerText.slice(3);
  arr.push(obj);
}
console.log(JSON.stringify(arr));

