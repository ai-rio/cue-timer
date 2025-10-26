import '@testing-library/jest-dom';

// Global type declarations for Jest DOM matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveFocus(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, string>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveErrorMessage(text: string | RegExp): R;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toHaveFormValues(values: Record<string, any>): R;
      toHaveHTMLContent(html: string | RegExp): R;
      toHaveRole(role: string): R;
      toHaveAccessibleDescription(text: string | RegExp): R;
      toHaveAccessibleName(text: string | RegExp): R;
      toBeEmptyDOMElement(): R;
      toBePartiallyChecked(checkedState: 'true' | 'false' | 'mixed'): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}

// Add any other global type declarations here
declare global {
  namespace NodeJS {
    interface Global {
      describe: typeof jest.describe;
      test: typeof jest.test;
      expect: typeof jest.expect;
      beforeAll: typeof jest.beforeAll;
      afterAll: typeof jest.afterAll;
      beforeEach: typeof jest.beforeEach;
      afterEach: typeof jest.afterEach;
      jest: typeof jest;
    }
  }
}

export {};
