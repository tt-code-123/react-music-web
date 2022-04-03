export interface LyricsType {
  content: string
  time: number
}
// [00:31.160]如果场景里出现一架钢琴
const parseExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
const exp = /\\r/g
const parseLyrics = (lyricString: string):LyricsType[] => {
  const lineStrings = lyricString.replace(exp,"").trim()
  const lineStringArr = lineStrings.split("\\n");

  const lyrics = [];
  for (let line of lineStringArr) {
    if (line) {
      const result = parseExp.exec(line);
      if (!result) continue;
      const time1 = result[1] as unknown as number * 60 * 1000;
      const time2 = result[2] as unknown as number * 1000;
      const time3 = result[3].length === 3? result[3] as unknown as number* 1: result[3]as unknown as number *10;
      const time = time1 + time2 + time3;
      const content = line.replace(parseExp, "").trim();
      if (content !== '') {
        const lineObj = { time, content };
        lyrics.push(lineObj);
      }
    }
  }
  return lyrics;
}

export default parseLyrics