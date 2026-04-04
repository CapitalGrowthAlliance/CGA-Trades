-- Run this SQL in your Supabase SQL Editor to create the necessary tables

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE,
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password TEXT,
  provider TEXT DEFAULT 'local',
  "providerId" TEXT,
  "profilePicture" TEXT,
  "isOAuthUser" INTEGER DEFAULT 0,
  "walletBalance" REAL DEFAULT 0.0,
  "activeInvestments" REAL DEFAULT 0.0,
  "withdrawableProfits" REAL DEFAULT 0.0,
  balance REAL DEFAULT 0.0,
  "totalInvestments" REAL DEFAULT 0.0,
  "totalEarnings" REAL DEFAULT 0.0,
  "roiPercentage" REAL DEFAULT 0.0,
  "referralCode" TEXT UNIQUE,
  "referralEarnings" REAL DEFAULT 0.0,
  "referredBy" UUID REFERENCES users(id),
  "referralCount" INTEGER DEFAULT 0,
  "isKYCVerified" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  roi REAL NOT NULL,
  duration TEXT NOT NULL,
  "minInvestment" REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  currency TEXT,
  amount REAL NOT NULL,
  fee REAL DEFAULT 0.0,
  "planName" TEXT,
  "withdrawalMethod" TEXT,
  "paymentMethod" TEXT,
  "depositProof" TEXT,
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawal_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  "bankName" TEXT,
  "accountNumber" TEXT,
  "accountName" TEXT,
  "walletAddress" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id),
  "planId" TEXT NOT NULL REFERENCES plans(id),
  amount REAL NOT NULL,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial plans
INSERT INTO plans (id, name, roi, duration, "minInvestment") VALUES 
('plan_1', 'Starter', 5.0, '30 Days', 100),
('plan_2', 'Professional', 12.0, '90 Days', 1000),
('plan_3', 'Elite', 25.0, '180 Days', 5000)
ON CONFLICT (id) DO NOTHING;

-- Insert initial FAQs
INSERT INTO faqs (id, question, answer) VALUES 
('faq_1', 'What is Capital Growth Alliance?', 'Capital Growth Alliance is a premium fintech investment platform designed to help you grow your wealth securely.'),
('faq_2', 'How do I deposit funds?', 'You can deposit funds by navigating to the Profile and clicking on the "Deposit" action card. Follow the instructions to complete your transfer.'),
('faq_3', 'What is the minimum investment?', 'Our Starter plan requires a minimum investment of $100.'),
('faq_4', 'How long does withdrawal take?', 'Withdrawals are typically processed within 24-48 business hours.'),
('faq_5', 'Is my money safe?', 'Yes, your funds are protected by industry-leading security protocols and cold storage solutions.')
ON CONFLICT (id) DO NOTHING;
