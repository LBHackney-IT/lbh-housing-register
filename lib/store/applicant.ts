import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { Store } from '.';
import { Applicant } from '../../domain/HousingApi';
import { AGREEMENT } from '../utils/form-data';
import { v4 as uuidv4 } from 'uuid';

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
    agree: (state, action) => applyQuestions(state, AGREEMENT, { agree: true }),
    ensurePersonId: (state) => ({
      ...state,
      person: {
        ...state?.person,
        id: state?.person?.id ?? 'temp-' + uuidv4(),
      },
    }),
    updateApplicant: updateApplicantReducer,
    updateWithFormValues: (
      state,
      action: PayloadAction<{ activeStepId: string; values: FormikValues }>
    ) =>
      applyQuestions(state, action.payload.activeStepId, action.payload.values),
  },
});

export function selectHasAgreed(store: Store) {
  return (
    store.application?.mainApplicant?.questions?.find(
      (q) => q.id === `${AGREEMENT}/agree`
    )?.answer === 'true'
  );
}

export default slice;
export const { agree, updateApplicant, updateWithFormValues, ensurePersonId } =
  slice.actions;
