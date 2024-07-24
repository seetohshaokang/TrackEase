import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

function Footer() {
  return (
    <footer className="footer bg-base-200 text-base-content p-10">
        <div className="">
          <div className="grid gap-5">
            <Link href="/">
              <h3 className="sr-only">Trackease</h3>
              <Image
                src="/trackease-navbar-logo.png"
                alt="Logo"
                width={88}
                height={88}
                className="transition-all hover:opacity-75 dark:invert"
              />
            </Link>
            <p className="footer-title">
                TrackEase is a project by Team 6232 of NUS Orbital 2024.
            </p>
              <p className="footer">©TrackEase. All rights reserved. 2024-present.</p>
              
          </div>
        </div>
    </footer>
  );
}

export default Footer;
