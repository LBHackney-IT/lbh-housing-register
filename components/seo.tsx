import Head from 'next/head';

interface Props {
  title: string;
}

const Seo = ({ title }: Props): React.ReactElement => (
  <Head>
    <title>{title} | Housing Register | Hackney Council</title>
  </Head>
);

export default Seo;
