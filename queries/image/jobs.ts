import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FetchUtil } from "@/lib/Fetch.util";
import { ImageRatio } from "@/types/image.interfaces";
import type {
  EnqueueImageJobResponse,
  ImageJob,
  ImageJobHistoryFilter,
  ImageJobHistoryResponse,
  ImageJobsResponse,
} from "@/types/imageJob.interfaces";

export const imageJobsQueryKey = ["imageJobs"] as const;
export const imageJobHistoryQueryKey = ["imageJobHistory"] as const;

// 진행 중이면 자주, 서버만 기다리는 중이면 드물게, 모두 끝났으면 멈춘다.
const pollInterval = (jobs: ImageJob[] | undefined) => {
  if (!jobs) return false;
  const active = jobs.filter(
    (job) => job.status === "PENDING" || job.status === "RUNNING",
  );
  if (active.length === 0) return false;
  return active.every((job) => job.waitingForServer) ? 15_000 : 2_000;
};

export const useImageJobsQuery = () =>
  useQuery({
    queryKey: imageJobsQueryKey,
    queryFn: async (): Promise<ImageJob[]> => {
      const response = (await FetchUtil.get("/api/image-jobs")) as ImageJobsResponse;
      return response.jobs;
    },
    refetchInterval: (query) => pollInterval(query.state.data),
  });

/** 프로필 생성 요청 탭. 진행 중인 요청이 보이면 10초마다 새로 받는다. */
export const useImageJobHistoryInfiniteQuery = (
  filter: ImageJobHistoryFilter,
  limit = 20,
) =>
  useInfiniteQuery({
    queryKey: [...imageJobHistoryQueryKey, filter, limit],
    queryFn: async ({ pageParam }): Promise<ImageJobHistoryResponse> =>
      (await FetchUtil.get(
        `/api/image-jobs/history?page=${pageParam}&limit=${limit}&filter=${filter}`,
      )) as ImageJobHistoryResponse,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    refetchInterval: (query) =>
      query.state.data?.pages[0]?.summary.active ? 10_000 : false,
  });

export const useEnqueueImageJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      prompt: string;
      model: string;
      ratio: ImageRatio;
      categories: string[];
    }): Promise<ImageJob> => {
      const response = (await FetchUtil.post(
        "/api/generate-image",
        data,
      )) as EnqueueImageJobResponse;
      return response.job;
    },
    onSuccess: () => {
      // 크레딧은 접수할 때 먼저 차감된다.
      queryClient.invalidateQueries({ queryKey: ["credit"] });
      queryClient.invalidateQueries({ queryKey: imageJobsQueryKey });
      queryClient.invalidateQueries({ queryKey: imageJobHistoryQueryKey });
    },
  });
};

export const useCancelImageJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: number): Promise<ImageJob> => {
      const response = (await FetchUtil.delete(`/api/image-jobs/${jobId}`, {})) as {
        job: ImageJob;
      };
      return response.job;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["credit"] });
      queryClient.invalidateQueries({ queryKey: imageJobsQueryKey });
      queryClient.invalidateQueries({ queryKey: imageJobHistoryQueryKey });
    },
  });
};
