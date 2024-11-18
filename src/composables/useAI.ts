import { Configuration, OpenAIApi } from 'openai'

export const useAI = () => {
  const config = useRuntimeConfig()
  const openai = new OpenAIApi(new Configuration({
    apiKey: config.public.openaiApiKey
  }))

  const generateShoppingListSuggestion = async (currentList) => {
    try {
      const prompt = `Based on this shopping list: ${JSON.stringify(currentList)}, 
                     suggest additional items that might be needed. Consider:
                     1. Common complementary items
                     2. Frequently bought together items
                     3. Seasonal items
                     4. Basic essentials that might be missing
                     Return only a list of items, one per line.`

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful shopping assistant that suggests relevant items based on current shopping lists."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })

      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error generating suggestions:', error)
      throw new Error('Failed to generate suggestions')
    }
  }

  return {
    generateShoppingListSuggestion
  }
}