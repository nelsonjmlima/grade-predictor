
import { toast } from "sonner";

interface GitLabProject {
  id: number;
  name: string;
  description: string | null;
  path_with_namespace: string;
  web_url: string;
}

interface GitLabMember {
  id: number;
  name: string;
  username: string;
  email?: string;
}

export async function getProjectInfo(projectUrl: string, token: string): Promise<GitLabProject | null> {
  try {
    const projectPath = urlToProjectPath(projectUrl);
    const apiUrl = `https://gitlab.com/api/v4/projects/${projectPath}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "PRIVATE-TOKEN": token
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitLab API error:", response.status, errorText);
      toast.error(`Failed to fetch project: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitLab project:", error);
    toast.error("Failed to fetch GitLab project information");
    return null;
  }
}

export async function getProjectMembers(projectId: number, token: string): Promise<GitLabMember[]> {
  try {
    const apiUrl = `https://gitlab.com/api/v4/projects/${projectId}/members/all`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "PRIVATE-TOKEN": token
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitLab API error:", response.status, errorText);
      toast.error(`Failed to fetch members: ${response.statusText}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitLab members:", error);
    toast.error("Failed to fetch GitLab project members");
    return [];
  }
}

function urlToProjectPath(url: string): string {
  return encodeURIComponent(url.replace("https://gitlab.com/", ""));
}
