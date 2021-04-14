import Tag from "./tag"

const PhaseBanner = (): JSX.Element => (
  <div className="govuk-phase-banner lbh-phase-banner lbh-container">
    <p className="govuk-phase-banner__content">
      <Tag content="Alpha" className="govuk-phase-banner__content__tag" />
      <span className="govuk-phase-banner__text">
        This is a new tool - it's work in progress. &nbsp;
        <a href="https://hackney.gov.uk/contact-us" title="Tell us what you think">Tell us what you think</a>, your feedback will help us to improve it.
      </span>
    </p>
  </div>
)

export default PhaseBanner