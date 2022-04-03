const removeDuplicate = (arr: string[]) => {
  const newArr = []

  arr.forEach((item) => {
    if (newArr.indexOf(item) === -1) {
      newArr.push(item)
    }
  })
  return newArr // 返回一个新数组
}

export default removeDuplicate
