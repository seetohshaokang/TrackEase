export default function CarouselFeatureTwo() {
    return (
        <div className="group h-80 w-96 [perspective:1000px]">
            <div className="relative h-full w-full rounded-lg shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-500 bg-white h-full w-full p-32">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
</svg>
     </div>
                <div className="absolute inset-0 hh-full w-full rounded-lg bg-black px-12 text-center text-slate-100 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="flex min-h-full flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold">Google Event Calendar</h1>
                        <p className="text-lg">You can add, view, edit and delete events to your Google Calendar</p>
                        <p className="text-sm">Click the arrow to view demonstration</p>
                    </div>
                </div>
            </div>
        </div>
    );
}