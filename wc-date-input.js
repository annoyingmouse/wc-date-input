class WCDateInput extends HTMLElement {
  #day = ''
  #month = ''
  #year = ''
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
    this.#day = this.shadow.querySelector('#day')
    this.#month = this.shadow.querySelector('#month')
    this.#year = this.shadow.querySelector('#year')
    this.#day.addEventListener('change', () => this.updateValue('day'))
    this.#month.addEventListener('change', () => this.updateValue('month'))
    this.#year.addEventListener('change', () => this.updateValue('year'))
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
                 value="${this.#day}"
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
                 value="${this.#month}"
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
                 value="${this.#year}"
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

  checkValidity(chunk) {
    console.log('checkValidity called', chunk)
  }

  updateValue(chunk) {
    console.log('updateValue called', chunk)
    if (chunk === 'day') {
      this.#day = this.#day.value
      this.checkValidity(chunk)
    }
    if (chunk === 'month') {
      this.#month = this.#month.value
      this.checkValidity(chunk)
    }
    if (chunk === 'year') {
      this.#year = this.#year.value
      this.checkValidity(chunk)
    }
    // const date = new Date(this.#year.value, this.#month.value - 1, this.#day.value)
    // this.value = date.toISOString().split('T')[0]
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