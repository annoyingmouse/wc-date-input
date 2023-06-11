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
    this.shadow = this.attachShadow({ mode: 'closed' })
    this.internals = this.attachInternals()
  }

  connectedCallback() {
    this.render()
    this.dayInput = this.shadow.querySelector('#day')
    this.monthInput = this.shadow.querySelector('#month')
    this.yearInput = this.shadow.querySelector('#year')
    this.dayInput.addEventListener('change', () => this.updateValue('day'))
    this.monthInput.addEventListener('change', () => this.updateValue('month'))
    this.yearInput.addEventListener('change', () => this.updateValue('year'))
  }

  get css() {
    return `
      <style>
        .date-input {
          display: grid; 
          grid-template-columns: 2.75em 2.75em 4em;
          gap: 0% 20px; 
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
          font-weight: 400;
          font-size: 19px;
          line-height: 25px;
          margin-bottom: 5px;
          text-size-adjust: 100%;
          font-smoothing: antialiased;
        }
        input {
          height: 2.5rem;
          margin-top: 0;
          line-height: 1.5;
          border: 2px solid #0b0c0c;
          padding: 5px;
          border-radius: 0;
        }
        input.error {
          border-color: #D4352C;
        }
        input:focus {
          outline: 3px solid #FFDD00;
          outline-offset: 0;
          box-shadow: inset 0 0 0 2px;
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
            ${this.#monthText}
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
            ${this.#yearText}
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
    if (oldValue !== newValue) {
      this.render()
    }
  }

  isLeapYear() {
    if(!this.#year) return false
    return (this.#year % 4 === 0 && this.#year % 100 !== 0 || this.#year % 400 === 0)
  }

  checkDay() {
    if(!this.#day) return true
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
    if(this.#month > 12) {
      return false
    } else {
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
  }

  checkYear() {
    if(!this.#year) return true
    if(this.#year > 9999) {
      return false
    } else {
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
  }

  checkValidity(chunk) {
    if(this.checkMonth()) {
      this.monthInput.classList.remove('error')
    } else {
      this.monthInput.classList.add('error')
    }
    if(this.checkDay()) {
      this.dayInput.classList.remove('error')
    } else {
      this.dayInput.classList.add('error')
    }
    if(this.checkYear()) {
      this.yearInput.classList.remove('error')
    } else {
      this.yearInput.classList.add('error')
    }
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
      this.checkValidity(chunk)
    }
    if (chunk === 'month') {
      if(!isNaN(Number(this.monthInput.value)) && Number(this.monthInput.value)) {
        this.#month = Number(this.monthInput.value)
        this.monthInput.value = `${this.#month}`
      } else {
        this.#month = 0
        this.monthInput.value = ''
      }
      this.checkValidity(chunk)
    }
    if (chunk === 'year') {
      if(!isNaN(Number(this.yearInput.value)) && Number(this.yearInput.value)) {
        this.#year = Number(this.yearInput.value)
        this.yearInput.value = `${this.#year}`
      } else {
        this.#year = 0
        this.yearInput.value = ''
      }
      this.checkValidity(chunk)
    }
  }

  /**
   * Default value is now
   * @param {string|null} name
   * @returns {Date}
   */
  get value() {
    return this.hasAttribute('value') ? new Date(this.getAttribute('value')) : new Date()
  }

  set value(value) {
    this.setAttribute('value', value)
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

  /**
   * Default value is 0 years from now
   * @param {string|null} max
   * @returns {Date}
   */
  get max() {
    return this.hasAttribute('max') ? new Date(this.getAttribute('max')) : this.addYears(new Date(), 0)
  }

  get dayText() {
    return this.hasAttribute('dayText') ? this.getAttribute('dayText') : this.#dayText
  }

  get monthText() {
    return this.hasAttribute('monthText') ? this.getAttribute('monthText') : this.#monthText
  }

  get yearText() {
    return this.hasAttribute('yearText') ? this.getAttribute('yearText') : this.#yearText
  }

}

window.customElements.define('wc-date-input', WCDateInput)