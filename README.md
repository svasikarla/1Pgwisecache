# WiseCache

WiseCache is an AI-powered web content management system that helps you save, summarize, and organize web content efficiently. Built with Next.js, Supabase, and OpenAI, it provides a modern and intuitive interface for managing your knowledge base.

## Features

- 🤖 AI-powered content summarization
- 📱 Responsive modern UI
- 🔍 Smart categorization of content
- 👥 Guest mode for trying the service
- 🔐 Secure authentication with Supabase
- 📚 Personal knowledge base management

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth)
- **AI**: OpenAI GPT for content analysis
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wisecache.git
   cd wisecache
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your:
   - Supabase project URL and anon key
   - OpenAI API key
   - Site URL (for auth callbacks)

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new project in Supabase
2. Run the following SQL in the Supabase SQL editor:

```sql
-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  is_guest boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create knowledge base table
create table public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  original_url text not null,
  category text not null,
  headline text not null,
  summary text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.knowledge_base enable row level security;

-- Create policies
create policy "Users can read own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own data"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can read own knowledge base"
  on public.knowledge_base for select
  using (auth.uid() = user_id);

create policy "Users can insert into own knowledge base"
  on public.knowledge_base for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own knowledge base entries"
  on public.knowledge_base for delete
  using (auth.uid() = user_id);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 