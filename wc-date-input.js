/**
 * Nased on: https://design-system.service.gov.uk/components/date-input/
 */
class WCDateInput extends HTMLElement {
  #day = 0
  #month = 0
  #year = 0
  #dayText = 'Day'
  #monthText = 'Month'
  #yearText = 'Year'
  
  static get observedAttributes() {
    return [
      'value',
      'min',
      'max',
      'disabled',
      'readonly',
      'required',
      'data-day-text',
      'data-month-text',
      'data-year-text',
      'data-error-text'
    ]
  }

  static formAssociated = true
  constructor() {
    super()
    this.internals = this.attachInternals()
    this.shadow = this.attachShadow({
      mode: 'closed',
      delegatesFocus: true
    })
    this.shadow.innerHTML = `${this.css}${this.html}`
    this.pattern = new RegExp("^\\d{4}\\-(0?[1-9]|1[012])\\-(0?[1-9]|[12][0-9]|3[01])$")
    this.warnedMin = false
    this.warnedMax = false
    this.disabled = false
    this.dayInput = this.shadow.querySelector('#day')
    this.monthInput = this.shadow.querySelector('#month')
    this.yearInput = this.shadow.querySelector('#year')
    this.errorTextElements = this.shadow.querySelectorAll('.can-have-user-error')
    this.errorMessageElement = this.shadow.querySelector('#error-message')
    this.forDay = this.shadow.querySelector('label[for="day"]')
    this.forMonth = this.shadow.querySelector('label[for="month"]')
    this.forYear = this.shadow.querySelector('label[for="year"]')
  }

  connectedCallback() {
    this.dayInput.addEventListener('blur', () => {
      this.updateDayValue()
    })
    this.monthInput.addEventListener('blur', () => {
      this.updateMonthValue()
    })
    this.yearInput.addEventListener('blur', () => {
      this.updateYearValue()
    })
    this.updateInputs()
  }

  updateInputs() {
    this.dayInput.value = `${this.#day ? this.#day : ''}`
    this.monthInput.value = `${this.#month ? this.#month : ''}`
    this.yearInput.value = `${this.#year ? this.#year : ''}`
    if(this.#day) {
      this.updateDayValue()
    }
    if(this.#month) {
      this.updateMonthValue()
    }
    if(this.#year) {
      this.updateYearValue()
    }
  }

  get css() {
    return `
      <style>
        .date-input {
          font-family: arial, sans-serif;
          position: relative;
        }
        .date-input:after {
          content: "";
          display: block;
          clear: both;
        }
        .date-input.user-error::before {
          content: "";
          left: -15px;
          width: 5px;
          height: 100%;
          opacity: 1;
          background: #D4352C;
          position: absolute;
        }
        .form-group-holder {
          display: grid; 
          grid-template-columns: 2.75em 2.75em 4em;
          gap: 0% 1em; 
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group:after {
          content: "";
          display: block;
          clear: both;
        }
        label {
          display: block;
          font-weight: normal;
          font-size: .85em;
          line-height: 2em;
          margin-bottom: .2em;
          text-size-adjust: 100%;
          font-smoothing: antialiased;
        }
        label.user-error {
          color: #D4352C;
        }
        input {
          height: 2em;
          margin-top: 0;
          line-height: 1.5em;
          border: 2px solid #0b0c0c;
          padding: .5em;
          border-radius: 0;
        }
        input.user-error {
          border-color: #D4352C;
        }
        input.error {
          border-color: #D4352C;
        }
        input:focus {
          outline: .3rem solid #FFDD00;
          outline-offset: 0;
          box-shadow: inset 0 0 0 .15em;
        }
        span.can-have-user-error {
          display: none;
        }
        span.can-have-user-error.user-error {
          display: block;
          color: #D4352C;
          font-size: .85em;
          margin-top: .5em;
        }
      </style>
    `
  }

  get html() {
    return `
      <div class="date-input can-have-user-error${this.errorText ? ' user-error' : ''}">
        <div class="form-group-holder">
          <div class="form-group">
            <label for="day"
                   class="can-have-user-error${this.errorText ? ' user-error' : ''}">
              ${this.dayText}
            </label>
            <input id="day"
                   class="can-have-user-error${this.errorText ? ' user-error' : ''}" 
                   name="day"
                   type="text"
                   min="1"
                   max="31"
                   pattern="^((0?[1-9])|([12][0-9])|(3[01]))$"
                   ${this.disabled ? 'disabled' : ''}
                   ${this.readonly ? 'readonly' : ''}
                   value="${this.#day ? this.#day : ''}"
                   inputmode="numeric"
                   data-form-type="date,day"
                   tabindex="0" />
          </div>
          <div class="form-group">
            <label for="month"
                   class="can-have-user-error${this.errorText ? ' user-error' : ''}"> 
              ${this.monthText}
            </label>
            <input id="month"
                   class="can-have-user-error${this.errorText ? ' user-error' : ''}"
                   name="month"
                   type="text"
                   min="1"
                   max="12"
                   pattern="^((0[1-9])|(1[0-2]))$"
                   ${this.disabled ? 'disabled' : ''}
                   ${this.readonly ? 'readonly' : ''}
                   value="${this.#month ? this.#month : ''}"
                   inputmode="numeric"
                   data-form-type="date,month"
                   tabindex="0" />
          </div>
          <div class="form-group year-input">
            <label for="year"
                   class="can-have-user-error${this.errorText ? ' user-error' : ''}">
              ${this.yearText}
            </label>
            <input id="year"
                   class="can-have-user-error${this.errorText ? ' user-error' : ''}"
                   name="year"
                   type="text"
                   pattern="^\\d{4}$"
                   ${this.disabled ? 'disabled' : ''}
                   ${this.readonly ? 'readonly' : ''}
                   value="${this.#year ? this.#year : ''}"
                   inputmode="numeric" 
                   data-form-type="date,year"
                   tabindex="0" />
          </div>
        </div>
        <span class="can-have-user-error${this.errorText ? ' user-error' : ''}">
          <strong id="error-message">${this.errorText}</strong>
        </span>
      </div>
    `
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'required':
        if(oldValue !== newValue) {
          this.required = newValue !== null
        }
        break
      case 'disabled':
        if(oldValue !== newValue) {
          this.disabled = newValue !== null
        }
        break
      case "readonly":
        if(oldValue !== newValue) {
          this.readonly = newValue !== null
        }
        break
      case 'value':
        if(oldValue !== newValue) {
          this.value = newValue
          this.populateDate()
        }
        break
      case 'min':
        if(oldValue !== newValue) {
          this.min = newValue !== null ? newValue : null
        }
        break
      case 'max':
        if(oldValue !== newValue) {
          this.max = newValue !== null ? newValue : null
        }
        break
      case 'data-day-text':
        if(oldValue !== newValue) {
          this.forDay.innerText = this.dayText
        }
        break
      case 'data-month-text':
        if(oldValue !== newValue) {
          this.forMonth.innerText = this.monthText
        }
        break
      case 'data-year-text':
        if(oldValue !== newValue) {
          this.forYear.innerText = this.yearText
        }
        break
      case 'data-error-text':
        if(oldValue !== newValue) {
          if(newValue) {
            this.errorTextElements.forEach(element => {
              element.classList.add('user-error')
              this.errorMessageElement.innerText = newValue
            })
          } else {
            this.errorTextElements.forEach(element => {
              element.classList.remove('user-error')
              this.errorMessageElement.innerText = ''
            })
          }
        }
    }
  }

  isLeapYear(year) {
    if(!year) return false
    return (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
  }

  createDateString() {
    if(this.#year && this.#month && this.#day) {
      return `${this.#year.toString().padStart(4, '0')}-${this.#month.toString().padStart(2, '0')}-${this.#day.toString().padStart(2, '0')}`
    } else {
      return ''
    }
  }
  
  updateDay(value) {
    if(!value) {
      this.#day = 0
      this.dayInput.value = ''
    } else {
      this.#day = value
      this.dayInput.value = `${value}`
      this.dayInput.classList.remove('error')
    }
  }

  updateMonth(value) {
    if(!value) {
      this.#month = 0
      this.monthInput.value = ''
    } else {
      this.#month = value
      this.monthInput.value = `${value}`
      this.monthInput.classList.remove('error')
    }
  }

  updateYear(value) {
    if(!value) {
      this.#year = 0
      this.yearInput.value = ''
    } else {
      this.#year = value
      this.yearInput.value = `${value}`
      this.yearInput.classList.remove('error')
    }
  }

  updateDate() {
    if(this.#day && this.#month && this.#year && this.checkDateIsValid(this.createDateString())) {
      this.value = this.createDateString()
    } else {
      this.value = ''
    }
  }

  checkDay(value) {
    if(value > 31 || value < 1) {
      return false
    }
    if(this.min && this.#year && this.#month) {
      if(this.#year === this.min.getFullYear() && this.#month === this.min.getMonth() + 1) {
        if(value < this.min.getDate()) {
          return false
        }
      }
    }
    if(this.max && this.#year && this.#month) {
      if(this.#year === this.max.getFullYear() && this.#month === this.max.getMonth() + 1) {
        if(value > this.max.getDate()) {
          return false
        }
      }
    }
    if(this.#month) {
      if(this.#month === 2) {
        if(this.#year) {
          if(value > 29 && this.isLeapYear(this.#year)) {
            return false
          } else if(value > 28 && !this.isLeapYear(this.#year)) {
            return false
          } else {
            return true
          }
        } else {
          if(value > 29) {
            return false
          } else {
            return true
          }
        }
      } else if(this.#month === 4 || this.#month === 6 || this.#month === 9 || this.#month === 11) {
        if(value > 30) {
          return false
        } else {
          return true
        }
      } else {
        if(value > 31) {
          return false
        } else {
          return true
        }
      }
    } else {
      return true
    }
  }

  checkMonth(value) {
    if(value > 12 || value < 1) {
      return false
    }
    if(this.min) {
      if(this.#year) {
        if(this.#year === this.min.getFullYear()) {
          if(value < this.min.getMonth() + 1) {
            return false
          }
        }
      }
      if(this.#year && this.#day) {
        if(this.#year === this.min.getFullYear() && value === this.min.getMonth() + 1) {
          if(this.#day < this.min.getDate()) {
            return false
          }
        }
      }
    }
    if(this.max) {
      if(this.#year) {
        if(this.#year === this.max.getFullYear()) {
          if(value > this.max.getMonth() + 1) {
            return false
          }
        }
      }
      if(this.#year && this.#day) {
        if(this.#year === this.max.getFullYear() && value === this.max.getMonth() + 1) {
          if(this.#day > this.max.getDate()) {
            return false
          }
        }
      }
    }
    if(this.#day) {
      if(value === 2) {
        if(this.#year) {
          if(this.#day > 29 && this.isLeapYear(this.#year)) {
            return false
          } else if(this.#day > 28 && !this.isLeapYear(this.#year)) {
            return false
          } else {
            return true
          }
        } else {
          if(this.#day > 29) {
            return false
          } else {
            return true
          }
        }
      } else if(value === 4 || value === 6 || value === 9 || value === 11) {
        if(this.#day > 30) {
          return false
        } else {
          return true
        }
      } else {
        if(this.#day > 31) {
          return false
        } else {
          return true
        }
      }
    } else {
      return true
    }
  }

  checkYear(value) {
    if(value > 9999 || value < 1) {
      return false
    }
    if(this.min){
      if (value < this.min.getFullYear()) {
        return false
      }
      if(this.#month && value === this.min.getFullYear()) {
        if(this.#month < this.min.getMonth() + 1) {
          return false
        }
      }
      if(this.#day && value === this.min.getFullYear()) {
        if(this.#month === this.min.getMonth() + 1) {
          if(this.#day < this.min.getDate()) {
            return false
          }
        }
      }
    }
    if(this.max){
      if (value > this.max.getFullYear()) {
        return false
      }
      if(this.#month && value === this.max.getFullYear()) {
        if(this.#month > this.max.getMonth() + 1) {
          return false
        }
      }
      if(this.#day && value === this.max.getFullYear()) {
        if(this.#month === this.max.getMonth() + 1) {
          if(this.#day > this.max.getDate()) {
            return false
          }
        }
      }
    }
    if(this.#month === 2 && this.#day > 0) {
      if(this.#day > 29 && this.isLeapYear(value)) {
        return false
      } else if(this.#day > 28 && !this.isLeapYear(value)) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  updateDayValue() {
    const day = Number(this.dayInput.value)
    if(!isNaN(day) && this.checkDay(day)) {
      this.updateDay(day)
    } else {
      this.updateDay(0)
    }
    this.updateDate()
  }

  updateMonthValue() {
    const month = Number(this.monthInput.value)
    if(!isNaN(month) && this.checkMonth(month)) {
      this.updateMonth(month)
    } else {
      this.updateMonth(0)
    }
    this.updateDate()
  }

  updateYearValue() {
    const year = Number(this.yearInput.value)
    if(!isNaN(year) && this.checkYear(year)) {
      this.updateYear(year)
    } else {
      this.updateYear(0)
    }
    this.updateDate()
  }

  checkDateIsValid(dateString) {
    if(!this.pattern.test(dateString)) {
      return false
    } else {
      const [year, month, day] = dateString.split('-')
      const date = new Date(dateString)
      return date.getDate() === Number(day) && date.getMonth() + 1 === Number(month) && date.getFullYear() === Number(year)
    }
  }

  populateDate() {
    if(this.hasAttribute('value') && this.pattern.test(this.getAttribute('value'))){
      if(this.checkDateIsValid(this.getAttribute('value'))) {
        const [year, month, day] = this.getAttribute('value').split('-')
        this.#day = Number(day)
        this.#month = Number(month)
        this.#year = Number(year)
      } else {
        console.warn(`Supplied value (${this.getAttribute('value')}) is not a valid date (YYYY-MM-DD), ignoring...`)  
        this.#day = this.#day ? this.#day : 0
        this.#month = this.#month ? this.#month : 0
        this.#year = this.#year ? this.#year : 0
      }
    } else {
      this.#day = this.#day ? this.#day : 0
      this.#month = this.#month ? this.#month : 0
      this.#year = this.#year ? this.#year : 0
    }
    this.dayInput.value = `${this.#day ? this.#day : ''}`
    this.monthInput.value = `${this.#month ? this.#month : ''}`
    this.yearInput.value = `${this.#year ? this.#year : ''}`
    return this.createDateString()
  }

  /**
   * Gets the value attribute, or null if it is not valid or not set
   * @param {string|null} value
   * @returns {Date}
   */
  get value() {
    return this.populateDate()
  }

  set value(newValue) {
    if(this.getAttribute('value') !== newValue) {
      this.setAttribute('value', newValue)
      this.internals.setFormValue(newValue, this.value)
      if(!newValue && this.required) {
        const errorWarning = this.dataset.valueMissing ?? 'Please enter a date.'
        this.internals.setValidity({valueMissing: true}, errorWarning, !this.#day ? this.dayInput : !this.#month ? this.monthInput : this.yearInput)
        if(!this.#day) {
          this.dayInput.classList.add('error')
        }
        if(!this.#month) {
          this.monthInput.classList.add('error')
        }
        if(!this.#year) {
          this.yearInput.classList.add('error')
        }
      } else {
        this.internals.setValidity({})
      }
      this.dispatchEvent(new Event('change', {
        bubbles: true
      }))
    }
  }

  /**
   * Gets the min attribute, or null if it is not valid or not set
   * @param {string|null} min
   * @returns {Date|null}
   */
  get min() {
    if(this.hasAttribute('min') && this.pattern.test(this.getAttribute('min'))){
      if(this.checkDateIsValid(this.getAttribute('min'))) {
        return new Date(this.getAttribute('min'))
      } else {
        if(!this.warnedMin) {
          console.warn(`Supplied min date (${this.getAttribute('min')}) is not a valid date (YYYY-MM-DD), ignoring...`)  
          this.warnedMin = true
        }
        return null
      }
    } else {
      return null
    }
  }

  set min(value) {
    this.setAttribute('min', value)
  }

  /**
   * Gets the max attribute, or null if it is not valid or not set
   * @param {string|null} max
   * @returns {Date|null}
   */
  get max() {
    if(this.hasAttribute('max') && this.pattern.test(this.getAttribute('max'))){
      if(this.checkDateIsValid(this.getAttribute('max'))) {
        return new Date(this.getAttribute('max'))
      } else {
        if(!this.warnedMax) {
          console.warn(`Supplied max date (${this.getAttribute('max')}) is not a valid date (YYYY-MM-DD), ignoring...`)  
          this.warnedMax = true
        }
        return null
      }
    } else {
      return null
    }
  }

  set max(value) {
    this.setAttribute('max', value)
  }

  get dayText() {
    return this.dataset.dayText ?? this.#dayText
  }

  get monthText() {
    return this.dataset.monthText ?? this.#monthText
  }

  get yearText() {
    return this.dataset.yearText ?? this.#yearText
  }

  get errorText() {
    return this.dataset.errorText ?? null
  }

  get required() {
    return this.hasAttribute('required')
  }

  set required(value) {
    if (value === 'true' || value === true) {
      this.setAttribute('required', 'true')
    }
    if (value === 'false' || value === false) {
      this.removeAttribute('required')
    }
  }

  get readonly() {
    return this.hasAttribute('readonly')
  }

  set readonly(value) {
    if (value === 'true' || value === true) {
      this.setAttribute('readonly', 'true')
    }
    if (value === 'false' || value === false) {
      this.removeAttribute('readonly')
    }
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }
  
  set disabled(value) {
    if (value === 'true' || value === true) {
      this.setAttribute('disabled', 'true')
    }
    if (value === 'false' || value === false) {
      this.removeAttribute('disabled')
    }
  }

  get form() {
    return this.internals.form
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(value) {
    this.setAttribute('name', value)
  }

  get validity() {
    return this.internals.validity
  }

  get validationMessage() {
    return this.internals.validationMessage
  }

  get willValidate() {
    return this.internals.willValidate
  }

  checkValidity() {
    return this.internals.checkValidity()
  }

  reportValidity() {
    return this.internals.reportValidity()
  }

}

window.customElements.define('wc-date-input', WCDateInput)