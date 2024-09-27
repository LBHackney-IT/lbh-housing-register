import { createAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { Store } from '.';
import { Applicant, Question } from '../../domain/HousingApi';
import { FormID } from '../utils/form-data';

export type ApplicantWithPersonID = Applicant & {
  person: Applicant['person'] & { id: string };
};

export function applicantHasId(
  applicant: Applicant | undefined = {}
): applicant is ApplicantWithPersonID {
  return !!applicant.person?.id;
}

export const updateApplicant = createAction<ApplicantWithPersonID>(
  'applicant/updateApplicant'
);

export const updateWithFormValues = createAction<{
  personID: string;
  formID: FormID;
  values: FormikValues;
  markAsComplete: boolean;
}>('applicant/updateWithFormValues');

export function applyQuestions(
  state: Applicant | undefined = {},
  activeStepId: string,
  values: FormikValues
): Applicant {
  return {
    ...state,
    questions: [
      ...(state?.questions?.filter(
        (question) => !question.id?.startsWith(`${activeStepId}/`)
      ) || []),
      ...Object.entries(values).map(([id, answer]) => ({
        id: `${activeStepId}/${id}`,
        answer: JSON.stringify(answer),
      })),
    ],
  };
}

export function updateApplicantReducer(
  state: Applicant | undefined,
  payload: Applicant
) {
  return {
    ...state,
    person: {
      ...state?.person,
      ...payload.person,
    },
    contactInformation: {
      ...state?.contactInformation,
      ...payload.contactInformation,
    },
    address: {
      ...state?.address,
      ...payload.address,
    },
  };
}

export const selectApplicant = (applicantPersonId: string) => (
  store: Store
): ApplicantWithPersonID | undefined => {
  if (
    applicantHasId(store.application.mainApplicant) &&
    store.application.mainApplicant?.person?.id === applicantPersonId
  ) {
    return store.application.mainApplicant;
  }
  return store.application.otherMembers?.find(
    (a): a is ApplicantWithPersonID =>
      applicantHasId(a) && a.person?.id === applicantPersonId
  );
};

export const findQuestion = (formID: FormID, questionName: string) => (
  question: Question
) => question.id === `${formID}/${questionName}`;

export function getQuestionValue(
  questions: Question[] | undefined,
  formID: FormID,
  questionName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallbackValue: any = undefined
) {
  const a = questions?.find(findQuestion(formID, questionName))?.answer;
  return a ? JSON.parse(a) : fallbackValue;
}

export function getQuestionsForFormAsValues(
  formID: FormID,
  applicant: Applicant
): FormikValues {
  return Object.fromEntries(
    (applicant.questions ?? [])
      .filter((question) => question.id?.startsWith(`${formID}/`))
      .map((question) => [
        (question.id || '').slice(`${formID}/`.length),
        JSON.parse(question.answer || 'null'),
      ])
  );
}
