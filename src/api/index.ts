import { AxiosResponse } from 'axios'
import request from './request'
import { BASE_URL } from '../config/index'
import {
  AlbumByAlbumId,
  AlbumBySingerId,
  DynamicInfoType,
  MusicByAlbumId,
  MusicByIdArrType,
  MusicByIdType,
  MusicBySingerId,
  MusicIdByAlbumId,
  OtherAlbum,
  PlaylistType,
  RecommendAlbum,
  SeachResponseType,
  SeachSuggestResponseType,
  SingerAllType,
  SingerById,
  SingerType,
  UserInfoType,
  UserLikeMusicType,
} from './type'

// 获取音乐列表
export const getMusicList = (pageNum: number, pageSize: number) => request.get(`${BASE_URL}/music/list`, { params: { pageNum, pageSize } })

// 登录请求
export const login = (username: string, password: string) => request.post(`${BASE_URL}/user/login`, { username, password })

// 注册请求
export const register = (username: number, password: number) => request.post(`${BASE_URL}/user/register`, { username, password })

// 获取轮播图图片url
export const getBannerUrl = () => request.get(`${BASE_URL}/image/banner`)

// 获取专辑轮播图图片url
export const getAlbumBannerUrl = () => request.get(`${BASE_URL}/image/albumBanner`)

// 和获取tages图片url
export const getTageUrl = () => request.get(`${BASE_URL}/image/tage`)

// 获取推荐歌单
export const getRecommendPlaylist = (pageNum?: number, pageSize?: number): Promise<PlaylistType> =>
  request.get(`${BASE_URL}/playlist/recommend`, { params: { pageNum, pageSize } })

// 获取推荐专辑
export const getRecommendAlbum = (pageNum?: number, pageSize?): Promise<RecommendAlbum> =>
  request.get(`${BASE_URL}/album/recommend`, { params: { pageNum, pageSize } })

// 获取推荐歌手
export const getRecommendSinger = (): Promise<AxiosResponse<SingerType[], any>> => request.get(`${BASE_URL}/singer/recommend`)

// 搜索歌手、歌曲接口
export const getSearchAll = (inputValue: string, pageNum: number = 1, pageSize: number = 15): Promise<SeachResponseType> => {
  return request.get(`${BASE_URL}/search/all`, { params: { inputValue, pageSize, pageNum } })
}
// 搜索联想接口
export const getSearchSuggest = (keywords: string): Promise<SeachSuggestResponseType> => {
  return request.get(`${BASE_URL}/search/suggest`, { params: { keywords } })
}

// 根据歌曲id获取歌曲
export const getMusicById = (_id: string): Promise<MusicByIdType> => request.get(`${BASE_URL}/music/songId/?_id=${_id}`)

// 根据歌手id获取歌手信息
export const getSingerById = (_id: string): Promise<SingerById> => request.get(`${BASE_URL}/singer/singerId/?_id=${_id}`)

// 根据国籍、性别、获取歌手信息
export const getSingerByOther = (
  initial: string,
  language: string,
  gender: string,
  pageNum: number = 1,
  pageSize: number = 12,
): Promise<SingerAllType> => {
  return request.get(`${BASE_URL}/singer/list`, { params: { initial, language, gender, pageNum, pageSize } })
}

// 根据歌手id获取歌曲信息
export const getMusicBySingerId = (_id: string, pageNum: number = 1, pageSize: number = 10): Promise<MusicBySingerId> => {
  return request.get(`${BASE_URL}/music/artistId`, { params: { _id, pageNum, pageSize } })
}

// 根据歌手id获取专辑信息
export const getAlbumBySingerId = (_id: string, pageNum: number = 1, pageSize: number = 5): Promise<AlbumBySingerId> => {
  return request.get(`${BASE_URL}/album/artistId`, { params: { _id, pageNum, pageSize } })
}

// 根据专辑id获取专辑信息
export const getAlbumByAlbumId = (_id: string): Promise<AlbumByAlbumId> => {
  return request.get(`${BASE_URL}/album/albumId/?_id=${_id}`)
}

// 根据专辑id获取歌曲信息
export const getMusicByAlbumId = (_id: string): Promise<MusicByAlbumId> => {
  return request.get(`${BASE_URL}/music/albumId/?_id=${_id}`)
}

// 根据专辑id获取歌曲Id
export const getMusicIdByAlbumId = (albumId: string): Promise<MusicIdByAlbumId> => {
  return request.get(`${BASE_URL}/music/musicId/?albumId=${albumId}`)
}

// 获取歌手其他专辑信息
export const getOtherAlbum = (singerId: string, albumId: string): Promise<OtherAlbum> => {
  return request.get(`${BASE_URL}/album/other`, { params: { singerId, albumId } })
}

// 获取歌曲id数组获取歌曲信息
export const getMusicByIdArr = (songIdArr: string[]): Promise<MusicByIdArrType> => {
  return request.get(`${BASE_URL}/music/songIdArr`, { params: { songIdArr } })
}

// 喜欢歌曲接口
export const setLikeMusic = (musicIdArr: string[], userId: string) => {
  return request.post(`${BASE_URL}/user/like`, { musicIdArr, userId })
}

// 删除喜欢歌曲接口
export const delLikeMusic = (musicIdArr: string[], userId: string) => {
  return request.post(`${BASE_URL}/user/dislike`, { musicIdArr, userId })
}

// 根据用户id获取喜欢的歌曲的接口
export const getLikeMusicByUserId = (_id: string): Promise<UserLikeMusicType> => {
  return request.get(`${BASE_URL}/user/like/music`, { params: { _id } })
}

// 根据用户id获取用户信息的接口
export const getUserInfoByUserId = (_id: string): Promise<UserInfoType> => {
  return request.get(`${BASE_URL}/user/info`, { params: { _id } })
}

// 获取动态的接口
export const getDynamic = (currentUserId: string): Promise<DynamicInfoType> => {
  return request.get(`${BASE_URL}/dynamic/all`, { params: { currentUserId } })
}

// 修改用户喜欢的动态的接口
export const UpdateLikeDynamic = (_id: string, type: 'like' | 'dislike', dynamic_id: string) => {
  return request.post(`${BASE_URL}/user/change/like/dynamic`, { _id, type, dynamic_id })
}

// 评论回复的接口
export const addReply = (dynamic_id: string, content: string, create_time: string, from_id: string, p_id?: string, to_id?: string) => {
  return request.post(`${BASE_URL}/comment/add/reply`, { content, p_id, dynamic_id, create_time, from_id, to_id })
}
