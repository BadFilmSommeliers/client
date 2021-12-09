<template>
  <div v-if='collectionSet' class="row justify-content-center">
    <h3 class="ps-0 mb-0">{{categoryTitle}}</h3>
    <hr class="mb-0">
    <account-own-collection-list-item
      v-for="(collection, index) in collectionSet"
      :key="collection.pk"
      :collection="collection"
      v-show="startIndex <= index && index < startIndex + indexRange"
    >
    </account-own-collection-list-item>

    <v-pagination
      v-model="pageNumber"
      :length="parseInt((moviesLength + indexRange - 1) / indexRange)"
      :total-visible="7"
      color="#343434"
      class="py-5"
    ></v-pagination>
  </div>
</template>

<script>
import AccountOwnCollectionListItem from '@/components/account/AccountOwnCollectionListItem'


export default {
  name: 'AccountOwnCollectionList',
  components: {
    AccountOwnCollectionListItem
  },
  props: {
    collectionSet: Array,
    categoryTitle: String
  },
  data: function () {
    return {
      pageNumber: 1,
      indexRange: 6,
      moviesLength: this.collectionSet.length,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      pageLength: 0,
    }
  },
  created: function () {
    this.startIndex = (this.pageNumber - 1) * this.indexRange
  },
  watch: {
    pageNumber: function () {
      this.startIndex = (this.pageNumber - 1) * this.indexRange
    }
  }
}
</script>

<style>

</style>