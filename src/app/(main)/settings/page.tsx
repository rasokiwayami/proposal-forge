import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/settings/profile-form';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>
      <ProfileForm initialProfile={profile} />
    </div>
  );
}