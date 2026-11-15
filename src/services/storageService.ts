import { getSupabaseClient } from '../lib/supabase/client';

export interface StorageUploadResult {
  path: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
}

export const storageService = {
  /**
   * Upload candidate resume to the private 'resumes' bucket
   * Path: resumes/{userId}/{timestamp}_{sanitizedFileName}
   */
  async uploadResume(userId: string, file: File): Promise<{ data: StorageUploadResult | null; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          path: `demo/resumes/${file.name}`,
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type || 'application/pdf',
        },
        error: null,
      };
    }

    try {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return { data: null, error: new Error('Only PDF resumes are accepted.') };
      }

      if (file.size > 10 * 1024 * 1024) {
        return { data: null, error: new Error('Resume file size exceeds the 10MB limit.') };
      }

      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${userId}/${Date.now()}_${sanitizedName}`;

      const { data, error } = await client.storage
        .from('resumes')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      return {
        data: {
          path: data.path,
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type || 'application/pdf',
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  /**
   * Generates a signed download URL for private resumes (valid for 60 minutes)
   */
  async getResumeSignedUrl(path: string, expiresInSeconds: number = 3600): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client.storage
        .from('resumes')
        .createSignedUrl(path, expiresInSeconds);

      if (error || !data) return null;
      return data.signedUrl;
    } catch {
      return null;
    }
  },

  /**
   * Upload company verification document to the private 'verification-docs' bucket
   * Path: verification-docs/{companyId}/{docType}_{timestamp}_{sanitizedFileName}
   */
  async uploadVerificationDocument(
    companyId: string,
    docType: string,
    file: File
  ): Promise<{ data: StorageUploadResult | null; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          path: `demo/verification-docs/${docType}_${file.name}`,
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
        },
        error: null,
      };
    }

    try {
      if (file.size > 10 * 1024 * 1024) {
        return { data: null, error: new Error('Verification document exceeds the 10MB limit.') };
      }

      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${companyId}/${docType}_${Date.now()}_${sanitizedName}`;

      const { data, error } = await client.storage
        .from('verification-docs')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      return {
        data: {
          path: data.path,
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  /**
   * Generates a signed download URL for verification documents (admin & company only)
   */
  async getVerificationDocSignedUrl(path: string, expiresInSeconds: number = 3600): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client.storage
        .from('verification-docs')
        .createSignedUrl(path, expiresInSeconds);

      if (error || !data) return null;
      return data.signedUrl;
    } catch {
      return null;
    }
  },
};
