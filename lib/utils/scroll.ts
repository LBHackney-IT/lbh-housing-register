export function scrollTo(selector: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView();
  }
}

export function scrollToError(selector?: string) {
  if (!selector) {
    selector = '.govuk-error-summary';
  }

  scrollTo(selector);
}

export function scrollToTop() {
  window.scroll({ top: 0, behavior: 'smooth' });
}
