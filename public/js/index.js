import { Tab, Tab1 } from './header.js';
import { Banner } from './Banner.js';
import { Floor } from './Floor.js';
$(function () {
  //动态载入头部
  $("header").load("./components/header.html", function () {
    let el = $(this).find(".nav-list");
    let el1 = $(this).find(".nav-list2");
    $.getJSON("./data/data1.json", function (data) {
      new Tab(data, el).init();
    });
    $.getJSON("./data/data2.json", function (data) {
      new Tab1(data, el1).init();
    });
    $.get({
      url: "http://localhost/users/islogined",
      success(res) {
        if (res.status == 1)
          $(".logined").css("display", "block");
        else {
          $(".no-login").css("display", "block");
        }
      }
    })
  });

  //底部
  $("footer").load("./components/footer.html");

  //侧边栏
  $(".sider").load("./components/sider.html");

  //渲染轮播图
  $.getJSON("./data/banner.json", (data) => {
    new Banner(data, $(".banner")).init();
  })

  $.getJSON("./data/data3.json", data => {
    new Floor(data, $(".floors")).init();
  })
})

