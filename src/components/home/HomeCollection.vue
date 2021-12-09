<template>
  <div class="container">
    <h4 style="font-weight: 800;" class="m-0">최신 컬렉션</h4>
    <div class="row row-cols-2 justify-content-between m-0 flex-grow-1 mb-5">
      <home-collection-item
        v-for="collection in collections.slice(-2)"
        :key="`c${collection.pk}`"
        :collection="collection"
        class='p-0 rounded-3 m-1 col col-12 p-0'
        >
      </home-collection-item>
    </div>
    <h4 style="font-weight: 800;" class="m-0 pt-5">이번주 인기 컬렉션</h4>
    <div class="row row-cols-2 justify-content-between m-0 flex-grow-1">
      <home-collection-item
        v-for="collection in mostLikedCollections.slice(0, 2)"
        :key="`c${collection.pk}`"
        :collection="collection"
        class='p-0 rounded-3 m-1 col col-12 p-0'
        >
      </home-collection-item>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import HomeCollectionItem from '@/components/home/HomeCollectionItem'

export default {
  name: 'HomeCollection',
  components: {
    HomeCollectionItem,
  },
  computed: {
    ...mapState([
      'userPk',
      'collections',
    ]),
    mostLikedCollections: function () {
      const today = new Date()
      const recentCollections = this.collections.filter(collection => {
        return (today - new Date(collection.created_at.slice(0, 10))) / (24 * 60 * 60 * 1000) <= 7
      })
      return _.orderBy(recentCollections, 'like_count', 'desc')
    }
  }
}
</script>

<style>

</style>