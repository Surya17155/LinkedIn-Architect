
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, MediaFile } from '../types';
import { ThumbsUp, MessageSquare, Repeat, Send, Globe, Plus, X, MoreHorizontal, FileText, Maximize, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface LinkedInPreviewProps {
  content: string;
  user: UserProfile;
  mediaFiles: MediaFile[];
}

const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({ content, user, mediaFiles }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const shouldTruncate = content.length > 220 || (content.match(/\n/g) || []).length > 4;
  const displayContent = (!isExpanded && shouldTruncate) ? content.slice(0, 220).trim() + '...' : content;
  
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(user.profileUrl, '_blank');
  };

  const images = mediaFiles.filter(m => m.type === 'image');
  const pdfs = mediaFiles.filter(m => m.type === 'pdf');

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full overflow-hidden font-sans border border-gray-100 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="p-3 pb-2 flex gap-3 relative">
           <div className="absolute top-2 right-2 flex gap-1">
              <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                  <MoreHorizontal size={20} />
              </button>
               <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                  <X size={20} />
              </button>
           </div>

          <div className="flex-shrink-0 relative cursor-pointer" onClick={handleProfileClick}>
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-12 h-12 rounded-full object-cover border border-gray-100"
            />
          </div>

          <div className="flex flex-col justify-center pt-0.5 w-full pr-16">
             <div className="flex items-center flex-wrap gap-1">
                <span 
                  className="font-semibold text-gray-900 text-[14px] hover:text-[#0a66c2] hover:underline cursor-pointer"
                  onClick={handleProfileClick}
                >
                  {user.name}
                </span>
                <span className="text-gray-400 text-[12px] font-normal">• 3rd+</span>
                <button 
                  onClick={handleProfileClick}
                  className="ml-1 text-[#0a66c2] font-semibold text-[14px] hover:bg-blue-50 px-2 py-0.5 -my-1 rounded transition-colors flex items-center"
                >
                   <Plus size={14} className="mr-0.5" strokeWidth={3} /> Follow
                </button>
             </div>
             
             <p className="text-gray-500 text-[12px] leading-tight line-clamp-1 mt-0.5">
               {user.headline}
             </p>
             
             <div className="flex items-center gap-1 text-gray-500 text-[12px] mt-0.5">
                <span>1h • </span>
                <Globe size={12} className="text-gray-500" />
             </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-3 pb-2">
          <div className="text-[14px] text-gray-900 leading-[1.5] whitespace-pre-wrap break-words" dir="auto">
            {displayContent}
            {shouldTruncate && !isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="text-gray-500 hover:text-[#0a66c2] hover:underline ml-1 font-medium"
              >
                ...see more
              </button>
            )}
          </div>
        </div>

        {/* Media Rendering */}
        <div className="w-full mt-1 border-t border-gray-100 overflow-hidden bg-[#F3F2EF]">
             {/* PDF Preview (LinkedIn Carousel Style) */}
             {pdfs.length > 0 && (
                 <div className="w-full aspect-[3/4] relative bg-gray-200 group border-b border-gray-200">
                      {/* Header Bar */}
                      <div className="absolute top-0 left-0 right-0 h-[52px] bg-black/80 backdrop-blur-md flex items-center justify-between px-3 z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                          <div className="flex items-center gap-3 overflow-hidden max-w-[70%]">
                              <div className="w-8 h-8 rounded bg-white flex items-center justify-center flex-shrink-0">
                                  <FileText size={20} className="text-red-600 fill-red-600" />
                              </div>
                              <div className="flex flex-col overflow-hidden text-white leading-tight">
                                  <span className="text-sm font-bold truncate">{pdfs[0].name || "Document.pdf"}</span>
                                  <span className="text-[11px] text-gray-300">5 pages • PDF</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-4 text-white">
                               <button title="Download" className="hover:text-gray-300 transition-colors"><Download size={20} /></button>
                               <button title="Full Screen" className="hover:text-gray-300 transition-colors"><Maximize size={20} /></button>
                          </div>
                      </div>

                      {/* Iframe Viewer */}
                      <iframe 
                          src={`${pdfs[0].url}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full border-none block bg-white"
                          title="Document Preview" 
                      />

                      {/* Navigation Arrows (Visual Mockup for Carousel Feel) */}
                      <div className="absolute top-1/2 left-3 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <button className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-colors shadow-lg">
                              <ChevronLeft size={24} />
                           </button>
                      </div>
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <button className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-colors shadow-lg">
                              <ChevronRight size={24} />
                           </button>
                      </div>

                      {/* Footer Page Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-md text-white text-xs font-semibold shadow-sm tracking-wide">
                              1 / 5
                          </div>
                      </div>
                 </div>
             )}

             {/* Image Grid Logic */}
             {pdfs.length === 0 && images.length > 0 && (
                 <>
                 {/* 1 Image */}
                 {images.length === 1 && (
                     <div className="cursor-pointer" onClick={() => openLightbox(0)}>
                        <img src={images[0].url} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
                     </div>
                 )}
                 
                 {/* 2 Images */}
                 {images.length === 2 && (
                     <div className="flex h-[300px]">
                         <div className="w-1/2 h-full pr-0.5 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img src={images[0].url} alt="Post 1" className="w-full h-full object-cover" />
                         </div>
                         <div className="w-1/2 h-full pl-0.5 cursor-pointer" onClick={() => openLightbox(1)}>
                            <img src={images[1].url} alt="Post 2" className="w-full h-full object-cover" />
                         </div>
                     </div>
                 )}
                 
                 {/* 3 Images */}
                 {images.length === 3 && (
                     <div className="flex h-[300px]">
                         <div className="w-2/3 h-full pr-0.5 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img src={images[0].url} alt="Post 1" className="w-full h-full object-cover" />
                         </div>
                         <div className="w-1/3 flex flex-col h-full pl-0.5">
                             <div className="h-1/2 w-full pb-0.5 cursor-pointer" onClick={() => openLightbox(1)}>
                                <img src={images[1].url} alt="Post 2" className="w-full h-full object-cover" />
                             </div>
                             <div className="h-1/2 w-full pt-0.5 cursor-pointer" onClick={() => openLightbox(2)}>
                                <img src={images[2].url} alt="Post 3" className="w-full h-full object-cover" />
                             </div>
                         </div>
                     </div>
                 )}

                 {/* 4 Images */}
                 {images.length === 4 && (
                    <div className="flex h-[300px]">
                        <div className="w-2/3 h-full pr-0.5 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img src={images[0].url} alt="Post 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-1/3 flex flex-col h-full pl-0.5">
                            <div className="h-1/3 w-full pb-0.5 cursor-pointer" onClick={() => openLightbox(1)}>
                                <img src={images[1].url} alt="Post 2" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-1/3 w-full py-0.5 cursor-pointer" onClick={() => openLightbox(2)}>
                                <img src={images[2].url} alt="Post 3" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-1/3 w-full pt-0.5 cursor-pointer" onClick={() => openLightbox(3)}>
                                <img src={images[3].url} alt="Post 4" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                 )}

                 {/* 5+ Images (Quadrant Layout with +N) */}
                 {images.length >= 5 && (
                     <div className="grid grid-cols-2 gap-1 h-[300px]">
                         {images.slice(0, 4).map((img, i) => (
                             <div 
                                key={i} 
                                className="relative w-full h-full cursor-pointer overflow-hidden group"
                                onClick={() => openLightbox(i)}
                             >
                                 <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                 {/* Overlay on the 4th image (Bottom Right) */}
                                 {i === 3 && (
                                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-2xl backdrop-blur-[1px]">
                                         +{images.length - 4}
                                     </div>
                                 )}
                             </div>
                         ))}
                     </div>
                 )}
                 </>
             )}
        </div>

        {/* Social Stats */}
        <div className="px-3 py-2 flex items-center justify-between text-[12px] text-gray-500 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-1 hover:text-[#0a66c2] hover:underline cursor-pointer group">
              <div className="flex -space-x-1 relative">
                  <div className="bg-[#1485BD] rounded-full w-4 h-4 flex items-center justify-center z-20 ring-1 ring-white">
                      <ThumbsUp size={8} className="text-white fill-white" />
                  </div>
                  <div className="bg-[#D14335] rounded-full w-4 h-4 flex items-center justify-center z-10 ring-1 ring-white">
                      <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
                  </div>
                  <div className="bg-[#5FA659] rounded-full w-4 h-4 flex items-center justify-center z-0 ring-1 ring-white">
                       <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M7 9a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm17 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>
                  </div>
              </div>
              <span className="ml-1 group-hover:text-[#0a66c2] group-hover:underline">{user.name} and 142 others</span>
          </div>
          <div className="flex gap-2 hover:text-[#0a66c2] cursor-pointer">
              <span className="hover:underline">84 comments</span>
              <span>•</span>
              <span className="hover:underline">12 reposts</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-2 py-1 flex items-center justify-between bg-white">
          <ActionButton icon={<ThumbsUp size={18} className="transform -scale-x-100" />} label="Like" />
          <ActionButton icon={<MessageSquare size={18} />} label="Comment" />
          <ActionButton icon={<Repeat size={18} />} label="Repost" />
          <ActionButton icon={<Send size={18} className="transform -rotate-45 mb-1" />} label="Send" />
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-200">
           {/* Close Button */}
           <button 
             onClick={closeLightbox}
             className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
           >
             <X size={24} />
           </button>

           {/* Counter */}
           <div className="absolute top-4 left-4 text-white font-medium bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {images.length}
           </div>

           {/* Main Image */}
           <div className="relative w-full h-full flex items-center justify-center p-4">
              <img 
                src={images[selectedImageIndex].url} 
                className="max-w-full max-h-full object-contain shadow-2xl"
                alt="Fullscreen Preview"
              />
           </div>

           {/* Navigation */}
           {images.length > 1 && (
             <>
               <button 
                 onClick={prevImage}
                 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all hover:scale-110"
               >
                 <ChevronLeft size={32} />
               </button>
               <button 
                 onClick={nextImage}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all hover:scale-110"
               >
                 <ChevronRight size={32} />
               </button>
             </>
           )}

           {/* Thumbnails Strip */}
           <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i); }}
                  className={`relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden transition-all border-2 ${i === selectedImageIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                   <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
           </div>
        </div>
      )}
    </>
  );
};

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center justify-center gap-2 px-2 py-3 rounded hover:bg-gray-100 flex-1 text-gray-600 font-semibold text-[14px] transition-colors group active:bg-gray-200">
    <span className="group-hover:scale-110 transition-transform">{icon}</span>
    <span>{label}</span>
  </button>
);

export default LinkedInPreview;
