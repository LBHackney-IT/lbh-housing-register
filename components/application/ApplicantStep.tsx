import { ReactElement, ReactNode } from 'react';
import { Applicant } from '../../domain/HousingApi';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { HeadingOne } from '../content/headings';
import Paragraph from '../content/paragraph';
import Layout from '../layout/resident-layout';

function ApplicantStep({
  children,
  formID,
  applicant,
  stepName,
}: {
  children: ReactNode;
  formID: FormID;
  stepName: string;
  applicant: Applicant;
}): ReactElement {
  const formData = getFormData(formID);
  const breadcrumbs = [
    {
      id: 'application-overview',
      href: '/apply/overview',
      name: 'Application',
    },
    {
      id: 'applicant-apply-id',
      href: `/apply/${applicant.person?.id}`,
      name: applicant.person?.firstName || '',
    },
    {
      id: 'applicant-apply-form',
      href: `/apply/${applicant.person?.id}/${formID}`,
      name: stepName,
    },
  ];

  return (
    <Layout pageName={stepName} breadcrumbs={breadcrumbs}>
      {formData.heading && <HeadingOne content={formData.heading} />}
      {formData.copy && (
        <Paragraph>
          <strong>{formData.copy}</strong>
        </Paragraph>
      )}

      {children}
    </Layout>
  );
}
export default ApplicantStep;
