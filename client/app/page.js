import Auth from "./_components/Auth";
import Head from 'next/head';
import Carousel from "./_components/carousel";

export default function Page() {
  return (
    <div>
      <Head>
        <title>TrackEase</title>
        </Head>
        <main className="flex flex-col items-center justify-center h-screen space-y-10" style={{ backgroundImage: "url('/background.avif')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="p-10 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-custom-blue">Task tracking made easy.</h1>
          <p className="text-custom-blue">
            This is your one-stop hub to track your deliverables and manage your time more effectively.
          </p>
          <Auth />
        </div>
        <Carousel />
      </main>
    </div>
  );
}
