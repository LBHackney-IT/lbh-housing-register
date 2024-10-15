import Link from 'next/link';
import { useRouter } from 'next/router';
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
import { useAppSelector, useAppDispatch } from '../../../lib/store/hooks';
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
import {
  ApiCallStatusCode,
  selectSaveApplicationStatus,
} from 'lib/store/apiCallsStatus';
import { useEffect, useState } from 'react';
import Loading from 'components/loading';

const ResidentIndex = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(
    selectApplicant(resident)
  ) as ApplicantWithPersonID;
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const application = useAppSelector((store) => store.application);

  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [userHasSaved, setUserHasSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const returnHref = '/apply/overview';
  let isEligible = true;

  //use effect to stop router.push firing multiple times
  useEffect(() => {
    if (!isEligible && currentResident === mainResident) {
      router.push(checkAnswers);
    }
  }, [isEligible]);

  useEffect(() => {
    if (userHasSaved) {
      setIsSaving(true);
      dispatch(removeApplicant(currentResident.person.id));
      setUserHasSaved(false);
    }

    if (isSaving) {
      if (saveApplicationStatus?.callStatus === ApiCallStatusCode.FULFILLED) {
        router.push(returnHref);
      }

      if (saveApplicationStatus?.callStatus === ApiCallStatusCode.REJECTED) {
        router.push(
          {
            pathname: returnHref,
            query: {
              error: 'Unable to delete household member. Please try again.',
            },
          },
          returnHref
        );
      }
    }
  }, [saveApplicationStatus?.callStatus, userHasSaved]);

  //render simple layout without loading application when saving
  if (isSaving) {
    return (
      <Layout pageName="Person overview" pageLoadsApplication={false}>
        <Loading text="Saving..." />
      </Layout>
    );
  }

  //redirect when applicant details missing and not saving
  if (!currentResident || !mainResident) {
    return <Custom404 />;
  }

  const baseHref = !isSaving ? `/apply/${currentResident.person?.id}` : '';

  const breadcrumbs = !isSaving
    ? [
        {
          href: returnHref,
          name: 'Application',
        },
        {
          href: baseHref,
          name: currentResident.person?.firstName || '',
        },
      ]
    : [];

  const checkAnswers = `${baseHref}/summary`;

  [isEligible] = checkEligible(application);

  const steps = getApplicationSectionsForResident(
    currentResident === mainResident,
    isOver18(currentResident),
    currentResident.person.relationshipType === 'partner'
  );

  const tasks = applicationSteps(
    currentResident,
    currentResident === mainResident
  );

  const sectionNames: FormID[] = [];
  steps.map((step) => {
    step.sections.map((section) => {
      sectionNames.push(section.id);
    });
  });

  const onDelete = () => {
    setUserHasSaved(true);
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
    <Layout
      pageName="Person overview"
      breadcrumbs={breadcrumbs}
      dataTestId="test-apply-resident-index-page"
    >
      <h1 className="lbh-heading-h1" style={{ marginBottom: '40px' }}>
        <span className="govuk-hint lbh-hint">Complete information for:</span>
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
          mainButtonTestId="test-apply-resident-index-delete-this-information-button"
          dialogConfirmButtonTestId="test-apply-resident-index-delete-this-information-confirm-button"
        />
      )}
    </Layout>
  );
};

export default withApplication(ResidentIndex);
