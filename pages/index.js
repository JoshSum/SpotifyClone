import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'


export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden"> 
      <Head>
        <title>Spotify 2.0</title>
        <meta name="description" content="Create By JoshSum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <Sidebar/>
        {/* Center */}
      </main>
      <div>
        {/* Player */}
      </div>
    </div>
  )
}
