import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Repository {
  id: string;
  name: string;
  full_name: string;
}

interface UpgradeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositories: Repository[];
  onStartUpgrade: (data: {
    repositoryId: string;
    technology: string;
    targetVersion: string;
  }) => void;
}

const technologyVersions = {
  Java: ["21", "17", "11", "8"],
  Angular: ["18", "17", "16", "15"],
  Python: ["3.12", "3.11", "3.10", "3.9"]
};

export function UpgradeSelectionModal({ 
  open, 
  onOpenChange, 
  repositories, 
  onStartUpgrade 
}: UpgradeSelectionModalProps) {
  const [selectedRepository, setSelectedRepository] = useState<string>("");
  const [selectedTechnology, setSelectedTechnology] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  const handleStartUpgrade = () => {
    if (selectedRepository && selectedTechnology && selectedVersion) {
      onStartUpgrade({
        repositoryId: selectedRepository,
        technology: selectedTechnology,
        targetVersion: selectedVersion
      });
      // Reset form
      setSelectedRepository("");
      setSelectedTechnology("");
      setSelectedVersion("");
      onOpenChange(false);
    }
  };

  const availableVersions = selectedTechnology 
    ? technologyVersions[selectedTechnology as keyof typeof technologyVersions] || []
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Version Upgrade</DialogTitle>
          <DialogDescription>
            Select the repository, technology, and target version for the upgrade scan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="repository">Repository</Label>
            <Select value={selectedRepository} onValueChange={setSelectedRepository}>
              <SelectTrigger id="repository">
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.id}>
                    {repo.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="technology">Technology</Label>
            <Select value={selectedTechnology} onValueChange={(value) => {
              setSelectedTechnology(value);
              setSelectedVersion(""); // Reset version when technology changes
            }}>
              <SelectTrigger id="technology">
                <SelectValue placeholder="Select technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="Angular">Angular</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="version">Target Version</Label>
            <Select 
              value={selectedVersion} 
              onValueChange={setSelectedVersion}
              disabled={!selectedTechnology}
            >
              <SelectTrigger id="version">
                <SelectValue placeholder="Select target version" />
              </SelectTrigger>
              <SelectContent>
                {availableVersions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartUpgrade}
            disabled={!selectedRepository || !selectedTechnology || !selectedVersion}
          >
            Start Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}