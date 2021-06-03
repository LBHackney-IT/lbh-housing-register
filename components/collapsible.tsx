import { useState } from 'react';

interface CollapsibleProps {
  heading: string;
  children: any;
}

export default function Collapsible({
  heading,
  children,
}: CollapsibleProps): JSX.Element {
  const [open, setOpen] = useState(true);

  return (
    <section className="lbh-collapsible">
      <button
        aria-expanded={open}
        className="lbh-collapsible__button"
        onClick={() => setOpen(!open)}
      >
        <h2 className="lbh-heading-h2 lbh-collapsible__heading">{heading}</h2>
        <svg width="17" height="10" viewBox="0 0 17 10">
          <path d="M2 1.5L8.5 7.5L15 1.5" strokeWidth="3" />
        </svg>
      </button>
      <div className="lbh-collapsible__content" hidden={!open}>
        {children}
      </div>
    </section>
  );
}
