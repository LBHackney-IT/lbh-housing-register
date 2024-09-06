import { useEffect, useRef } from 'react';

import Paragraph from './paragraph';

const CookieBanner: React.FC = (): JSX.Element => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const loadCookieBanner = async () => {
      if (typeof window !== 'undefined') {
        const { CookieBanner: LbhCookieBanner } = await import('lbh-frontend');
        new LbhCookieBanner(ref.current as HTMLElement).init();
      }
    };

    loadCookieBanner();
  }, []);

  return (
    <section
      className="lbh-cookie-banner"
      data-module="lbh-cookie-banner"
      data-testid="test-cookie-banner"
      ref={ref}
    >
      <div className="lbh-container">
        <div className="govuk-grid-row">
          <div className="lbh-cookie-banner__content govuk-grid-column-two-thirds-from-desktop">
            <Paragraph>
              We use cookies to ensure you have the best experience. For full
              details see our{' '}
              <a href="https://hackney.gov.uk/privacy">privacy statement</a>.
            </Paragraph>
          </div>
          <div className="lbh-cookie-banner__button-wrapper govuk-grid-column-one-third-from-desktop">
            <button
              type="button"
              className="govuk-button lbh-cookie-banner__button lbh-button govuk-button--secondary lbh-button--secondary"
              data-module="govuk-button"
              data-behavior="lbh-cookie-close"
              data-testid="test-cookie-button"
            >
              Accept and close
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookieBanner;
