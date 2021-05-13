import { ApplicationSteps } from "../types/application"
import { IMMIGRATION_STATUS, YOUR_SITUATION } from "./form-data"

export const getEligibilitySteps = (): ApplicationSteps[] => {
  return [
    {
      "heading": "Eligibility",
      "steps": [
        {
          "heading": "Your situation",
          "id": YOUR_SITUATION
        },
        {
          "heading": "Immigration status",
          "id": IMMIGRATION_STATUS
        }
      ]
    }
  ]
}

/**
 * Get form IDs from the ApplicationSteps type
 * @param {ApplicationSteps[]} steps Application steps
 * @returns {string[]} Workable form ids
 */
export const getFormIdsFromApplicationSteps = (steps: ApplicationSteps[]): string[] => {
  const ids: string[] = []
  steps.map(step => step.steps.map(s => ids.push(s.id)))
  return ids
}