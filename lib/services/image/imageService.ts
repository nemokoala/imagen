import {
  imageGenerationService,
  GenerateImageRequest,
  GenerateImageResponse,
} from "./imageGenerationService";
import { imageRetrievalService } from "./imageRetrievalService";

export type { GenerateImageRequest, GenerateImageResponse };

export const imageService = {
  ...imageGenerationService,
  ...imageRetrievalService,
};

export { imageGenerationService, imageRetrievalService };
