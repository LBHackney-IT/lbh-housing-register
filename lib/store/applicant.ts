import { checkEligible } from '../utils/form';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '.';
import { Applicant } from '../../domain/HousingApi';

const initialState: Applicant = {};

const slice = createSlice({
  name: 'applicant',
  initialState: initialState as Applicant | undefined,
  reducers: {
    /**
     * Agree to terms and conditions
     */
    agree: (state) => ({
      ...(state ?? {}),
      questions: [
        ...(state?.questions ?? []),
        { id: 'agreement', answer: 'true' },
      ],
    }),

    /**
     * Update resident's form data
     */
    updateFormData: (
      state,
      action: PayloadAction<{ [key: string]: FormData }>
    ) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };

      const eligibility = checkEligible(state.formData);
      state.isEligible = eligibility[0];
      state.ineligibilityReasons = eligibility[1];

      // Update name to reflect on the main overview page
      state.name =
        state.formData.firstName && state.formData.lastName
          ? state.formData.firstName + ' ' + state.formData.lastName
          : 'You';

      return state;
    },
  },
});

export function applicantIsEligible(applicant: Applicant) {
  // TODO
  // checkEligible()
  return true;
}

export function selectHasAgreed(store: Store) {
  return (
    store.application?.mainApplicant?.questions?.find(
      (q) => q.id === 'agreement'
    )?.answer === 'true'
  );
}

export default slice;
export const { agree, updateFormData } = slice.actions;
