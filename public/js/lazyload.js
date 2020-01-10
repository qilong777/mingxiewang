let lazyLoading = function () {
  var $window = $(window);
  var lazyImgs = $('img[data-src]');
  // 定义事件函数:
  var onScroll = function () {
    // 获取页面滚动的高度:  scrollTop()获取匹配元素相对滚动条顶部的偏移。
    var wtop = $window.scrollTop();//页面滚动的高度就是窗口顶部与文档顶部之间的距离，也就是滚动条滚动的距离

    // 获取可视区域高度:
    var wheight = $window.height();
    // 循环处理数组的每个img元素:

    for (let i = 0; i < lazyImgs.length; i++) {
      const ele = lazyImgs.eq(i);
      if (ele.offset().top - wtop < wheight) {  //$.offset().top获取匹配元素距离文本文档顶的距离。
        if (ele.attr("src") != ele.attr("data-src")) {
          ele.attr('src', ele.attr('data-src'));
          lazyImgs.splice(i, 1);
          i--;
        }
      }
    }

    if (lazyImgs.length <= 0) {
      window.onscroll = null;
    }
  };
  // 绑定事件:
  window.onscroll = onScroll;
  // 手动触发一次:
  onScroll();
}