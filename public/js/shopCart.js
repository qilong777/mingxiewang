import { Init } from './init.js';

$(function () {
  Init();

  $.get({
    url: "http://localhost/commodities/shopCart",
    success(res) {
      console.log(res.data);
      if (res.status == 0) {
        $(".msg").show();
        $(".wrap").hide();
      } else {
        new ShopCart(res.data, $(".wrap")).init();
      }

    }
  })
})

class ShopCart {
  constructor(data, root) {
    this.data = data;
    this.root = root;
  }
  init() {
    Object.defineProperty(this, "num", {
      get() {
        return this.data.reduce((total, ele) => {
          if (ele.isSelect) {
            return total + ele.count;
          }
          else {
            return total;
          }
        }, 0)
      }
    });
    Object.defineProperty(this, "allNum", {
      get() {
        return this.data.reduce((total, ele) => {
          return total + ele.count;
        }, 0)
      }
    });
    Object.defineProperty(this, "total", {
      get() {
        let total = this.data.reduce((total, ele) => {
          if (ele.isSelect) {
            return total + ele.price * ele.count;
          } else {
            return total;
          }
        }, 0)
        return (total + 0.00).toFixed(2);
      }
    });
    for (let i = 0; i < this.data.length; i++) {
      const ele = this.data[i];
      Object.defineProperty(ele, "xiaoji", {
        get() {
          return (ele.count * ele.price + 0.00).toFixed(2);
        }
      })
    }
    this.renderUI();
    this.addEventHandle();
  }
  renderUI() {
    let html = `
    <p>我的购物车</p>
    <div class="cart-header">
      <div><input class="allSelect" type="checkbox"></div>
      <span class="first">商品信息</span>
      <span>赠送积分</span>
      <span>销售价格</span>
      <span>数量</span>
      <span>折扣/优惠</span>
      <span>小计</span>
      <span>操作</span>
    </div>
    {{if $data.length==0}}
      <p class="warning">购物车还是空的，还不快点去剁手！！！</p>

    {{else if $data.length!=0}}
    <ul class="cart-body">
    {{each $data}}
      <li>
        <div class="checkbox"><input {{$value.isSelect==1?'checked':''}} type="checkbox"></div>
        <div class="first">
          <a href="#" class="img">
            <img width="50" height="50" src={{$value.bigSrc}} alt="">
            <img class="big-img" src={{$value.bigSrc}} alt="">
          </a>
          <a href="#" class="desc">
            <span class="name">
            {{$value.name}}
            </span>
            <span class="info">
              (尺码:{{$value.selectSize}},颜色:{{$value.color}} )
            </span>
          </a>
        </div>
        <div>0</div>
        <div>￥<span>{{($value.price+0.00).toFixed(2)}}</span></div>
        <div class="btns clearfix">
          <a href="#" class="fl">-</a>
          <input type="text" class="fl" value={{$value.count}}>
          <a href="#" class="fl">+</a>
        </div>
        <div>-</div>
        <div>￥<span class="xiaoji">{{$value.xiaoji}}</span></div>
        <div><a href="#" class="del">删除</a></div>
      </li>
      {{/each}};
    </ul>
    <div class="cart-footer clearfix">
        <p>已选商品数量：<span class="num">${this.num}</span></p>
        <p>商品总金额：<span class="total">￥${this.total}</span></p>

        <a href="#" class="settlement">下单结算</a>
    </div>
    {{/if}}
    `;
    this.root.html(template.render(html, this.data));
    this.allSelect = $(".allSelect");
    this.$num = $(".num");
    this.$total = $(".total");

    if (this.isAllSelect()) {
      this.allSelect.prop("checked", true);
    }


  }

  addEventHandle() {
    let self = this;
    //复选框点击事件
    this.root.on("click", "input[type=checkbox]", function () {
      let select = $(this).prop("checked") ? 1 : 0;
      if ($(this).hasClass("allSelect")) {
        $("input[type=checkbox]").prop("checked", select);
        self.data.forEach(ele => {
          ele.isSelect = select;
          self.updateSQL(ele.commodityId, ele.count, ele.selectSize, ele.isSelect);
        });
      } else {
        let index = $(this).parents("li").index();
        self.data[index].isSelect = select;
        self.allSelect.prop("checked", self.isAllSelect());
        self.updateSQL(self.data[index].commodityId, self.data[index].count, self.data[index].selectSize, self.data[index].isSelect);
      }
      self.$num.text(self.num);
      self.$total.text("￥" + self.total);
    })

    //+-按钮点击事件
    this.root.on("click", ".btns a", function (e) {
      e.preventDefault();
      let parent = $(this).parents("li");
      let index = parent.index();
      if ($(this).text() == "-") {
        if (self.data[index].count <= 1) {
          return;
        }
        $(this).next().val(--self.data[index].count);
      } else {
        $(this).prev().val(++self.data[index].count);
      }
      parent.find(".xiaoji").text((self.data[index].count * self.data[index].price + 0.00).toFixed(2));
      self.updateSQL(self.data[index].commodityId, self.data[index].count, self.data[index].selectSize, self.data[index].isSelect);
      self.$num.text(self.num);
      $(".cart-num").text(self.allNum);
      self.$total.text("￥" + self.total);
    })

    //删除操作
    this.root.find(".del").click(function (e) {
      e.preventDefault();
      if (confirm("是否要删除？")) {
        let parent = $(this).parents("li");
        let index = parent.index();
        let data = self.data.splice(index, 1)[0];
        parent.remove();
        self.deleteSQL(data.commodityId, data.selectSize);
        self.$num.text(self.num);
        $(".cart-num").text(self.allNum);
        self.$total.text("￥" + self.total);
      }
    })

    //结算按钮
    this.root.find(".settlement").click(function (e) {
      e.preventDefault();
      let list = self.data.filter(ele => ele.isSelect == 1);
      if (list.length == 0) {
        alert("未选择购买商品，请选择");
        return;
      }
      self.settleMent();

    })
  }

  //判断是否都选择了
  isAllSelect() {
    return this.data.every(ele => ele.isSelect == 1)
  }

  //修改
  updateSQL(commodityId, count, selectSize, isSelect) {
    $.ajax({
      type: "put",
      url: "http://localhost/commodities/shopCart",
      data: {
        commodityId, count, selectSize, isSelect
      },
      success(res) {
        if (res.status != 1) {
          alert(res.msg);
          location.reload();
        }
      }
    })
  }

  //删除
  deleteSQL(commodityId, selectSize) {
    $.ajax({
      type: "delete",
      url: "http://localhost/commodities/shopCart",
      data: {
        commodityId, selectSize
      },
      success(res) {
        if (res.status != 1) {
          alert(res.msg);
          location.reload();
        }
      }
    })
  }

  //结算
  settleMent() {
    let self = this;
    $.ajax({
      type: "delete",
      url: "http://localhost/commodities/settlement",
      success(res) {
        if (res.status == 1) {
          alert("恭喜你剁手成功,一共花费" + self.total);
        } else {
          alert(res.msg);
        }
        location.reload();
      }
    })
  }
}