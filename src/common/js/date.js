export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    // RegExp.$1为第一个子匹配
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let args = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (var key in args) {
    // 用args的key值新建正则表达式，来匹配传过来的日期格式'yyyy-MM-dd hh-mm-ss'
    if (new RegExp(`(${key})`).test(fmt)) {
      let str = args[key] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
// 左边补0，MM可能是2位，也可能是1位，如果是2位的话，1-9月份就要在前面补0
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
