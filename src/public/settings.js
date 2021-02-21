const { ipcRenderer } = require("electron");
const vueApp = new Vue({
  el: "#vue-app",
  data: {
    config: {}
  },
  mounted() {
    this.$watch("config", debounce(function (conf) {
      conf = { ...conf };
      console.log(conf)
      config.setAll(conf);
      ipcRenderer.send("settings", conf);
    }, 100), { deep: true })
    this.config = config.getAll();
  },
  methods: {
    quit() {
      ipcRenderer.send("quit");
    }
  }
})