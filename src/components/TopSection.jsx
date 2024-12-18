import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const values = [
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Pbha0caomIx8Dh7n4KqnZQ2bLoIc8N8-SQ&s',
    description: 'Group Creation and Management',
  },
  {
    image: 'https://youthareawesome.com/wp-content/uploads/2023/11/IMG_20231117_120638-1068x926.jpg',
    description: 'Note sharing and collaboration',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5dM68qp0bimYtm1PcZz61Mc7pMAzLitS9rg&s',
    description: 'Study session and scheduling',
  },
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc4Y26EvLY_-f9DYkDpFbW7TB6IlkKglCqJg&s',
    description: 'Focus Sessions & Study Tools Integration',
  },
];

function TopSection() {

   // Slick Carousel settings
   const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of cards to show at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds per slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
    <section className="text-center py-[60px] px-[40px] max-w-[2000px] mx-auto bg-gradient-to-br from-[#f0f4f8] to-[#e8eef3] shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
      {/* Heading */}
      <h2
        className="font-serif text-[36px] text-[#006400] font-bold mb-[10px]"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        Top Values For You
      </h2>

      {/* Subheading */}
      <p className="text-[18px] font-bold text-black mb-[30px]">
        Try a variety of benefits when using our services
      </p>

      {/* Carousel */}
      <Slider {...settings}>
        {values.map((value, index) => (
          <div
            key={index}
            className="text-center max-w-xs mx-auto shadow-lg p-4 rounded-md"
          >
            {/* Image */}
            <img
              src={value.image}
              alt={value.description}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-gray-400 shadow-md hover:scale-110 transition-transform duration-300"
            />
            {/* Description */}
            <p className="text-base text-black-700 mt-2">{value.description}</p>
          </div>
        ))}
      </Slider>
    </section>
  </div>
);
}

export default TopSection;
    