export interface GeneratedImage {
  id: number;
  userId: number;
  prompt: string;
  imageUrl: string;
  model: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    nickname: string;
  };
}

export interface GenerateImageRequest {
  prompt: string;
  model: string;
  categories?: string[]; // 카테고리 slug 배열 (선택)
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl: string;
  remaining: number | "unlimited";
}

export interface GetUserImagesResponse {
  success: boolean;
  images: Image[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  error?: string;
}

export interface GetImageByIdResponse {
  success: boolean;
  image: GeneratedImage | null;
  prevImages?: Image[];
  nextImages?: Image[];
  error?: string;
}

export interface Image {
  id: number;
  userId: number;
  prompt: string;
  translatedPrompt: string | null; // 번역된 프롬프트
  imageUrl: string;
  model: string;
  size: string;
  editData: string | null;
  editedImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  categories: Category[]; // 카테고리 목록
  likeCount: number;
  commentCount: number;
}

export interface GalleryResponse {
  success: boolean;
  images: Image[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  error?: string;
}
export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  parentId: number | null;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  replies: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}
