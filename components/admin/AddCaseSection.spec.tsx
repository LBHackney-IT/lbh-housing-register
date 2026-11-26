import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';

import AddCaseSection from './AddCaseSection';
import { type SectionData } from '../../lib/utils/adminHelpers';

const section: SectionData = {
  sectionId: 'personal-details',
  sectionHeading: 'Personal details',
  fields: [{ name: 'emailAddress', label: 'Email', type: 'email' }],
};

describe('AddCaseSection submit errors', () => {
  it('passes a submit error through to the matching text field', () => {
    render(
      <Formik
        initialValues={{ personalDetails_emailAddress: 'ada@example.com' }}
        onSubmit={jest.fn()}
      >
        <AddCaseSection
          section={section}
          fieldErrors={{
            personalDetails_emailAddress:
              'An application already exists for this email address.',
          }}
        />
      </Formik>,
    );

    expect(
      screen.getByText('An application already exists for this email address.'),
    ).toBeInTheDocument();
  });
});

describe('AddCaseSection read-only fields', () => {
  const twoFieldSection: SectionData = {
    sectionId: 'personal-details',
    sectionHeading: 'Personal details',
    fields: [
      { name: 'emailAddress', label: 'Email', type: 'email' },
      { name: 'phoneNumber', label: 'Mobile number', type: 'text' },
    ],
  };

  it('renders the listed fields as read-only and leaves the others editable', () => {
    render(
      <Formik
        initialValues={{
          personalDetails_emailAddress: 'ada@example.com',
          personalDetails_phoneNumber: '07123456789',
        }}
        onSubmit={jest.fn()}
      >
        <AddCaseSection
          section={twoFieldSection}
          readOnlyFields={{ emailAddress: 'Locked for sign-in.' }}
        />
      </Formik>,
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute('name', 'personalDetails_emailAddress');
    expect(inputs[0]).toHaveAttribute('readonly');
    expect(inputs[1]).toHaveAttribute('name', 'personalDetails_phoneNumber');
    expect(inputs[1]).not.toHaveAttribute('readonly');
  });

  it('shows the reason for a read-only field as its hint', () => {
    render(
      <Formik
        initialValues={{ personalDetails_emailAddress: 'ada@example.com' }}
        onSubmit={jest.fn()}
      >
        <AddCaseSection
          section={section}
          readOnlyFields={{ emailAddress: 'Locked for sign-in.' }}
        />
      </Formik>,
    );

    expect(screen.getByText('Locked for sign-in.')).toBeInTheDocument();
  });
  it('leaves every field editable when no read-only fields are given', () => {
    render(
      <Formik
        initialValues={{ personalDetails_emailAddress: 'ada@example.com' }}
        onSubmit={jest.fn()}
      >
        <AddCaseSection section={section} />
      </Formik>,
    );

    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly');
  });
});
