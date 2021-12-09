import Vue from 'vue'
import VueRouter from 'vue-router'

import Signup from '@/views/accounts/Signup'
import Login from '@/views/accounts/Login'
import Home from '@/views/movies/Home'
import Movie from '@/views/movies/Movie'
import Account from '@/views/accounts/Account'
import Collection from '@/views/collections/Collection'
import ReviewDetail from '@/components/review/ReviewDetail'
import CollectionList from '@/views/collections/CollectionList'
import SelectMovies from '@/views/movies/SelectMovies'
import NotFound from '@/views/NotFound'


Vue.use(VueRouter)

const routes = [
  {
    path: '/accounts/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/accounts/login/:just_signup?',
    name: 'Login',
    component: Login,
  },
  {
    path: '',
    name: 'Home',
    component: Home,
  },
  {
    path: '/movie/:movie_pk/:review_pk?',
    name: 'Movie',
    component: Movie,
    props: true,
  },
  {
    path: '/account/:user_pk',
    name: 'Account',
    component: Account,
  },
  {
    path:'/collection/:collection_pk',
    name: 'Collection',
    component: Collection,
  },
  {
    path:'/collection/',
    name: 'CollectionList',
    component: CollectionList,
  },
  {
    path: '/review/:review_pk',
    name: 'ReviewDetail',
    component: ReviewDetail,
  },
  {
    path: '/select',
    name: 'SelectMovies',
    component: SelectMovies,
  },
  {
    path: '/404',
    alias: '*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
