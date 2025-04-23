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
      repositories: {
        Row: {
          additions: number | null
          api_key: string | null
          author: string | null
          average_commits_per_week: number | null
          average_operations_per_commit: number | null
          branch_count: number | null
          commit_count: number | null
          created_at: string | null
          csv_file_url: string | null
          date: string | null
          deletions: number | null
          description: string | null
          email: string | null
          final_grade_prediction: string | null
          gitlab_user: string | null
          id: string
          language: string | null
          last_activity: string | null
          link: string | null
          merge_request_count: number | null
          name: string
          operations: number | null
          predicted_grade: string | null
          progress: number | null
          project_id: string | null
          students: Json | null
          technologies: string[] | null
          total_additions: number | null
          total_deletions: number | null
          total_operations: number | null
          user_id: string | null
          week_of_prediction: string | null
        }
        Insert: {
          additions?: number | null
          api_key?: string | null
          author?: string | null
          average_commits_per_week?: number | null
          average_operations_per_commit?: number | null
          branch_count?: number | null
          commit_count?: number | null
          created_at?: string | null
          csv_file_url?: string | null
          date?: string | null
          deletions?: number | null
          description?: string | null
          email?: string | null
          final_grade_prediction?: string | null
          gitlab_user?: string | null
          id?: string
          language?: string | null
          last_activity?: string | null
          link?: string | null
          merge_request_count?: number | null
          name: string
          operations?: number | null
          predicted_grade?: string | null
          progress?: number | null
          project_id?: string | null
          students?: Json | null
          technologies?: string[] | null
          total_additions?: number | null
          total_deletions?: number | null
          total_operations?: number | null
          user_id?: string | null
          week_of_prediction?: string | null
        }
        Update: {
          additions?: number | null
          api_key?: string | null
          author?: string | null
          average_commits_per_week?: number | null
          average_operations_per_commit?: number | null
          branch_count?: number | null
          commit_count?: number | null
          created_at?: string | null
          csv_file_url?: string | null
          date?: string | null
          deletions?: number | null
          description?: string | null
          email?: string | null
          final_grade_prediction?: string | null
          gitlab_user?: string | null
          id?: string
          language?: string | null
          last_activity?: string | null
          link?: string | null
          merge_request_count?: number | null
          name?: string
          operations?: number | null
          predicted_grade?: string | null
          progress?: number | null
          project_id?: string | null
          students?: Json | null
          technologies?: string[] | null
          total_additions?: number | null
          total_deletions?: number | null
          total_operations?: number | null
          user_id?: string | null
          week_of_prediction?: string | null
        }
        Relationships: []
      }
      Repositorio: {
        Row: {
          API_Key: string | null
          id: number
          URL_Repositorio: string | null
        }
        Insert: {
          API_Key?: string | null
          id?: number
          URL_Repositorio?: string | null
        }
        Update: {
          API_Key?: string | null
          id?: number
          URL_Repositorio?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
