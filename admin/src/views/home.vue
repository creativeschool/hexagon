<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          驱动版本： {{ clientInfo.driver }}<br/>
          操作系统： {{ clientInfo.os }}<br/>
          运行平台： {{ clientInfo.platform }}
        </v-card-text>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate/>
          等待数据库连接
        </v-overlay>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { connection } from '@/db/index'
import { bus } from '@/plugins/bus'

export default {
  name: 'home',
  data: () => ({
    loading: true,
    clientInfo: {}
  }),
  created () {
    bus.$emit('title', '')
    connection.then(ctx => {
      this.loading = false
      this.clientInfo = ctx.db.serverConfig.clientInfo
    }).finally(() => { this.loading = false })
  }
}
</script>
