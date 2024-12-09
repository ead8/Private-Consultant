'use client'

import  { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Loader2, 
  FileDown, 
  Link2, 
  Sparkles, 
  Globe, 
  Bot, 
  Lightbulb, 
  PieChart, 
  Zap 
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from "@/lib/utils"
import ToolbarMenu from '@/components/toolbar-menu'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const EnhancedConsultantReportGenerator = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [instructions, setInstructions] = useState('')
  const [reportType, setReportType] = useState('detailed')
  const [enableAdvancedAnalysis, setEnableAdvancedAnalysis] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: `
      <h1>AI Report Generator</h1>
      <p>Enter a URL and watch magic happen! 🚀</p>
      <blockquote>Insights await your exploration...</blockquote>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert focus:outline-none max-w-none',
      },
    },
  })

  const simulateProgress = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) {
        clearInterval(interval);
        setGenerationProgress(100);
      } else {
        setGenerationProgress(progress);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setGenerationProgress(0)
    
    const progressCleanup = simulateProgress();

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url, 
          instructions, 
          reportType,
          advancedAnalysis: enableAdvancedAnalysis 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      const data = await response.json()

      if (editor) {
        editor.commands.setContent(data.html)
      }

      progressCleanup();

      toast({
        title: "✨ Report Generated Successfully",
        description: "Dive into the insights!",
        icon: <Sparkles className="text-purple-500" />,
      })
    } catch (error) {
      progressCleanup();
      toast({
        title: "🚨 Generation Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setGenerationProgress(100)
    }
  }

  const handleExport = () => {
    if (editor) {
      const html = editor.getHTML()
      const blob = new Blob([html], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report_${new Date().toISOString().slice(0,10)}.html`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "📁 Report Exported",
        description: "Your report is now downloaded",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <Card className="w-full shadow-2xl border-2 border-purple-100">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-purple-600" />
                AI Insight Generator
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Bot className="text-blue-500" />
                Transform web content into actionable insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 ">
                <Label htmlFor="url" className="flex mt-2 items-center gap-2">
                  <Globe className="text-blue-500" /> Website URL
                </Label>
                <div className="relative">
                  <Link2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-8 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-type" className="flex items-center gap-2">
                  <PieChart className="text-purple-500" /> Report Type
                </Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detailed">Detailed Analysis</SelectItem>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="technical">Technical Breakdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="flex items-center gap-2">
                <Lightbulb className="text-yellow-500" /> Special Instructions
              </Label>
              <Input
                id="instructions"
                placeholder="Provide specific context or focus areas..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-analysis"
                checked={enableAdvancedAnalysis}
                onCheckedChange={setEnableAdvancedAnalysis}
              />
              <Label htmlFor="advanced-analysis" className="flex items-center gap-2">
                <Zap className="text-orange-500" /> Enable Advanced AI Analysis
              </Label>
            </div>

            {isLoading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${generationProgress}%`}}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Insights...
                </>
              ) : (
                'Generate Intelligent Report'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="border rounded-lg p-2 bg-white shadow-sm">
              <ToolbarMenu editor={editor} />
            </div>

            <div className={cn(
              "border rounded-lg bg-white shadow-md",
              isLoading && "opacity-50 pointer-events-none"
            )}>
              <EditorContent
                editor={editor}
                className="min-h-[400px] p-4"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading}
            className="hover:bg-blue-50 transition-colors"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EnhancedConsultantReportGenerator