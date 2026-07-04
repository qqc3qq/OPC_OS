export const name = '004_create_goals'
export const sql = `
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  deadline TEXT
);

CREATE INDEX IF NOT EXISTS idx_goals_project ON goals(project_id);
`
