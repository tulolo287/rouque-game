class Events {
  callbacks = [];

  emit(name, value) {
    this.callbacks.forEach(event => {
      if (event.name === name) {
        event.callback(value)
      }
    })
  }

  on(name, callback) {
    this.callbacks.push({
      name,
      callback,
    });
  }

}
