// src/lib/blog.ts

// 1) Define your categories map (slug → human-readable)
export const ALL_CATEGORIES: Record<string, string> = {
    financije: 'Finance',
    trening: 'Working Out',
    mindfulness: 'Mindfulness',
    produktivnost: 'Productivity',
  };
  
  // 2) A Post type
  export interface Post {
    slug: string;
    title: string;
  }
  
  // 3) Stubbed fetcher (replace with real data source later)
  export async function getPostsByCategory(
    category: string,
    opts?: { limit: number }
  ): Promise<Post[]> {
    // Example static data—you’ll swap this for MDX/DB calls
    const demo: Post[] = [
      { slug: 'ulaganje-u-fondove', title: 'Ulaganje u fondove' },
      { slug: 'kako-sastaviti-budzet', title: 'Kako sastaviti budžet' },
      { slug: 'osnove-mindfulnessa', title: 'Osnove mindfulnessa' },
      { slug: '5-vjezbi-za-produktivnost', title: '5 vježbi za produktivnost' },
    ];
  
    // Filter by category (in a real app you’d query your markdown or DB)
    const filtered = demo.filter((p) =>
      // simple heuristic—match any demo post to each category
      true
    );
  
    // Return only `limit` items if given
    return opts?.limit ? filtered.slice(0, opts.limit) : filtered;
  }
  