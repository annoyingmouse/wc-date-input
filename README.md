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

## License

MIT
