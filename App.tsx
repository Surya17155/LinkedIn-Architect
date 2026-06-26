
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import LinkedInPreview from './components/LinkedInPreview';
import LandingPage from './components/LandingPage';
import MCPModal from './components/MCPModal';
import { LinkedInLogo } from './components/LinkedInLogo';
import { UserProfile, MediaFile } from './types';
import { Layout, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [content, setContent] = useState<string>("");
  const [mcpModalOpen, setMcpModalOpen] = useState(false);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  
  const user: UserProfile = {
    name: "Surya Kant",
    headline: "BBA (hons.) in AI Student at IILM University, Greater Noida",
    avatarUrl: "https://i.postimg.cc/xd4VMNfP/download.png", 
    profileUrl: "https://www.linkedin.com/in/suryakant17155/"
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      mediaFiles.forEach(file => URL.revokeObjectURL(file.url));

      const files = Array.from(e.target.files);
      const newMedia: MediaFile[] = files.map((file: any) => ({
          url: URL.createObjectURL(file),
          type: file.type === 'application/pdf' ? 'pdf' : 'image',
          name: file.name
      }));
      setMediaFiles(newMedia);
    }
  };

  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => {
          URL.revokeObjectURL(file.url);
      });
    };
  }, [mediaFiles]);

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('editor')} />;
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      
      {/* Centered Logo Header with MCP Button */}
      <div className="pt-6 pb-4 flex justify-center w-full relative">
         <div 
           className="cursor-pointer hover:opacity-80 transition-opacity"
           onClick={() => setView('landing')}
           title="Back to Home"
         >
            <LinkedInLogo size="md" />
         </div>
         <button
           onClick={() => setMcpModalOpen(true)}
           className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all shadow-sm"
           title="MCP Server Configuration"
         >
           <Cpu className="w-4 h-4" />
           <span className="hidden sm:inline">MCP</span>
         </button>
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full min-h-[600px]">
            
            {/* Left Panel: Editor */}
            <div className="h-full flex flex-col min-h-[500px]">
                <div className="mb-4 flex items-end justify-between px-2">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Post</h2>
                        <p className="text-sm text-gray-500 mt-1">Design, format, and optimize for engagement.</p>
                     </div>
                </div>
                <div className="flex-1 relative">
                    <Editor 
                        content={content} 
                        setContent={setContent} 
                        onMediaUpload={handleMediaUpload}
                        mediaCount={mediaFiles.length}
                    />
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="h-full flex flex-col items-center">
                 <div className="w-full mb-6 flex items-center justify-between max-w-[555px] px-2">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</h2>
                </div>
                
                <div className="w-full max-w-[555px]">
                    <LinkedInPreview 
                        content={content}
                        user={user}
                        mediaFiles={mediaFiles}
                    />
                </div>
                
                {/* Formatting Tips Section Removed */}
            </div>
        </div>
      </main>

      <MCPModal isOpen={mcpModalOpen} onClose={() => setMcpModalOpen(false)} />
    </div>
  );
};

export default App;
