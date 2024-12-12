import { Card } from "../ui/card";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export default function WelcomeCard({ onGetStarted }) {
  return (
    <Card className="mb-6 bg-slate-900/50 border-slate-700">
      <CardContent className="p-4 flex items-center justify-between">
        <p className="text-purple-100">
          Add your first life incident to see posts!
        </p>
        <Button onClick={onGetStarted}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Incident
        </Button>
      </CardContent>
    </Card>
  );
}
