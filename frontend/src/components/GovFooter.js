const GovFooter = () => {
  return (
    <footer className="bg-[#162e51] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Seal and Description */}
        <div className="mb-6 sm:mb-8">
          <img 
            src="/images/footer-logo.jpg"
            alt="Administrative Office of the United States Courts"
            className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full object-cover"
          />
          <p className="text-white italic text-xs sm:text-sm leading-relaxed max-w-xl">
            This site is maintained by the Administrative Office of the U.S. Courts on behalf of the Federal Judiciary.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <a href="#" className="block text-white hover:underline font-semibold text-sm sm:text-base">
            Privacy & Security Policy
          </a>
          <a href="#" className="block text-white hover:underline font-semibold text-sm sm:text-base">
            Operating Status
          </a>
          <a href="#" className="block text-white hover:underline font-semibold text-sm sm:text-base">
            Download Plug-Ins
          </a>
        </div>

        {/* Subscribe Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-2">Subscribe to Updates</h3>
          <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
            To receive updates, enter your email address and select the topics that interest you.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 max-w-md">
            <input 
              type="email" 
              placeholder="" 
              className="flex-1 px-4 py-2 rounded-full bg-white text-[#1b1b1b] border-0 focus:outline-none focus:ring-2 focus:ring-[#b5a642] text-base"
            />
            <button className="px-6 py-2 rounded-full bg-[#1a4480] hover:bg-[#2563eb] text-white font-semibold border border-white text-sm sm:text-base">
              Submit
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-[#1a4480]">
          {/* Building/Court icon */}
          <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1a4480] flex items-center justify-center hover:bg-[#2563eb]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current">
              <path d="M12 2L2 8v2h20V8L12 2zm0 2.5L18 8H6l6-3.5zM4 12v8h3v-6h2v6h2v-6h2v6h2v-6h2v6h3v-8H4z"/>
            </svg>
          </a>
          {/* YouTube icon */}
          <a href="#" className="hover:opacity-80">
            <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </a>
          {/* LinkedIn icon */}
          <a href="#" className="hover:opacity-80">
            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default GovFooter;
