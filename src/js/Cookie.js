$(function () {
  $.extend({
    setItem(key, value, delay, path) {
      path = path || "/";
      if (delay) {
        let date = new Date();
        date.setDate(date.getDate() + delay);
        document.cookie = `${key}=${value};expires=${date};path=${path}`;
      } else {
        document.cookie = `${key}=${value};path=${path}`;
      }
    },
    getItem(key) {
      let arr = document.cookie.split("; ");
      for (const iterator of arr) {
        let arrTemp = iterator.split("=");
        if (arrTemp[0] == key) {
          return arrTemp[1];
        }
      }
    },
    removeItem(key) {
      this.setItem(key, "", -1);
    },
    clear() {
      let arr = document.cookie.split("; ");
      for (const iterator of arr) {
        let arrTemp = iterator.split("=");
        this.removeItem(arrTemp[0]);
      }
    }
  })
})


// let Cookie = {
//   setCookie(key, value, delay) {
//     if (delay) {
//       let date = new Date();
//       date.setDate(date.getDate() + delay);
//       document.cookie = key + "=" + value + ";expires=" + date;
//     } else {
//       document.cookie = key + "=" + value;
//     }
//   },
//   getCookie(key) {
//     let arr = document.cookie.split("; ");
//     for (const iterator of arr) {
//       let arrTemp = iterator.split("=");
//       if (arrTemp[0] == key) {
//         return arrTemp[1];
//       }
//     }
//   },
//   removeCookie(key) {
//     this.setCookie(key, "", -1);
//   },
//   clearCookies() {
//     let arr = document.cookie.split("; ");
//     for (const iterator of arr) {
//       let arrTemp = iterator.split("=");
//       this.removeCookie(arrTemp[0]);
//     }
//   }
// };