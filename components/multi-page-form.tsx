import Form from "./form"
import { HeadingOne } from "./headings"
import { MultiPageFormData } from "../lib/types/form"

interface MultiPageFormProps {
  data: MultiPageFormData
}

export default function MultiPageForm({ data }: MultiPageFormProps): JSX.Element {
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