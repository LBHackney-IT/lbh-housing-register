import { CreateApplicationRequest } from "../../domain/application"
import { Resident } from "../types/resident"
import { constructApplication } from "../utils/helper"

/**
 * Create new application
 * @param {Resident[]} applicants The applicant information
 * @returns {any} The newly added application
 */
export const createApplication = async (applicants: Resident[]): Promise<any> => {
  try {
    const application = constructApplication(applicants)

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
export const updateApplication = async (applicants: Resident[]): Promise<any> => {
  try {
    const application = constructApplication(applicants)
    
    const id = "161621af-03bc-47ff-86d9-ada7862aa00a"
    const res = await fetch(`/api/applications/${id}`,
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
