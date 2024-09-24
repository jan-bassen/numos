export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_memberships: {
        Row: {
          account: string
          created_at: string
          deactivated_at: string | null
          id: string
          role: Database["public"]["Enums"]["membership-roles_old"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account: string
          created_at?: string
          deactivated_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["membership-roles_old"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account?: string
          created_at?: string
          deactivated_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["membership-roles_old"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_memberships_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string
          id: string
          owner: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          owner?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          owner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_owner"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      action_connections: {
        Row: {
          action: string | null
          id: string
          source: string
          sourceOutput: string
          target: string
          targetInput: string
          type: Database["public"]["Enums"]["datatype"]
        }
        Insert: {
          action?: string | null
          id?: string
          source: string
          sourceOutput: string
          target: string
          targetInput: string
          type: Database["public"]["Enums"]["datatype"]
        }
        Update: {
          action?: string | null
          id?: string
          source?: string
          sourceOutput?: string
          target?: string
          targetInput?: string
          type?: Database["public"]["Enums"]["datatype"]
        }
        Relationships: [
          {
            foreignKeyName: "public_action_connections_action_fkey"
            columns: ["action"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_action_connections_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "action_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_action_connections_target_fkey"
            columns: ["target"]
            isOneToOne: false
            referencedRelation: "action_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      action_nodes: {
        Row: {
          action: string
          comment: string | null
          controls: Json | null
          id: string
          inputs: Json | null
          outputs: Json | null
          type: string
          x: number | null
          y: number | null
        }
        Insert: {
          action: string
          comment?: string | null
          controls?: Json | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          type: string
          x?: number | null
          y?: number | null
        }
        Update: {
          action?: string
          comment?: string | null
          controls?: Json | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          type?: string
          x?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_action_nodes_action_fkey"
            columns: ["action"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
        ]
      }
      actions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          slug: string
          trigger: Json | null
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          slug: string
          trigger?: Json | null
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          slug?: string
          trigger?: Json | null
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_actions_version_id_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      attributes: {
        Row: {
          created_at: string
          description: string | null
          display: Database["public"]["Enums"]["display"]
          id: string
          list: boolean
          name: string | null
          settings: Json | null
          slug: string
          token_specific: boolean
          type: Database["public"]["Enums"]["datatype"]
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display?: Database["public"]["Enums"]["display"]
          id?: string
          list?: boolean
          name?: string | null
          settings?: Json | null
          slug: string
          token_specific?: boolean
          type: Database["public"]["Enums"]["datatype"]
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display?: Database["public"]["Enums"]["display"]
          id?: string
          list?: boolean
          name?: string | null
          settings?: Json | null
          slug?: string
          token_specific?: boolean
          type?: Database["public"]["Enums"]["datatype"]
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "attributes_version_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          account: string | null
          banner: string | null
          created_at: string | null
          description: string | null
          editable_version: string | null
          external_link: string | null
          id: string
          image: string | null
          max_supply: number | null
          name: string | null
          slug: string
          symbol: string | null
          updated_at: string | null
        }
        Insert: {
          account?: string | null
          banner?: string | null
          created_at?: string | null
          description?: string | null
          editable_version?: string | null
          external_link?: string | null
          id?: string
          image?: string | null
          max_supply?: number | null
          name?: string | null
          slug: string
          symbol?: string | null
          updated_at?: string | null
        }
        Update: {
          account?: string | null
          banner?: string | null
          created_at?: string | null
          description?: string | null
          editable_version?: string | null
          external_link?: string | null
          id?: string
          image?: string | null
          max_supply?: number | null
          name?: string | null
          slug?: string
          symbol?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_editable_version_fkey"
            columns: ["editable_version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      empty_folders: {
        Row: {
          collection: string
          id: string
          label: string
          path: string | null
        }
        Insert: {
          collection: string
          id?: string
          label: string
          path?: string | null
        }
        Update: {
          collection?: string
          id?: string
          label?: string
          path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_empty_folders_collection_fkey"
            columns: ["collection"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          collection: string
          created_at: string
          id: string
          name: string | null
          parent: string | null
        }
        Insert: {
          collection: string
          created_at?: string
          id?: string
          name?: string | null
          parent?: string | null
        }
        Update: {
          collection?: string
          created_at?: string
          id?: string
          name?: string | null
          parent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_collection_fkey"
            columns: ["collection"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      image_connections: {
        Row: {
          id: string
          source: string
          sourceOutput: string
          target: string
          targetInput: string
          type: Database["public"]["Enums"]["datatype"]
          version: string | null
        }
        Insert: {
          id?: string
          source: string
          sourceOutput: string
          target: string
          targetInput: string
          type: Database["public"]["Enums"]["datatype"]
          version?: string | null
        }
        Update: {
          id?: string
          source?: string
          sourceOutput?: string
          target?: string
          targetInput?: string
          type?: Database["public"]["Enums"]["datatype"]
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_image_connections_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "image_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_image_connections_target_fkey"
            columns: ["target"]
            isOneToOne: false
            referencedRelation: "image_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_image_connections_version_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      image_nodes: {
        Row: {
          comment: string | null
          controls: Json | null
          id: string
          inputs: Json | null
          outputs: Json | null
          type: string
          version: string
          x: number | null
          y: number | null
        }
        Insert: {
          comment?: string | null
          controls?: Json | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          type: string
          version: string
          x?: number | null
          y?: number | null
        }
        Update: {
          comment?: string | null
          controls?: Json | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          type?: string
          version?: string
          x?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_image_nodes_version_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      layers: {
        Row: {
          bytes: number
          collection: string
          created_at: string
          folder: string | null
          height: number
          id: string
          name: string | null
          tags: string[] | null
          type: Database["public"]["Enums"]["image-type"]
          updated_at: string | null
          width: number
        }
        Insert: {
          bytes: number
          collection: string
          created_at?: string
          folder?: string | null
          height: number
          id?: string
          name?: string | null
          tags?: string[] | null
          type: Database["public"]["Enums"]["image-type"]
          updated_at?: string | null
          width: number
        }
        Update: {
          bytes?: number
          collection?: string
          created_at?: string
          folder?: string | null
          height?: number
          id?: string
          name?: string | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["image-type"]
          updated_at?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "layers_collection_fkey"
            columns: ["collection"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layers_folder_fkey"
            columns: ["folder"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      versions: {
        Row: {
          collection: string
          created_at: string | null
          id: string
          major: number
          minor: number
          patch: number
          status: Database["public"]["Enums"]["version-status"]
          updated_at: string | null
        }
        Insert: {
          collection: string
          created_at?: string | null
          id?: string
          major?: number
          minor?: number
          patch?: number
          status?: Database["public"]["Enums"]["version-status"]
          updated_at?: string | null
        }
        Update: {
          collection?: string
          created_at?: string | null
          id?: string
          major?: number
          minor?: number
          patch?: number
          status?: Database["public"]["Enums"]["version-status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "versions_collection_fkey"
            columns: ["collection"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_layer_storage_object: {
        Args: {
          layer_id: string
          collection_id: string
        }
        Returns: undefined
      }
      has_collection_permission: {
        Args: {
          collection: string
          element: string
          method: string
        }
        Returns: boolean
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      "access-method": "insert" | "select" | "update" | "delete"
      "account-tier": "free" | "artist" | "team" | "enterprise"
      datatype:
        | "exec"
        | "enum"
        | "number"
        | "string"
        | "boolean"
        | "address"
        | "color"
        | "datetime"
        | "location"
        | "weather"
        | "image"
        | "direction"
        | "buffer"
        | "generic"
      direction:
        | "top"
        | "top-right"
        | "right"
        | "bottom-right"
        | "bottom"
        | "bottom-left"
        | "left"
        | "top-left"
        | "center"
      display: "public" | "hidden" | "private"
      "image-type": "jpeg" | "jpg" | "png" | "gif" | "svg+xml" | "webp" | "avif"
      "interval-unit": "minutes" | "hours" | "days"
      "membership-roles": "admin" | "editor" | "viewer" | "custom"
      "membership-roles_old": "owner" | "admin" | "editor" | "viewer" | "custom"
      required: "required" | "default" | "optional"
      socketType:
        | "exec"
        | "image"
        | "string"
        | "integer"
        | "float"
        | "boolean"
        | "vector"
        | "color"
        | "date"
        | "location"
        | "array"
        | "address"
      trigger: "api" | "interval" | "token" | "schedule"
      "trigger-type": "api" | "interval" | "blockchain" | "token" | "schedule"
      "version-status": "development" | "review" | "ready" | "live"
      "weather-code":
        | "200"
        | "201"
        | "202"
        | "210"
        | "211"
        | "212"
        | "221"
        | "230"
        | "231"
        | "232"
        | "300"
        | "301"
        | "302"
        | "310"
        | "311"
        | "312"
        | "313"
        | "314"
        | "321"
        | "500"
        | "501"
        | "502"
        | "503"
        | "504"
        | "511"
        | "520"
        | "521"
        | "522"
        | "531"
        | "600"
        | "601"
        | "602"
        | "611"
        | "612"
        | "613"
        | "615"
        | "616"
        | "620"
        | "621"
        | "622"
        | "701"
        | "711"
        | "721"
        | "731"
        | "741"
        | "751"
        | "761"
        | "762"
        | "771"
        | "781"
        | "800"
        | "801"
        | "802"
        | "803"
        | "804"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
