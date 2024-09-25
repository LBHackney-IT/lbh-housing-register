import { getGenderName } from './gender';
import { Applicant } from '../../domain/HousingApi';

describe('getGenderName', () => {
  it('should return "Male" for gender "M"', () => {
    const applicant: Applicant = {
      person: {
        gender: 'M',
      },
    };
    expect(getGenderName(applicant)).toBe('Male');
  });

  it('should return "Female" for gender "F"', () => {
    const applicant: Applicant = {
      person: {
        gender: 'F',
      },
    };
    expect(getGenderName(applicant)).toBe('Female');
  });

  it('should return gender description for gender "self"', () => {
    const applicant: Applicant = {
      person: {
        gender: 'self',
        genderDescription: 'Non-binary',
      },
    };
    expect(getGenderName(applicant)).toBe('Non-binary');
  });

  it('should return empty string for gender "self" but no description', () => {
    const applicant: Applicant = {
      person: {
        gender: 'self',
      },
    };
    expect(getGenderName(applicant)).toBe('');
  });

  it('should return empty string for empty gender', () => {
    const applicant: Applicant = {
      person: {
        gender: '',
      },
    };
    expect(getGenderName(applicant)).toBe('');
  });

  it('should return empty string if person is undefined', () => {
    const applicant: Applicant = {};
    expect(getGenderName(applicant)).toBe('');
  });

  it('should return empty string if gender is undefined', () => {
    const applicant: Applicant = {
      person: {},
    };
    expect(getGenderName(applicant)).toBe('');
  });
  it('should return empty string if gender is explicity undefined', () => {
    const applicant: Applicant = {
      person: {
        gender: undefined,
      },
    };
    expect(getGenderName(applicant)).toBe('');
  });
});
