class Banner {
  constructor(data, root) {
    this.data = data;
    this.root = root;
    this.timer = null;
    this.index = 0;

  }
  init() {
    this.renderUI();
    this.imgLis = this.root.find(".img > li");
    this.btnLis = this.root.find(".btn-list > li");
    this.addTimer();
    this.addEventHandle();
  }
  renderUI() {
    let html = `
      <ul class="img">
      {{each $data}}
        <li class={{$index==0?"active":""}}>
          <a href="#">
            <img src={{$value}} alt="">
          </a>
        </li>
      {{/each}}
      </ul>
      <ul class="btn-list">
      {{each $data}}
        <li class={{$index==0?"active":""}}></li>
      {{/each}}
      </ul>
    `;
    this.root.html(template.render(html, this.data))
  }
  //加入定时器
  addTimer() {
    let length = this.data.length;
    this.timer = setInterval(() => {
      this.imgLis[this.index].className = "";
      this.btnLis[this.index].className = "";
      this.index = (this.index + 1) % length;
      this.imgLis[this.index].className = "active";
      this.btnLis[this.index].className = "active";
    }, 2000)
  }
  addEventHandle() {
    //移入暂停
    this.root.mouseenter(() => {
      clearInterval(this.timer);
      this.timer = null;
    }).mouseleave(() => {
      this.addTimer();
    });
    let self = this;
    this.btnLis.mouseover(function () {
      let index = $(this).index();
      $(this).addClass("active")
        .siblings().removeClass("active");
      self.imgLis[self.index].className = "";
      self.index = index;
      self.imgLis[index].className = "active";

    })
  }
}
export { Banner }