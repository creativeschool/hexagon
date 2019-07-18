<template>
  <v-app>
    <system-bar></system-bar>
    <v-app-bar app dark>
      <v-toolbar-title>教学资源开放平台管理</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text to="/">首页</v-btn>
        <v-btn text to="/info">同步信息</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>

    <v-snackbar v-model="snackbar" bottom right :timeout="5000">
      {{ toast }}
      <v-btn dark text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { bus } from '@/plugins/bus'
import systemBar from '@/components/systembar'

export default {
  name: 'App',
  components: {
    systemBar
  },
  data: () => ({
    loading: true,
    loggedIn: false,
    loadLog: [],
    toast: '',
    snackbar: false
  }),
  methods: {
    showToast (text) {
      this.snackbar = true
      this.toast = text
    }
  },
  mounted () {
    bus.$on('toast', msg => this.showToast(msg))
  },
  errorCaptured (err, vm, info) {
    console.log(info)
    this.showToast(err.message)
  }
}
</script>
