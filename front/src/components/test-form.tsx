"use client"

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { questionFromSchema } from "@/lib/types";
import toast, { Toaster } from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"

import { useQuestionContext } from "@/context/question-context";
import { useCallback, useEffect, useMemo } from "react";
import { postQuestion } from "@/services/question.service";

type QuestionFormType = z.infer<typeof questionFromSchema>;

export default function QuestionForm() {

    const { question, setQuestion } = useQuestionContext();

    const form = useForm<QuestionFormType>({
        resolver: zodResolver(questionFromSchema),
        defaultValues: question,
    });

    const { fields: alternatives } = useFieldArray({
      control: form.control,
      name: "alternatives",
    });

    async function onSubmit(values: QuestionFormType) {

      try{

        setQuestion(values)
        console.log("✅ Form data:", values);
        await postQuestion(values);

        toast.success('Questão criada com sucesso!.');

      }catch(error){

        toast.error('Por um erro interno, não possivel criar a questão tente novamente!')

      }

    }

    const watchedValues = form.watch();


    const memoizedSetQuestion = useCallback((newQuestion: QuestionFormType) => {
        setQuestion(newQuestion);
    }, [setQuestion]);
      
      // Debounce para evitar muitas atualizações
    const debouncedWatchedValues = useMemo(() => {
      const timeoutId = setTimeout(() => {
        const result = questionFromSchema.safeParse(watchedValues);
        if (result.success) {
          memoizedSetQuestion(result.data);
        }
      }, 100);
    
      return () => clearTimeout(timeoutId);
    }, [watchedValues, memoizedSetQuestion]);
    
    useEffect(() => {
      return debouncedWatchedValues;
    }, [debouncedWatchedValues]);

  const onError = (errors : unknown) => {
    console.error("❌ Erros no formulário:", errors);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Ano</FormLabel>
                  <FormControl>
                    <Input type="number" value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="knowledgeArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Área de Conhecimento</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NATURE">Natureza</SelectItem>
                        <SelectItem value="MATHEMATICS">Matemática</SelectItem>
                        <SelectItem value="HUMANITIES">Humanas</SelectItem>
                        <SelectItem value="LANGUAGES">Linguagens</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Título da Questão</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    value={field.value ?? ""} 
                    className="min-h-[100px] bg-gray-50"
                    placeholder="Digite o título da questão..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="context"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Contexto</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    value={field.value ?? ""} 
                    className="min-h-[150px] bg-gray-50"
                    placeholder="Forneça o contexto da questão..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="alternativesIntroduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Introdução das Alternativas</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    value={field.value ?? ""} 
                    className="min-h-[100px] bg-gray-50"
                    placeholder="Texto introdutório para as alternativas..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Resposta Correta</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-gray-50 w-[180px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Alternativa A</SelectItem>
                      <SelectItem value="b">Alternativa B</SelectItem>
                      <SelectItem value="c">Alternativa C</SelectItem>
                      <SelectItem value="d">Alternativa D</SelectItem>
                      <SelectItem value="e">Alternativa E</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Alternativas</h3>
            <div className="space-y-4">
              {alternatives.map((alternative, index) => (
                <Card key={alternative.id} className="border-gray-200 shadow-2xl">
                  <CardContent className="p-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`alternatives.${index}.letter`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Letra {alternatives[index].letter}</FormLabel>
                          <FormControl>
                            <Input 
                              maxLength={1} 
                              {...field} 
                              className="bg-gray-50"
                              placeholder="Ex: A"
                              disabled={true}   
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`alternatives.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Texto</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              value={field.value ?? ""} 
                              className="bg-gray-50"
                              placeholder="Texto da alternativa"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`alternatives.${index}.imageUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">URL da Imagem (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              value={field.value ?? ""} 
                              className="bg-gray-50"
                              placeholder="https://example.com/image.jpg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`alternatives.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium"> Correta? (opcional)</FormLabel>
                          <FormControl>
                            <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-lg font-medium"
          >
            Enviar Questão
          </Button>
        </form>
      </Form>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  );
}