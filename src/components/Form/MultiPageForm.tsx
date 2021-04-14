import Form from "./Form"
import HeadingOne from "../Typography/HeadingOne"
import { MultiPageFormData } from "../../types/form-types"

interface MultiPageFormProps {
  data: MultiPageFormData
}

const MultiPageForm = ({ data }: MultiPageFormProps): JSX.Element => {
  const totalSections: number = data.sections.length;

  return (
    <>
      {data.title && <HeadingOne content={data.title} />}

      {data.sections.map(((section, index) =>
        <Form key={index} section={section} sectionIndex={index + 1} totalSections={totalSections} />
      ))}
    </>
  );
}

export default MultiPageForm