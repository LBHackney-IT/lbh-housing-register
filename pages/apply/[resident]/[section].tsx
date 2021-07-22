import { useRouter } from 'next/router';
import ApplicationForms from '../../../components/application/application-forms';
import Hint from '../../../components/form/hint';
import Layout from '../../../components/layout/resident-layout';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import { applicantHasId, selectApplicant } from '../../../lib/store/applicant';

import { useAppSelector } from '../../../lib/store/hooks';
import { getApplicationSectionFromId } from '../../../lib/utils/application-forms';
import { getApplicationSectionsForResident } from '../../../lib/utils/resident';
import Custom404 from '../../404';

const ApplicationSection = (): JSX.Element => {
  const router = useRouter();
  const { resident, section } = router.query as {
    resident: string;
    section: string;
  };

  const applicant = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);

  if (!applicantHasId(applicant)) {
    return <Custom404 />;
  }

  const baseHref = `/apply/${applicant.person.id}`;
  const returnHref = '/apply/overview';

  const sectionGroups = getApplicationSectionsForResident(
    applicant === mainResident
  );

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: applicant.person.firstName || '',
    },
    {
      href: `${baseHref}/${section}`,
      name: getApplicationSectionFromId(section, sectionGroups)?.heading || '',
    },
  ];

  const onSubmit = async () => {
    router.push(baseHref);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Hint content={applicant.person.firstName ?? ''} />
      <ApplicationForms
        applicant={applicant}
        sectionGroups={sectionGroups}
        activeStep={section}
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default whenAgreed(ApplicationSection);
