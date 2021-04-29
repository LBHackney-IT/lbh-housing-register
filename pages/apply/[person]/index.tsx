import { HeadingOne } from "../../../components/content/headings"
import Layout from "../../../components/layout/resident-layout"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ApplicationTaskOverview(): JSX.Element {
  const router = useRouter()
  let { person } = router.query
  person = person as string

  return (
    <Layout>
      {person && <HeadingOne content={person} />}
      
      <Link href={`${router.asPath}/task`}>
        Example task
      </Link>
    </Layout>
  )
}