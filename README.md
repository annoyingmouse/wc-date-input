# <wc-date-input>

This web component creates a configurable date input similar to that suggested by the [UK Government](https://design-system.service.gov.uk/components/date-input/).

If you're anything like me, you'll find scrolling through months looking for your date of birth painful on android devices. Demo [here](https://codepen.io/annoyingmouse/pen/BaGzPdv).

## Usage

```html
<wc-date-input></wc-date-input>
<script type="module" src="wc-date-input.js"></script>
```

## Configuration

* Adding a `value` will allow you to pre-populate the input - the value date will be checked and ignored if invalid.
* Adding a `min` value will allow you to set a minimum valid date - the min date will be checked for validity and ignored if invalid.
* Adding a `max` value will allow you to set a maximum valid date - the max date will be checked for validity and ignored if invalid.
* Adding `disabled` disables the input.
* Adding `required` enables validation of the input. The component is opinionated about what it will allow you to enter (invalid dates or those outside the min and max range will not be accepted) - you should not be able to enter invalid dates.
* Adding `readonly` prevents the input from changing.
* Adding `data-day-text` allows you to change the label above the day input.
* Adding `data-month-text` allows you to change the label above the month input.
* Adding `data-year-text` allows you to change the label above the year input.
* Adding `data-value-missing` allows you to customise the validation message if required is set.
* Adding `data-error-text` allows you to use external validation to set the field as invalid.

## License

MIT