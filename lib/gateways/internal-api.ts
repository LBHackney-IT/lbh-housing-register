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
    const application: CreateApplicationRequest = {
      status: "Pending",
      applicant: applicants[0].formData["personal-details"],
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

// TODO: update application
