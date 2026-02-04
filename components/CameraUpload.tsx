
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Sparkles, Loader2 } from 'lucide-react';
import { ClothingItem, Category } from '../types';
import { analyzeClothingImage } from '../services/geminiService';

interface CameraUploadProps {
  onAdd: (item: ClothingItem) => void;
  onCancel: () => void;
}

const CameraUpload: React.FC<CameraUploadProps> = ({ onAdd, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [details, setDetails] = useState<Partial<ClothingItem> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    try {
      const result = await analyzeClothingImage(base64);
      setDetails(result);
    } catch (e) {
      console.error(e);
      // Fallback details for demo if API fails
      setDetails({
        category: Category.TOP,
        subCategory: 'Classic Shirt',
        color: 'Neutral',
        style: 'Casual',
        season: ['Spring', 'Summer']
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const confirmAdd = () => {
    if (image && details) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        image,
        category: details.category as Category || Category.TOP,
        color: details.color || 'Unknown',
        style: details.style || 'Casual',
        subCategory: details.subCategory || 'Clothing Item',
        season: details.season || [],
        wearCount: 0,
        dateAdded: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col max-w-md mx-auto overflow-hidden">
      <header className="px-6 py-4 flex justify-between items-center bg-slate-900 text-white">
        <button onClick={onCancel} className="p-2"><X /></button>
        <h2 className="text-lg font-bold">Add New Item</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 relative flex flex-col">
        {!image ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
            <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center">
              <Camera className="w-12 h-12 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">Capture your item</p>
              <p className="text-slate-400 text-sm mt-2">Place your clothing on a flat surface with good lighting</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40"
            >
              Take Photo
            </button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleCapture}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="Capture" />
              {analyzing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Analyzing with Gemini...
                  </p>
                </div>
              )}
            </div>

            {details && !analyzing && (
              <div className="bg-white rounded-t-3xl -mt-8 relative z-10 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1 block">AI Recognized</span>
                    <h3 className="text-2xl font-bold text-slate-900">{details.subCategory}</h3>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                    {details.category}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Color</p>
                    <p className="text-sm font-bold text-slate-700">{details.color}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Style</p>
                    <p className="text-sm font-bold text-slate-700">{details.style}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {details.season?.map(s => (
                    <span key={s} className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setImage(null); setDetails(null); }}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold"
                  >
                    Retake
                  </button>
                  <button 
                    onClick={confirmAdd}
                    className="flex-[2] py-4 bg-black text-white rounded-2xl font-bold shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Save to Wardrobe
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraUpload;
