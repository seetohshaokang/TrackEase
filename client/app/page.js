import Auth from "./_components/Auth";
import Head from 'next/head';

export default function Page() {
  return (
    <div>
      <Head>
        <title>TrackEase</title>
        </Head>
        <main className="flex items-center justify-center h-screen" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="bg-white p-8 border-2 border-gray-300 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to TrackEase!</h1>
          <p>
            This is your one-stop hub to track your deliverables and manage your time more effectively!
          </p>
          <Auth />
        </div>
      </main>
    </div>
  );
}
