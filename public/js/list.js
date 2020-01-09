import { Tab, Tab1 } from './header.js';
$(function () {
  //动态载入头部
  $("header").load("../components/header.html", function () {
    let el = $(this).find(".nav-list");
    let el1 = $(this).find(".nav-list2");
    $.getJSON("../data/data1.json", function (data) {
      new Tab(data, el).init();
    });
    $.getJSON("../data/data2.json", function (data) {
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
  $("footer").load("../components/footer.html");

  //侧边栏
  $(".sider").load("../components/sider.html");

  //展开收起功能
  let overdl = $(".select_dl:gt(1)");
  let ocBtn = $(".oc-btn");
  ocBtn.click(function (e) {
    e.preventDefault();
    if ($(this).children("span").text() == "展开") {
      overdl.css("display", "block");
      $(this).children().text("收起").next().addClass("close");
    } else {
      $(this).children().text("展开").next().removeClass("close");
      overdl.css("display", "none");
    }
  });

  //产生商品列表
  let classId = location.search.slice(9) * 1;
  $.get({
    url: "http://localhost/commodities/pageCount",
    data: { classId },
    success(res) {
      let { count, pageCount } = res.data;
      new ProductList(classId, count, pageCount, $(".list-wrapper")).init();
    }
  })

})
class ProductList {
  constructor(classId, count, pageCount, root) {
    //当前商品类别Id
    this.classId = classId;
    //该类商品总数
    this.count = count;
    //该类商品总页数
    this.pageCount = pageCount;
    //当前页码
    this.page = 1;
    //当前排序模式
    this.mode = "default";
    //当前是按什么排序
    this.what = "";
    //根节点
    this.root = root;
    //当前页数据
    this.data = null;
  }
  init() {
    this.getList(this.classId, this.page, this.mode, this.what)
      .then(() => {
        this.renderUI();
        this.addEventHandle();
      });

  }
  renderUI() {
    let html = `
      <!-- 排序 -->
      <div class="sort-box clearfix">
        <p class="fl sort">
          <span>排序方式:</span>
          <a href="#" class="active default">默认排序</a>
          <a href="#" class="price">价格</a>
          <a href="#" class="sell">销量</a>
        </p>
        <p class="fr counts">
          共找到<span>50</span>个商品
        </p>
      </div>
      <ul class="list container clearfix">
        {{each $data}}
        <li class="list-item">
          <div class="wrap">
            <a href="#">
              <img src={{$value.bigSrc}} alt="">
            </a>
            <div class="scroll">
              <span class="prev">&lt;</span>
              <span class="next">&gt;</span>
              <ul class="clearfix">
                <li><img src={{$value.smallSrc}} alt=""></li>
              </ul>
            </div>

          </div>
          <div class="desc">
            <p class="price">
              <span>￥{{$value.price}}</span>
              <del>￥{{$value.del}}</del>
            </p>
            <p>{{$value.description}}</p>
            <p>已售出<i>{{$value.sold}}</i>件</p>
            <p class="size">尺码：{{$value.size}}</p>
          </div>
        </li>
        {{/each}}
      </ul>
      <div class="page-btn-box clearfix">
        <ul class="page-btns">

        </ul>
      </div>
    `;
    this.root.html(template.render(html, this.data));
    this.pageBtns = this.root.find(".page-btns");
    this.sortBtns = this.root.find(".sort-box");
    this.lists = this.root.find(".list");
    if (this.pageCount == 1) {
      this.pageBtns.html(`<li class="active">1</li>`);
    }
    else {
      let html = "<li style='visibility:hidden;'>上一页</li>";
      for (let i = 1; i <= this.pageCount; i++) {
        if (i == 1) {
          html += `<li class="active">${i}</li>`;
        } else {
          html += `<li>${i}</li>`;
        }
      }
      html += "<li>下一页</li>";
      this.pageBtns.html(html);
    }
  }

  renderList() {
    let html = `
    {{each $data}}
    <li class="list-item">
      <div class="wrap">
        <a href="#">
          <img src={{$value.bigSrc}} alt="">
        </a>
        <div class="scroll">
          <span class="prev">&lt;</span>
          <span class="next">&gt;</span>
          <ul class="clearfix">
            <li><img src={{$value.smallSrc}} alt=""></li>
          </ul>
        </div>

      </div>
      <div class="desc">
        <p class="price">
          <span>￥{{$value.price}}</span>
          <del>￥{{$value.del}}</del>
        </p>
        <p>{{$value.description}}</p>
        <p>已售出<i>{{$value.sold}}</i>件</p>
        <p class="size">尺码：{{$value.size}}</p>
      </div>
    </li>
    {{/each}}
    `;
    this.lists.html(template.render(html, this.data));
  }

  getList(classId, page, mode, what) {
    let self = this;
    return new Promise(function (resolve, reject) {
      $.get({
        url: "http://localhost/commodities/commodity",
        dataType: "json",
        data: { classId, page, mode, what },
        success(res) {
          if (res.status === 1) {
            self.data = res.data;
            console.log(self.data);

            resolve();
          } else {
            alert("数据加载失败");
          }
        }
      })
    })

  }

  addEventHandle() {
    let self = this;
    //排序按钮点击
    this.sortBtns.on("click", "a", function (e) {
      let promise;
      e.preventDefault();
      if ($(this).hasClass("default")) {
        $(this).addClass("active").siblings("a").removeClass("active");
        self.mode = "default";
        self.what = "";
        promise = self.getList(self.classId, self.page, self.mode, self.what);
      } else if ($(this).hasClass("price")) {
        self.what = "price";
        $(this).addClass("active").siblings("a").removeClass("active");
        if ($(this).hasClass("asc")) {
          $(this).removeClass("asc");
          self.mode = "desc";
          promise = self.getList(self.classId, self.page, self.mode, self.what);
        } else {
          $(this).addClass("asc");
          self.mode = "asc";
          promise = self.getList(self.classId, self.page, self.mode, self.what);
        }
      } else {
        self.what = "sold";
        $(this).addClass("active").siblings("a").removeClass("active");
        if ($(this).hasClass("asc")) {
          $(this).removeClass("asc");
          self.mode = "desc";
          promise = self.getList(self.classId, self.page, self.mode, self.what);
        } else {
          $(this).addClass("asc");
          self.mode = "asc";
          promise = self.getList(self.classId, self.page, self.mode, self.what);
        }
      }
      promise.then(() => {
        self.renderList();
      })
    });
    let prev = this.pageBtns.find("li:eq(0)");
    let next = this.pageBtns.find("li:eq(-1)");
    this.pageBtns.on("click", "li", function () {
      let index = $(this).index();
      if (index == 0) {
        --self.page;
      } else if (index == self.pageCount + 1) {
        ++self.page;
      } else {
        self.page = index;
      }
      if (self.page == 1) {
        prev.css("visibility", "hidden");
        next.css("visibility", "visible");
      } else if (self.page == self.pageCount) {
        next.css("visibility", "hidden");
        prev.css("visibility", "visible");
      } else {
        prev.css("visibility", "visible");
        next.css("visibility", "visible");
      }
      self.pageBtns.find(`li:eq(${self.page})`).addClass("active")
        .siblings().removeClass("active");
      self.getList(self.classId, self.page, self.mode, self.what)
        .then(() => {
          self.renderList();
        })
    })
  }


}
