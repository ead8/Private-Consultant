import { NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'
import { OpenAI } from 'openai'

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Processes a POST request to generate an HTML report based on scraped content and user instructions.
 * @param {Request} request - The incoming HTTP request object containing JSON payload with url, instructions, reportType, and advancedAnalysis.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated HTML report or an error message.
 * @throws {Error} If no markdown content is found in the scrape result.
 */
export async function POST(request: Request) {
    try {
      const { 
        url, 
        instructions, 
        reportType = 'detailed',
        advancedAnalysis = false 
      } = await request.json();
  
      const scrapeResult:any = await firecrawl.scrapeUrl(url, { 
        formats: ['markdown']
      });
  
      const markdownContent = scrapeResult.markdown;
  
      if (!markdownContent) {
        throw new Error('No markdown content found in scrape result');
      }

      // Customize system prompt based on report type and advanced analysis
      const systemPrompt = advancedAnalysis 
        ? "Perform an in-depth, multi-dimensional analysis of the content. Extract nuanced insights, potential implications, and provide a comprehensive breakdown."
        : reportType === 'executive' 
          ? "Generate a concise, high-level summary focusing on key strategic insights and main takeaways."
          : reportType === 'technical'
            ? "Create a detailed, technically-oriented report with precise analysis, data points, and technical observations."
            : "Generate a comprehensive report covering the most important aspects of the content.";
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `
              Scraped Content: ${markdownContent}
              User Instructions: ${instructions}
              Report Details:
              - Report Type: ${reportType}
              - Advanced Analysis: ${advancedAnalysis}
              
              Generate a comprehensive HTML report that meets the specified requirements.
            `
          }
        ],
        max_tokens: 1500
      });
  
      return NextResponse.json({ 
        html: completion.choices[0].message.content 
      });
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate report' },
        { status: 500 }
      );
    }
  }