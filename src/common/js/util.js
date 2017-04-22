/**
*解析url参数
*@example ?id=12345&a=b
*@return Object {id:12345,a:b}
*/
export function urlParse() {
  let url = window.location.search
  let obj = {}
  // ?或者&然后是非？和&的字符一个或多个
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      // 从下标1开始知道结尾
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
