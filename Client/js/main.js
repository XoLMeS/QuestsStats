Vue.config.devtools = true;

Vue.component('grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array
  },
  methods: {
  	showQuest: function(event){
  		var name = event.target.getAttribute("name");
  		var id = event.target.getAttribute("id");
  		$(location).attr('href', './quest.html?id='+id+'&name='+name)
  	}
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
})

var vm = new Vue({
  el: '#grid',
  data: {
    gridColumns: ['alias', 'status'],
    gridData: []
  },

  methods: {
    sendFile(event) {
      var file = $('#input')[0].files[0];
      console.log(file);
      axios
      .post('http://localhost:3000/update', file, {headers: {'Content-Type': 'application/json'}})
      .then(response => (this.gridData = response.data));
    }
  },
   mounted() {
    axios
      .get('http://localhost:3000/quests/status')
      .then(response => (this.gridData = response.data));
  }
})