import { useRouter } from 'next/router';
import ApplicationForms from '../../../components/application/application-forms';
import Layout from '../../../components/layout/resident-layout';
import withApplication from '../../../lib/hoc/withApplication';
import { selectApplicant } from '../../../lib/store/applicant';
import { Applicant } from '../../../domain/HousingApi';
import { useAppSelector } from '../../../lib/store/hooks';
import { getApplicationSectionFromId } from '../../../lib/utils/application-forms';
import { isOver18 } from '../../../lib/utils/dateOfBirth';
import { getApplicationSectionsForResident } from '../../../lib/utils/resident';

const ApplicationSection = (): JSX.Element => {
  const router = useRouter();
  const { resident, section } = router.query as {
    resident: string;
    section: string;
  };

  const applicant = useAppSelector(selectApplicant(resident)) as Applicant;
  const mainResident = useAppSelector((s) => s.application.mainApplicant);

  const baseHref = `/apply/${applicant?.person?.id}`;
  const returnHref = '/apply/overview';

  const sectionGroups = applicant
    ? getApplicationSectionsForResident(
        applicant === mainResident,
        isOver18(applicant),
        applicant.person?.relationshipType === 'partner'
      )
    : [];

  const sectionName =
    getApplicationSectionFromId(section, sectionGroups)?.heading || '';

  const breadcrumbs = [
    {
      id: 'apply-overview',
      href: returnHref,
      name: 'Application',
    },
    {
      id: 'apply-resident',
      href: baseHref,
      name: applicant?.person?.firstName || '',
    },
    {
      id: 'apply-resident-section',
      href: `${baseHref}/${section}`,
      name: sectionName,
    },
  ];

  const onSubmit = async () => {
    router.push(baseHref);
  };

  return (
    <Layout pageName={sectionName} breadcrumbs={breadcrumbs}>
      <ApplicationForms
        applicant={applicant}
        sectionGroups={sectionGroups}
        activeStep={section}
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default withApplication(ApplicationSection);
