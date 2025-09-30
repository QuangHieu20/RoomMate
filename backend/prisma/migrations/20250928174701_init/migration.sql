-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('moderator', 'super_admin', 'user');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'inactive', 'banned');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('for_rent', 'looking_for');

-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'expired', 'rented');

-- CreateEnum
CREATE TYPE "public"."PriceType" AS ENUM ('monthly', 'daily');

-- CreateEnum
CREATE TYPE "public"."RoomType" AS ENUM ('single_room', 'shared_room', 'apartment', 'house', 'studio');

-- CreateEnum
CREATE TYPE "public"."GenderRequirement" AS ENUM ('male', 'female', 'any');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('text', 'image', 'location', 'contact');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" VARCHAR,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "password_hash" VARCHAR,
    "role" "public"."UserRole",
    "status" "public"."UserStatus" NOT NULL DEFAULT 'inactive',
    "avatar" VARCHAR,
    "email_verified_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "public"."PostType" NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "price_type" "public"."PriceType" NOT NULL DEFAULT 'monthly',
    "area" INTEGER,
    "address" VARCHAR(500),
    "location_id" INTEGER,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "room_type" "public"."RoomType",
    "gender_requirement" "public"."GenderRequirement" NOT NULL DEFAULT 'any',
    "max_occupants" INTEGER NOT NULL DEFAULT 1,
    "available_from" DATE,
    "contact_name" VARCHAR(255),
    "contact_phone" VARCHAR(15),
    "status" "public"."PostStatus" NOT NULL DEFAULT 'draft',
    "approved_by" UUID,
    "approved_at" TIMESTAMP(6),
    "rejection_reason" TEXT,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_views" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "viewer_ip" INET,
    "viewer_id" UUID,
    "viewed_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID,
    "participant_1" UUID NOT NULL,
    "participant_2" UUID NOT NULL,
    "last_message_id" UUID,
    "last_message_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "message_type" "public"."MessageType" NOT NULL DEFAULT 'text',
    "content" TEXT,
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "public"."users"("role", "status");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "public"."posts"("user_id");

-- CreateIndex
CREATE INDEX "posts_type_status_idx" ON "public"."posts"("type", "status");

-- CreateIndex
CREATE INDEX "posts_location_id_status_idx" ON "public"."posts"("location_id", "status");

-- CreateIndex
CREATE INDEX "posts_price_idx" ON "public"."posts"("price");

-- CreateIndex
CREATE INDEX "posts_latitude_longitude_idx" ON "public"."posts"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "idx_posts_created_desc" ON "public"."posts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "post_images_post_id_sort_order_idx" ON "public"."post_images"("post_id", "sort_order");

-- CreateIndex
CREATE INDEX "post_views_post_id_viewed_at_idx" ON "public"."post_views"("post_id", "viewed_at");

-- CreateIndex
CREATE INDEX "post_views_post_id_idx" ON "public"."post_views"("post_id");

-- CreateIndex
CREATE INDEX "conversations_participant_1_last_message_at_idx" ON "public"."conversations"("participant_1", "last_message_at");

-- CreateIndex
CREATE INDEX "conversations_participant_2_last_message_at_idx" ON "public"."conversations"("participant_2", "last_message_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_participant_1_participant_2_post_id_key" ON "public"."conversations"("participant_1", "participant_2", "post_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "public"."messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_sender_id_created_at_idx" ON "public"."messages"("sender_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_conversation_id_is_read_idx" ON "public"."messages"("conversation_id", "is_read");

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_images" ADD CONSTRAINT "post_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_views" ADD CONSTRAINT "post_views_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_views" ADD CONSTRAINT "post_views_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_participant_1_fkey" FOREIGN KEY ("participant_1") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_participant_2_fkey" FOREIGN KEY ("participant_2") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "public"."messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
