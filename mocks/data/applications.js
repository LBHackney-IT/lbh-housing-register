module.exports = [
  {
    id: 'LBH-123',
    status: 'Pending',
    createdAt: '1 day ago',
    mainApplicant: {
      person: {
        id: '123',
        title: 'Miss',
        firstName: 'Test',
        middleName: '',
        surname: 'Person',
        dateOfBirth: '1990-02-19',
        gender: 'F',
        nationalInsuranceNumber: 'QQ 12 34 56 C',
      },
      contactInformation: {
        emailAddress: 'test@email.com',
        phoneNumber: '+447123456780',
        preferredMethodOfContact: 'email',
      },
      address: {
        addressLine1: '123 Hillman Street',
        addressLine2: 'Hackney',
        addressLine3: 'London',
        postcode: 'E8 1DY',
      },
    },
    otherMembers: [
      {
        person: {
          id: '123',
          title: 'Mrs',
          firstName: 'Other',
          middleName: '',
          surname: 'Person',
          dateOfBirth: '1982-02-20',
          gender: 'F',
        },
      },
      {
        person: {
          id: '123',
          title: 'Mr',
          firstName: 'Sample',
          surname: 'Person',
          dateOfBirth: '1985-02-20',
          gender: 'M',
        },
      },
    ],
  },
  {
    id: 'LBH-1234',
    status: 'In review',
    assignedTo: 'test@hackney.gov.uk',
    createdAt: '2 days ago',
    mainApplicant: {
      person: {
        id: '1234',
        title: 'Mrs',
        firstName: 'Test',
        middleName: '',
        surname: 'Person',
        dateOfBirth: '1952-08-19',
        gender: 'F',
      },
      contactInformation: {
        emailAddress: 'test@email.com',
        phoneNumber: '+447123456780',
        preferredMethodOfContact: 'email',
      },
      address: {
        addressLine1: '1234 Hillman Street',
        addressLine2: 'Hackney',
        addressLine3: 'London',
        postcode: 'E8 1DY',
      },
    },
  },
  {
    id: 'LBH-12345',
    status: 'Approved',
    createdAt: '3 days ago',
    mainApplicant: {
      person: {
        id: '12345',
        title: 'Mr',
        firstName: 'Test',
        middleName: '',
        surname: 'Person',
        dateOfBirth: '1982-02-20',
        gender: 'M',
      },
      contactInformation: {
        emailAddress: 'test@email.com',
        phoneNumber: '+447123456780',
        preferredMethodOfContact: 'email',
      },
      address: {
        addressLine1: '12345 Hillman Street',
        addressLine2: 'Hackney',
        addressLine3: 'London',
        postcode: 'E8 1DY',
      },
    },
  },
  {
    id: 'LBH-123456',
    status: 'Overdue',
    createdAt: '2 weeks ago',
    mainApplicant: {
      person: {
        id: '123456',
        title: 'Mr',
        firstName: 'Test',
        middleName: '',
        surname: 'Person',
        dateOfBirth: '1988-02-20',
        gender: 'M',
      },
      contactInformation: {
        emailAddress: 'test@email.com',
        phoneNumber: '+447123456780',
        preferredMethodOfContact: 'email',
      },
      address: {
        addressLine1: '12345 Hillman Street',
        addressLine2: 'Hackney',
        addressLine3: 'London',
        postcode: 'E8 1DY',
      },
    },
  },
  {
    id: '161621af-03bc-47ff-86d9-ada7862aa00a',
    status: 'Overdue',
    createdAt: '2 weeks ago',
    mainApplicant: {
      person: {
        id: '123456',
        title: 'Mr',
        firstName: 'Rashid',
        middleName: 'Aden',
        surname: 'Omar',
        dateOfBirth: '1988-02-20',
        gender: 'M',
      },
      contactInformation: {
        emailAddress: 'test@email.com',
        phoneNumber: '+447123456780',
        preferredMethodOfContact: 'email',
      },
      address: {
        addressLine1: '12345 Hillman Street',
        addressLine2: 'Hackney',
        addressLine3: 'London',
        postcode: 'E8 1DY',
      },
    },
  },
];
