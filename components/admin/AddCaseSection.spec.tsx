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
