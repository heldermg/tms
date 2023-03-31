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
        <div className="grid grid-cols-1  gap-5">
          <div className='text-2xl text-left'>Features</div>
          <ul>
            <li>
              <strong>- SP1 - Sprint 1</strong>
              <ul className='m-5'>
                <li>- Roles Registration</li>
                <li>- Teams Registration</li>
              </ul>
            </li>
            <li>
              <strong>- SP2 - Sprint 2</strong>
              <ul className='m-5'>
                <li>- Users Registration</li>
                <li>- Absences Types Registration</li>
                <li>- Absences Registration</li>
              </ul>
            </li>
            <li>
            <strong>- SP3 - Sprint 3</strong>
              <ul className='m-5'>
                <li>- Calendar</li>
                <li>- Events Notification</li>
                <li>- Absences Report</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
