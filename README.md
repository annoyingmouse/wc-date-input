# <wc-date-input>

This web component creates a configurable date input similar to that suggested by the [UK Government](https://design-system.service.gov.uk/components/date-input/).

If you're anything like me, you'll find scrolling through months looking for your date of birth painful on android devices. Demo [here](https://codepen.io/annoyingmouse/pen/BaGzPdv).

## Usage

```html
<wc-date-input></wc-date-input>
<script type="module" src="wc-date-input.js"></script>
```

## Configuration

* Adding a `name` allows the component to participate in form submission — the value will appear in `FormData` under that name.
* Adding a `value` will allow you to pre-populate the input - the value date will be checked and ignored if invalid.
* Adding a `min` value will allow you to set a minimum valid date - the min date will be checked for validity and ignored if invalid.
* Adding a `max` value will allow you to set a maximum valid date - the max date will be checked for validity and ignored if invalid.
* Adding `disabled` disables the input and excludes it from form submission.
* Adding `required` enables native form validation. `checkValidity()` and `reportValidity()` are supported. The component will not accept invalid dates or dates outside the `min`/`max` range.
* Adding `readonly` prevents the input from changing.
* Adding `data-label` sets the text of the fieldset legend.
* Adding `data-day-text` allows you to change the label above the day input.
* Adding `data-month-text` allows you to change the label above the month input.
* Adding `data-year-text` allows you to change the label above the year input.
* Adding `data-value-missing` allows you to customise the validation message if `required` is set.
* Adding `data-error-text` allows you to use external validation to set the field as invalid.
* Adding `data-hint-text` overrides the default screen-reader hint (*"Focus moves automatically as you complete each field."*) — useful for internationalisation.
* Adding `data-day-autocomplete`, `data-month-autocomplete`, and `data-year-autocomplete` sets the `autocomplete` attribute on each sub-field (default `off`). For a date-of-birth field use `bday-day`, `bday-month`, and `bday-year` respectively.
* Adding `data-today-button-text` shows a GOV.UK-styled button that fills the inputs with today's date. The attribute value is used as the button label; if empty, it defaults to *"Use today's date"*. The button is automatically disabled when `disabled` or `readonly` is set. When `data-label` is also set, the button's `aria-label` combines both values (e.g. *"Use today's date, Start date"*) so screen reader users can distinguish it when multiple date inputs appear on the same page.

```html
<wc-date-input
  name="dob"
  data-label="Date of birth"
  data-day-autocomplete="bday-day"
  data-month-autocomplete="bday-month"
  data-year-autocomplete="bday-year"
></wc-date-input>
```

To show the today button with a custom label:

```html
<wc-date-input
  name="start-date"
  data-label="Start date"
  data-today-button-text="Use today's date"
></wc-date-input>
```

## Events

* A `change` event (bubbles) is fired whenever the component's value changes. Read the new value from `event.target.value`.

```js
document.querySelector('wc-date-input').addEventListener('change', (e) => {
  console.log(e.target.value) // e.g. '2024-03-15' or '' if cleared
})
```

## Keyboard navigation

| Key | Action |
|-----|--------|
| ArrowUp / ArrowDown | Increment or decrement the focused field (day, month, or year). Day and month wrap; year clamps to `min`/`max`. |
| ArrowRight | Move focus to the next field when the cursor is at the end of the current field. |
| ArrowLeft | Move focus to the previous field when the cursor is at the start of the current field. |
| Backspace (on empty field) | Move focus to the previous field. |
| Typing digits | Focus advances automatically once a field is complete (e.g. day ≥ 10, or a single digit that cannot start a valid two-digit value). |

## License

MIT
