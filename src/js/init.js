import { Tab, Tab1 } from './header.js';
let Init = function () {

  $("header").load("http://localhost/components/header.html", function () {
    let el = $(this).find(".nav-list");
    let el1 = $(this).find(".nav-list2");
    $.getJSON("http://localhost/data/data1.json", function (data) {
      new Tab(data, el).init();
    });
    $.getJSON("http://localhost/data/data2.json", function (data) {
      new Tab1(data, el1).init();
    });
    new Promise(function (resolve, reject) {
      $.get({
        url: "http://localhost/users/islogined",
        success(res) {
          if (res.status == 1) {
            $(".logined").css("display", "block");
            $("#uname a").text(res.data);
            resolve();
          }
          else {
            $(".no-login").css("display", "block");
          }
        }
      })
    }).then(function () {
      $.get({
        url: "http://localhost/commodities/shopCart",
        success(res) {
          if (res.status == 1) {
            let count = 0;
            res.data.forEach(ele => {
              count += ele.count;
            });
            $(".cart-num").text(count);
          }
        }
      })
    })



  });

  //底部
  $("footer").load("http://localhost/components/footer.html");

  //侧边栏
  $(".sider").load("http://localhost/components/sider.html");


}

export { Init };