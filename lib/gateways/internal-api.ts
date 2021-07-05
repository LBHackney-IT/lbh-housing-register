import { CreateApplicationRequest } from "../../domain/application"
import { Resident } from "../types/resident"
import { constructApplication } from "../utils/helper"
import { APPLICATION_STATUS_PENDING } from "../utils/constants"

/**
 * Create new application
 * @param {Resident[]} applicants The applicant information
 * @returns {any} The newly added application
 */
export const createApplication = async (applicants: Resident[], status: string = APPLICATION_STATUS_PENDING): Promise<any> => {
  try {
    const application = constructApplication(applicants, status)

    const res = await fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    });

    return await res.json();
  } catch (err) {
    throw new Error('Unable to create application');
  }
};

/**
 * Update application
 * @param {Resident[]} applicants The applicant information
 * @returns {any} The updated application
 */
export const updateApplication = async (applicants: Resident[], appicationId: string | undefined, status: string = APPLICATION_STATUS_PENDING): Promise<any> => {
  try {
    const application = constructApplication(applicants, status)

    const res = await fetch(`/api/applications/${appicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(application),
      }
    )
    return await res.json()
  } catch (err) {
    throw new Error(`This error: ${err}`)
  }
}
