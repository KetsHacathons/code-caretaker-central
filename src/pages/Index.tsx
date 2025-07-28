import { Navigation } from "@/components/ui/navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { 
  LayoutDashboard,
  GitBranch, 
  Shield, 
  TestTube2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const overviewMetrics = [
    {
      title: "Total Repositories",
      value: 24,
      description: "Across GitHub & BitBucket",
      icon: GitBranch,
      trend: { value: 12, label: "this month" }
    },
    {
      title: "Pending Updates",
      value: 8,
      description: "Version upgrades needed",
      icon: RefreshCw,
      variant: "warning" as const,
      trend: { value: -25, label: "vs last week" }
    },
    {
      title: "Vulnerabilities",
      value: 3,
      description: "High/Critical issues",
      icon: AlertTriangle,
      variant: "destructive" as const,
      trend: { value: -40, label: "this week" }
    },
    {
      title: "Test Coverage",
      value: "78%",
      description: "Average across all repos",
      icon: TestTube2,
      variant: "success" as const,
      trend: { value: 15, label: "improvement" }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Code Caretaker Central</h1>
                <p className="text-sm text-muted-foreground">Engineering Management Dashboard</p>
              </div>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Engineering Lead
          </h2>
          <p className="text-lg text-muted-foreground">
            Manage versions, security, and testing across all your repositories
          </p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default Index;
