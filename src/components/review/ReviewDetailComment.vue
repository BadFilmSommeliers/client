<template>
  <div>
    <p v-if="comments.length === 0">작성된 댓글이 없습니다.</p>
    <div
      v-else
      v-for="(comment, index) in comments"
      :key="comment.pk"
      v-show="startIndex <= index && index < startIndex + indexRange"
    >
      <!-- 댓글 수정란 -->
      <div v-if="wantToEditPk === comment.pk">
        <div class="d-flex justify-content-between align-items-center my-2">
          <div>
            <p class="fw-bold fs-6 m-0">{{ comment.user.nickname }}</p>
          </div>
          <div>
            <v-btn
              elevation="2"
              @click="editComment(comment.pk)"
              small
              color="rgba(52, 52, 52, 0.5)"
              class="me-1"
            >수정</v-btn>

              <v-btn
                elevation="2"
                @click="wantToEditPk = 0"
                small
                color="rgba(52, 52, 52, 0.5)"
              >취소</v-btn>

          </div>
        </div>
        <v-textarea
          name="input-7-1"
          filled
          auto-grow
          color="rgba(142, 208, 246, 0.5)"
          v-model="editedComment"
        ></v-textarea>
      </div>

      <!-- 댓글 출력란 -->
      <div v-else>
        <div v-if="comment.user.pk === userPk" class="d-flex flex-row justify-content-between">
          <div class="m-0">
            <span @click="$goToAccountDetail(comment.user.pk)" class="fw-bold account-id">{{ comment.user.nickname }}</span>
          </div>
          <div class="d-flex flex-row align-items-center">
            <span class="float-end font-size-12">{{ comment.created_at.slice(0, 10) + ' ' + comment.created_at.slice(11, 16) }}</span>
            <!-- 수정, 삭제 버튼 -->
            <div>
              <!-- 수정 -->
              <v-btn
                small
                dark
                @click="clickEdit(comment.pk, comment.content)"
                class="p-1"
                style="background-color: transparent; min-width: 0;"
              >
                🔧
              </v-btn>

              <!-- 삭제  -->
              <v-dialog
                v-model="dialog"
                max-width="290"
                :retain-focus="false"
                :hide-overlay="true"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="p-1"
                    style="background-color: transparent; min-width: 0;"
                  >
                    ❌
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="fs-6 fw-bold" style="color: #f7f7eb">
                    정말 삭제하시겠습니까?
                  </v-card-title>
                  <v-card-text>삭제된 후기는 복구되지 않습니다.</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      @click="dialog = false"
                      style="color: #f7f7eb"
                    >
                      취소
                    </v-btn>
                    <v-btn
                      text
                      @click="[deleteComment(comment.pk), dialog = false]"
                      style="color: #8ed0f6"
                    >
                      삭제
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </div>
        <div class="m-0" v-else>
          <span @click="$goToAccountDetail(comment.user.pk)" class="fw-bold account-id">{{ comment.user.nickname }}</span>
          <span class="float-end font-size-12 me-2">{{ comment.created_at.slice(0, 10) + ' ' + comment.created_at.slice(11, 16) }}</span>
        </div>
        <p style="white-space: pre-line">{{ comment.content }}</p>
      </div>
    </div>

    <!-- 댓글 작성란 -->
    <div v-if="userPk !== null">
      <div class="d-flex flex-row justify-content-between mb-2 align-items-end">
        <h6 class="m-0">댓글을 작성하세요</h6>
        <v-btn 
          elevation="2"
          small
          color="rgba(52, 52, 52, 0.5)"
          @click="createReviewComment"
        >
          작성
        </v-btn>
      </div>
      <v-textarea
        name="input-7-1"
        filled
        auto-grow
        color="rgba(142, 208, 246, 0.5)"
        v-model="reviewCommentContent"
      ></v-textarea>
    </div>
    <v-pagination
      v-model="pageNumber"
      :length="parseInt((commentsLength + indexRange - 1) / indexRange)"
      :total-visible="7"
      color="#343434"
    ></v-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'


export default {
  name: 'ReviewDetailComment',
  props: {
    reviewPk: Number
  },
  data: function () {
    return {
      comments: [],

      wantToEditPk: null,
      editedComment: null,

      reviewCommentContent: null,

      dialog: false,

      pageNumber: 1,
      indexRange: 10,
      commentsLength: 0,
      startIndex: (this.pageNumber - 1) * this.indexRange,
      pageLength: 0,
    }
  },
  methods: {
    getComments: function () {
      axios({
        method: 'get',
        url: `${this.$serverURL}/movies/review/${this.reviewPk}/`
      })
        .then(res => {
          this.comments = res.data.reviewcomment_set
          this.commentsLength = res.data.reviewcomment_set.length
        })
        .catch(() => {
        })
    },
    createReviewComment: function () {
      axios({
        method: 'post',
        url: `${this.$serverURL}/movies/review/${this.reviewPk}/comment/`,
        data: {
          'content': this.reviewCommentContent,
        },
        headers: this.$setToken()
      })
        .then(() => {
          this.getComments()
          this.reviewCommentContent = null
        })
        .catch(() => {
        })
    },
    deleteComment: function (comment_pk) {
      axios({
        method: 'delete',
        url: `${this.$serverURL}/movies/review/comment/${comment_pk}/`,
        headers: this.$setToken()
      })
        .then(() => {
          this.getComments()
        })
        .catch(() => {
        })
    },
    clickEdit: function (comment_pk, comment_content) {
      this.wantToEditPk = comment_pk
      this.editedComment = comment_content
    },
    editComment: function (comment_pk) {
      axios({
        method: 'put',
        url: `${this.$serverURL}/movies/review/comment/${comment_pk}/`,
        data: {
          'content': this.editedComment
        },
        headers: this.$setToken()
      })
        .then(() => {
          this.wantToEditPk = null
          this.getComments()
        })
        .catch(() => {
        })
    },
  },
  computed: {
    ...mapState([
      'userPk'
    ])
  },
  created: function () {
    this.getComments()
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
.review-comment-text {
  color: white;
}
</style>