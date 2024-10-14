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
  dataTestId,
}: {
  children: ReactNode;
  formID: FormID;
  stepName: string;
  applicant: Applicant;
  dataTestId?: string;
}): ReactElement {
  const formData = getFormData(formID);
  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
    {
      href: `/apply/${applicant.person?.id}`,
      name: applicant.person?.firstName || '',
    },
    {
      href: `/apply/${applicant.person?.id}/${formID}`,
      name: stepName,
    },
  ];

  return (
    <Layout
      pageName={stepName}
      breadcrumbs={breadcrumbs}
      dataTestId={dataTestId}
    >
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
