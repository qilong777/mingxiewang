var div = document.querySelectorAll(".wnav_pop");
var arr = [];
for (let i = 0; i < 3; i++) {
  const ele = div[i];
  // console.log(ele);

  let obj = {};
  obj.title = "男子运动";
  let arr1 = [];
  let lis = ele.querySelectorAll('li');
  // console.log(lis);

  for (let i = 0; i < 3; i++) {
    const ele = lis[i];
    let obj = {};
    obj.title = ele.querySelector("h4").textContent;
    console.log(obj.title);

    let data = [];
    let as = ele.querySelectorAll("a");
    if (i == 2) {
      for (let i = 0; i < as.length; i++) {
        const ele = as[i];
        data.push(ele.children[0].src + "");
      }
    } else {
      for (let i = 0; i < as.length; i++) {
        const ele = as[i];
        data.push(ele.textContent);
      }
    }

    obj.list = data;
    arr1.push(obj);
  }
  obj.data = arr1;
  arr.push(obj);
}
console.log(JSON.stringify(arr));
