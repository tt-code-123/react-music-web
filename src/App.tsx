import React, { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'

import { RoutesType } from './router'
import Loading from './components/loading'
import { ReducerStates } from './redux/reducers'

const App: React.FC = () => {
  const isLogin = useSelector((state: ReducerStates) => state.userInfo.isLogin, shallowEqual)

  const mainRoutes: RoutesType[] = [
    {
      path: '',
      element: <Navigate to="t/home" />,
    },
    {
      path: '/t',
      element: lazy(() => import('@/pages/main')),
      children: [
        {
          path: 'home',
          index: true,
          element: lazy(() => import('@/pages/home')),
        },
        {
          path: 'playlist',
          element: lazy(() => import('@/pages/playlist')),
        },
        {
          path: 'album',
          element: lazy(() => import('@/pages/album')),
        },
        {
          path: 'album/:_id',
          element: lazy(() => import('@/pages/albumDetail')),
        },
        {
          path: 'singer',
          element: lazy(() => import('@/pages/singer')),
        },
        {
          path: 'singer/:_id',
          element: lazy(() => import('@/pages/singerDetail')),
        },
        {
          path: 'dynamic',
          element: lazy(() => import('@/pages/dynamic')),
        },
        {
          path: 'song/:_id',
          element: lazy(() => import('@/pages/song')),
        },
      ],
    },
    {
      path: '/login',
      element: lazy(() => import('@/pages/other/login')),
    },
    {
      path: '/registered',
      element: lazy(() => import('@/pages/other/registered')),
    },
    {
      path: '/player',
      element: lazy(() => import('@/pages/player')),
    },
    {
      path: '/search',
      element: lazy(() => import('@/pages/search')),
    },
    {
      path: '*',
      element: lazy(() => import('@/pages/404')),
    },
  ]
  const changeRoutes = (routes: RoutesType[]): any => {
    return routes.map((item) => {
      if (item.children) {
        item.children = changeRoutes(item.children)
      }
      if (item.path === '') return item

      if (item.path === '/player' || item.path === 'dynamic') {
        if (!isLogin) {
          item.element = <Navigate to="/login" />
          return item
        }
      }
      if (item.element) {
        item.element = (
          <Suspense key={item.path} fallback={<Loading />}>
            <item.element />
          </Suspense>
        )
      }
      return item
    })
  }

  return <>{useRoutes(changeRoutes(mainRoutes))}</>
}

export default App
