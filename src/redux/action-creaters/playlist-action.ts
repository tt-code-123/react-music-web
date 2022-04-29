import { removeDuplicate } from '@/utils'
import { DELETE_DEFAULT_PLAYLIST, SAVE_DEFAULT_PLAYLIST, SAVE_SORT_DEFAULT_PLAYLIST } from '../action-types'
import { DefaultPlaylistType } from '../type'

export const saveDefaultPlaylistAction = (value: DefaultPlaylistType) => {
  const preDefaultPlaylist = localStorage.getItem('defaultPlaylist')
  const defaultPlaylist = preDefaultPlaylist ? [...value, ...JSON.parse(preDefaultPlaylist)] : [...value]
  const newArr = removeDuplicate(defaultPlaylist)
  localStorage.setItem('defaultPlaylist', JSON.stringify(newArr))
  return { type: SAVE_DEFAULT_PLAYLIST, data: value }
}
export const deleteDefaultPlaylistAction = (value: DefaultPlaylistType) => {
  if (value.length === 0) {
    localStorage.removeItem('defaultPlaylist')
  } else {
    const preDefaultPlaylist = localStorage.getItem('defaultPlaylist')
    const defaultPlaylist = preDefaultPlaylist ? [...JSON.parse(preDefaultPlaylist)] : []
    for (let i = 0; i < defaultPlaylist.length; i++) {
      for (let j = 0; j < value.length; j++) {
        if (defaultPlaylist[i] === value[j]) {
          defaultPlaylist.splice(i, 1)
          i--
        }
      }
    }
    localStorage.setItem('defaultPlaylist', JSON.stringify(defaultPlaylist))
  }
  return { type: DELETE_DEFAULT_PLAYLIST, data: value }
}
export const saveSortDefaultPlaylistAction = (value: DefaultPlaylistType) => {
  const defaultPlaylist = [...value]
  localStorage.setItem('defaultPlaylist', JSON.stringify(defaultPlaylist))
  return { type: SAVE_SORT_DEFAULT_PLAYLIST, data: value }
}
