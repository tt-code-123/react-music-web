import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router-dom'

import { AlbumInfo, MusicInfo, SingerInfo } from '@/api/type'
import PlayAddBtn from '@/components/playAddBtn'
import AddBtn from '@/components/addBtn'
import styles from './style.module.less'

interface IProps {
  musicCount: number
  total: number
  musicList: MusicInfo[]
  searchInputValue: string
  singerList: SingerInfo[]
  albumList: AlbumInfo[]
  search: (inputValue: string, pageNum?: number, pageSize?: number) => void
}
const MusicTable: React.FC<IProps> = ({ musicCount, musicList, searchInputValue, singerList, albumList, total, search }) => {
  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const columns: ColumnsType<MusicInfo> = [
    {
      title: '歌曲',
      key: 'music_name',
      dataIndex: 'music_name',
      render: (val, record) => {
        return (
          <span onClick={() => navigate(`/t/song/${record._id}`)} className={styles.column}>
            {val}
          </span>
        )
      },
    },
    {
      title: '歌手',
      key: 'singer_id',
      dataIndex: 'singer_id',
      render: (val) => {
        const data = singerList.find((item) => item._id === val)
        return (
          <span onClick={() => navigate(`/t/singer/${val}`)} className={styles.column}>
            {data && data.singer_name}
          </span>
        )
      },
    },
    {
      title: '专辑',
      key: 'album_id',
      dataIndex: 'album_id',
      render: (val) => {
        const data = albumList.length ? albumList.find((item) => item._id === val) : ''
        if (data) {
          return (
            <span onClick={() => navigate(`/t/album/${val}`)} className={styles.column}>
              《{data.album_name}》
            </span>
          )
        }
      },
    },
    {
      title: '添加到',
      key: '_id',
      dataIndex: '_id',
      render: (val) => {
        return (
          <AddBtn musicIdArr={[val]}>
            <PlusOutlined />
          </AddBtn>
        )
      },
    },
  ]
  const rowSelection = {
    selectedRowKeys: selectRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectRowKeys(selectedRowKeys)
    },
  }
  /** 处理分页搜索 */
  const handlePageClick = (page, pageSize) => {
    search(searchInputValue, page, pageSize)
  }
  return (
    <>
      <Table
        pagination={{
          defaultPageSize: 15,
          defaultCurrent: 1,
          total: musicCount === total ? musicCount : total,
          onChange: handlePageClick,
        }}
        rowKey="_id"
        dataSource={musicList}
        rowSelection={{ ...rowSelection }}
        columns={columns}
      />
      <PlayAddBtn selectRowKeys={selectRowKeys} />
    </>
  )
}

export default MusicTable
