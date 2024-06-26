import Auth from "./_components/Auth";
import Carousel from "./_components/Carousel";
import Image from "next/image";

export default function Page() {
  return (
    <div>
        <main className="flex flex-col items-center justify-center min-h-screen space-y-8" style={{ backgroundImage: "url('/green-background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="p-10 text-center max-w-md">
          <div className="flex items-center justify-center p-4">
          <Image src="/trackease-navbar-logo.png" width={88} height={88} />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-custom-blue">Task tracking made easy.</h1>
          <p className="text-custom-blue">
            This is your one-stop hub to track your deliverables and manage your time more effectively.
          </p>
          <Auth />
        </div>
        <Carousel className="my-1"/>
      </main>
    </div>
  );
}
