const getRandom = (playlistLength:number) => {
  return Math.floor(Math.random()*playlistLength)
}

export default getRandom