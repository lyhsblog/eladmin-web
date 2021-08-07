<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    :fullscreen="true"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="130px"
      label-position="top"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="12" style="max-height: calc(100vh - 200px); overflow-y: scroll;">
          <el-form-item
            label="name"
            prop="name"
          >
            <el-input
              v-model="form.name"
              style="width: 300px;"
            />
          </el-form-item>
          <el-form-item
            label="cover"
            prop="cover"
          >
            <el-input
              v-model="form.cover"
              style="width: 300px;"
            />
          </el-form-item>
          <el-form-item
            label="Category"
            prop="category"
          >
            <el-select v-model="form.category.id" placeholder="Select" style="width: 300px;">
              <el-option
                v-for="item in categories"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="description"
            prop="description"
          >
            <el-input
              v-model="form.description"
              type="textarea"
              style="width: 300px;"
            />
          </el-form-item>
          <el-form-item
            label="Published"
            prop="published"
          >
            <el-radio
              v-for="item in dict.dict.manga_published"
              :key="item.id"
              v-model="form.published"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>

          <el-form-item
            label="Recommended"
            prop="recommended"
          >
            <el-radio
              v-for="item in dict.dict.manga_recommended"
              :key="item.id"
              v-model="form.recommended"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
          <el-form-item
            label="Tags"
            prop="tags"
          >
            <el-tag
              v-for="tag in tags"
              :key="tag.name"
              closable
              :disable-transitions="false"
              :hit="tag.hit || false"
              @close="handleClose(tag)"
              @click="handleClick(tag)"
            >
              {{ tag.name }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            <div>
              {{ form.tags.map(tag => tag.name).join(",") }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="12">
          <el-form-item label="MainContent">
            <mavon-editor
              ref="md"
              v-model="form.content"
              style="height: calc(100vh - 250px)"
              @imgAdd="imgAdd"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import { categories, tags, addTag, delTags } from '@/views/cms/article/api'
import { upload } from '@/utils/upload'
import { mapGetters } from 'vuex'

const defaultForm = {
  name: '',
  cover: '',
  content: '',
  description: '',
  category: { id: '' },
  tags: [],
  published: false,
  recommended: false
}
export default {
  mixins: [form(defaultForm)],
  props: {
    dict: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tags: [
        {
          name: 'Tag1'
        },
        {
          name: 'Tag2'
        },
        {
          name: 'Tag3'
        }
      ],
      inputVisible: false,
      inputValue: '',
      categories: [{
        name: 'Option1'
      }, {
        name: 'Option2'
      }, {
        name: 'Option3'
      }, {
        name: 'Option4'
      }, {
        name: 'Option5'
      }],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      tags().then(res => {
        this.tags = res
      })
      categories().then(res => {
        this.categories = res
      })
    },
    imgAdd(pos, $file) {
      upload(this.imagesUploadApi, $file).then(res => {
        const data = res.data
        const url = this.baseApi + '/file/' + data.type + '/' + data.realName
        this.$refs.md.$img2Url(pos, url)
      })
    },
    handleClose(tag) {
      // to delete the tag and reload tags
      delTags([tag.id]).then(() => {
        this.form.tags = this.form.tags.filter(item => item.name !== tag.name)
        this.tags = this.tags.filter(item => item.name !== tag.name)
      })
    },
    handleClick(tag) {
      let exists = false
      for (const tagElement of this.form.tags) {
        if (tagElement.name === tag.name) {
          exists = true
        }
      }
      if (exists === true) {
        tag.hit = false
        this.form.tags = this.form.tags.filter(item => item.name !== tag.name)
      } else {
        tag.hit = true
        this.form.tags.push(tag)
      }
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      // to save tag that was updated and reload tags
      addTag({
        name: this.inputValue
      }).then(() => {
        tags().then(res => {
          this.tags = res
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
