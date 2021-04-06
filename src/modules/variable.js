const state = {
  positionIsShow:false,
}
const mutations = {
  setPositionIsShow(state, data) {
    state.positionIsShow = data;
  }
}
const actions = {
  setArtile(context, data) {
    context.commit('setArtile', data);
  }
}
const getters = {
  //获文章取条获件分页列表
  getArticleReplyPage(state) {
    return function (pageNo, pageSize) {
      let list = 0;
      return list;
    }
  }
}
export default {
  state,
  actions,
  mutations,
  getters
}
