import { checkEligible } from '../utils/form';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '.';
import { Applicant, Question } from '../../domain/HousingApi';
import { FormikValues } from 'formik';
import { a } from '@aws-amplify/ui';
import { AGREEMENT } from '../utils/form-data';

const initialState: Applicant = {};

const slice = createSlice({
  name: 'applicant',
  initialState: initialState as Applicant | undefined,
  reducers: {
    /**
     * Agree to terms and conditions
     */
    agree: (state, action) =>
      slice.caseReducers.updateWithFormValues(state, {
        ...action,
        payload: { activeStepId: AGREEMENT, values: { agree: true } },
      }),

    // TODO how do we tell which applicant we'll be updating? We should maybe rename "applicant" to "mainApplicant"?
    // TODO This function is going to get long, procedural, and will directly relate to mapApplicantToValues.
    updateWithFormValues: (
      state,
      action: PayloadAction<{ activeStepId: string; values: FormikValues }>
    ) => ({
      ...(state || {}),
      questions: [
        ...(state?.questions?.filter(
          (question) =>
            !question.id?.startsWith(`${action.payload.activeStepId}/`)
        ) || []),
        ...Object.entries(action.payload.values).map(([id, answer]) => ({
          id: `${action.payload.activeStepId}/${id}`,
          answer: JSON.stringify(answer),
        })),
      ],
    }),
  },
});

export const selectIsEligible = createSelector(
  [(store: Store) => store.application.mainApplicant],
  (application) => application && checkEligible(application)
);

export function selectHasAgreed(store: Store) {
  return (
    store.application?.mainApplicant?.questions?.find(
      (q) => q.id === `${AGREEMENT}/agree`
    )?.answer === 'true'
  );
}

export default slice;
export const { agree, updateWithFormValues } = slice.actions;
