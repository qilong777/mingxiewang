import { Tab, Tab1 } from './header.js';
$(function () {
  //动态载入头部
  $("header").load("./components/header.html", function () {
    let el = $(this).find(".nav-list");
    let el1 = $(this).find(".nav-list2");
    console.log(el1);

    $.getJSON("./data/data1.json", function (data) {
      new Tab(data, el).init();
    });
    $.getJSON("./data/data2.json", function (data) {
      new Tab1(data, el1).init();
    });
  });


})