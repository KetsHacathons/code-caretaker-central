import { Navigation } from "@/components/ui/navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield,
  AlertTriangle,
  Bug,
  TrendingDown,
  Play,
  Settings,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle
} from "lucide-react";

const Vulnerabilities = () => {
  const securityMetrics = [
    {
      title: "Critical Issues",
      value: 2,
      description: "Require immediate attention",
      icon: AlertTriangle,
      variant: "destructive" as const,
      trend: { value: -50, label: "from last scan" }
    },
    {
      title: "High Priority",
      value: 8,
      description: "Fix within 7 days",
      icon: Bug,
      variant: "warning" as const,
      trend: { value: -20, label: "this week" }
    },
    {
      title: "Medium/Low",
      value: 15,
      description: "Schedule for next sprint",
      icon: Bug,
      variant: "secondary" as const,
      trend: { value: 10, label: "new findings" }
    },
    {
      title: "Security Score",
      value: "B+",
      description: "Overall security rating",
      icon: Shield,
      variant: "success" as const,
      trend: { value: 25, label: "improvement" }
    }
  ];

  const vulnerabilities = [
    {
      id: "CVE-2024-1234",
      title: "SQL Injection vulnerability in auth-service",
      severity: "critical",
      cvss: 9.8,
      repository: "auth-service",
      platform: "GitHub",
      package: "spring-security",
      version: "5.7.2",
      fixedIn: "6.1.0",
      status: "open",
      discoveredDate: "2024-01-15",
      description: "Authentication bypass through SQL injection in login endpoint"
    },
    {
      id: "CVE-2024-5678",
      title: "Cross-site scripting in user-frontend",
      severity: "high",
      cvss: 7.5,
      repository: "user-frontend",
      platform: "BitBucket",
      package: "@angular/common",
      version: "16.0.0",
      fixedIn: "16.2.1",
      status: "in-progress",
      discoveredDate: "2024-01-10",
      description: "XSS vulnerability in user input validation"
    },
    {
      id: "CVE-2024-9101",
      title: "Denial of Service in payment-api",
      severity: "high",
      cvss: 7.2,
      repository: "payment-api",
      platform: "GitHub",
      package: "jackson-databind",
      version: "2.14.2",
      fixedIn: "2.15.0",
      status: "open",
      discoveredDate: "2024-01-12",
      description: "Memory exhaustion through malformed JSON payload"
    },
    {
      id: "CVE-2024-1122",
      title: "Path traversal in file-service",
      severity: "medium",
      cvss: 6.1,
      repository: "file-service",
      platform: "GitHub",
      package: "commons-io",
      version: "2.11.0",
      fixedIn: "2.11.1",
      status: "resolved",
      discoveredDate: "2024-01-08",
      description: "Directory traversal allows reading arbitrary files"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in-progress': return 'warning';
      case 'open': return 'destructive';
      default: return 'secondary';
    }
  };

  const getCVSSColor = (cvss: number) => {
    if (cvss >= 9.0) return 'text-destructive';
    if (cvss >= 7.0) return 'text-warning';
    if (cvss >= 4.0) return 'text-secondary';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">OSS Vulnerabilities</h1>
                <p className="text-sm text-muted-foreground">Security management across all repositories</p>
              </div>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Run Security Scan
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Scanning
          </Button>
          <Button variant="outline" className="gap-2">
            <TrendingDown className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Vulnerabilities List */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Vulnerabilities</CardTitle>
                <CardDescription>
                  Security issues detected across your repositories
                </CardDescription>
              </div>
              <Badge variant="outline">
                {vulnerabilities.filter(v => v.status !== 'resolved').length} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {vulnerabilities.map((vuln) => (
                <div 
                  key={vuln.id}
                  className="p-6 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{vuln.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {vuln.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {vuln.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Repository:</span>
                            <Badge variant="outline">{vuln.repository}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Package:</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {vuln.package}@{vuln.version}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Fix available:</span>
                            <code className="bg-success/10 text-success px-2 py-1 rounded text-xs">
                              {vuln.fixedIn}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(vuln.severity)}>
                          {vuln.severity.toUpperCase()}
                        </Badge>
                        <div className={`text-sm font-mono ${getCVSSColor(vuln.cvss)}`}>
                          CVSS: {vuln.cvss}
                        </div>
                      </div>
                      <Badge variant={getStatusColor(vuln.status)}>
                        {vuln.status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {vuln.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                        {vuln.status === 'open' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {vuln.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="h-3 w-3" />
                          Details
                        </Button>
                        {vuln.status === 'open' && (
                          <Button size="sm" className="gap-2">
                            <ExternalLink className="h-3 w-3" />
                            Fix Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {vuln.status === 'in-progress' && (
                    <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-warning">Fix in progress</span>
                        <span className="text-xs text-muted-foreground">65% complete</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Vulnerabilities;