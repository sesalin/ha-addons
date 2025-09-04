export type AutoSchema = {
  nav: Array<{ id: string; title: string; icon?: string }>;
  pages: Record<string, { id: string; title: string; entities: string[]; domain: string }>;
  theme: { primary?: string; radius?: string; logo_url?: string };
};

export type Entity = {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
};

