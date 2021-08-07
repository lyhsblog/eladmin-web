<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="NAME" />
      <el-table-column prop="clicks" label="CLICKS" />
      <el-table-column prop="likes" label="LIKES" />
      <el-table-column prop="tags" label="TAGS">
        <template slot-scope="scope">
          <span>
            {{ scope.row.tags.map(tag => tag.name).join(',') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="category.name" label="CATEGORY" />
      <el-table-column prop="published" label="PUBLISHED" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.published"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changePublished(scope.row, scope.row.published)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="recommended" label="RECOMMENDED" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.recommended"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeRecommended(scope.row, scope.row.recommended)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="POSTTIME" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','article:edit','article:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :dict="dict" />
  </div>
</template>

<script>
import crudArticle from './api'
import eHeader from './header'
import eForm from './form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Article',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: 'CMS内容',
      url: 'api/cms/article',
      sort: ['id,desc'],
      crudMethod: { ...crudArticle }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['manga_recommended', 'manga_published'],
  data() {
    return {
      permission: {
        add: ['admin', 'manga:add'],
        edit: ['admin', 'manga:edit'],
        del: ['admin', 'manga:del']
      }
    }
  },
  methods: {
    // 改变状态
    changePublished(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.manga_published[val] + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudArticle.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.manga_published[val] + '成功', 'success')
        }).catch(err => {
          data.published = !data.published
          console.log(err.data.message)
        })
      }).catch(() => {
        data.published = !data.published
      })
    },
    changeRecommended(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.manga_recommended[val] + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudArticle.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.manga_recommended[val] + '成功', 'success')
        }).catch(err => {
          data.recommended = !data.recommended
          console.log(err.data.message)
        })
      }).catch(() => {
        data.recommended = !data.recommended
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
