import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Coins, AlertCircle } from "lucide-react";

interface CreditDisplayProps {
  credit: number;
  isLoading: boolean;
}

export function CreditDisplay({ credit, isLoading }: CreditDisplayProps) {
  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">보유 크레딧</h3>
                <p className="text-sm text-gray-600">
                  이미지 생성에 사용되는 크레딧입니다
                </p>
              </div>
            </div>
            <div className="text-right">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                  <span className="text-sm text-gray-500">로딩 중...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-600">
                    {credit}
                  </span>
                  <span className="text-sm text-gray-500">크레딧</span>
                </div>
              )}
            </div>
          </div>

          {/* 크레딧 부족 경고 */}
          {credit && credit < 1 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">
                  크레딧이 부족합니다. 이미지 생성을 위해 크레딧을 충전해주세요.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
