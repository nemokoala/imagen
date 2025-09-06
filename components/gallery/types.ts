export interface Image {
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

