import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate, useParams } from 'react-router-dom'

import { MusicInfo } from '@/api/type'
import PlayAddBtn from '@/components/playAddBtn'
import AddBtn from '@/components/addBtn'
import styles from './style.module.less'

interface IProps {
  musicInfo: MusicInfo[]
  musicCount: number
  getMusicInfoBySingerId: (_id: string, pageNum?: number, pageSize?: number) => void
}
const SingerMusicTable: React.FC<IProps> = ({ musicInfo, musicCount, getMusicInfoBySingerId }) => {
  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([])
  const params = useParams()
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
      key: 'singer_name',
      dataIndex: 'singer_name',
      render: (val) => {
        return <span className={styles.column}>{val}</span>
      },
    },
    {
      title: '专辑',
      key: 'album_name',
      dataIndex: 'album_name',
      render: (val, record) => {
        return (
          <span onClick={() => navigate(`/t/album/${record.album_id}`)} className={styles.column}>
            《{val}》
          </span>
        )
      },
    },
    {
      title: '添加到',
      key: '_id',
      dataIndex: '_id',
      render: (val) => {
        return (
          <AddBtn musicIdArr={[val]}>
            <PlusOutlined className={styles.column} />
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
    getMusicInfoBySingerId(params._id, page, pageSize)
  }
  return (
    <>
      <Table
        pagination={{ defaultPageSize: 10, total: musicCount, onChange: handlePageClick }}
        rowKey="_id"
        dataSource={musicInfo && musicInfo}
        rowSelection={{ ...rowSelection }}
        columns={columns}
      />
      <PlayAddBtn selectRowKeys={selectRowKeys} />
    </>
  )
}

export default SingerMusicTable
