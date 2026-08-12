
export interface UpdateBlogPayload {
  title?: string;
  cont?: string;
  image?: File;
}

export interface CreateBlogFormValues {
  title: string;
  cont: string;
  image: File;
}


// =========================
// Media
// =========================

export interface BlogImage {
  url: string;
  alt?: string;
}

// =========================
// Structured content blocks (optional editor content)
// =========================

export interface BlogBlock {
  type: 'paragraph' | 'heading' | 'image' | 'quote' | 'list';
  text?: string;
  level?: number;
  image?: {
    url?: string;
    alt?: string;
  };
}

// =========================
// SEO
// =========================

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export type BlogStatus = 'draft' | 'published';

// =========================
// Core Blog shape (matches backend Blog model)
// =========================

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  BlogCategory: string;
  featuredImage: BlogImage;
  content: string;
  blocks?: BlogBlock[];
  status: BlogStatus;
  publishedAt: string | null;
  featured: boolean;
  seo?: BlogSeo;
  createdAt: string;
  updatedAt: string;
}

// =========================
// API request/response shapes
// =========================

export interface BlogPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetBlogsResponse {
  blogs: Blog[];
  pagination: BlogPagination;
}

export interface GetBlogsParams {
  category?: string;
  status?: BlogStatus;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateBlogResponse {
  message: string;
  blog: Blog;
}

export interface BlogMessageResponse {
  message: string;
  blog?: Blog;
}