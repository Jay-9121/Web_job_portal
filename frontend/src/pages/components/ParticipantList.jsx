import React, { useState, useEffect, useRef } from "react";

const ParticipantList = ({ participants }) => {
  // Track loading state for each participant's image individually
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  // Refs to access img elements
  const imgRefs = useRef({});

  // Initialize loading states
  useEffect(() => {
    const newStates = {};
    participants.forEach((participant, index) => {
      const key = participant.id || index;
      newStates[key] = true; // Start with loading true for all participants
    });
    setImageLoadingStates(newStates);
  }, [participants]);

  // Check for already loaded images after render
  useEffect(() => {
    const checkLoadedImages = () => {
      participants.forEach((participant, index) => {
        const key = participant.id || index;
        const img = imgRefs.current[key];
        if (img && img.complete) {
          handleImageLoad(key);
        }
      });
    };

    // Check immediately and after a short delay
    checkLoadedImages();
    const timeoutId = setTimeout(checkLoadedImages, 50);

    return () => clearTimeout(timeoutId);
  }, [participants]);

  const handleImageLoad = (key) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const handleImageError = (key) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  return (
    <div className="flex -space-x-2">
      {participants.map((participant, index) => {
        const key = participant.id || index;
        const isLoading = imageLoadingStates[key];

        return (
          <div key={key} className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"></div>
            )}
            <img
              ref={(el) => {
                if (el) {
                  imgRefs.current[key] = el;
                  // Check if image is already loaded (cached)
                  if (el.complete) {
                    handleImageLoad(key);
                  }
                }
              }}
              src={participant.image}
              alt={participant.name}
              className="w-8 h-8 rounded-full object-cover"
              onLoad={() => handleImageLoad(key)}
              onError={() => handleImageError(key)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantList;
