-- WhaleSignal Database Schema
-- Run this in your Supabase SQL editor

-- Users profile (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  creator_tone TEXT DEFAULT 'flirty',
  niche TEXT DEFAULT 'general',
  allowed_requests TEXT[] DEFAULT '{}',
  banned_requests TEXT[] DEFAULT '{}',
  min_custom_price INTEGER DEFAULT 20,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  fan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fans
CREATE TABLE public.fans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  total_spend INTEGER DEFAULT 0,
  last_purchase_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  preferred_content TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  spend_likelihood INTEGER DEFAULT 50,
  expected_value INTEGER DEFAULT 0,
  recommended_action TEXT DEFAULT 'wait',
  action_reason TEXT,
  scored_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fan interactions
CREATE TABLE public.interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fan_id UUID REFERENCES public.fans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  direction TEXT DEFAULT 'inbound',
  converted BOOLEAN DEFAULT FALSE,
  spend_amount INTEGER DEFAULT 0,
  interaction_type TEXT DEFAULT 'message',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom request triage
CREATE TABLE public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fan_id UUID REFERENCES public.fans(id) ON DELETE SET NULL,
  raw_request TEXT NOT NULL,
  decision TEXT NOT NULL,
  suggested_price INTEGER,
  safer_rewrite TEXT,
  decline_reason TEXT,
  boundary_flags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tonight board snapshots
CREATE TABLE public.board_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fan_ids UUID[] NOT NULL,
  total_opportunity INTEGER DEFAULT 0,
  likely_buyers INTEGER DEFAULT 0,
  time_wasters INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can manage own fans" ON public.fans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interactions" ON public.interactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own offers" ON public.offers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own snapshots" ON public.board_snapshots FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER fans_updated_at BEFORE UPDATE ON public.fans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
