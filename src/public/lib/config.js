class ConfigManager {

  #defaults = {
    volume: 0.5,
    autoStart: false
  }

  getDefault(key) {
    return this.#defaults[key];
  }

  get(key) {
    if (!this.#defaults.hasOwnProperty(key)) throw "Invalid key!";
    let lData = localStorage.getItem(`config:${key}`);
    if (!lData) return this.getDefault(key);
    return JSON.parse(lData).value;;
  }

  set(key, value) {
    if (!this.#defaults.hasOwnProperty(key)) throw "Invalid key!";
    let defType = typeof this.getDefault(key);
    let valType = typeof value;
    if (defType != valType) throw `Expected type is ${defType} for key ${key} but found ${valType}!`;
    localStorage.setItem(`config:${key}`, JSON.stringify({ value }));
  }

  remove(key) {
    localStorage.removeItem(`config:${key}`);
  }

  getAll() {
    let obj = Object.fromEntries(
      Object.entries(localStorage)
        .filter(i => i[0].startsWith("config:"))
        .map(i => [i[0].split(":", 2)[1], JSON.parse(i[1]).value])
    );
    Object.keys(this.#defaults).forEach((i) => {
      if (!obj.hasOwnProperty(i) && this.#defaults[i]) obj[i] = this.#defaults[i];
    });
    return obj;
  }

  setAll(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      this.set(key, value);
    })
  }

  clear() {
    Object.keys(localStorage)
      .filter(i => i.startsWith("config:"))
      .forEach((key) => {
        this.remove(key);
      })
  }

}

const config = new ConfigManager();
