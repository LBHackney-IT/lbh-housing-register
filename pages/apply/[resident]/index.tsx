import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { HeadingTwo } from '../../../components/content/headings';
import DeleteLink from '../../../components/delete-link';
import Layout from '../../../components/layout/resident-layout';
import SummaryList, {
  SummaryListActions,
  SummaryListRow,
  SummaryListValue,
} from '../../../components/summary-list';
import Tag from '../../../components/tag';
import {
  ApplicantWithPersonID,
  getQuestionValue,
  selectApplicant,
} from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { removeApplicant } from '../../../lib/store/otherMembers';
import {
  applicationSteps,
  getApplicationSectionsForResident,
} from '../../../lib/utils/resident';
import Custom404 from '../../404';
import Button, { ButtonLink } from '../../../components/button';
import { isOver18 } from '../../../lib/utils/dateOfBirth';
import { FormID } from '../../../lib/utils/form-data';
import { checkEligible } from '../../../lib/utils/form';
import withApplication from '../../../lib/hoc/withApplication';

const ResidentIndex = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(
    selectApplicant(resident)
  ) as ApplicantWithPersonID;
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const application = useAppSelector((store) => store.application);

  const baseHref = `/apply/${currentResident.person?.id}`;
  const returnHref = '/apply/overview';
  const checkAnswers = `${baseHref}/summary`;

  const [isEligible] = checkEligible(application);
  if (!isEligible && currentResident === mainResident) {
    router.push(checkAnswers);
  }

  const steps = getApplicationSectionsForResident(
    currentResident === mainResident,
    isOver18(currentResident),
    currentResident.person.relationshipType === 'partner'
  );

  const tasks = applicationSteps(
    currentResident,
    currentResident === mainResident
  );

  let sectionNames: FormID[] = [];
  steps.map((step) => {
    step.sections.map((section) => {
      sectionNames.push(section.id);
    });
  });

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: currentResident.person?.firstName || '',
    },
  ];

  const onDelete = () => {
    dispatch(removeApplicant(currentResident.person.id));

    router.push(returnHref);
  };

  const goBack = () => {
    router.push('/apply/overview');
  };

  const isSectionActive = (formId: FormID) => {
    const indexOfSectionName = sectionNames.indexOf(formId);

    // First Section is always unlocked
    if (indexOfSectionName === 0) {
      return true;
    }

    // Has previous section been completed?
    return getQuestionValue(
      currentResident.questions,
      sectionNames[indexOfSectionName - 1],
      'sectionCompleted',
      false
    );
  };

  const cantStartYetTag = (formID: FormID) => {
    const sectionActive = isSectionActive(formID);
    return sectionActive ? (
      <Tag content="To do" />
    ) : (
      <Tag content="Can't start yet" variant="grey" />
    );
  };

  return (
    <>
      {currentResident && mainResident ? (
        <Layout pageName="Person overview" breadcrumbs={breadcrumbs}>
          <h1 className="lbh-heading-h1" style={{ marginBottom: '40px' }}>
            <span className="govuk-hint lbh-hint">
              Complete information for:
            </span>
            {`${currentResident.person?.firstName} ${currentResident.person?.surname}`}
          </h1>

          {steps.map((step, index) => (
            <div key={index}>
              <HeadingTwo content={step.heading} />
              <SummaryList>
                {step.sections.map((formStep, index) => (
                  <SummaryListRow key={index}>
                    <SummaryListValue>
                      {isSectionActive(formStep.id) ? (
                        <Link href={`${baseHref}/${formStep.id}`}>
                          <a className="lbh-link">{formStep.heading}</a>
                        </Link>
                      ) : (
                        formStep.heading
                      )}
                    </SummaryListValue>
                    <SummaryListActions>
                      {getQuestionValue(
                        currentResident.questions,
                        formStep.id,
                        'sectionCompleted',
                        false
                      ) ? (
                        <Tag content="Completed" variant="green" />
                      ) : (
                        cantStartYetTag(formStep.id)
                      )}
                    </SummaryListActions>
                  </SummaryListRow>
                ))}
              </SummaryList>
            </div>
          ))}
          {tasks.remaining == 0 && (
            <ButtonLink href={`/apply/${currentResident.person?.id}/summary/`}>
              Check answers
            </ButtonLink>
          )}
          <br />
          <Button onClick={goBack} secondary={true}>
            Save and go back
          </Button>
          {currentResident !== mainResident && (
            <DeleteLink
              content="Delete this information"
              details="This information will be permanently deleted."
              onDelete={onDelete}
            />
          )}
        </Layout>
      ) : (
        <Custom404 />
      )}
    </>
  );
};

export default withApplication(ResidentIndex);
