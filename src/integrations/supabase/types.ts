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
      aluno: {
        Row: {
          idaluno: number
          nomealuno: string
          notasfinais_idnotasfinais: number
        }
        Insert: {
          idaluno?: number
          nomealuno: string
          notasfinais_idnotasfinais: number
        }
        Update: {
          idaluno?: number
          nomealuno?: string
          notasfinais_idnotasfinais?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_aluno_notasfinais"
            columns: ["notasfinais_idnotasfinais"]
            isOneToOne: false
            referencedRelation: "notasfinais"
            referencedColumns: ["idnotasfinais"]
          },
        ]
      }
      aluno_has_momento: {
        Row: {
          aluno_idaluno: number
          momento_idmomento: number
        }
        Insert: {
          aluno_idaluno: number
          momento_idmomento: number
        }
        Update: {
          aluno_idaluno?: number
          momento_idmomento?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_aluno_has_momento_aluno"
            columns: ["aluno_idaluno"]
            isOneToOne: false
            referencedRelation: "aluno"
            referencedColumns: ["idaluno"]
          },
          {
            foreignKeyName: "fk_aluno_has_momento_momento"
            columns: ["momento_idmomento"]
            isOneToOne: false
            referencedRelation: "momento"
            referencedColumns: ["idmomento"]
          },
        ]
      }
      grupo: {
        Row: {
          idgrupo: number
          nomegrupo: string
          repositorio_idrepobd: number
        }
        Insert: {
          idgrupo?: number
          nomegrupo: string
          repositorio_idrepobd: number
        }
        Update: {
          idgrupo?: number
          nomegrupo?: string
          repositorio_idrepobd?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_grupo_repositorio"
            columns: ["repositorio_idrepobd"]
            isOneToOne: false
            referencedRelation: "repositorio"
            referencedColumns: ["idrepobd"]
          },
        ]
      }
      grupo_has_aluno: {
        Row: {
          aluno_idaluno: number
          grupo_idgrupo: number
        }
        Insert: {
          aluno_idaluno: number
          grupo_idgrupo: number
        }
        Update: {
          aluno_idaluno?: number
          grupo_idgrupo?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_grupo_has_aluno_aluno"
            columns: ["aluno_idaluno"]
            isOneToOne: false
            referencedRelation: "aluno"
            referencedColumns: ["idaluno"]
          },
          {
            foreignKeyName: "fk_grupo_has_aluno_grupo"
            columns: ["grupo_idgrupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["idgrupo"]
          },
        ]
      }
      metrica: {
        Row: {
          aluno_idaluno: number
          datametrica: string
          idmetrica: number
          tipometrica: string
          valormetrica: number
        }
        Insert: {
          aluno_idaluno: number
          datametrica: string
          idmetrica?: number
          tipometrica: string
          valormetrica: number
        }
        Update: {
          aluno_idaluno?: number
          datametrica?: string
          idmetrica?: number
          tipometrica?: string
          valormetrica?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_metrica_aluno"
            columns: ["aluno_idaluno"]
            isOneToOne: false
            referencedRelation: "aluno"
            referencedColumns: ["idaluno"]
          },
        ]
      }
      momento: {
        Row: {
          datamomento: string
          idmomento: number
        }
        Insert: {
          datamomento: string
          idmomento?: number
        }
        Update: {
          datamomento?: string
          idmomento?: number
        }
        Relationships: []
      }
      notasfinais: {
        Row: {
          idnotasfinais: number
          notafinal: string
        }
        Insert: {
          idnotasfinais?: number
          notafinal: string
        }
        Update: {
          idnotasfinais?: number
          notafinal?: string
        }
        Relationships: []
      }
      previsoes: {
        Row: {
          aluno_idaluno: number
          dataprevisao: string
          idprevisoes: number
          previsaonota: number
        }
        Insert: {
          aluno_idaluno: number
          dataprevisao: string
          idprevisoes?: number
          previsaonota: number
        }
        Update: {
          aluno_idaluno?: number
          dataprevisao?: string
          idprevisoes?: number
          previsaonota?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_previsoes_aluno"
            columns: ["aluno_idaluno"]
            isOneToOne: false
            referencedRelation: "aluno"
            referencedColumns: ["idaluno"]
          },
        ]
      }
      professor: {
        Row: {
          apelido: string
          email: string
          idutilizador: number
          nome: string
          senha: string
        }
        Insert: {
          apelido: string
          email: string
          idutilizador?: number
          nome: string
          senha: string
        }
        Update: {
          apelido?: string
          email?: string
          idutilizador?: number
          nome?: string
          senha?: string
        }
        Relationships: []
      }
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
      repositorio: {
        Row: {
          api_key: number
          idrepobd: number
          urlrepositorio: string
        }
        Insert: {
          api_key: number
          idrepobd?: number
          urlrepositorio: string
        }
        Update: {
          api_key?: number
          idrepobd?: number
          urlrepositorio?: string
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
