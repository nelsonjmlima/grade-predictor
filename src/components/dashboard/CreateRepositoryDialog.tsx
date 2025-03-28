
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Users, GitBranch, Link, Key, User } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome do repositório deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  type: z.enum(["course", "project", "thesis"], { required_error: "Por favor selecione um tipo de repositório" }),
  students: z.string().optional(),
  link: z.string().url({ message: "Por favor insira uma URL válida" }).optional().or(z.literal("")),
  apiKey: z.string().optional(),
  userId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepositoryCreated?: () => void;
}

export function CreateRepositoryDialog({ 
  open, 
  onOpenChange, 
  onRepositoryCreated 
}: CreateRepositoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      students: "",
      link: "",
      apiKey: "",
      userId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      console.log("Criando repositório com valores:", values);
      
      setIsSubmitting(false);
      form.reset();
      onOpenChange(false);
      
      if (onRepositoryCreated) {
        onRepositoryCreated();
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Repositório</DialogTitle>
          <DialogDescription>
            Configure um novo repositório para acompanhar o progresso e desempenho dos alunos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Repositório</FormLabel>
                  <FormControl>
                    <Input placeholder="ex., Engenharia de Software 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve descrição do propósito deste repositório" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Repositório</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de repositório" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="course">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>Curso</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="project">
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-2" />
                          <span>Projeto</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="thesis">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Tese</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Repositório</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="https://github.com/usuario/repositorio" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave API</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Digite a chave API do repositório" type="password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Usuário</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Digite o ID do usuário" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="students"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereços de E-mail dos Alunos (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite os endereços de e-mail dos alunos, um por linha" 
                      className="resize-none h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Repositório"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
