import React, { useState } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'

import { MusicAlbumInfo } from '@/api/type'
import PlayAddBtn from '@/components/playAddBtn'
import AddBtn from '@/components/addBtn'
import styles from './style.module.less'

interface IProps {
  albumMusicInfo: MusicAlbumInfo[]
}
const AlbumMusic: React.FC<IProps> = ({ albumMusicInfo }) => {
  const navigate = useNavigate()
  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([])
  const rowSelection = {
    selectedRowKeys: selectRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectRowKeys(selectedRowKeys)
    },
  }
  const columns: ColumnsType<MusicAlbumInfo> = [
    {
      title: '歌曲',
      key: 'music_name',
      dataIndex: 'music_name',
      render: (val, record) => (
        <span onClick={() => navigate(`/t/song/${record._id}`)} className={styles.column}>
          {val}
        </span>
      ),
    },
    {
      title: '歌手',
      key: 'singer_name',
      dataIndex: 'singer_name',
      render: (val, record) => (
        <span onClick={() => navigate(`/t/singer/${record.singer_id}`)} className={styles.column}>
          {val}
        </span>
      ),
    },
    {
      title: '时长',
      key: 'music_second',
      dataIndex: 'music_second',
      render: (val) => {
        let minute = Math.floor(val / 60) + ''
        if (minute.length === 1) {
          minute = '0' + minute
        }
        let second = (val % 60) + ''
        if (second.length === 1) {
          second = '0' + second
        }
        return <span>{minute + ':' + second}</span>
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
  return (
    <>
      <Table pagination={false} columns={columns} dataSource={albumMusicInfo} rowKey="_id" rowSelection={{ ...rowSelection }} />
      <div className={styles.playAddBtn}>
        <PlayAddBtn selectRowKeys={selectRowKeys} />
      </div>
    </>
  )
}

export default AlbumMusic
