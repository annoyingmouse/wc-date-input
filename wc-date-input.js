class WCDateInput extends HTMLElement {
  #day = null
  #month = null
  #year = null
  #dayText = 'Day'
  #monthText = 'Month'
  #yearText = 'Year'


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
    this.#day.addEventListener('change', () => this.updateValue())
    this.#month.addEventListener('change', () => this.updateValue())
    this.#year.addEventListener('change', () => this.updateValue())
  }

  get css() {
    return `
      <style>
        .date-input:after {
          content: "";
          display: block;
          clear: both;
        }
        .date-input__item {
          display: inline-block;
          margin-right: 20px;
          margin-bottom: 0;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 400;
          color: #0b0c0c;
          margin-bottom: 5px;
          display: block;
        }
        .date-input__input {
          margin-bottom: 0;
        }
        
        .input--width-2 {
          max-width: 2.75em;
        }
        
        
        @media (min-width: 40.0625em)
          .form-group {
            margin-bottom: 30px;
          }
          .date-input__label {
            font-size: 19px;
            font-size: 1.1875rem;
            line-height: 1.3157894737;
          }
      </style>
    `
  }

  get html() {
    return `
      <div class="date-input">
        <div class="date-input__item">
          <div class="form-group">
            <label for="day">
              ${this.dayText}
            </label>
            <input className="date-input__input input--width-2"
                   id="day"
                   name="day"
                   type="text"
                   inputmode="numeric">
          </div>
        </div>
        <div class="date-input__item">
          <div class="form-group">
            <label for="month">
              ${this.#monthText}
            </label>
            <input className="date-input__input input--width-2"
                   id="month"
                   name="month"
                   type="text"
                   inputmode="numeric"/>
          </div>
        </div>
        <div class="date-input__item">
          <div class="form-group">
            <label for="year"/>
              ${this.#yearText}
            </label>
            <input class="date-input__input input--width-4"
                   id="year"
                   name="year"
                   type="text"
                   inputmode="numeric"/>
          </div>
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

  updateValue() {
    const date = new Date(this.#year.value, this.#month.value - 1, this.#day.value)
    this.value = date.toISOString().split('T')[0]
  }

  /**
   * Default value is now
   * @param {string|null} name
   * @returns {Date}
   */
  get value() {
    return this.hasAttribute('value') ? new Date(this.getAttribute('value')) : new Date()
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