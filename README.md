# <wc-date-input>

This web component creates a configurable date input similar to that suggested by the [UK Government](https://design-system.service.gov.uk/components/date-input/).

If you're anything like me, you'll find scrolling through months looking for your date of birth painful on android devices.

## Usage

```html
<wc-date-input></wc-date-input>
<script type="module" src="wc-date-input.js"></script>
```

## Configuration

Adding a `value` will allow you to pre-populate the input - the date will be checked and discarded if invalid.

Adding a `min` value will allow you to set a minimum valid date - the date will be checked and discarded if invalid.

Adding a `max` value will allow you to set a maximum valid date - the date will be checked and discarded if invalid.
      
Adding `disabled` will disabled the input.

Adding `required` will enable validation of the input. The component is opinionated about what it will allow you to enter (invalid dates or those outside the `min` and `max` range will not be accepted) - you should not be able to enter invalid dates.

Adding `readonly` will prevent the input from changing

Adding `dayText` will allow you to change the label above the day input

Adding `monthText` will allow you to change the label above the month input

Adding `yearText` will allow you to change the label above the year input

Adding `data-value-missing` allows you to customise the validation message if `required` is set.

## License

MIT