export type FeatureFlags = {
  lights: boolean;
  climate: boolean;
  security: boolean;
  covers: boolean;
  sensors: boolean;
  cameras: boolean;
  energy: boolean;
};

export type ThemeTokens = {
  primary?: string;
  radius?: string;
  logo_url?: string;
};

export type Options = {
  features: FeatureFlags;
  theme: ThemeTokens;
  mappings?: Record<string, unknown>;
};

export type HAEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
  context?: any;
};

export type AutoSchema = {
  nav: Array<{ id: string; title: string; icon?: string }>;
  pages: Record<string, { id: string; title: string; entities: string[]; domain: string }>;
  theme: ThemeTokens;
};

