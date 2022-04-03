import { getLikeMusicByUserId } from '@/api'
import { SAVE_LIKE_PLAYLIST } from '../action-types'

const changeSongDetailAction = (likeArr: string[]) => {
  return {
    type: SAVE_LIKE_PLAYLIST,
    data: likeArr,
  }
}

export const saveLikePlaylistAction = (value: string) => {
  return async (dispatch) => {
    if (value) {
      const data = await getLikeMusicByUserId(value)
      dispatch(changeSongDetailAction(data.data.like_music))
    } else {
      dispatch(changeSongDetailAction([]))
    }
  }
}
