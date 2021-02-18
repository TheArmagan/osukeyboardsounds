const { ipcRenderer } = require("electron");
const vueApp = new Vue({
  el: "#vue-app",
  data: {
    config: {},
    saveButtonText: "Save"
  },
  mounted() {
    this.config = config.getAll();
    ipcRenderer.send("settings", { ...this.config });
  },
  methods: {
    save() {
      let conf = { ...this.config };
      config.setAll(conf);
      this.saveButtonText = "Saved!";
      setTimeout(() => {
        this.saveButtonText = "Save";
      }, 1000);
      ipcRenderer.send("settings", conf);
    },
    quit() {
      ipcRenderer.send("quit");
    }
  }
})