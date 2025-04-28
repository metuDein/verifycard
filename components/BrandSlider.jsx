"use client";

import { useState, useEffect } from "react";

const BrandSlider = ({ brands }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate brands every 3 seconds
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
        // goToNext();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [brands.length, isAutoPlaying]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? brands.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
    setIsAutoPlaying(false);
  };

  // Determine which brands to display based on currentIndex
  const getVisibleBrands = () => {
    const visibleBrands = [];
    const totalBrands = brands.length;

    // Always show 5 brands if possible (2 left, center, 2 right)
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalBrands) % totalBrands;
      visibleBrands.push({
        ...brands[index],
        position: i, // -2, -1, 0, 1, 2
      });
    }

    return visibleBrands;
  };

  return (
    <div className="flex items-center justify-center w-[300px] sm:w-[600px] py-2 sm:py-8 relative">
      <button
        onClick={goToPrev}
        className="bg-transparent border-none text-4xl cursor-pointer text-gray-700 px-4 z-20 hidden hover:text-black"
      >
        &lt;
      </button>

      <div className="flex items-center justify-center gap-4 w-4/5 h-[150px]">
        {getVisibleBrands().map((brand, idx) => (
          <div
            key={`${brand.id}-${idx}`}
            className={`
              transition-all duration-500 flex items-center justify-center
              ${brand.position === -2 ? "-translate-x-[60%] scale-80" : ""}
              ${brand.position === -1 ? "-translate-x-[30%] scale-110" : ""}
              ${brand.position === 0 ? "scale-150 z-10" : ""}
              ${brand.position === 1 ? "translate-x-[30%] scale-110" : ""}
              ${brand.position === 2 ? "translate-x-[60%] scale-80" : ""}
              ${
                brand.position === 0
                  ? "grayscale-0 opacity-100"
                  : "grayscale-50 opacity-70"
              }
            `}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className={`
                transition-all duration-500 object-contain
                ${brand.position === 0 ? "max-h-[100px]" : "max-h-[60px]"}
              `}
            />
          </div>
        ))}
      </div>

      <button
        onClick={goToNext}
        className="bg-transparent border-none text-4xl hidden cursor-pointer text-gray-700 px-4 z-20 hover:text-black"
      >
        &gt;
      </button>
    </div>
  );
};

export default BrandSlider;
