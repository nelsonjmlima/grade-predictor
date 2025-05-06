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
      activity_metrics: {
        Row: {
          active_days: number | null
          assigned_issues: number | null
          avg_branches_per_day: number | null
          avg_lines_added: number | null
          avg_lines_deleted: number | null
          comments_given: number | null
          comments_received: number | null
          commit_count: number | null
          created_issues: number | null
          created_merges: number | null
          group_id: string | null
          id: string
          late_commits: number | null
          merged_merges: number | null
          number_comments: number | null
          student_id: string | null
          total_branches: number | null
          updated_at: string | null
        }
        Insert: {
          active_days?: number | null
          assigned_issues?: number | null
          avg_branches_per_day?: number | null
          avg_lines_added?: number | null
          avg_lines_deleted?: number | null
          comments_given?: number | null
          comments_received?: number | null
          commit_count?: number | null
          created_issues?: number | null
          created_merges?: number | null
          group_id?: string | null
          id?: string
          late_commits?: number | null
          merged_merges?: number | null
          number_comments?: number | null
          student_id?: string | null
          total_branches?: number | null
          updated_at?: string | null
        }
        Update: {
          active_days?: number | null
          assigned_issues?: number | null
          avg_branches_per_day?: number | null
          avg_lines_added?: number | null
          avg_lines_deleted?: number | null
          comments_given?: number | null
          comments_received?: number | null
          commit_count?: number | null
          created_issues?: number | null
          created_merges?: number | null
          group_id?: string | null
          id?: string
          late_commits?: number | null
          merged_merges?: number | null
          number_comments?: number | null
          student_id?: string | null
          total_branches?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_metrics_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_metrics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      group_students: {
        Row: {
          added_at: string | null
          group_id: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          added_at?: string | null
          group_id?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          added_at?: string | null
          group_id?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_students_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
          repository_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          repository_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          repository_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          group_id: string | null
          id: string
          predicted_grade: number | null
          prediction_date: string | null
          student_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          predicted_grade?: number | null
          prediction_date?: string | null
          student_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          predicted_grade?: number | null
          prediction_date?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      repositories: {
        Row: {
          created_at: string | null
          id: string
          link: string
          name: string
          project_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link: string
          name: string
          project_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string
          name?: string
          project_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repositories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          email: string
          gitlab_member_id: number | null
          gitlab_username: string | null
          id: string
          name: string
          repository_id: string | null
        }
        Insert: {
          email: string
          gitlab_member_id?: number | null
          gitlab_username?: string | null
          id?: string
          name: string
          repository_id?: string | null
        }
        Update: {
          email?: string
          gitlab_member_id?: number | null
          gitlab_username?: string | null
          id?: string
          name?: string
          repository_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          institution: string | null
          last_name: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          institution?: string | null
          last_name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          institution?: string | null
          last_name?: string | null
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
