import mongoose, { Schema, Document } from 'mongoose';

// MongoDB handles flexible, unstructured data: Product Catalogs, Custom Design Metadata, and Reviews.

// ----------------------------------------------------------------------
// Reviews Schema (Including 5-star Google review data)
// ----------------------------------------------------------------------
export interface IReview extends Document {
  authorName: string;
  authorImage?: string;
  rating: number; // 1 to 5
  text: string;
  source: 'google' | 'internal';
  productId?: mongoose.Types.ObjectId; // Optional relationship to a specific product
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  authorName: { type: String, required: true },
  authorImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  source: { type: String, enum: ['google', 'internal'], default: 'internal' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  createdAt: { type: Date, default: Date.now }
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

// ----------------------------------------------------------------------
// Product Catalog Schema
// ----------------------------------------------------------------------
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: 'custom-apparel' | 'sublimation-blanks' | 'personalized-gifts' | 'team-shirts' | 'consulting';
  priceBase: number;
  currency: string;
  images: string[];

  // NoSQL flexibility shines here: Different products have totally different attributes
  attributes: Record<string, any>; // e.g., { colors: ['red', 'blue'], sizes: ['S', 'M', 'L'] }
  
  // Custom design metadata for sublimation templates
  sublimationMetadata?: {
    printAreaWidth: number;
    printAreaHeight: number;
    dpiRequirement: number;
    overlayTemplateUrl: string;
  };
  
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['custom-apparel', 'sublimation-blanks', 'personalized-gifts', 'team-shirts', 'consulting'],
    required: true 
  },
  priceBase: { type: Number, required: true },
  currency: { type: String, default: 'CAD' },
  images: [{ type: String }],
  attributes: { type: Schema.Types.Mixed, default: {} },
  sublimationMetadata: {
    printAreaWidth: Number,
    printAreaHeight: Number,
    dpiRequirement: Number,
    overlayTemplateUrl: String
  },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
