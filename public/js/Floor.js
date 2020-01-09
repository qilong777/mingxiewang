class Floor {
  constructor(data, root) {
    this.data = data;
    this.root = root;
  }
  init() {
    this.renderUI();
  }
  renderUI() {
    let html = `
    {{each $data}}
    <div class="floor container">
      <img src={{$value.src}}
        alt="">
      <ul class="data-list clearfix">
      {{each $value.data}}
        <li>
          <a href="#" target="_blank" title={{$value.desc}}>
            <img src={{$value.src}} title={{$value.desc}}>
            <div>
              <p class="p1">{{$value.desc}}</p>
              <p class="p2">
                <span class="price">{{$value.price}}</span>
                <del>{{$value.del}}</del>
                <span class="btn">立即抢购</span>
              </p>
            </div>
          </a>
        </li>
      {{/each}}
      </ul>
    </div>
    {{/each}}
    `;
    this.root.html(template.render(html, this.data));
  }
}
export { Floor }