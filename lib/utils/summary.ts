export const retrieveQuestionName = (question: any) => {
  return question['id'].substr(question['id'].lastIndexOf('/') + 1);
};

export const normalizeString = (answer: string) => {
  return answer.replace(/[^a-zA-Z0-9 ]/g, '');
};
