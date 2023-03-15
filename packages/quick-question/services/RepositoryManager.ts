import fs from "fs";
import path from "path";

import { buildIndex, revisionFilename, Revision } from "quick-question-indexer";

export interface Metadata {
  name: string;
  exampleQueries: string[];
}

export type IndexingStatus = "init" | "success" | "pending" | "failed";
export type IndexRevision = Revision;

class RepositoryManager {
  indexingJob?: Promise<void>;
  indexingStatus: IndexingStatus = "init";
  metadata: Metadata;
  private indexRevision: IndexRevision | null = null;

  constructor() {
    const metadataFile = path.join(
      process.cwd(),
      process.env.REPO_DIR!,
      "metadata.json"
    );
    this.metadata = JSON.parse(fs.readFileSync(metadataFile, "utf-8"));
  }

  getIndexingStatus(): IndexingStatus {
    if (
      fs.existsSync(
        path.join(process.cwd(), process.env.REPO_DIR!, "index/docstore.json")
      )
    ) {
      return "success";
    }

    if (!this.indexingJob) {
      this.indexingStatus = "pending";
      this.indexingJob = createIndexingJob().then((status) => {
        this.indexingStatus = status;
      });
    }

    return this.indexingStatus;
  }

  getIndexRevision(): IndexRevision | null {
    if (this.getIndexingStatus() !== 'success') {
      return null;
    }
    if (this.indexRevision) {
      return this.indexRevision;
    }
    const indexRevisionFile = path.join(
      process.cwd(),
      process.env.REPO_DIR!,
      "index",
      revisionFilename
    );
    if (fs.existsSync(indexRevisionFile)) {
      this.indexRevision = JSON.parse(
        fs.readFileSync(indexRevisionFile, "utf-8")
      ) as Revision;
    }
    return this.indexRevision;
  }
}

async function createIndexingJob(): Promise<IndexingStatus> {
  try {
    await buildIndex({
      input: path.join(process.cwd(), process.env.REPO_DIR!, "metadata.json"),
      dryrun: false,
    });
    return "success";
  } catch (err) {
    console.error("Failed indexing", err);
    return "failed";
  }
}

export function getRepositoryManager(ctx: any): RepositoryManager {
  if (!ctx.repositoryManager) {
    ctx.repositoryManager = new RepositoryManager();
  }
  return ctx.repositoryManager;
}
