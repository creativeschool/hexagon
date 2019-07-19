<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-simple-table>
            <tbody>
              <tr>
                <td>文件总数：</td>
                <td>{{ fileCount }}</td>
              </tr>
              <tr>
                <td>去重文件版本总数：</td>
                <td>{{ uniqueFileCount }}</td>
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

export default {
  name: 'file',
  data: () => ({
    loading: true,
    fileCount: NaN,
    uniqueFileCount: NaN
  }),
  mounted () {
    connection.then(async ctx => {
      this.loading = false
      this.fileCount = await ctx.files.countDocuments()
      this.uniqueFileCount = await ctx.fs.find().count()
    })
  }
}
</script>
