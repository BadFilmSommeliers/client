<template>
  <v-container fill-height fluid>
    <v-row 
      align="center"
      justify="center"
    >
      <v-col>
        <h1 class="text-center">요청하신 페이지가 존재하지 않습니다.</h1>
        <v-img
          src="@/assets/somi/sad.png"
          max-height="100"
          contain
          class="m-2"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style>

</style>