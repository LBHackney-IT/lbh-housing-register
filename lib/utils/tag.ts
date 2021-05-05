export function getStatusTag(status: string) {
  let colour
  switch (status) {
    case 'In review':
      return "lbh-tag--yellow"
    case 'Overdue':
      return "lbh-tag--red"
    case 'Approved':
      return "lbh-tag--green"
  }
  return colour
}
