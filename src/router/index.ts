import { lazy } from 'react'

export interface RoutesType {
  path: string
  element?: any
  index?: boolean
  children?: RoutesType[]
}
const routes: RoutesType[] = [
  {
    path: '/',
    element: lazy(() => import('@/pages/home')),
  },
  {
    path: '/registered',
    element: lazy(() => import('@/pages/other/registered')),
  },
  {
    path: '/home',
    element: lazy(() => import('@/pages/home')),
  },
  {
    path: '/login',
    element: lazy(() => import('@/pages/other/login')),
  },
  {
    path: '*',
    element: lazy(() => import('@/pages/404')),
  },
]

export default routes

