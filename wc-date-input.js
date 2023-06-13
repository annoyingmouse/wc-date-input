class WCDateInput extends HTMLElement {
  #day = 0
  #month = 0
  #year = 0
  #dayText = 'Day'
  #monthText = 'Month'
  #yearText = 'Year'

  static formAssociated = true

  static get observedAttributes() {
    return [
      'required',
      'value',
      'min',
      'max',
      'disabled',
      'required',
      'dayText',
      'monthText',
      'yearText',
    ]
  }

  subtractYears(date, years) {
    return new Date(date.getFullYear() - years, date.getMonth(), date.getDate())
  }

  addYears(date, years) {
    return new Date(date.getFullYear() + years, date.getMonth(), date.getDate())
  }

  constructor() {
    super()
    this.shadow = this.attachShadow({
      mode: 'closed'
    })
    this.internals = this.attachInternals()
  }

  connectedCallback() {
    console.log('connectedCallback')
    this.render()
    this.dayInput = this.shadow.querySelector('#day')
    this.monthInput = this.shadow.querySelector('#month')
    this.yearInput = this.shadow.querySelector('#year')
    this.dayInput.addEventListener('keyup', () => this.updateValue('day'))
    this.monthInput.addEventListener('keyup', () => this.updateValue('month'))
    this.yearInput.addEventListener('keyup', () => this.updateValue('year'))
    const value = this.value // get value from attribute, even if it's incorrect or not set
    this.dayInput.value = `${this.#day ? this.#day : ''}`
    this.monthInput.value = `${this.#month ? this.#month : ''}`
    this.yearInput.value = `${this.#year ? this.#year : ''}`
    const event = new Event('keyup', {
      bubbles: true,
      composed: true
    })
    this.dayInput.dispatchEvent(event)
    this.monthInput.dispatchEvent(event)
    this.yearInput.dispatchEvent(event)
  }

  get css() {
    return `
      <style>
        .date-input {
          display: grid; 
          grid-template-columns: 2.75em 2.75em 4em;
          gap: 0% 1em; 
          font-family: arial,sans-serif;
        }
        .date-input:after {
          content: "";
          display: block;
          clear: both;
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
        input {
          height: 2em;
          margin-top: 0;
          line-height: 1.5em;
          border: 2px solid #0b0c0c;
          padding: .5em;
          border-radius: 0;
        }
        input.error {
          border-color: #D4352C;
        }
        input:focus {
          outline: .3rem solid #FFDD00;
          outline-offset: 0;
          box-shadow: inset 0 0 0 .15em;
        }
      </style>
    `
  }

  get html() {
    return `
      <div class="date-input">
        <div class="form-group">
          <label for="day">
            ${this.dayText}
          </label>
          <input id="day"
                 name="day"
                 type="text"
                 min="1"
                 max="31"
                 value="${this.#day ? this.#day : ''}"
                 pattern="[0-9]{1,2}"
                 inputmode="numeric"
                 data-form-type="date,day" />
        </div>
        <div class="form-group">
          <label for="month">
            ${this.monthText}
          </label>
          <input id="month"
                 name="month"
                 type="text"
                 min="1"
                 max="12"
                 value="${this.#month ? this.#month : ''}"
                 pattern="[0-9]{1,2}"
                 inputmode="numeric"
                 data-form-type="date,month" />
        </div>
        <div class="form-group year-inout">
          <label for="year"/>
            ${this.yearText}
          </label>
          <input id="year"
                 name="year"
                 type="text"
                 value="${this.#year ? this.#year : ''}"
                 pattern="[0-9]{4}"
                 inputmode="numeric" 
                 data-form-type="date,year" />
        </div>
      </div>
    `
  }

  render() {
    this.shadow.innerHTML = `${this.css}${this.html}`
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue)
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
      case 'value':
        if(oldValue !== newValue) {
          this.value = newValue
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
      case 'day-text':
        if(oldValue !== newValue) {
          this.dayText = newValue !== null ? newValue : null
        }
        break
      case 'month-text':
        if(oldValue !== newValue) {
          this.monthText = newValue !== null ? newValue : null
        }
        break
      case 'year-text':
        if(oldValue !== newValue) {
          this.yearText = newValue !== null ? newValue : null
        }
        break
    }
  }

  isLeapYear() {
    if(!this.#year) return false
    return (this.#year % 4 === 0 && this.#year % 100 !== 0 || this.#year % 400 === 0)
  }

  checkDay() {
    if(!this.#day) return true
    if(this.#day < 1) return false
    if(this.#month) {
      if(this.#month === 2) {
        if(this.#year) {
          if(this.#day > 29 && this.isLeapYear()) {
            return false
          } else if(this.#day > 28 && !this.isLeapYear()) {
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
      } else if(this.#month === 4 || this.#month === 6 || this.#month === 9 || this.#month === 11) {
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
      if(this.#day > 31) {
        return false
      } else {
        return true
      }
    }
  }

  checkMonth() {
    if(!this.#month) return true
    if(this.#month > 12 || this.#month < 1) {
      return false
    }
    if(this.#day) {
      if(this.#month === 2) {
        if(this.#year) {
          if(this.#day > 29 && this.isLeapYear()) {
            return false
          } else if(this.#day > 28 && !this.isLeapYear()) {
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
      } else if(this.#month === 4 || this.#month === 6 || this.#month === 9 || this.#month === 11) {
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

  checkYear() {
    if(!this.#year) return true
    if(this.#year > 3000 || this.#year < 1000) {
      return false
    }
    if(this.#month) {
      if(this.#month === 2) {
        if(this.#day) {
          if(this.#day > 29 && this.isLeapYear()) {
            return false
          } else if(this.#day > 28 && !this.isLeapYear()) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      } else if(this.#month === 4 || this.#month === 6 || this.#month === 9 || this.#month === 11) {
        if(this.#day) {
          if(this.#day > 30) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      } else {
        if(this.#day) {
          if(this.#day > 31) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      }
    } else {
      return true
    }
  }

  checkValue() {
    let ok = true
    this.dayInput.classList.remove('error')
    this.monthInput.classList.remove('error')
    this.yearInput.classList.remove('error')
    if(!this.checkDay()) {
      this.dayInput.classList.add('error')
      ok = false
    }
    if(!this.checkMonth()) {
      this.monthInput.classList.add('error')
      ok = false
    }
    if(!this.checkYear()) {
      this.yearInput.classList.add('error')
      ok = false
    }
    
    if(ok) {
      const date = new Date(this.createDateString())
      if(this.checkValueValidity(date) && this.checkBeforeMax(date) && this.checkAfterMin(date)){
        this.dayInput.classList.remove('error')
        this.monthInput.classList.remove('error')
        this.yearInput.classList.remove('error')
        this.value = this.createDateString()
      } else {
        this.dayInput.classList.add('error')
        this.monthInput.classList.add('error')
        this.yearInput.classList.add('error')
        this.value = ''
      }
    } else {
      this.value = ''
    }
  }

  createDateString() {
    if(this.#year && this.#month && this.#day) {
      return `${this.#year.toString().padStart(4, '0')}-${this.#month.toString().padStart(2, '0')}-${this.#day.toString().padStart(2, '0')}`
    } else {
      return ''
    }
  }
  
  checkValidity() {
    return this.internals.checkValidity()
  }

  reportValidity() {
    return this.internals.reportValidity()
  }

  updateValue(chunk) {

    /**
     * For each element of the date, we check if the value is a number and that it is not zero
     * If it is, we update the internal variable and the value of the corresponding input (removing the leading 0)
     * If it is not, we set the internal variable to 0 and update the corresponding input (showing an empty string)
     * We then check the validity of the date
     */
    if (chunk === 'day') {
      if(!isNaN(Number(this.dayInput.value)) && Number(this.dayInput.value)) {
        this.#day = Number(this.dayInput.value)
        this.dayInput.value = `${this.#day}`
      } else {
        this.#day = 0
        this.dayInput.value = ''
      }
      this.checkValue(chunk)
    }
    if (chunk === 'month') {
      if(!isNaN(Number(this.monthInput.value)) && Number(this.monthInput.value)) {
        this.#month = Number(this.monthInput.value)
        this.monthInput.value = `${this.#month}`
      } else {
        this.#month = 0
        this.monthInput.value = ''
      }
      this.checkValue(chunk)
    }
    if (chunk === 'year') {
      if(!isNaN(Number(this.yearInput.value)) && Number(this.yearInput.value)) {
        this.#year = Number(this.yearInput.value)
        this.yearInput.value = `${this.#year}`
      } else {
        this.#year = 0
        this.yearInput.value = ''
      }
      this.checkValue(chunk)
    }
  }

  checkValueValidity(date) {
    return date.getDate() === this.#day && date.getMonth() + 1 === this.#month && date.getFullYear() === this.#year
  }

  checkBeforeMax(date) {
    return date.getTime() <= this.max.getTime()
  }

  checkAfterMin(date) {
    return date.getTime() >= this.min.getTime()
  }

  /**
   * Default value is now
   * @param {string|null} name
   * @returns {Date}
   */
  get value() {
    /**
     * We check the validity of the value attribute and if it is valid, we return a new Date object, but not before setting the internal variables
     */
    const pattern = new RegExp("^\\d{4}\\-(0?[1-9]|1[012])\\-(0?[1-9]|[12][0-9]|3[01])$")
    if(this.hasAttribute('value') && pattern.test(this.getAttribute('value'))){
      const [year, month, day] = this.getAttribute('value').split('-')
      this.#month = Number(month)
      this.#day = Number(day)
      this.#year = Number(year)
      const date = new Date(this.getAttribute('value'))
      if(this.checkValueValidity(date)) {
        return new Date(this.getAttribute('value'))
      } else {
        return null
      }
    } else {
      null
    }
  }

  set value(value) {
    const date = new Date(value)
    if(this.checkBeforeMax(date) && this.checkAfterMin(date)){
      this.setAttribute('value', value)
    } else {
      this.setAttribute('value', '')
    }
    this.internals.setFormValue(value)
  }

  /**
   * Default value is 120 years ago
   * @param {string|null} min
   * @returns {Date}
   */
  get min() {
    return this.hasAttribute('min') ? new Date(this.getAttribute('min')) : this.subtractYears(new Date(), 120)
  }

  set min(value) {
    this.setAttribute('min', value)
  }

  /**
   * Default value is 0 years from now
   * @param {string|null} max
   * @returns {Date}
   */
  get max() {
    return this.hasAttribute('max') ? new Date(this.getAttribute('max')) : this.addYears(new Date(), 10)
  }

  set max(value) {
    this.setAttribute('max', value)
  }

  get dayText() {
    return this.hasAttribute('day-text') ? this.getAttribute('day-text') : this.#dayText
  }

  get monthText() {
    return this.hasAttribute('month-text') ? this.getAttribute('month-text') : this.#monthText
  }

  get yearText() {
    return this.hasAttribute('year-text') ? this.getAttribute('year-text') : this.#yearText
  }

  get validity() {
    return this.internals.validity
  }

  get validationMessage() {
    return this.internals.validationMessage
  }

}

window.customElements.define('wc-date-input', WCDateInput)