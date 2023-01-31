// /pages/index.tsx
import Head from 'next/head'
import Layout from '../components/Layout'

function Home() {
  return (
    <div>
      <Head>
        <title>TMS - Team Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-5xl my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          WELCOME
        </div>
      </div>
    </div>
  )
}

export default Home
