import Image from "next/image";
import Auth from "./_components/Auth";
import Feature from "./_components/Feature";
import Footer from "./_components/Footer";
import MediaQuery from "./_components/MediaQuery";

export default function Page() {
  return (
    <MediaQuery>
      <div className="">
        <main
          className="flex relative flex-col justify-center min-h-screen bg-fixed"
          style={{
            backgroundImage: "url('/homepage-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="p-10 absolute left-1/4 transform -translate-x-1/3 text-center max-w-lg space-y-5">
            <div className="flex items-center justify-center p-4">
              <Image
                src="/trackease-navbar-logo.png"
                alt="trackease logo"
                width={88}
                height={88}
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-custom-blue">
              Task tracking made easy.
            </h1>
            <p className="text-custom-blue text-xl">
              Your one-stop hub to track your deliverables and manage your time
              more effectively.
            </p>
            <Auth />
          </div>
        </main>
        <Feature />
        <Footer />
      </div>
    </MediaQuery>
  );
}
