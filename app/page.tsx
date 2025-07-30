"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Save, Upload } from "lucide-react"

export default function BusinessPlanPage() {
  // State for all plan fields
  const [vision, setVision] = useState("")
  const [mission, setMission] = useState("")
  const [goals, setGoals] = useState<string[]>([])
  const [measures, setMeasures] = useState<string[]>([])
  const [actions, setActions] = useState<string[]>([])
  const [team, setTeam] = useState<string[]>([])
  const [logoUrl, setLogoUrl] = useState("")

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load plan data from API on page load
  useEffect(() => {
    const loadPlanData = async () => {
      try {
        console.log('Loading plan data from /api/plan...')
        const response = await fetch('/api/plan', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Loaded plan data:', data)

          setVision(data.vision || "")
          setMission(data.mission || "")
          setGoals(data.goals || [])
          setMeasures(data.measures || [])
          setActions(data.actions || [])
          setTeam(data.team || [])
          setLogoUrl(data.logoUrl || "")
        } else {
          console.error('Failed to load plan data:', response.status, response.statusText)
          setSaveMessage("Failed to load plan data")
        }
      } catch (error) {
        console.error("Error loading plan data:", error)
        setSaveMessage("Error loading plan data")
      } finally {
        setIsLoading(false)
      }
    }

    loadPlanData()
  }, [])

  // Save data to API
  const handleSave = async () => {
    if (isSaving) return

    try {
      setIsSaving(true)
      setSaveMessage("Saving...")

      const planData = {
        vision,
        mission,
        goals,
        measures,
        actions,
        team,
        logoUrl,
      }

      console.log('Saving plan data:', planData)

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Plan data saved successfully', result)
        setSaveMessage("✅ Saved successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        console.error('Failed to save plan data:', response.status, response.statusText)
        setSaveMessage("❌ Failed to save")
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error saving plan data:", error)
      setSaveMessage("❌ Error saving")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper functions for array fields
  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, ""])
  }

  const updateArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number, 
    value: string
  ) => {
    setter(prev => prev.map((item, i) => i === index ? value : item))
  }

  const removeArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number
  ) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading business plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Plan</h1>
          <div className="flex justify-center gap-4 items-center">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Plan"}
            </Button>
            {saveMessage && (
              <span className="text-sm font-medium">{saveMessage}</span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Logo URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Logo URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter logo URL..."
                className="w-full"
              />
              {logoUrl && (
                <div className="mt-4 text-center">
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    className="h-16 mx-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Vision Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Enter your vision statement..."
                rows={3}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="Enter your mission statement..."
                rows={3}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Goals
                <Button 
                  onClick={() => addArrayItem(setGoals)} 
                  size="sm" 
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={goal}
                    onChange={(e) => updateArrayItem(setGoals, index, e.target.value)}
                    placeholder={`Goal ${index + 1}...`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeArrayItem(setGoals, index)}
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-gray-500 text-center py-4">No goals added yet. Click "Add Goal" to start.</p>
              )}
            </CardContent>
          </Card>

          {/* Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Measures
                <Button 
                  onClick={() => addArrayItem(setMeasures)} 
                  size="sm" 
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Measure
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {measures.map((measure, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={measure}
                    onChange={(e) => updateArrayItem(setMeasures, index, e.target.value)}
                    placeholder={`Measure ${index + 1}...`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeArrayItem(setMeasures, index)}
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {measures.length === 0 && (
                <p className="text-gray-500 text-center py-4">No measures added yet. Click "Add Measure" to start.</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Actions
                <Button 
                  onClick={() => addArrayItem(setActions)} 
                  size="sm" 
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Action
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {actions.map((action, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={action}
                    onChange={(e) => updateArrayItem(setActions, index, e.target.value)}
                    placeholder={`Action ${index + 1}...`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeArrayItem(setActions, index)}
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {actions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No actions added yet. Click "Add Action" to start.</p>
              )}
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Team Members
                <Button 
                  onClick={() => addArrayItem(setTeam)} 
                  size="sm" 
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {team.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={member}
                    onChange={(e) => updateArrayItem(setTeam, index, e.target.value)}
                    placeholder={`Team member ${index + 1}...`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeArrayItem(setTeam, index)}
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {team.length === 0 && (
                <p className="text-gray-500 text-center py-4">No team members added yet. Click "Add Member" to start.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Save Button */}
        <div className="text-center mt-8 pb-8">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="gap-2"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Business Plan"}
          </Button>
        </div>
      </div>
    </div>
  )
}