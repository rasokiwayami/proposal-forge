export type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  skills: string[];
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  portfolio_urls: { label: string; url: string }[];
  created_at: string;
  updated_at: string;
};
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
export type Platform = 'crowdworks' | 'lancers' | 'coconala' | 'other';
export type ProposalStatus = 'draft' | 'submitted' | 'won' | 'lost';
export type Proposal = {
  id: string;
  user_id: string;
  job_title: string;
  job_description: string;
  job_url: string | null;
  platform: Platform;
  status: ProposalStatus;
  proposed_price: number | null;
  proposed_deadline_days: number | null;
  final_text: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
};
export type ProposalInsert = Omit<Proposal, 'id' | 'created_at' | 'updated_at'>;
export type ProposalUpdate = Partial<Omit<Proposal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type ProposalAgentOutput = {
  id: string;
  proposal_id: string;
  agent_name: string;
  output_markdown: string;
  created_at: string;
};
export type ProposalAgentOutputInsert = Omit<ProposalAgentOutput, 'id' | 'created_at'>;
export type WinPattern = {
  id: string;
  user_id: string;
  pattern_text: string | null;
  tag: string | null;
  used_count: number;
  created_at: string;
};
export type WinPatternInsert = Omit<WinPattern, 'id' | 'created_at'>;