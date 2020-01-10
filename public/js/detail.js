import { Tab, Tab1 } from './header.js';
//放大镜代码
(function ($) {
  $.fn.extend({
    magnifier() {
      this.each(function () {
        let float = $(".float", this),
          right = $(".detail-bigimg img", this),
          rightBox = $(".detail-bigimg", this);
        $(".detail-img", this).mousemove(function (e) {
          let x = e.offsetX,
            y = e.offsetY;
          x = x - float.width() / 2;
          y = y - float.height() / 2;
          if (x < 0) {
            x = 0;
          } if (y < 0) {
            y = 0;
          }
          if (x > $(this).width() - float.width()) {
            x = $(this).width() - float.width()
          }
          if (y > $(this).height() - float.height()) {
            y = $(this).height() - float.height()
          }
          float.css({
            top: y,
            left: x
          })
          right.css({
            top: y * -2 + "px ",
            left: x * -2 + "px"
          })
        }).mouseover(function () {
          float.css({ display: "block" });
          rightBox.show();
        }).mouseout(function () {
          float.css({ display: "none" });
          rightBox.hide();
        })
      })
    }
  })
})(jQuery)

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


  $.get({
    url: "http://localhost/commodities/detail",
    data: { id: location.search.slice(4) },
    success(res) {
      if (res.status == 1) {
        $(".detail-img img,.detail-bigimg img").attr("src", res.data.bigSrc);
        $(".img-select img").attr("src", res.data.smallSrc);
        $(".detail-left").magnifier();
        new Detail(res.data, $(".detail-right")).init();
      } else {
        alert(res.msg);
        location.href = "http://localhost/html/list.html?classId=" + res.data;
      }

    }
  })
})

class Detail {
  constructor(data, root) {
    this.data = data;
    this.root = root;

  }
  init() {
    this.data.size = this.data.size.split("、");
    this.renderUI();
    this.addEventHandle();
  }
  //渲染UI
  renderUI() {
    let html = `
        <div class="name">
          <span class="more-brand">更多<a href="#">{{$data.brand}}</a></span>
          <h1 class="goods-name">{{$data.name}}</h1>
          <div class="sp"></div>
        </div>
        <div class="goods-price">
          <p>
            <span>吊&nbsp;&nbsp;牌&nbsp;&nbsp;价：</span><del>￥{{$data.del}}</del>
          </p>
          <p> <span> 销&nbsp;&nbsp;售&nbsp;&nbsp;价： </span> <span class="price">￥{{$data.price}}</span>
            &nbsp;&nbsp;(&nbsp;5.0折&nbsp;)&nbsp;&nbsp; <span class="discount price_com">立省： ￥150.00 </span>
          </p>
          <p>
            好&nbsp;&nbsp;评&nbsp;&nbsp;度：&nbsp;&nbsp;<span class="comCountBar"><i class="comment"></i></span>&nbsp;&nbsp;{{$data.score}}分
            &nbsp;&nbsp;(<a href="#commentTips" class="comCount">已有{{$data.commentCount}}人评论</a>)
          </p>
          <p>
            运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：&nbsp;&nbsp;名鞋库会员满399包邮&nbsp;&nbsp;(&nbsp;不包括货到付款&nbsp;)
          </p>
          <p style="color:#ff8383">温馨提示：本款不支持货到付款</p>
        </div>
        <div class="push-sale">
          <div class="wrap clearfix">
            <div class="t">促销信息</div>
            <div class="scon"> 满300减30 满600减60&nbsp;&nbsp;限购3件 </div>
          </div>
        </div>
        <div class="select-box">
          <p class="clearfix size">
            <span>尺码：</span>
            {{each $data.size}}
            <a href="#" class={{$index==0?"selected":""}}>{{$value}}<i class="gou"></i></a>
            {{/each}}
          </p>
          <p class="clearfix">
            <span>颜色：</span>
            <a href="#" class="img selected">
              <img src={{$data.smallSrc}} alt="">
              <i class="gou"></i>
            </a>
          </p>
          <p class="clearfix btns">
            <span>购买数量：</span>
            <a href="#" class="sub">-</a>
            <input type="text" class="num" value="1">
            <a href="#" class="add">+</a>
            <button></button>
          </p>
        </div>
        <div class="sp"></div>
        <div class="buy-btns">
          <p>
            <span class="spec-tip">
              您将购买<span class="buy-num">1</span>件
              <span class="buy-cm">42</span>码&nbsp;<span class="color">黑色+白色</span>
            </span>
          </p>
          <div class="btn-box">
            <a href="#" class="im-buy"></a>
            <a href="#" class="add-cart"></a>
          </div>
        </div>
        <div class="sp"></div>
        <div class="promise">
          <i>名鞋库保障：</i>&nbsp;<img src="//images.s.cn/statics/zheng.png">&nbsp;正品认证&nbsp;&nbsp;&nbsp;&nbsp;<img
            src="//images.s.cn/statics/tui.png">&nbsp;自由退货&nbsp;&nbsp;&nbsp;&nbsp;<img
            src="//images.s.cn/statics/mian.png">&nbsp;全场满399免邮
        </div>
    `;
    this.root.html(template.render(html, this.data));
    let score = Math.round(this.data.score);
    this.root.find(".comment").css("background-position", score * 12 - 159 + "px -178px")
    this.size = this.root.find(".size");
    this.btns = this.root.find(".btns");
    this.cartBtns = this.root.find(".btn-box");
    this.buyNumText = this.root.find(".buy-num");
    this.buyCm = this.root.find(".buy-cm");
    this.buyNumInput = this.root.find(".num");

    //zb
    let num = 1;
    Object.defineProperty(this, "buyNum", {
      set: function (val) {
        this.buyNumInput.val(val);
        this.buyNumText.text(val);
        num = val;
      },
      get: function () {
        return num;
      }
    });

  }

  //添加点击事件
  addEventHandle() {
    let self = this;
    //选择尺码的点击事件
    this.size.on("click", "a", function () {
      $(this).addClass("selected").siblings("a").removeClass("selected");
      self.buyCm.text($(this).text());
    });

    //+-点击事件
    this.btns.on("click", "a", function () {
      if ($(this).text() == "-" && self.buyNum > 1) {
        self.buyNum--;
      } else if ($(this).text() == "+" && self.buyNum < 20) {
        self.buyNum++;
      }
    })

    //输入事件
    this.buyNumInput[0].oninput = function (e) {
      e = e || window.event;
      if (!/\d/.test(e.data) && e.data != null) {
        self.buyNum = self.buyNum;
      }
      if (this.value * 1 < 1) {
        self.buyNum = 1;
      } else if (this.value * 1 > 20) {
        self.buyNum = 20;
      } else {
        self.buyNum = this.value;
      }
    }

    //加入购物车事件
    this.cartBtns.on("click", "a", function () {
      if ($(this).hasClass("im-buy")) {
        alert("暂无此功能，敬请等待，反正我不做!");
      } else {
        // $.post()
      }
    })
  }
}
