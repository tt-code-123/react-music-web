export interface AlbumType {
  _id: string
  album_introduction?: string
  album_name: string
  release_company?: string
  release_time: string
  singer_id: string
  album_img: string
}
export interface MusicType {
  _id: string
  music_name: string
  album_id: string
  music_img: string
  music_url: string
  music_second: string
  music_lyrics: string
  music_tag: string
  singer_id: string
}
export interface RecommendPlaylist {
  _id: string
  playlist_amount: string
  playlist_img: string
  playlist_name: string
}
export interface PlaylistType extends ResponseType {
  data: {
    playlist: RecommendPlaylist[]
    todoCount: number
  }
}
export interface SingerType {
  _id: string
  singer_img: string
  singer_introduction: string
  singer_name: string
}
export interface ResponseType {
  data: any
  status: number
  msg?: string
}

/** 搜索接口返回类型 */
export interface MusicInfo {
  _id: string
  music_name: string
  music_second: string
  singer_id: string
  album_id: string
}
export interface SingerInfo {
  _id: string
  singer_name: string
  singer_img: string
}
export interface SeachResponseType extends ResponseType {
  data: {
    albumCount?: number
    musicCount?: number
    total?: number
    albumList?: AlbumInfo[]
    musicList?: MusicInfo[]
    singerList?: SingerInfo[]
  }
}
/** 搜索联想接口返回类型 */
export interface SeachSuggestResponseType extends ResponseType {
  data: {
    singer?: [{ _id: string; singer_name: string }]
    music?: [{ _id: string; music_name: string }]
  }
}

/** 根据歌曲id获取歌曲接口返回类型 */
export interface MusicByIdType extends ResponseType {
  data: {
    _id: string
    music_name: string
    album_id: string
    music_img: string
    music_url: string
    music_lyrics: string
    music_tag: string
    singer_id: string
    album_name: string
    singer_name: string
  }
}

/** 根据歌手id获取歌手信息接口返回类型 */
export interface SingerById extends ResponseType {
  data: SingerType
}

/** 根据歌手id获取歌曲信息接口返回类型 */
export interface MusicInfo {
  _id: string
  music_name: string
  singer_id: string
  album_id: string
  album_name: string
  singer_name: string
}
export interface MusicBySingerId extends ResponseType {
  data: {
    musicInfo: MusicInfo[]
    musicCount: number
  }
}

/** 根据歌手id获取专辑信息接口返回类型 */
export interface AlbumInfo {
  _id: string
  album_name: string
  singer_id: string
  album_img: string
  singer_name: string
  release_time: string
}
export interface AlbumBySingerId extends ResponseType {
  data: {
    albumCount: number
    albumInfo: AlbumInfo[]
    singerName: string
  }
}

/** 歌手其他专辑接口返回类型 */
export interface RecommendAlbum extends ResponseType {
  data: {
    totalCount: number
    albumArr: AlbumInfo[]
  }
}

/** 根据专辑id获取专辑信息接口返回类型 */
export interface AlbumByAlbumId extends ResponseType {
  data: {
    _id: string
    album_introduction: string
    album_name: string
    release_company: string
    release_time: string
    singer_id: string
    album_img: string
    singer_name: string
  }
}

/** 根据专辑id获取歌曲信息接口返回类型 */
export interface MusicAlbumInfo {
  _id: string
  music_name: string
  music_second: string
  singer_id: string
  singer_name: string
}
export interface MusicByAlbumId extends ResponseType {
  data: MusicAlbumInfo[]
}

/** 根据专辑id获取歌曲Id接口返回类型 */
export interface MusicIdByAlbumId extends ResponseType {
  data: string[]
}

/** 歌手其他专辑接口返回类型 */
export interface OtherAlbum extends ResponseType {
  data: AlbumInfo[]
}

/** 根据歌曲id数组获取歌曲接口返回类型 */
export interface MusicArrInfo {
  _id: string
  music_name: string
  music_img: string
  music_url: string
  music_lyrics: string
  music_time: string
  music_second: string
  singer_id: string
  singer_name: string
  isChecked?: boolean
}
export interface MusicByIdArrType extends ResponseType {
  data: MusicArrInfo[]
}

/** 根据用户id获取喜欢歌曲接口返回类型 */
export interface UserLikeMusicType extends ResponseType {
  data: {
    _id: string
    like_music: string[]
  }
}

/** 根据歌手国籍、性别返回歌手信息接口返回类型 */
export interface SingerAllType extends ResponseType {
  data: {
    totalCount: number
    singerArr: SingerInfo[]
  }
}

/** 根据歌手国籍、性别返回歌手信息接口返回类型 */
export interface UserInfoType extends ResponseType {
  data: {
    username: string
    _id: string
    password: string
    avatar_url: string
  }
}

/** 动态接口返回类型 */
export interface CommentInfoType {
  _id: string
  content: string
  dynamic_id: string
  from_id: string
  to_id: string
  p_id: string
  children?: any[]
  create_time: string
  isShowArea: boolean
  value: string
  from_user: {
    _id: string
    username: string
    avatar_url: string
  }
  to_user: {
    _id: string
    username: string
    avatar_url: string
  }
}
export interface DynamicDataType {
  _id: string
  dynamic_content: string
  user_id: string
  image_file: string[]
  release_time: string
  isShowArea: boolean
  value: string
  like: boolean
  commentInfo: CommentInfoType[]
  userInfo: {
    _id: string
    username: string
    avatar_url: string
  }
}
export interface DynamicInfoType extends ResponseType {
  data: DynamicDataType[]
}
