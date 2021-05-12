import { ButtonLink } from "../button"
import { HeadingOne, HeadingThree, HeadingTwo } from "../content/headings"
import InsetText from "../content/inset-text"
import List, { ListItem } from "../content/list"
import Paragraph from "../content/paragraph"
import { Store } from "../../lib/store"
import Link from "next/link"
import { useStore } from "react-redux"

export default function NotEligible(): JSX.Element {
  const store = useStore<Store>()
  const reasons = store.getState().resident.ineligibilityReasons

  return (
    <>
      <HeadingOne content="You won't be able to join the housing register" />

      {reasons && reasons.length > 0 && (
        <>
          <HeadingTwo content="Why is this?" />
          {reasons?.map((reason, index) => (
            <InsetText key={index}>
              <Paragraph>{reason}</Paragraph>
            </InsetText>
          ))}
        </>
      )}

      <HeadingTwo content="What next?" />
      <Paragraph>
        <strong>We can provide support to help you move into a privately rented home</strong>
      </Paragraph>
      <Paragraph>
        If you choose to rent privately, the Council may be able to help provide the following assistance:
      </Paragraph>
      <List>
        <ListItem>One months rent in advance</ListItem>
        <ListItem>Security deposit paid</ListItem>
        <ListItem>Landlord compliance check</ListItem>
        <ListItem>Longest possible tenancy terms</ListItem>
        <ListItem>Pre-inspection of the property</ListItem>
        <ListItem>Practical and financial help with removals</ListItem>
        <ListItem>Transport costs for viewing and moving if outside of London</ListItem>
        <ListItem>Financial assistance to provide white goods if they aren't provided by the landlord</ListItem>
      </List>
      <ButtonLink href="https://hackney.gov.uk/housing-application">
        Contact us for advice
      </ButtonLink>
    </>
  )
}