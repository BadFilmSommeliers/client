<template>
  <div class="row justify-content-between">
    <h3 class="ps-0 m-0">좋아한 후기</h3>
    <hr class="mt-0">
    
    <account-own-like-review-list-item
      v-for="(review, index) in reviews"
      :key="review.pk"
      :review="review"
      v-show="startIndex <= index && index < startIndex + indexRange"
    >
    </account-own-like-review-list-item>
    <v-pagination
      v-model="pageNumber"
      :length="parseInt((moviesLength + indexRange - 1) / indexRange)"
      :total-visible="7"
      color="#343434"
    ></v-pagination>

  </div>
</template>

<script>
import AccountOwnLikeReviewListItem from '@/components/account/AccountOwnLikeReviewListItem'


export default {
  name: 'AccountOwnLikeReviewList',
  components: {
    AccountOwnLikeReviewListItem
  },
  props: {
    reviews: Array
  },
  data: function () {
    return {
      pageNumber: 1,
      indexRange: 6,
      moviesLength: this.reviews.length,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      pageLength: 0,
    }
  },
 methods: { 
    scrollToTop: function () {
      window.scrollTo(0,0)
    }
  },
  created: function () {
    this.startIndex = (this.pageNumber - 1) * this.indexRange
  },
  watch: {
    pageNumber: function () {
      this.startIndex = (this.pageNumber - 1) * this.indexRange
      this.scrollToTop()
    }
  }
}
</script>

<style>

</style>