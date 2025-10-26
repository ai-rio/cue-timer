// Global type declarations for Jest DOM matchers in tests
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBeDisabled(): R;
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toHaveStyle(styles: Record<string, string>): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toBeEmptyDOMElement(): R;
      toBePartiallyChecked(): R;
      toHaveRole(role: string): R;
      toHaveAccessibleName(name: string | RegExp): R;
      toHaveAccessibleDescription(description: string | RegExp): R;
      toHaveErrorMessage(message: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp): R;
      toHaveFormValues(values: Record<string, unknown>): R;
      toHaveValue(value: string | RegExp): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveClass(...classNames: string[]): R;
      toHaveHTML(html: string | RegExp): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
      toHaveStyle(styles: Record<string, string | RegExp>): R;
      toBeVisible(): R;
      toBeInTheDocument(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string | RegExp): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveErrorMessage(text: string | RegExp): R;
      toHaveFormValues(values: Record<string, unknown>): R;
      toHaveRole(role: string, options?: { queryFallbacks?: boolean }): R;
      toHaveValue(value: string | RegExp): R;
      toBeChecked(): R;
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBePartiallyChecked(): R;
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveFocus(): R;
      toBeInTheDocument(): R;
    }
  }
}
