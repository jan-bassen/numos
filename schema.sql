-- =============================================
-- Schema extracted from db_cluster-01-09-2025@03-17-28.backup
-- Application tables (public schema)
-- =============================================

-- =============================================
-- ENUMS / CUSTOM TYPES
-- =============================================

CREATE TYPE public."access-method" AS ENUM (
    'insert',
    'select',
    'update',
    'delete'
);

CREATE TYPE public."account-tier" AS ENUM (
    'free',
    'artist',
    'team',
    'enterprise'
);

CREATE TYPE public.datatype AS ENUM (
    'exec',
    'enum',
    'number',
    'string',
    'boolean',
    'address',
    'color',
    'datetime',
    'location',
    'weather'
);

CREATE TYPE public.direction AS ENUM (
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
    'top-left',
    'center'
);

CREATE TYPE public.display AS ENUM (
    'public',
    'hidden',
    'private'
);

CREATE TYPE public."image-type" AS ENUM (
    'jpeg',
    'jpg',
    'png',
    'gif',
    'svg+xml',
    'webp',
    'avif'
);

CREATE TYPE public."interval-unit" AS ENUM (
    'minutes',
    'hours',
    'days'
);

CREATE TYPE public."membership-roles" AS ENUM (
    'admin',
    'editor',
    'viewer',
    'custom'
);

CREATE TYPE public."membership-roles_old" AS ENUM (
    'owner',
    'admin',
    'editor',
    'viewer',
    'custom'
);

CREATE TYPE public.required AS ENUM (
    'required',
    'default',
    'optional'
);

CREATE TYPE public."socketType" AS ENUM (
    'exec',
    'image',
    'string',
    'integer',
    'float',
    'boolean',
    'vector',
    'color',
    'date',
    'location'
);

CREATE TYPE public.trigger AS ENUM (
    'api',
    'interval',
    'token',
    'schedule'
);

CREATE TYPE public."trigger-type" AS ENUM (
    'api',
    'interval',
    'blockchain',
    'token',
    'schedule'
);

CREATE TYPE public."value-type" AS ENUM (
    'enum',
    'number',
    'string',
    'boolean',
    'address',
    'color',
    'datetime',
    'location',
    'weather',
    'image'
);

CREATE TYPE public."version-status" AS ENUM (
    'development',
    'review',
    'ready',
    'live'
);

-- =============================================
-- TABLES
-- =============================================

-- Accounts & Memberships
CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner uuid
);

CREATE TABLE public.account_memberships (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deactivated_at timestamp with time zone,
    account uuid NOT NULL,
    user_id uuid NOT NULL,
    role public."membership-roles_old" DEFAULT 'viewer' NOT NULL
);

-- User Profiles
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY,
    updated_at timestamp with time zone,
    username text,
    full_name text,
    avatar_url uuid,
    CONSTRAINT username_length CHECK ((char_length(username) >= 3))
);

-- Collections
CREATE TABLE public.collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    slug text NOT NULL,
    max_supply integer,
    name text,
    image text,
    editable_version uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    description text,
    external_link text,
    banner text,
    symbol text,
    account uuid,
    settings_locked boolean DEFAULT false NOT NULL
);

-- Versions
CREATE TABLE public.versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    major integer DEFAULT 0 NOT NULL,
    minor integer DEFAULT 0 NOT NULL,
    patch integer DEFAULT 1 NOT NULL,
    collection uuid NOT NULL,
    status public."version-status" DEFAULT 'development' NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    locked boolean DEFAULT false NOT NULL,
    name text,
    description text,
    external_link text,
    image uuid,
    banner uuid,
    featured uuid
);

-- Attributes
CREATE TABLE public.attributes (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    slug text NOT NULL,
    name text,
    token_specific boolean DEFAULT true NOT NULL,
    version uuid NOT NULL,
    description text,
    display public.display DEFAULT 'public' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    locked boolean DEFAULT false NOT NULL,
    value jsonb,
    CONSTRAINT attributes_description_check CHECK ((length(description) < 500))
);

-- Folders
CREATE TABLE public.folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    parent uuid,
    version uuid NOT NULL
);

-- Uploads (Images/Assets)
CREATE TABLE public.uploads (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    tags text[],
    bytes bigint NOT NULL,
    type public."image-type" NOT NULL,
    folder uuid,
    width integer NOT NULL,
    height integer NOT NULL,
    updated_at timestamp with time zone,
    version uuid NOT NULL
);

-- Layers (Image Composition)
CREATE TABLE public.layers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    version uuid NOT NULL,
    slug text NOT NULL,
    definition jsonb NOT NULL,
    name text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    description text,
    index integer NOT NULL
);

-- Image Nodes (Node-based editor)
CREATE TABLE public.image_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    type text NOT NULL,
    x double precision,
    y double precision,
    comment text,
    state jsonb,
    layer uuid NOT NULL
);

-- Image Connections
CREATE TABLE public.image_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    source uuid NOT NULL,
    target uuid NOT NULL,
    "sourceOutput" text NOT NULL,
    "targetInput" text NOT NULL,
    type public.datatype NOT NULL,
    layer uuid NOT NULL
);

-- Actions (Automation)
CREATE TABLE public.actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    slug text NOT NULL,
    name text,
    version uuid NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    trigger jsonb,
    locked boolean DEFAULT false NOT NULL,
    CONSTRAINT actions_description_check CHECK ((length(description) < 500))
);

-- Action Nodes
CREATE TABLE public.action_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    action uuid NOT NULL,
    type text NOT NULL,
    x double precision,
    y double precision,
    inputs jsonb,
    outputs jsonb,
    controls jsonb,
    comment text,
    state jsonb
);

-- Action Connections
CREATE TABLE public.action_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    source uuid NOT NULL,
    target uuid NOT NULL,
    "sourceOutput" text NOT NULL,
    "targetInput" text NOT NULL,
    action uuid,
    type public.datatype NOT NULL
);

-- Action Issues
CREATE TABLE public.action_issues (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    action uuid NOT NULL,
    data jsonb NOT NULL
);

-- =============================================
-- FOREIGN KEYS
-- =============================================

-- Accounts
ALTER TABLE public.accounts ADD CONSTRAINT fk_owner 
    FOREIGN KEY (owner) REFERENCES auth.users(id);

-- Account Memberships
ALTER TABLE public.account_memberships ADD CONSTRAINT account_memberships_account_fkey 
    FOREIGN KEY (account) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.account_memberships ADD CONSTRAINT account_memberships_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Profiles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Collections
ALTER TABLE public.collections ADD CONSTRAINT collections_account_fkey 
    FOREIGN KEY (account) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE public.collections ADD CONSTRAINT collections_editable_version_fkey 
    FOREIGN KEY (editable_version) REFERENCES public.versions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Versions
ALTER TABLE public.versions ADD CONSTRAINT versions_collection_fkey 
    FOREIGN KEY (collection) REFERENCES public.collections(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Attributes
ALTER TABLE public.attributes ADD CONSTRAINT attributes_version_fkey 
    FOREIGN KEY (version) REFERENCES public.versions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Folders
ALTER TABLE public.folders ADD CONSTRAINT folders_parent_fkey 
    FOREIGN KEY (parent) REFERENCES public.folders(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.folders ADD CONSTRAINT folders_version_fkey 
    FOREIGN KEY (version) REFERENCES public.versions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Uploads
ALTER TABLE public.uploads ADD CONSTRAINT layers_folder_fkey 
    FOREIGN KEY (folder) REFERENCES public.folders(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.uploads ADD CONSTRAINT layers_version_fkey 
    FOREIGN KEY (version) REFERENCES public.versions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Layers
ALTER TABLE public.layers ADD CONSTRAINT image_layers_version_fkey 
    FOREIGN KEY (version) REFERENCES public.versions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Image Nodes
ALTER TABLE public.image_nodes ADD CONSTRAINT image_nodes_layer_fkey 
    FOREIGN KEY (layer) REFERENCES public.layers(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Image Connections
ALTER TABLE public.image_connections ADD CONSTRAINT image_connections_layer_fkey 
    FOREIGN KEY (layer) REFERENCES public.layers(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.image_connections ADD CONSTRAINT public_image_connections_source_fkey 
    FOREIGN KEY (source) REFERENCES public.image_nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.image_connections ADD CONSTRAINT public_image_connections_target_fkey 
    FOREIGN KEY (target) REFERENCES public.image_nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Actions
ALTER TABLE public.actions ADD CONSTRAINT public_actions_version_id_fkey 
    FOREIGN KEY (version) REFERENCES public.versions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Action Nodes
ALTER TABLE public.action_nodes ADD CONSTRAINT public_action_nodes_action_fkey 
    FOREIGN KEY (action) REFERENCES public.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Action Connections
ALTER TABLE public.action_connections ADD CONSTRAINT public_action_connections_action_fkey 
    FOREIGN KEY (action) REFERENCES public.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.action_connections ADD CONSTRAINT public_action_connections_source_fkey 
    FOREIGN KEY (source) REFERENCES public.action_nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.action_connections ADD CONSTRAINT public_action_connections_target_fkey 
    FOREIGN KEY (target) REFERENCES public.action_nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Action Issues
ALTER TABLE public.action_issues ADD CONSTRAINT action_issues_action_fkey 
    FOREIGN KEY (action) REFERENCES public.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;
