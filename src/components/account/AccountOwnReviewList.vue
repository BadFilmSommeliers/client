<template>
  <div v-if="reviews" class="row justify-content-between">
    <h3 class="ps-0 mb-0">작성한 후기</h3>
    <hr>
    <account-own-review-list-item
      v-for="(review, index) in reviews"
      :key="index"
      :review="review"
      v-show="startIndex <= index && index < startIndex + indexRange"
    >
    </account-own-review-list-item>
    <v-pagination
      v-model="pageNumber"
      :length="parseInt((moviesLength + indexRange - 1) / indexRange)"
      :total-visible="7"
      color="#343434"
    ></v-pagination>
  </div>
</template>

<script>
import AccountOwnReviewListItem from '@/components/account/AccountOwnReviewListItem'


export default {
  name: 'AccountOwnReviewList',
  data: function () {
    return {
      pageNumber: 1,
      indexRange: 6,
      moviesLength: this.reviews.length,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      pageLength: 0,
    }
  },
  components: {
    AccountOwnReviewListItem
  },
  props: {
    reviews: Array
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