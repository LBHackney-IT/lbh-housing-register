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
        ethnicity: 'White',
        nationality: 'British',
        placeOfBirth: 'London',
        dateOfBirth: '1990-02-19',
        gender: 'F',
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
        postCode: 'E8 1DY',
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
          ethnicity: 'Black Caribbean',
          nationality: 'British',
          placeOfBirth: 'London',
          dateOfBirth: '1982-02-20',
          gender: 'F',
        },
        contactInformation: {
          emailAddress: 'test@email.com',
          phoneNumber: '+447123456780',
          preferredMethodOfContact: 'email',
        },
      },
      {
        person: {
          id: '123',
          title: 'Mr',
          firstName: 'Sample',
          surname: 'Person',
        },
      },
    ],
  },
  {
    id: 'LBH-1234',
    status: 'In review',
    createdAt: '2 days ago',
    mainApplicant: {
      person: {
        id: '1234',
        title: 'Mrs',
        firstName: 'Test',
        middleName: '',
        surname: 'Person',
        ethnicity: 'Black African',
        nationality: 'British',
        placeOfBirth: 'London',
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
        postCode: 'E8 1DY',
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
        ethnicity: 'Black Caribbean',
        nationality: 'British',
        placeOfBirth: 'London',
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
        postCode: 'E8 1DY',
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
        ethnicity: 'Prefer not to say',
        nationality: 'British',
        placeOfBirth: 'London',
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
        postCode: 'E8 1DY',
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
        ethnicity: 'Prefer not to say',
        nationality: 'British',
        placeOfBirth: 'London',
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
        postCode: 'E8 1DY',
      },
    },
  },
];
