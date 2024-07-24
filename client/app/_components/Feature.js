'use client';

import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Feature details with icons, titles etc
const featureText = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
  </svg>
  ,
    title: "Progress Dashboard",
    href: "/",
    description:
      "Our dashboard feature provides a weekly view of your tasks and shows the percentage of tasks completed, helping you stay on top of your progress.",
    cta: "Click for demo",
    videoSrc: "/taskfeaturevideo.mp4", 
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  </svg>
  ,
    title: "Task Tracker",
    href: "/",
    description:
      "Our task tracking feature lets you add, edit, bookmark, delete, schedule, tag, complete, and search tasks with ease.",
    cta: "Click for demo",
    videoSrc: "/taskfeaturevideo.mp4", 
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
  ,
    title: "Google Event Calendar",
    href: "/",
    description:
      "Our event calendar feature lets you add, edit, and delete events, all seamlessly linked to your Google Calendar.",
    cta: "Click for demo",
    videoSrc: "/eventfeaturevideo.mp4", 
  }
];

const Feature = () => {
  const [flipped, setFlipped] = useState(Array(featureText.length).fill(false));

  const handleFlip = (index) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  return (
        <div className="flex flex-col items-center gap-6 py-20">
          <h3 className="text-custom-blue text-4xl font-bold pb-10">Features</h3>

          <div className="mt-6 flex flex-wrap justify-center 2xl:gap-32 md:gap-12">
            {featureText.map(
              ({ icon, title, description, href, cta, videoSrc }, index) => (
                <div
                  key={index}
                  className="relative h-72 w-96 cursor-pointer rounded-lg shadow-lg transition-all duration-1000[transform-style:preserve-3d]"
                  onClick={() => handleFlip(index)}
                >
                  {/* Front side of card */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-between rounded-lg border p-6 transition-all hover:-mt-2 hover:mb-2 [backface-visibility:hidden] ${
                      flipped[index] ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
                    }`}
                  >
                    <div className="grid gap-4">
                      {icon}
                      <h4 className="text-xl text-green-700">{title}</h4>
                      <p className="text-base opacity-70">{description}</p>
                    </div>
           
                      <div className="flex items-center text-sm font-semibold">
                        <p>{cta}</p> <ArrowRight className="ml-2 h-4 w-4 " />
                      </div>

                  </div>
                  {/* Back side */}
                  <div
                    className={`absolute inset-0 h-full w-full rounded-lg flex items-center justify-center  [backface-visibility:hidden] ${
                      flipped[index] ? "[transform:rotateY(0deg)]" : "[transform:rotateY(180deg)]"
                    }`}
                  >
                    <video
                      src={videoSrc}
                      autoPlay loop muted controls controlsList="nodownload"
                      disableRemotePlayback
                      disablePictureInPicture
                      className="w-full h-full object-cover"
                    ></video>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
  );
};

export default Feature;
