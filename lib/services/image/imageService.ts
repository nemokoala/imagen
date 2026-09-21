import {
  imageGenerationService,
  GenerateImageRequest,
  GenerateImageResponse,
} from "./imageGenerationService";
import { imageRetrievalService } from "./imageRetrievalService";
import { qwenImageService } from "./qwenImageService";

export type { GenerateImageRequest, GenerateImageResponse };

export const imageService = {
  ...imageGenerationService,
  ...imageRetrievalService,
  ...qwenImageService,
};

export { imageGenerationService, imageRetrievalService };
