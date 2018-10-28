
Vue.config.devtools = true;

Vue.component('pathway', {
  template: '#pathway-template',
  props: {
    data: null
  }
})

var vm = new Vue({
  el: '#grid',
  data: {
    quest: null
  },
  mounted() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    var name = urlParams.get('name');
    axios
      .get('http://localhost:3000/quests/'+id +'?name='+name)
      .then(response => (this.quest = response.data));
  }
})