"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  User,
  Image as ImageIcon,
  Download,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

interface Image {
  id: number;
  prompt: string;
  imageUrl: string;
  model: string;
  size: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image | null;
  onDownload: (imageUrl: string, prompt: string) => void;
}

export function ImageModal({
  isOpen,
  onClose,
  image,
  onDownload,
}: ImageModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center justify-between text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-purple-600" />
              <span>이미지 상세 정보</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {image && (
          <div className="space-y-6">
            {/* 이미지 */}
            <div className="flex justify-center">
              <div className="relative group">
                <Image
                  src={image.imageUrl}
                  alt={image.prompt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-96 object-contain rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() => onDownload(image.imageUrl, image.prompt)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    다운로드
                  </Button>
                </div>
              </div>
            </div>

            {/* 프롬프트 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                프롬프트
              </h3>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                <p className="text-gray-700 leading-relaxed">{image.prompt}</p>
              </div>
            </div>

            {/* 이미지 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    생성자
                  </h3>
                  <p className="text-gray-700">{image.user.nickname}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    모델
                  </h3>
                  <Badge variant="secondary" className="text-sm">
                    {image.model}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                    크기
                  </h3>
                  <p className="text-gray-700">{image.size}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    생성일
                  </h3>
                  <p className="text-gray-700">{formatDate(image.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
