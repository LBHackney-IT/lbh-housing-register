import { CreateApplicationRequest } from "../../domain/application"
import { Resident } from "../types/resident"

/**
 * Create new application
 * @param {Resident[]} applicants The applicant information
 * @returns {any} The newly added application
 */
export const createApplication = async (applicants: Resident[]): Promise<any> => {
  try {
    // TODO: update mapping of data
    const personal = applicants[0].formData["personal-details"]
    const address = applicants[0].formData["address-details"]
    const contactInformation = {
      contactInformation: {
      emailAddress: "",
      phoneNumber: "",
      preferredMethodOfContact: ""
      }
    }

    const applicant = {
      personal,
      address,
      contactInformation
    }

    const application: CreateApplicationRequest = {
      status: "Pending",
      applicant,
      otherMembers: applicants.length > 1
        ? applicants.slice(1).map((resident) => resident?.formData["personal-details"])
        : []
    }

    const res = await fetch("/api/applications",
      {
        method: "POST",
        body: JSON.stringify(application),
      }
    )

    return await res.json()
  } catch (err) {
    throw new Error('Unable to create application')
  }
}

/**
 * Update application
 * @param {Resident[]} applicants The applicant information
 * @returns {any} The updated application
 */
export const updateApplication = async (applicants: Resident[], id: string): Promise<any> => {
  try {
    const personal = applicants[0].formData["personal-details"]
    const address = applicants[0].formData["address-details"]
    const contactInformation = {
      emailAddress: applicants[0].formData[""],
      phoneNumber: "",
      preferredMethodOfContact: ""
    }

    const applicant = {
      personal,
      address,
      contactInformation
    }

    const application: CreateApplicationRequest = {
      status: "Pending",
      applicant,
      otherMembers: applicants.length > 1
        ? applicants.slice(1).map((resident) => resident?.formData["personal-details"])
        : []
    }

    const res = await fetch("/api/applications",
      {
        method: "PATCH",
        body: JSON.stringify(application),
      }
    )

    return await res.json()
  } catch (err) {
    throw new Error('Unable to update application')
  }
}
