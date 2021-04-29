import { HeadingOne } from "../../../components/content/headings"
import Layout from "../../../components/layout/resident-layout"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ApplicationTaskOverview(): JSX.Element {
  const router = useRouter()
  let { person } = router.query
  person = person as string

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {person && <HeadingOne content={person} />}
      
      <Link href={`${router.asPath}/task`}>
        Example task
      </Link>
    </Layout>
  )
}