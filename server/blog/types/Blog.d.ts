import { Document } from "mongoose";

interface IBlog extends Document {
  title: string;
  subtitle: string;
  description: string;
  isArchived: boolean;
  featuredImages: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export = IBlog;
