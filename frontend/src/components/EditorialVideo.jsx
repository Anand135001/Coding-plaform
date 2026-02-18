
const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {

  if (!secureUrl) {
    return (
      <div className="p-6 text-center text-gray-500">
        No editorial video available.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">
        Solution Video
      </h2>

      {/* Aspect Ratio Wrapper */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">

        <video
          controls
          preload="metadata"
          poster={thumbnailUrl}
          className="absolute top-0 left-0 w-full h-full object-contain"
        >
          <source src={secureUrl} type="video/mp4" />
        </video>

      </div>

      {duration && (
        <p className="mt-3 text-gray-600">
          Duration: {Math.floor(duration / 60)} min {duration % 60} sec
        </p>
      )}

    </div>
  );
};

export default Editorial;