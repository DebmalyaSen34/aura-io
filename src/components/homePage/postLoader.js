import { Avatar } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";

export default function PostLoader() {
  return (
    <Card className="bg-slate-700/50 border-slate-700 animate-pulse mt-5">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 bg-purple-600" />
          <span className="text-purple-100 w-32 h-4 bg-gray-600 rounded"></span>
          <span className="ml-auto text-lg font-semibold w-16 h-4 bg-gray-600 rounded"></span>
        </div>
        <div className="flex gap-4 mt-4">
          <span className="w-24 h-4 bg-gray-600 rounded"></span>
          <span className="w-24 h-4 bg-gray-600 rounded"></span>
        </div>
      </CardContent>
    </Card>
  );
}
