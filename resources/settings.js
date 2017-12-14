class Settings {
   constructor(settings = []){
      this.settings = {}
      for(var setting of settings) {
         this.addSetting(setting)
      }
   }

   read(setting) {
      return Number(this.settings[setting.toLowerCase()].value)
   }

   add(options) {

      var setting = {
         html: this.createSettingHTML(options),
         value: options.value
      }
      document.querySelector('settings').appendChild(setting.html.container)

      // Listen for update
      setting.html.input.addEventListener('input', () => {
         this.onChange(setting)
      })

      this.settings[options.name.toLowerCase()] = setting
   }

   onChange(setting) {
      setting.html.value.innerHTML = setting.html.input.value
      setting.value = setting.html.input.value
   }

   createSettingHTML(setting) {
      var html = {
         container: document.createElement('setting'),
         label: document.createElement('label'),
         input: document.createElement('input'),
         value: document.createElement('value')
      }
      html.container.appendChild(html.label)
      html.container.appendChild(html.input)
      html.container.appendChild(html.value)

      // Label Setup
      html.label.innerHTML = setting.name

      // Range Slider Setup
      html.input.type = 'range'
      html.input.step = (setting.max - setting.min)/100
      html.input.min = setting.min || 0
      html.input.max = setting.max || 100
      html.input.value = setting.value
      html.input.defaultValue = setting.value

      // Value Setup
      html.value.innerHTML = setting.value

      return html
   }
}
