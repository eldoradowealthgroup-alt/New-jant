const GovHeader = () => {
  return (
    <div>
      {/* Official government banner */}
      <div className="bg-[#f0f0f0] px-3 sm:px-4 py-2 border-b border-[#dfe1e2]">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <span className="text-base sm:text-lg">🇺🇸</span>
          <span className="text-xs sm:text-sm text-[#1b1b1b]">
            An official website of the United States government
          </span>
        </div>
      </div>

      {/* US Courts Logo Header */}
      <div className="bg-white px-3 sm:px-4 py-3 sm:py-4 border-b border-[#dfe1e2]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center flex-wrap gap-2 sm:gap-4">
            <img 
              src="/images/header-logo.jpg"
              alt="United States Courts"
              className="h-10 sm:h-14 lg:h-16 w-auto"
            />
            <div className="text-[#1b1b1b]">
              <span className="text-sm sm:text-base lg:text-lg font-semibold">US District Lookup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovHeader;
