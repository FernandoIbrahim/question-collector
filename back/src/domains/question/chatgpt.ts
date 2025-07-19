import { CompleteQuestion, CompleteQuestionBody, questionPayload } from "src/lib/types";
require('dotenv').config();

const API_KEY = process.env.API_KEY;

async function getFormattedQuestion(prompt: questionPayload): Promise<CompleteQuestionBody | null> {
  // Validação básica
  if (!API_KEY) {
    console.error("API_KEY não encontrada no arquivo .env");
    return null;
  }

  if (!API_KEY.startsWith('sk-')) {
    console.error("API_KEY parece não ser válida (deve começar com 'sk-')");
    return null;
  }

  if (!prompt || typeof prompt !== 'object') {
    console.error("Prompt deve ser um objeto questionPayload válido");
    return null;
  }

  // Log para debug
  console.log("Prompt recebido:", JSON.stringify(prompt, null, 2));

  const url = "https://api.openai.com/v1/chat/completions";
  const requestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: `## Objetivo
Você é um assistente especializado em processar questões de múltipla escolha do ENEM. Sua tarefa é receber um objeto de questão no formato JSON e:

1. Modificar o campo 'subject_id' com base em uma lista predefinida de categorias
2. Remover quebras de linhas desnecessárias nos campos 'alternatives_introduction' e 'context' para melhor legibilidade
3. **CALCULAR os parâmetros de TRI (Teoria de Resposta ao Item) como um corretor oficial do ENEM**


## Parâmetros de TRI - Teoria de Resposta ao Item (Modelo ENEM)

### DISCRIMINATION (Parâmetro 'a' - Discriminação)
**Faixa:** 0.4 a 3.0
- **0.4 - 0.8:** Discriminação BAIXA - questão não diferencia bem entre candidatos de diferentes níveis
- **0.8 - 1.2:** Discriminação MODERADA - questão diferencia razoavelmente
- **1.2 - 2.0:** Discriminação ALTA - questão diferencia muito bem os candidatos
- **2.0 - 3.0:** Discriminação MUITO ALTA - questão diferencia perfeitamente

**Critérios de análise:**
- Questões com múltiplas etapas de raciocínio = maior discriminação
- Questões que exigem conhecimento específico e aplicação = alta discriminação
- Questões muito diretas ou muito vagas = baixa discriminação
- Questões com pegadinhas óbvias = baixa discriminação

### DIFFICULTY (Parâmetro 'b' - Dificuldade)
**Faixa:** -3.0 a +3.0 (escala padronizada)
- **-3.0 a -1.0:** MUITO FÁCIL - 85-95% dos candidatos acertam
- **-1.0 a -0.5:** FÁCIL - 70-85% dos candidatos acertam
- **-0.5 a +0.5:** MÉDIO - 40-70% dos candidatos acertam
- **+0.5 a +1.0:** DIFÍCIL - 20-40% dos candidatos acertam
- **+1.0 a +3.0:** MUITO DIFÍCIL - 5-20% dos candidatos acertam

**Critérios de análise:**
- Complexidade do conteúdo exigido
- Número de conceitos que precisam ser integrados
- Nível de abstração necessário
- Familiaridade do tema para estudantes de ensino médio

### GUESSING (Parâmetro 'c' - Acerto Casual)
**Faixa:** 0.0 a 0.25
- **0.0 - 0.10:** Questão muito bem elaborada, difícil de acertar "no chute"
- **0.10 - 0.15:** Questão bem elaborada, baixa chance de acerto casual
- **0.10 - 0.25:** Questão razoável, chance moderada de acerto casual
- **0.20 - 0.25:** Questão com distratores fracos, chance alta de acerto casual

**Critérios de análise:**
- Qualidade dos distratores (alternativas incorretas)
- Presença de alternativas absurdas ou obviamente incorretas
- Possibilidade de eliminação por conhecimento básico
- Presença de "pegadinhas" que podem induzir ao erro

## Instruções Específicas

1. **Analise cuidadosamente cada questão considerando:**
   - Nível de conhecimento exigido (ensino médio)
   - Complexidade do raciocínio necessário
   - Qualidade das alternativas
   - Contexto e aplicabilidade


2. **Retorne APENAS o JSON** do objeto com:
   - Textos formatados (quebras de linha corrigidas)
   - Selecicione com base nos valores a baixo a categoria que mais se assemelha a matéria da questão com o atributo subject id
   - discrimination calculado
   - difficulty calculado  
   - guessing calculado

   Exemplos de parâmetros (discriminação, dificuldade, acerto ao acaso):  
   1,7008	1,15068	0,14749
   2,82041	2,00971	0,12385
   1,88342	1,48748	0,27044
   2,9073	0,12756	0,21003
   1,92924	2,72331	0,17678
   2,54499	0,32436	0,18403
   1,57481	1,65344	0,22044
   3,21388	1,90806	0,17205
   2,39814	1,69946	0,19017
   2,40418	0,72028	0,21294
   1,85393	0,63073	0,178
   1,71246	-0,07547 0,17405
   2,91476	1,12362	0,11243
   3,01205	1,50249	0,18745
   1,99076	0,67442	0,18662
   2,29781	1,5026	0,13077
   1,0062	2,26887	0,12084
   3,99324	0,94637	0,16656
   0,29544	3,80025	0,02691
   3,17216	1,35723	0,2178
   0,50541	0,95758	0,04207

   ## Lista de Valores para 'subject_id'
   1- ECOLOGIA | 2- FISIOLOGIA HUMANA | 3- GENÉTICA E BIOTECNOLOGIA | 4- CITOLOGIA | 5- QUÍMICA ORGÂNICA | 6- ESTRUTURA ATÔMICA | 7- PROPRIEDADE DOS MATERIAIS | 8- ONDULATÓRIA | 9- ELETRICIDADE E MAGNETISMO | 10- MECÂNICA | 11- QUÍMICA | 12- FÍSICA | 13- BIOLOGIA | 17- EVOLUÇÃO E ORIGEM DA VIDA | 18- BOTÂNICA E ZOOLOGIA | 19- MICROBIOLOGIA E IMUNOLOGIA | 20- ESTEQUIOMETRIA | 21- TERMOQUÍMICA | 22- ELETROQUÍMICA | 23- QUÍMICA AMBIENTAL | 24- ÓPTICA | 25- TERMODINÂMICA | 26- FÍSICA MODERNA

**IMPORTANTE:** Seus cálculos devem ser consistentes com o padrão ENEM. Questões muito específicas ou que exigem conhecimento avançado terão difficulty mais alto. Questões com distratores bem elaborados terão guessing mais baixo.` 
      },
      { role: "user", content: JSON.stringify(prompt) }
    ],
    temperature: 1.5, // Reduzido para maior consistência nos cálculos
    max_tokens: 3000 // Aumentado para acomodar as explicações detalhadas
  };

  // Log do corpo da requisição para debug
  console.log("Request body:", JSON.stringify(requestBody, null, 2));

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify(requestBody)
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro detalhado da OpenAI:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      // Log específico para erro 400
      if (response.status === 400) {
        console.error("Erro 400 - Possíveis causas:");
        console.error("- API Key inválida");
        console.error("- Formato da requisição incorreto");
        console.error("- Conteúdo da mensagem muito longo");
        console.error("- Parâmetros inválidos");
      }
      
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Verificação se a resposta tem a estrutura esperada
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Estrutura de resposta inesperada:", data);
      throw new Error("Resposta da API em formato inesperado");
    }

    let message = data.choices[0].message.content;
    
    // Remove blocos de código Markdown e espaços extras
    const cleanMessage = message;


    let formattedQuestion;
    try {
      formattedQuestion = JSON.parse(cleanMessage);
      console.log("Questão formatada:" + cleanMessage);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", {
        cleanMessage,
        error: parseError
      });
      throw new Error("Resposta não está em formato JSON válido");
    }

    if (!formattedQuestion || typeof formattedQuestion !== 'object') {
      throw new Error("Objeto retornado não é válido");
    }

    const completeQuestion: CompleteQuestionBody = {
      ...formattedQuestion,
      type: "free" // Forçando o tipo como esperado
    };

    return completeQuestion;

  } catch (error) {
    console.error("Erro ao acessar a API da OpenAI:", {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      error
    });
    return null;
  }
}

export { getFormattedQuestion };