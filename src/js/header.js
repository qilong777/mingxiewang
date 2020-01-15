
class Tab {
  constructor(data, root) {
    this.data = data;
    this.root = root;
  }
  init() {
    this.renderUI();
    this.addEventHandle();
  }
  renderUI() {
    let html = `
    <li class="all">
      所有商品分类
      <ul class="all-list">
        {{each $data}}
        <li class="all-item">
          <span class={{'icon' + $index}}></span>
          <a href="#">{{$value.title}}</a>
          <i></i>
          <div class="item-list" style="top:{{-$index*43 + 'px'}}">
          {{each $value.data}}
            <div>
              <h3 class="title {{$value.hasBg?'':'no-bg'}}">
                <a target="_blank" href="#" style="background-position:{{$value.x + 'px ' + $value.y + 'px'}}">
                  {{$value.title}}
                </a>
                <a target="_blank" href="#" class="more">
                  更多
                </a>
              </h3>
              <p class="category-label-list">
              {{each $value.list}}
                <a target="_blank" class={{$value.isRed?'hight-light':''}}>
                {{$value.name}}
                </a>
              {{/each}}
              </p>
            </div> 
          {{/each}}
          </div>
        </li>
        {{/each}}
      </ul>
    </li>
    `;
    this.root.prepend(template.render(html, this.data));
  }
  addEventHandle() {
    let rootLi = this.root.find(".all");
    let ul = this.root.find(".all-list");
    rootLi.hover(function () {
      ul.addClass("active");
    }, function () {
      ul.removeClass("active");
    });
    ul.find(".all-item").hover(function () {
      $(this).addClass("active");
    }, function () {
      $(this).removeClass("active");
    })

  }
}

class Tab1 {
  constructor(data, root) {
    this.data = data;
    this.root = root;
  }
  init() {
    this.renderUI();
    this.addEventHandle();
  }
  renderUI() {
    let html = `
    <ul>
      <li class="active"><a href="http://localhost" class="first item">首页</a></li>
      {{each $data}}
      <li class="li-item">
        <a href="#" class="item">{{$value.title}}</a>
        <ul class="show-list clearfix">
          {{each $value.data}}
          <li class={{$index==2?"brand":""}}>
            <h4>{{$value.title}}</h4>
            <p>
            {{each $value.list}}
              {{if $value.includes("http")}}
                <a href="#"><img src={{$value}}></a>
              {{else}}
                <a href="http://localhost/html/list.html?classId=1">{{$value}}</a>
              {{/if}}
            {{/each}}
            </p>
          </li>
          {{/each}}
        </ul>
      </li>
      {{/each}}
      <li class="li-item"><a href="#" class="item">配件</a></li>
    </ul>
    `;
    this.root.html(template.render(html, this.data));
  }
  addEventHandle() {
    this.root.children("ul").on("mouseover", ".li-item", function () {
      $(this).addClass("active");
    }).on("mouseout", ".li-item", function () {
      $(this).removeClass("active");
    })
  }
}

export { Tab, Tab1 }