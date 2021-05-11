import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import Link from "next/link"

export default function ApplicationPersonsOverview(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="People in this application" />
      
      <Link href={`/apply/person-one`}>
        You
      </Link>
    </Layout>
  )
}

// TODO: list of people