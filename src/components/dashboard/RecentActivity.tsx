import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  GitCommit,
  Shield,
  RefreshCw,
  TestTube2,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'version' | 'security' | 'coverage' | 'general';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  repository?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'version',
    title: 'Java 21 upgrade completed',
    description: 'Successfully upgraded 8 repositories to Java 21',
    timestamp: '2 hours ago',
    status: 'success',
    repository: 'Multiple repos'
  },
  {
    id: '2',
    type: 'security',
    title: 'Critical vulnerability detected',
    description: 'CVE-2024-1234 found in auth-service dependencies',
    timestamp: '4 hours ago',
    status: 'error',
    repository: 'auth-service'
  },
  {
    id: '3',
    type: 'coverage',
    title: 'Test coverage improved',
    description: 'Coverage increased from 75% to 82% in user-api',
    timestamp: '6 hours ago',
    status: 'success',
    repository: 'user-api'
  },
  {
    id: '4',
    type: 'version',
    title: 'Angular 18 upgrade in progress',
    description: 'Upgrading frontend applications to Angular 18',
    timestamp: '8 hours ago',
    status: 'pending',
    repository: 'frontend-apps'
  },
  {
    id: '5',
    type: 'security',
    title: 'Weekly security scan',
    description: 'Automated scan completed with 2 medium-risk issues',
    timestamp: '1 day ago',
    status: 'warning',
    repository: 'All repositories'
  }
];

const typeIcons = {
  version: RefreshCw,
  security: Shield,
  coverage: TestTube2,
  general: GitCommit
};

const statusStyles = {
  success: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  error: 'text-destructive bg-destructive/10 border-destructive/20',
  pending: 'text-primary bg-primary/10 border-primary/20'
};

const statusIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  pending: Clock
};

export function RecentActivity() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
        <CardDescription>
          Latest updates across your repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {mockActivities.map((activity) => {
              const TypeIcon = typeIcons[activity.type];
              const StatusIcon = statusIcons[activity.status];
              
              return (
                <div key={activity.id} className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <TypeIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm text-foreground">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        {activity.repository && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {activity.repository}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", statusStyles[activity.status])}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}