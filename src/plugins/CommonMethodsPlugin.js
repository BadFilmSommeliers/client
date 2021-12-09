const MyPlugin = {}
MyPlugin.install = function (Vue) {
  Vue.prototype.$goToAccountDetail = function (user_pk) {
    this.$router.push({name: 'Account', params: {user_pk: user_pk}})
  }
  Vue.prototype.$goToMovieDetail = function (movie_pk) {
    this.$router.push({ name: 'Movie', params: { movie_pk: `${movie_pk}`} })
  }
  Vue.prototype.$goToReviewDetail = function (movie_pk, review_pk) {
    this.$router.push({name: 'Movie', params: {movie_pk: movie_pk, review_pk: review_pk}})
  }
  Vue.prototype.$goToCollectionDetail = function (collection_pk) {
    this.$router.push({ name: 'Collection', params: {collection_pk: `${collection_pk}`}})
  }
  Vue.prototype.$setToken = function () {
    const token = localStorage.getItem('jwt')
    const config = {
      Authorization: `JWT ${token}`
    }
    return config
  }
}
export default MyPlugin