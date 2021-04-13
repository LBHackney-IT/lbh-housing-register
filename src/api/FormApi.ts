import qualificationForm from "../data/qualification-form.json"
import { MultiPageFormData } from "../types/form-types"

export default class FormApi {
  getFormData(): MultiPageFormData {
    return qualificationForm;
  }
}