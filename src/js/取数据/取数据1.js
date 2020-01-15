//去所有商品分类选项卡数据
var divs = document.querySelectorAll(".sub-pannel-ctn");
var arr = [];
for (let i = 0; i < divs.length; i++) {
  let ele = divs[i];
  let obj = {}
  let list = ele.querySelectorAll("div");
  let arr1 = [];
  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    let obj = {};
    let h3 = ele.querySelector("h3");
    if (h3.classList.contains("category-nobg")) {
      obj.hasBg = false;
    } else {
      obj.hasBg = true;
    }
    let title = h3.children[0].textContent.trim();
    obj.title = title;

    let ptext = ele.querySelector("p").textContent;

    ptext = ptext.trim();
    ptext.replace(/\s+/g, " ");
    let data = ptext.split(" ");
    let list1 = [];
    for (let i = 0; i < data.length; i++) {
      const ele = data[i];
      list1.push({
        isRed: false,
        name: ele
      })
    }
    obj.list = list1;
    arr1.push(obj);
  }
  obj.title = "运动休闲鞋";
  obj.data = arr1;
  arr.push(obj);
}

console.log(JSON.stringify(arr));
