export function saveToLocal(id, key, value) {
  // 双下划线表示私有，localStorage存储的都是json字符串
  let seller = window.localStorage.__seller__
  // 从来没有创建seller时
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 解析成对象
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
