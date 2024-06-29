import CarouselFeatureOne from "./CarouselFeatureOne";
import CarouselFeatureTwo from "./CarouselFeatureTwo";

export default function Carousel() {
    return (
      <div>

      <h1 className="flex justify-center text-4xl font-bold text-custom-blue pb-4">Features</h1>

      <div className="flex space-x-8">

        <div className="carousel w-96 h-80 rounded-lg">
  <div id="slide1" className="carousel-item relative w-full">
    <CarouselFeatureOne />    
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide2" className="carousel-item relative w-full">
    <video autoPlay loop muted className="w-full h-full object-cover">
      <source src="/testvideo.mp4" />
      </video >
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide1" className="btn btn-circle">❮</a> 
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div> 
</div>

<div className="carousel w-96 h-80 rounded-lg">
  <div id="slide3" className="carousel-item relative w-full">
    <CarouselFeatureTwo />    
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle">❮</a> 
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div> 
  <div id="slide4" className="carousel-item relative w-full">
    <video autoPlay loop muted className="w-full h-full object-cover">
      <source src="/testvideo.mp4" />
      </video >
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle">❮</a> 
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div> 
</div>

</div>

</div>
    );
}