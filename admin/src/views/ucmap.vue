<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-simple-table>
            <tbody>
              <tr>
                <td>关联记录总数：</td>
                <td>{{ ucmapCount }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate/>
          等待操作
        </v-overlay>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { connection } from '@/db/index'
import { bus } from '@/plugins/bus'

export default {
  name: 'ucmap',
  data: () => ({
    loading: true,
    ucmapCount: NaN
  }),
  created () {
    bus.$emit('title', '用户课程关联')
    connection.then(async ctx => {
      this.loading = false
      this.ucmapCount = await ctx.ucmap.countDocuments()
    })
  }
}
</script>
