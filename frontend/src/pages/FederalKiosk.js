import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const FederalKiosk = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const kioskImages = [
    {
      id: 1,
      url: "/images/kiosk-1.jpg",
      title: "Bonding Kiosk Screen"
    },
    {
      id: 2,
      url: "/images/kiosk-2.jpg",
      title: "Bonding Kiosk Machine"
    },
    {
      id: 3,
      url: "/images/kiosk-3.jpg",
      title: "Warrant Dismissal Division Notice"
    },
    {
      id: 4,
      url: "/images/kiosk-4.jpg",
      title: "Understanding Your Kiosk Deposit"
    }
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/payment-methods")}
          variant="ghost"
          className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold p-0 mb-4"
        >
          ← Back to Payment Methods
        </Button>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a4480] mb-2">
          Federal Bonding Kiosk
        </h1>
        <p className="text-[#71767a] mb-6 text-sm sm:text-base">
          Use authorized bonding kiosks nationwide to post your surety bond. Tap on any image to enlarge.
        </p>

        {/* Kiosk Info */}
        <div className="bg-[#f5f5f5] border border-[#dfe1e2] rounded-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1b1b1b] mb-3">About Federal Bonding Kiosks</h2>
          <ul className="text-sm text-[#1b1b1b] space-y-2">
            <li>• Available at convenient locations nationwide</li>
            <li>• Syncs directly with federal database</li>
            <li>• No personal information required at kiosk</li>
            <li>• Accepts cash deposits for surety bonds</li>
            <li>• Multiple kiosk providers accepted</li>
          </ul>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {kioskImages.map((image) => (
            <div 
              key={image.id}
              className="border border-[#dfe1e2] rounded-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openLightbox(image)}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-48 sm:h-56 object-cover hover:opacity-90 transition-opacity"
              />
              <div className="p-3 bg-white">
                <p className="text-sm font-semibold text-[#1b1b1b]">{image.title}</p>
                <p className="text-xs text-[#1a4480]">Tap to enlarge</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-[#faf3d1] border-l-4 border-[#b38600] p-4 mb-6">
          <h3 className="font-bold text-[#1b1b1b] mb-2">Important Instructions</h3>
          <p className="text-sm text-[#1b1b1b]">
            Before visiting a kiosk, ensure you have your Trust Account ID# (10 digit FBI ACCT #) 
            and your trust account QR-CODE issued by U.S. Dept of Treasury. Follow all instructions 
            provided by your contacting officer.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/payment-methods")}
            className="rounded-sm bg-[#1a4480] hover:bg-[#162e51] text-white py-3 px-8 text-base font-bold"
          >
            Return to Payment Methods
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
          </div>
        </div>
      )}

      <GovFooter />
    </div>
  );
};

export default FederalKiosk;
