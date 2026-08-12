import { Blog, BlogMessageResponse, BlogStatus, CreateBlogResponse, GetBlogsParams, GetBlogsResponse } from '@/types/blog';
import api from './api';


export const blogService = {
  // =========================
  // Public
  // =========================

  async getBlogs(params: GetBlogsParams = {}): Promise<GetBlogsResponse> {
    const { data } = await api.get<GetBlogsResponse>('/blogs', { params });

    return data;
  },

  async getAdminBlogs(params: GetBlogsParams = {}): Promise<GetBlogsResponse> {
    const { data } = await api.get<GetBlogsResponse>(
      "/blogs/admin",
      { params }
    );

    return data;
  },

  async getBlogById(blogId: string): Promise<Blog> {
    const { data } = await api.get<Blog>(`/blogs/${blogId}`);

    return data;
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    const { data } = await api.get<Blog>(`/blogs/slug/${slug}`);

    return data;
  },

  // =========================
  // Admin
  // =========================

  async createBlog(formData: FormData): Promise<CreateBlogResponse> {
    const { data } = await api.post<CreateBlogResponse>(
      '/blogs',
      formData
    );

    return data;
  },

  async updateBlog(
    blogId: string,
    formData: FormData
  ): Promise<Blog> {
    const { data } = await api.put<Blog>(
      `/blogs/${blogId}`,
      formData
    );

    return data;
  },

  async deleteBlog(
    blogId: string
  ): Promise<BlogMessageResponse> {
    const { data } =
      await api.delete<BlogMessageResponse>(
        `/blogs/${blogId}`
      );

    return data;
  },
};

// =========================
// Helper: build multipart FormData for create/update forms
// =========================
// NOTE: the file field MUST be named "featuredImage" to match the
// backend's upload.single("featuredImage") multer config.
interface BlogFormFields {
  title?: string;
  slug?: string;
  subtitle?: string;
  excerpt?: string;
  BlogCategory?: string;
  content?: string;
  status?: BlogStatus;
  featured?: boolean;
  imageAlt?: string;
  blocks?: unknown;
  seo?: unknown;
  featuredImage?: File; // new image file, only include when the user picks/replaces one
}

export function buildBlogFormData(fields: BlogFormFields): FormData {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'featuredImage' && value instanceof File) {
      formData.append('featuredImage', value);
      return;
    }

    if (key === 'blocks' || key === 'seo') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}