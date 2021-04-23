import { Application } from "../domain/application"
import { Resident } from "../domain/resident"

export const applications = new Array<Application>(
  {
    id: "LBH-12345",
    applicant: {
      name: "Test user",
      email: "test@email.com",
      phoneNumber: "+447123456780"
    } as Resident,
    status: "Pending",
    createdAt: "1 day ago"
  },
  {
    id: "LBH-12345",
    applicant: {
      name: "Test user",
      email: "test@email.com",
      phoneNumber: "+447123456780"
    } as Resident,
    status: "Pending",
    createdAt: "1 day ago"
  },
  {
    id: "LBH-12345",
    applicant: {
      name: "Test user",
      email: "test@email.com",
      phoneNumber: "+447123456780"
    } as Resident,
    status: "Pending",
    createdAt: "1 day ago"
  }
)
