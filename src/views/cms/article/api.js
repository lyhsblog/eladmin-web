import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/cms/article',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/cms/article',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/cms/article',
    method: 'put',
    data
  })
}

export function tags() {
  return request({
    url: 'api/cms/article/tags',
    method: 'get'
  })
}

export function addTag(data) {
  return request({
    url: 'api/cms/article/addTag',
    method: 'post',
    data
  })
}

export function delTags(ids) {
  return request({
    url: 'api/cms/article/delTag',
    method: 'delete',
    data: ids
  })
}

export function categories() {
  return request({
    url: 'api/cms/article/categories',
    method: 'get'
  })
}

export default { add, edit, del, tags, addTag, categories, delTags }
