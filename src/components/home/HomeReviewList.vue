<template>
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-md-6 col-12">
        <h3 class="m-0" style="font-weight: 800;">최신 후기</h3>
        <home-review-list-item
          v-for="(review, index) in recentReviews"
          :key="index"
          :review="review"
        >
        </home-review-list-item>
      </div>
      <div class="col-md-6 col-12">
        <h3 class="m-0" style="font-weight: 800;">이번주 인기 후기</h3>
        <home-review-list-item
          v-for="(review, index) in mostLikedReviews"
          :key="index"
          :review="review"
        >
        </home-review-list-item>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import HomeReviewListItem from '@/components/home/HomeReviewListItem'

export default {
  name: 'HomeReviewList',
  components: {
    HomeReviewListItem
  },
  data: function () {
    return {
      recentReviews: null,
      mostLikedReviews: null,
    }
  },
  created: function () {
    axios({
      method: 'get',
      url: `${this.$serverURL}/movies/review/`
    })   
      .then(res => {
        this.recentReviews = res.data.slice(0, 4)
        const today = new Date()
        const recentReviews = res.data.filter(review => {
          return (today - new Date(review.created_at.slice(0, 10))) / (24 * 60 * 60 * 1000) <= 7
        })
        this.mostLikedReviews = _.orderBy(recentReviews, 'like_count', 'desc').slice(0, 4)
      })
      .catch(() => {
      })
  }
}
</script>

<style>

</style>