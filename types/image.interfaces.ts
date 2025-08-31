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
  model?: string;
  userId: number;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface GetUserImagesResponse {
  success: boolean;
  images: GeneratedImage[];
  error?: string;
}

export interface GetImageByIdResponse {
  success: boolean;
  image: GeneratedImage | null;
  error?: string;
}
