import { fixture, html, expect } from '@open-wc/testing'
import { sendKeys } from '@web/test-runner-commands'
import '../wc-date-input.js'

// Navigate focus from the default day field to month.
// Requires the component to have a value so the day field is non-empty;
// End ensures the cursor is at the trailing edge before ArrowRight.
async function focusMonth(el) {
  el.focus()
  await sendKeys({ press: 'End' })
  await sendKeys({ press: 'ArrowRight' })
}

// Navigate focus through day and month to reach year.
async function focusYear(el) {
  el.focus()
  await sendKeys({ press: 'End' })
  await sendKeys({ press: 'ArrowRight' })
  await sendKeys({ press: 'End' })
  await sendKeys({ press: 'ArrowRight' })
}

// ─── Value ────────────────────────────────────────────────────────────────────

describe('value attribute', () => {
  it('reads back a valid date string', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    expect(el.value).to.equal('2024-03-15')
  })

  it('ignores a non-date string', async () => {
    const el = await fixture(html`<wc-date-input value="not-a-date"></wc-date-input>`)
    expect(el.value).to.equal('')
  })

  it('ignores a structurally valid but impossible date', async () => {
    const el = await fixture(html`<wc-date-input value="2024-02-30"></wc-date-input>`)
    expect(el.value).to.equal('')
  })

  it('clears fields when value attribute is removed', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    el.removeAttribute('value')
    expect(el.value).to.equal('')
  })

  it('fires a change event when value changes', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    let fired = false
    el.addEventListener('change', () => { fired = true })
    el.setAttribute('value', '2024-03-15')
    expect(fired).to.be.true
  })

  it('does not fire a change event when the value is set to the same string', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    let count = 0
    el.addEventListener('change', () => { count++ })
    el.setAttribute('value', '2024-03-15')
    expect(count).to.equal(0)
  })
})

// ─── Date validation ──────────────────────────────────────────────────────────

describe('leap year validation', () => {
  it('accepts Feb 29 in a leap year', async () => {
    const el = await fixture(html`<wc-date-input value="2024-02-29"></wc-date-input>`)
    expect(el.value).to.equal('2024-02-29')
  })

  it('rejects Feb 29 in a non-leap year', async () => {
    const el = await fixture(html`<wc-date-input value="2023-02-29"></wc-date-input>`)
    expect(el.value).to.equal('')
  })

  it('accepts Feb 28 in a non-leap year', async () => {
    const el = await fixture(html`<wc-date-input value="2023-02-28"></wc-date-input>`)
    expect(el.value).to.equal('2023-02-28')
  })
})

describe('month-length validation', () => {
  for (const month of ['04', '06', '09', '11']) {
    it(`rejects day 31 in month ${month}`, async () => {
      const el = await fixture(html`<wc-date-input value="2024-${month}-31"></wc-date-input>`)
      expect(el.value).to.equal('')
    })

    it(`accepts day 30 in month ${month}`, async () => {
      const el = await fixture(html`<wc-date-input value="2024-${month}-30"></wc-date-input>`)
      expect(el.value).to.equal(`2024-${month}-30`)
    })
  }

  it('accepts day 31 in January', async () => {
    const el = await fixture(html`<wc-date-input value="2024-01-31"></wc-date-input>`)
    expect(el.value).to.equal('2024-01-31')
  })
})

// ─── Required validation ──────────────────────────────────────────────────────

describe('required', () => {
  it('is invalid when required and no value is set', async () => {
    const el = await fixture(html`<wc-date-input required></wc-date-input>`)
    expect(el.checkValidity()).to.be.false
  })

  it('sets validity.valueMissing when required and empty', async () => {
    const el = await fixture(html`<wc-date-input required></wc-date-input>`)
    expect(el.validity.valueMissing).to.be.true
  })

  it('is valid when required and a date is provided', async () => {
    const el = await fixture(html`<wc-date-input required value="2024-03-15"></wc-date-input>`)
    expect(el.checkValidity()).to.be.true
  })

  it('becomes invalid when required and value is cleared', async () => {
    const el = await fixture(html`<wc-date-input required value="2024-03-15"></wc-date-input>`)
    el.removeAttribute('value')
    expect(el.checkValidity()).to.be.false
  })
})

// ─── Min / max ────────────────────────────────────────────────────────────────

describe('min and max', () => {
  it('clears value when min is set to a date after the current value', async () => {
    const el = await fixture(html`<wc-date-input value="2024-01-01"></wc-date-input>`)
    el.setAttribute('min', '2024-06-01')
    expect(el.value).to.equal('')
  })

  it('clears value when max is set to a date before the current value', async () => {
    const el = await fixture(html`<wc-date-input value="2024-12-31"></wc-date-input>`)
    el.setAttribute('max', '2024-06-01')
    expect(el.value).to.equal('')
  })

  it('keeps value when it lies within min and max', async () => {
    const el = await fixture(html`
      <wc-date-input value="2024-06-15" min="2024-01-01" max="2024-12-31">
      </wc-date-input>`)
    expect(el.value).to.equal('2024-06-15')
  })
})

// ─── Form integration ─────────────────────────────────────────────────────────

describe('form integration', () => {
  it('includes the date string in FormData under the component name', async () => {
    const form = await fixture(html`
      <form>
        <wc-date-input name="dob" value="2024-03-15"></wc-date-input>
      </form>`)
    expect(new FormData(form).get('dob')).to.equal('2024-03-15')
  })

  it('submits an empty string when no value is set', async () => {
    const form = await fixture(html`
      <form>
        <wc-date-input name="dob"></wc-date-input>
      </form>`)
    expect(new FormData(form).get('dob')).to.equal('')
  })

  it('is excluded from FormData when disabled', async () => {
    const form = await fixture(html`
      <form>
        <wc-date-input name="dob" value="2024-03-15" disabled></wc-date-input>
      </form>`)
    expect(new FormData(form).get('dob')).to.be.null
  })

  it('willValidate is false when disabled', async () => {
    const el = await fixture(html`<wc-date-input disabled required></wc-date-input>`)
    expect(el.willValidate).to.be.false
  })
})

// ─── Keyboard: ArrowUp / ArrowDown ───────────────────────────────────────────

describe('keyboard ArrowUp / ArrowDown — day field', () => {
  it('ArrowUp increments the day', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-10"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-03-11')
  })

  it('ArrowDown decrements the day', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-10"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2024-03-09')
  })

  it('ArrowUp wraps from the month max back to 1', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-31"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-03-01')
  })

  it('ArrowDown wraps from 1 to the month max', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-01"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2024-03-31')
  })

  it('ArrowDown from day 1 wraps to 29 in a leap-year February', async () => {
    const el = await fixture(html`<wc-date-input value="2024-02-01"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2024-02-29')
  })

  it('ArrowDown from day 1 wraps to 28 in a non-leap-year February', async () => {
    const el = await fixture(html`<wc-date-input value="2023-02-01"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2023-02-28')
  })
})

describe('keyboard ArrowUp / ArrowDown — month field', () => {
  it('ArrowUp increments the month', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusMonth(el)
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-04-15')
  })

  it('ArrowDown decrements the month', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusMonth(el)
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2024-02-15')
  })

  it('ArrowUp wraps from 12 to 1', async () => {
    const el = await fixture(html`<wc-date-input value="2024-12-15"></wc-date-input>`)
    await focusMonth(el)
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-01-15')
  })

  it('ArrowDown wraps from 1 to 12', async () => {
    const el = await fixture(html`<wc-date-input value="2024-01-15"></wc-date-input>`)
    await focusMonth(el)
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2024-12-15')
  })
})

describe('keyboard ArrowUp / ArrowDown — year field', () => {
  it('ArrowUp increments the year', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2025-03-15')
  })

  it('ArrowDown decrements the year', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2023-03-15')
  })

  it('ArrowUp clamps at the max year', async () => {
    const el = await fixture(html`
      <wc-date-input max="2025-12-31" value="2025-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2025-03-15')
  })

  it('ArrowDown clamps at the min year', async () => {
    const el = await fixture(html`
      <wc-date-input min="2020-01-01" value="2020-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'ArrowDown' })
    expect(el.value).to.equal('2020-03-15')
  })
})

// ─── Keyboard: ArrowLeft / ArrowRight focus navigation ───────────────────────

describe('keyboard ArrowLeft / ArrowRight — focus navigation', () => {
  it('ArrowRight at end of day moves focus to month (ArrowUp increments month)', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusMonth(el)
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-04-15')
  })

  it('ArrowRight at end of month moves focus to year (ArrowUp increments year)', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2025-03-15')
  })

  it('ArrowLeft at start of year moves focus to month (ArrowUp increments month)', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusYear(el)
    // year cursor is at 0 after navigation (setSelectionRange(0,0) is called on focus)
    await sendKeys({ press: 'ArrowLeft' })
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-04-15')
  })

  it('ArrowLeft at start of month moves focus to day (ArrowUp increments day)', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusMonth(el)
    // month cursor is at 0 after navigation
    await sendKeys({ press: 'ArrowLeft' })
    await sendKeys({ press: 'ArrowUp' })
    expect(el.value).to.equal('2024-03-16')
  })

  it('ArrowRight mid-value does not move focus to the next field', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    el.focus()
    await sendKeys({ press: 'Home' })       // cursor at 0, mid-value
    await sendKeys({ press: 'ArrowRight' }) // moves cursor to 1, not to month
    await sendKeys({ press: 'ArrowUp' })    // still on day: 15 → 16
    expect(el.value).to.equal('2024-03-16')
  })

  it('a full date can be entered entirely by keyboard using ArrowRight', async () => {
    // Use digits that do not trigger auto-advance: day ≤ 3, month = 1
    const root = await fixture(html`
      <div>
        <wc-date-input></wc-date-input>
        <button>next</button>
      </div>`)
    const el = root.querySelector('wc-date-input')

    el.focus()
    await sendKeys({ type: '3' })           // day = "3" (≤3, no auto-advance)
    await sendKeys({ press: 'ArrowRight' }) // → month  (day blurs → #day=3)
    await sendKeys({ type: '1' })           // month = "1" (≤1, no auto-advance)
    await sendKeys({ press: 'ArrowRight' }) // → year   (month blurs → #month=1)
    await sendKeys({ type: '2024' })        // year = "2024" (auto-commits)

    expect(el.value).to.equal('2024-01-03')
  })
})

// ─── Auto-advance ─────────────────────────────────────────────────────────────

describe('auto-advance between fields', () => {
  it('a single day digit of 4–9 auto-advances to month', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    el.focus()
    await sendKeys({ type: '5' })    // day=5 (≥4) → advance to month
    await sendKeys({ type: '3' })    // month=3 (≥2) → advance to year
    await sendKeys({ type: '2024' }) // year=2024 → auto-commit
    expect(el.value).to.equal('2024-03-05')
  })

  it('a two-digit day auto-advances to month', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    el.focus()
    await sendKeys({ type: '17' })   // day=17 (2 digits, ≤31) → advance to month
    await sendKeys({ type: '8' })    // month=8 (≥2) → advance to year
    await sendKeys({ type: '1972' }) // year=1972 → auto-commit
    expect(el.value).to.equal('1972-08-17')
  })

  it('a two-digit month auto-advances to year', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    el.focus()
    await sendKeys({ type: '15' })   // day=15 → advance to month
    await sendKeys({ type: '12' })   // month=12 (2 digits, ≤12) → advance to year
    await sendKeys({ type: '2024' }) // year=2024 → auto-commit
    expect(el.value).to.equal('2024-12-15')
  })

  it('typing digits continuously fills all three fields', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    el.focus()
    await sendKeys({ type: '1781972' })
    expect(el.value).to.equal('1972-08-17')
  })

  it('typing digits continuously works with a leading zero in day', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    el.focus()
    await sendKeys({ type: '17081972' })
    expect(el.value).to.equal('1972-08-17')
  })
})

// ─── Backspace navigation ─────────────────────────────────────────────────────

describe('Backspace on empty field moves focus to previous field', () => {
  it('Backspace in empty year moves focus to month', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'Control+a' })
    await sendKeys({ press: 'Backspace' }) // clears year content
    await sendKeys({ press: 'Backspace' }) // year empty → move to month
    // now on month: ArrowUp increments month (3 → 4)
    await sendKeys({ press: 'ArrowUp' })
    // re-enter year to get a complete date
    await sendKeys({ press: 'ArrowRight' })
    await sendKeys({ type: '2024' })
    expect(el.value).to.equal('2024-04-15')
  })

  it('Backspace in empty month moves focus to day', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusMonth(el)
    await sendKeys({ press: 'Control+a' })
    await sendKeys({ press: 'Backspace' }) // clears month content
    await sendKeys({ press: 'Backspace' }) // month empty → move to day
    // now on day: ArrowUp increments day (15 → 16)
    await sendKeys({ press: 'ArrowUp' })
    // re-enter month and year to get a complete date
    await sendKeys({ press: 'ArrowRight' })
    await sendKeys({ type: '3' })   // month=3, auto-advances to year
    await sendKeys({ type: '2024' })
    expect(el.value).to.equal('2024-03-16')
  })

  it('Backspace in a non-empty year field does not move focus', async () => {
    const el = await fixture(html`<wc-date-input value="2024-03-15"></wc-date-input>`)
    await focusYear(el)
    await sendKeys({ press: 'End' })
    await sendKeys({ press: 'Backspace' }) // deletes '4', year becomes '202'
    // still on year (field was not empty) — complete it by typing the missing digit
    await sendKeys({ type: '5' })  // year = '2025', auto-commits
    expect(el.value).to.equal('2025-03-15')
  })
})

// ─── data-today-button-text ──────────────────────────────────────────────────

describe('data-today-button-text — visibility', () => {
  it('button is hidden when attribute is absent', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    expect(button.classList.contains('visible')).to.be.false
  })

  it('button is visible when attribute is present', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date"></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    expect(button.classList.contains('visible')).to.be.true
  })

  it('adding the attribute dynamically shows the button', async () => {
    const el = await fixture(html`<wc-date-input></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    expect(button.classList.contains('visible')).to.be.false
    el.setAttribute('data-today-button-text', 'Today')
    expect(button.classList.contains('visible')).to.be.true
  })

  it('removing the attribute dynamically hides the button', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Today"></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    expect(button.classList.contains('visible')).to.be.true
    el.removeAttribute('data-today-button-text')
    expect(button.classList.contains('visible')).to.be.false
  })
})

describe('data-today-button-text — label', () => {
  it('shows the default label when attribute value is empty', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text=""></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    expect(button.textContent).to.equal("Use today's date")
  })

  it('shows custom text from the attribute value', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Set to today"></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    expect(button.textContent).to.equal('Set to today')
  })

  it('updates the button label when the attribute value changes', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Today"></wc-date-input>`)
    const button = el.shadow.querySelector('#today-button')
    el.setAttribute('data-today-button-text', 'Set date to today')
    expect(button.textContent).to.equal('Set date to today')
  })
})

describe('data-today-button-text — click behaviour', () => {
  const todayString = () => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  }

  it("sets the component value to today's date", async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date"></wc-date-input>`)
    el.shadow.querySelector('#today-button').click()
    expect(el.value).to.equal(todayString())
  })

  it('overwrites an existing value with today\'s date', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" value="2000-01-01"></wc-date-input>`)
    el.shadow.querySelector('#today-button').click()
    expect(el.value).to.equal(todayString())
  })

  it('fires a change event when clicked', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date"></wc-date-input>`)
    let fired = false
    el.addEventListener('change', () => { fired = true })
    el.shadow.querySelector('#today-button').click()
    expect(fired).to.be.true
  })
})

describe('data-today-button-text — disabled and readonly', () => {
  it('button is disabled when the component is disabled', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" disabled></wc-date-input>`)
    expect(el.shadow.querySelector('#today-button').disabled).to.be.true
  })

  it('button is enabled after disabled is removed', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" disabled></wc-date-input>`)
    el.disabled = false
    expect(el.shadow.querySelector('#today-button').disabled).to.be.false
  })

  it('button is disabled when the component is readonly', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" readonly></wc-date-input>`)
    expect(el.shadow.querySelector('#today-button').disabled).to.be.true
  })

  it('button is enabled after readonly is removed', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" readonly></wc-date-input>`)
    el.readonly = false
    expect(el.shadow.querySelector('#today-button').disabled).to.be.false
  })

  it('button is enabled when both disabled and readonly are absent', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date"></wc-date-input>`)
    expect(el.shadow.querySelector('#today-button').disabled).to.be.false
  })

  it('button does not update value when disabled', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" disabled value="2000-01-01"></wc-date-input>`)
    // disabled buttons do not fire click events
    el.shadow.querySelector('#today-button').click()
    expect(el.value).to.equal('2000-01-01')
  })
})

// ─── data-today-button-text — aria-label ─────────────────────────────────────

describe('data-today-button-text — aria-label', () => {
  it('has no aria-label when data-label is absent', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date"></wc-date-input>`)
    expect(el.shadow.querySelector('#today-button').hasAttribute('aria-label')).to.be.false
  })

  it('sets aria-label combining button text and legend when data-label is present', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" data-label="Start date"></wc-date-input>`)
    expect(el.shadow.querySelector('#today-button').getAttribute('aria-label')).to.equal("Use today's date, Start date")
  })

  it('uses the default button text in aria-label when attribute value is empty', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="" data-label="Start date"></wc-date-input>`)
    expect(el.shadow.querySelector('#today-button').getAttribute('aria-label')).to.equal("Use today's date, Start date")
  })

  it('updates aria-label when data-label changes', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" data-label="Start date"></wc-date-input>`)
    el.setAttribute('data-label', 'End date')
    expect(el.shadow.querySelector('#today-button').getAttribute('aria-label')).to.equal("Use today's date, End date")
  })

  it('removes aria-label when data-label is removed', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" data-label="Start date"></wc-date-input>`)
    el.removeAttribute('data-label')
    expect(el.shadow.querySelector('#today-button').hasAttribute('aria-label')).to.be.false
  })

  it('updates aria-label when data-today-button-text changes', async () => {
    const el = await fixture(html`<wc-date-input data-today-button-text="Use today's date" data-label="Start date"></wc-date-input>`)
    el.setAttribute('data-today-button-text', 'Set to today')
    expect(el.shadow.querySelector('#today-button').getAttribute('aria-label')).to.equal('Set to today, Start date')
  })
})
