<template>
  <div v-if="userInfo" class="col p-0">
    <div v-show="category === 1">
      <div class="container">
        <account-own-collection-list 
          v-if="userInfo.collection_set.length > 0" 
          :collection-set="userInfo.collection_set"
          :category-title="'컬렉션'"
        ></account-own-collection-list>
        <p v-else>만드신 컬렉션이 없습니다.</p>
      </div>
    </div>
    <div v-show="category === 6">
      <div class="container">
        <account-own-collection-list 
          v-if="userInfo.like_collections.length > 0"
          :collection-set="userInfo.like_collections"
          :category-title="'좋아한 컬렉션'"
        ></account-own-collection-list>
        <p v-else>좋아하신 컬렉션이 없습니다.</p>
      </div>
    </div>
    <div v-show="category === 2">
      <div class="container">
        <account-own-review-list 
          v-if="userInfo.review_set.length > 0"
          :reviews="userInfo.review_set"
        ></account-own-review-list>
        <p v-else>작성하신 후기가 없습니다.</p>
      </div>
    </div>
    <div v-show="category === 3">
      <div class="container">
        <account-own-like-movie-list 
          v-if="userInfo.like_movies.length > 0"
          :movies="userInfo.like_movies"
        ></account-own-like-movie-list>
        <p v-else>좋아하신 영화가 없습니다.</p>
      </div>
    </div>
    <div v-show="category === 4">
      <div class="container">
        <account-own-movie-list 
          v-if="userInfo.review_set.length > 0"
          :review-set="userInfo.review_set"
        ></account-own-movie-list>
        <p v-else>평가하신 후기가 없습니다.</p>
      </div>
    </div>
    <div v-show="category === 5">
      <div class="container">
        <account-own-like-review-list 
          v-if="userInfo.like_reviews.length > 0"
          :reviews="userInfo.like_reviews"
        ></account-own-like-review-list>
        <p v-else>좋아하신 후기가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import AccountOwnMovieList from '@/components/account/AccountOwnMovieList'
import AccountOwnReviewList from '@/components/account/AccountOwnReviewList'
import AccountOwnCollectionList from '@/components/account/AccountOwnCollectionList'
import AccountOwnLikeMovieList from '@/components/account/AccountOwnLikeMovieList'
import AccountOwnLikeReviewList from '@/components/account/AccountOwnLikeReviewList'


export default {
  name: 'AccountOwn',
  components: {
    AccountOwnMovieList,
    AccountOwnReviewList,
    AccountOwnCollectionList,
    AccountOwnLikeMovieList,
    AccountOwnLikeReviewList
  },
  props: {
    userInfo: Object,
    category: Number
  },
}
</script>

<style>

</style>