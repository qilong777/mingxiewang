//获取首页楼层数据
var floors = document.querySelectorAll(".product_list")

var arr = [];
for (let i = 0; i < floors.length; i++) {
  const ele = floors[i];
  let obj = {};
  obj.src = "";
  let arr1 = [];
  let lists = ele.querySelectorAll("dl");

  for (let i = 0; i < lists.length; i++) {
    const ele = lists[i];
    let obj = {};
    obj.src = ele.querySelector("img").src;
    obj.desc = ele.querySelector(".r2").innerText;
    obj.price = ele.querySelector(".price").innerText;
    obj.del = ele.querySelector(".del_price").innerText;
    arr1.push(obj);
  }
  obj.data = arr1;
  arr.push(obj);
}
console.log(JSON.stringify(arr));

