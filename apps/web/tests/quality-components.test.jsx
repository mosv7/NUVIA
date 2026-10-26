import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import Field from '../src/components/ui/Field.jsx';
import UiArrow from '../src/components/ui/UiArrow.jsx';
describe('shared component contracts', () => {
  it('associates the field label and input', () => {
    const html = renderToStaticMarkup(
      <Field name="email" label="Work email" type="email" value="" onChange={() => {}} />,
    );
    expect(html).toContain('for="email"');
    expect(html).toContain('id="email"');
  });
  it('exposes validation errors', () => {
    const html = renderToStaticMarkup(
      <Field name="email" label="Work email" value="" error="Required" onChange={() => {}} />,
    );
    expect(html).toContain('Required');
    expect(html).toContain('aria-invalid="true"');
  });
  it('mirrors the shared arrow for RTL', () => {
    expect(renderToStaticMarkup(<UiArrow rtl />)).toContain('180deg');
    expect(renderToStaticMarkup(<UiArrow />)).toContain('0deg');
  });
});
