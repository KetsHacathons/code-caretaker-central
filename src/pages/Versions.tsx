import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UpgradeSelectionModal } from "@/components/upgrade/UpgradeSelectionModal";
import { AutoUpdateConfigModal } from "@/components/upgrade/AutoUpdateConfigModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRepositories } from "@/hooks/useRepositories";
import { supabase } from "@/integrations/supabase/client";
import { 
  RefreshCw,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Settings
} from "lucide-react";

const Versions = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { repositories, loading: repositoriesLoading } = useRepositories();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAutoUpdateConfigOpen, setIsAutoUpdateConfigOpen] = useState(false);
  const [isCreatingUpgrade, setIsCreatingUpgrade] = useState(false);

  const handleStartUpgrade = async (data: { repositoryId: string; technology: string; targetVersion: string }) => {
    const selectedRepo = repositories.find(repo => repo.id === data.repositoryId);
    setIsCreatingUpgrade(true);
    
    try {
      toast({
        title: "Creating Upgrade",
        description: `Creating branch and PR for ${data.technology} upgrade to ${data.targetVersion}...`
      });

      const { data: result, error } = await supabase.functions.invoke('create-upgrade-pr', {
        body: {
          repositoryId: data.repositoryId,
          technology: data.technology,
          targetVersion: data.targetVersion
        }
      });

      if (error) {
        throw error;
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Pull Request Created! 🎉",
        description: (
          <div className="space-y-2">
            <p>Successfully created PR #{result.pullRequestNumber} for {selectedRepo?.full_name}</p>
            <p className="text-sm text-muted-foreground">
              Please review and merge the pull request to complete the upgrade.
            </p>
            <a 
              href={result.pullRequestUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-primary hover:underline"
            >
              View Pull Request →
            </a>
          </div>
        ),
        duration: 10000,
      });

    } catch (error) {
      console.error('Upgrade creation failed:', error);
      toast({
        title: "Upgrade Failed",
        description: `Failed to create upgrade: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingUpgrade(false);
    }
  };

  const versionMetrics = [
    {
      title: "Java Projects",
      value: 12,
      description: "8 on v17, 4 need upgrade to v21",
      icon: Package,
      variant: "warning" as const
    },
    {
      title: "Angular Projects",
      value: 6,
      description: "3 on v16, 3 need upgrade to v18",
      icon: Package,
      variant: "warning" as const
    },
    {
      title: "Python Projects",
      value: 6,
      description: "All on v3.11, upgrade to v3.12 available",
      icon: Package,
      variant: "success" as const
    },
    {
      title: "Up-to-date",
      value: "45%",
      description: "Repositories with latest versions",
      icon: TrendingUp,
      trend: { value: 15, label: "improvement" }
    }
  ];

  const upgradeQueue = [
    {
      id: 1,
      repository: "auth-service",
      platform: "GitHub",
      technology: "Java",
      currentVersion: "17",
      targetVersion: "21",
      status: "pending",
      priority: "high",
      estimatedTime: "2 hours"
    },
    {
      id: 2,
      repository: "user-frontend",
      platform: "BitBucket",
      technology: "Angular",
      currentVersion: "16",
      targetVersion: "18",
      status: "in-progress",
      priority: "medium",
      estimatedTime: "4 hours"
    },
    {
      id: 3,
      repository: "payment-api",
      platform: "GitHub",
      technology: "Java",
      currentVersion: "17",
      targetVersion: "21",
      status: "pending",
      priority: "high",
      estimatedTime: "3 hours"
    },
    {
      id: 4,
      repository: "analytics-service",
      platform: "GitHub",
      technology: "Python",
      currentVersion: "3.11",
      targetVersion: "3.12",
      status: "completed",
      priority: "low",
      estimatedTime: "1 hour"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <RefreshCw className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Version Management</h1>
                <p className="text-sm text-muted-foreground">Centralized version upgrades across all repositories</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Navigation />
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {versionMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="gap-2" onClick={() => setIsUpgradeModalOpen(true)}>
            <Play className="h-4 w-4" />
            Start All Upgrades
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Scan for Updates
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setIsAutoUpdateConfigOpen(true)}>
            <Settings className="h-4 w-4" />
            Configure Auto-Updates
          </Button>
        </div>

        {/* Upgrade Queue */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upgrade Queue</CardTitle>
                <CardDescription>
                  Pending and active version upgrades across your repositories
                </CardDescription>
              </div>
              <Badge variant="outline">
                {upgradeQueue.filter(item => item.status === 'pending').length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upgradeQueue.map((upgrade) => (
                <div 
                  key={upgrade.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{upgrade.repository}</h4>
                        <Badge variant="outline" className="text-xs">
                          {upgrade.platform}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {upgrade.technology}: {upgrade.currentVersion} → {upgrade.targetVersion}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Est. {upgrade.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getPriorityColor(upgrade.priority)}>
                      {upgrade.priority}
                    </Badge>
                    <Badge variant={getStatusColor(upgrade.status)}>
                      {upgrade.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {upgrade.status === 'in-progress' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                      {upgrade.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {upgrade.status}
                    </Badge>
                    {upgrade.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    )}
                    {upgrade.status === 'in-progress' && (
                      <div className="w-20">
                        <Progress value={65} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Upgrade Selection Modal */}
      <UpgradeSelectionModal
        open={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
        repositories={repositories}
        loading={repositoriesLoading || isCreatingUpgrade}
        onStartUpgrade={handleStartUpgrade}
      />

      {/* Auto-Update Configuration Modal */}
      <AutoUpdateConfigModal
        open={isAutoUpdateConfigOpen}
        onOpenChange={setIsAutoUpdateConfigOpen}
      />
    </div>
  );
};

export default Versions;