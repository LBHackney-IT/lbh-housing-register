import qualificationFormData from "../data/qualification-form.json"
import { MultiPageFormData } from "./types/form"

export default class FormsManager {
  getQualificationFormData(): MultiPageFormData {
    return qualificationFormData;
  }
}