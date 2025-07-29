import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/ui/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  Github, 
  GitBranch, 
  Lock, 
  Unlock, 
  Search,
  Plus,
  Loader2,
  Calendar,
  Code
} from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  provider: string;
  external_id: string;
  clone_url: string;
  default_branch: string;
  is_private: boolean;
  description?: string;
  language?: string;
  scan_status: string;
  last_scan_at?: string;
  created_at: string;
  user_id: string;
}

export default function Repositories() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchRepositories();
    }
  }, [user]);

  const fetchRepositories = async () => {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRepositories(data || []);
    } catch (error) {
      toast({
        title: "Error fetching repositories",
        description: "Failed to load your repositories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'scanning': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Repository Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect and manage your GitHub and Bitbucket repositories
            </p>
          </div>
          <Navigation />
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Connect Repository
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredRepositories.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No repositories found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No repositories match your search.' : 'Connect your first repository to get started.'}
                  </p>
                  {!searchQuery && (
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Connect Repository
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredRepositories.map((repo) => (
                  <Card key={repo.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Github className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">{repo.name}</h3>
                            {repo.is_private ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Unlock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {repo.full_name}
                          </p>
                          
                          {repo.description && (
                            <p className="text-sm mb-3">{repo.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                <Code className="h-4 w-4" />
                                {repo.language}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Added {formatDate(repo.created_at)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <Badge className={getStatusColor(repo.scan_status)}>
                            {repo.scan_status}
                          </Badge>
                          
                          {repo.last_scan_at && (
                            <p className="text-xs text-muted-foreground">
                              Last scan: {formatDate(repo.last_scan_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>
                  Connect repositories and manage scans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Github className="h-4 w-4" />
                  Connect GitHub
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <GitBranch className="h-4 w-4" />
                  Connect Bitbucket
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Repository Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Repositories</span>
                    <span className="font-semibold">{repositories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Scanned</span>
                    <span className="font-semibold">
                      {repositories.filter(r => r.scan_status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending Scans</span>
                    <span className="font-semibold">
                      {repositories.filter(r => r.scan_status === 'pending').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}