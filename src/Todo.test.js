import { render } from '@testing-library/react';
import Todo from './Todo';

const todo = {title: "test", description:"testing", id:1}
test('renders', () => {
  render(<Todo todo={todo} remove={jest.fn()}/>);
});

test('renders correct todo', () => {
  const { container } = render(<Todo todo={todo} remove={jest.fn()}/>);

  expect(container).toContainHTML('testing');
})
