const formateNum = (num:number) => {
  const number = (num / 10000).toFixed(1)
  return number + 'W'
}

export default formateNum