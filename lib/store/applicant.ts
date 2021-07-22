import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { Store } from '.';
import { Applicant, Question } from '../../domain/HousingApi';
import { FormID } from '../utils/form-data';

const initialState: Applicant = {};

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
  action: PayloadAction<Partial<Applicant>>
) {
  return {
    ...state,
    person: {
      ...state?.person,
      ...action.payload.person,
    },
    contactInformation: {
      ...state?.contactInformation,
      ...action.payload.contactInformation,
    },
    address: {
      ...state?.address,
      ...action.payload.address,
    },
  };
}

const slice = createSlice({
  name: 'applicant',
  initialState: initialState as Applicant | undefined,
  reducers: {
    /**
     * Agree to terms and conditions
     */
    agree: (state, action) =>
      applyQuestions(state, FormID.AGREEMENT, { agree: true }),
    updateApplicant: updateApplicantReducer,
    updateWithFormValues: (
      state,
      action: PayloadAction<{ activeStepId: FormID; values: FormikValues }>
    ) =>
      applyQuestions(state, action.payload.activeStepId, action.payload.values),
  },
});

export function selectHasAgreed(store: Store) {
  return (
    store.application?.mainApplicant?.questions?.find(
      (q) => q.id === `${FormID.AGREEMENT}/agree`
    )?.answer === 'true'
  );
}

export const findQuesiton =
  (formId: FormID, questionName: string) => (question: Question) =>
    question.id === `${formId}/${questionName}`;

export function getQuestionValue(
  questions: Question[] | undefined,
  formId: FormID,
  questionName: string,
  def = undefined
) {
  const a = questions?.find(findQuesiton(formId, questionName))?.answer;
  return a ? JSON.parse(a) : def;
}

export default slice;
export const { agree, updateApplicant, updateWithFormValues } = slice.actions;
