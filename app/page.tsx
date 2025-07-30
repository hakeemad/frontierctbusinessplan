
"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  Target,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  ImageIcon,
  Presentation,
  ArrowLeft,
  UserPlus,
  GripVertical,
  MoreHorizontal,
} from "lucide-react"
import { MultiSelect } from "@/components/multi-select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Milestone {
  id: string
  text: string
  completed: boolean
  completedDate?: string
  notes?: string
  progressNotes?: { id: string; text: string; timestamp: string }[]
  deadline?: string
  assignees?: string[]
}

interface GoalArea {
  id: string
  title: string
  color: string
  assignees?: string[]
  strategies: string[]
  measures: Milestone[]
  rocks: Milestone[]
}

interface SavedData {
  id: string
  name: string
  vision: string
  mission: string
  logo: string | null
  goalAreas: GoalArea[]
  teamMembers: string[]
  timestamp: string
}

type ListKey = keyof Pick<GoalArea, "strategies" | "measures" | "rocks">

export default function BusinessPlanTemplate() {
  /* -------------------------------------------------- state */
  const [vision, setVision] = useState("")
  const [mission, setMission] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [isEditingVision, setIsEditingVision] = useState(false)
  const [isEditingMission, setIsEditingMission] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [goalAreas, setGoalAreas] = useState<GoalArea[]>([])
  const [savedVersions, setSavedVersions] = useState<SavedData[]>([])
  const [saveName, setSaveName] = useState("")
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [rockError, setRockError] = useState("")

  // Team management
  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [newTeamMember, setNewTeamMember] = useState("")
  const [showTeamInput, setShowTeamInput] = useState(false)

  // Drag and drop state
  const [draggedArea, setDraggedArea] = useState<string | null>(null)

  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ]

  // Load plan data from API on page load
  const loadPlanData = useCallback(async () => {
    try {
      setIsLoading(true)
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
        setLogo(data.logoUrl || data.logo || null) // Support both logoUrl and logo
        setGoalAreas(data.goalAreas || [])
        setTeamMembers(data.team || data.teamMembers || []) // Support both team and teamMembers
        setSavedVersions(data.savedVersions || [])
      } else {
        console.error('Failed to load plan data:', response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error loading plan data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save data to API with debouncing to prevent excessive saves
  const saveToAPI = useCallback(async () => {
    if (isSaving) return // Prevent concurrent saves
    
    try {
      setIsSaving(true)
      console.log('Saving plan data to /api/plan...')
      
      const planData = {
        vision,
        mission,
        logoUrl: logo, // Use logoUrl as the field name
        team: teamMembers, // Use team as the field name
        goalAreas,
        savedVersions,
      }
      
      console.log('Sending plan data:', planData)
      
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
      } else {
        console.error('Failed to save plan data:', response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error saving plan data:", error)
    } finally {
      setIsSaving(false)
    }
  }, [vision, mission, logo, goalAreas, teamMembers, savedVersions, isSaving])

  // Manual save function for explicit saves
  const handleSave = useCallback(async () => {
    await saveToAPI()
  }, [saveToAPI])

  // Load data on component mount
  useEffect(() => {
    loadPlanData()
  }, [loadPlanData])

  // Auto-save whenever data changes (but not during initial load)
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveToAPI()
      }, 2000) // Debounce saves by 2 seconds to reduce excessive API calls
      
      return () => clearTimeout(timeoutId)
    }
  }, [vision, mission, logo, goalAreas, teamMembers, savedVersions, isLoading, saveToAPI])

  /* -------------------------------------------------- team helpers */
  const addTeamMember = () => {
    if (!newTeamMember.trim()) return
    const updatedTeam = [...teamMembers, newTeamMember.trim()]
    setTeamMembers(updatedTeam)
    setNewTeamMember("")
    setShowTeamInput(false)
  }

  const removeTeamMember = (index: number) => {
    const updatedTeam = teamMembers.filter((_, i) => i !== index)
    setTeamMembers(updatedTeam)
  }

  /* -------------------------------------------------- helpers */
  const addGoalArea = () => {
    const newArea: GoalArea = {
      id: `area-${Date.now()}`,
      title: "New Goal Area",
      color: colors[goalAreas.length % colors.length],
      assignees: [],
      strategies: [],
      measures: [],
      rocks: [],
    }
    setGoalAreas([...goalAreas, newArea])
  }

  const updateAreaTitle = (areaId: string, title: string) =>
    setGoalAreas((prev) => prev.map((a) => (a.id === areaId ? { ...a, title } : a)))

  const updateAreaAssignees = (areaId: string, assignees: string[]) =>
    setGoalAreas((prev) => prev.map((a) => (a.id === areaId ? { ...a, assignees } : a)))

  const deleteGoalArea = (areaId: string) => setGoalAreas((prev) => prev.filter((a) => a.id !== areaId))

  const addItem = (areaId: string, type: ListKey, value: string, deadline?: string, assignees?: string[]) => {
    if (!value.trim()) return

    // Add validation for rocks - require both deadline and at least one assignee
    if (type === "rocks" && (!deadline || !assignees?.length)) return

    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area

        if (type === "strategies") {
          return { ...area, strategies: [...area.strategies, value.trim()] }
        }

        const newMilestone: Milestone = {
          id: `${type}-${Date.now()}`,
          text: value.trim(),
          completed: false,
          ...(type === "rocks" && deadline ? { deadline } : {}),
          ...(assignees?.length ? { assignees } : {}),
        }
        return { ...area, [type]: [...area[type], newMilestone] }
      }),
    )
  }

  const removeItem = (areaId: string, type: ListKey, index: number) =>
    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const copy = [...area[type]]
        copy.splice(index, 1)
        return { ...area, [type]: copy }
      }),
    )

  const toggleMilestone = (areaId: string, milestoneId: string, type: "measures" | "rocks") =>
    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const updated = area[type].map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                completed: !m.completed,
                completedDate: !m.completed ? new Date().toLocaleDateString() : undefined,
              }
            : m,
        )
        return { ...area, [type]: updated }
      }),
    )

  const updateNotes = (areaId: string, milestoneId: string, type: "measures" | "rocks", notes: string) =>
    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const updated = area[type].map((m) => (m.id === milestoneId ? { ...m, notes } : m))
        return { ...area, [type]: updated }
      }),
    )

  const updateMilestoneAssignees = (
    areaId: string,
    milestoneId: string,
    type: "measures" | "rocks",
    assignees: string[],
  ) =>
    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const updated = area[type].map((m) => (m.id === milestoneId ? { ...m, assignees } : m))
        return { ...area, [type]: updated }
      }),
    )

  const areaProgress = (area: GoalArea) => {
    const totalMeasures = area.measures.length
    const completedMeasures = area.measures.filter((m) => m.completed).length
    const totalRocks = area.rocks.length
    const completedRocks = area.rocks.filter((r) => r.completed).length

    if (totalMeasures === 0 && totalRocks === 0) return 0

    const measuresProgress = totalMeasures > 0 ? (completedMeasures / totalMeasures) * 20 : 0
    const rocksProgress = totalRocks > 0 ? (completedRocks / totalRocks) * 80 : 0

    return measuresProgress + rocksProgress
  }

  const overallProgress = () => {
    if (goalAreas.length === 0) return 0

    const totalProgress = goalAreas.reduce((sum, area) => {
      const totalMeasures = area.measures.length
      const completedMeasures = area.measures.filter((m) => m.completed).length
      const totalRocks = area.rocks.length
      const completedRocks = area.rocks.filter((r) => r.completed).length

      if (totalMeasures === 0 && totalRocks === 0) return sum

      const measuresProgress = totalMeasures > 0 ? (completedMeasures / totalMeasures) * 20 : 0
      const rocksProgress = totalRocks > 0 ? (completedRocks / totalRocks) * 80 : 0

      return sum + (measuresProgress + rocksProgress)
    }, 0)

    return totalProgress / goalAreas.length
  }

  const saveData = () => {
    if (!saveName.trim()) return

    const newSave: SavedData = {
      id: `save-${Date.now()}`,
      name: saveName.trim(),
      vision,
      mission,
      logo,
      goalAreas,
      teamMembers,
      timestamp: new Date().toISOString(),
    }

    const updatedVersions = [...savedVersions, newSave]
    setSavedVersions(updatedVersions)
    setSaveName("")
    setShowSaveInput(false)
  }

  const loadData = (saveData: SavedData) => {
    setVision(saveData.vision)
    setMission(saveData.mission)
    setLogo(saveData.logo)
    setGoalAreas(saveData.goalAreas)
    if (saveData.teamMembers) {
      setTeamMembers(saveData.teamMembers)
    }
  }

  const deleteSave = (saveId: string) => {
    const updatedVersions = savedVersions.filter((save) => save.id !== saveId)
    setSavedVersions(updatedVersions)
  }

  const addProgressNote = (areaId: string, milestoneId: string, type: "measures" | "rocks", noteText: string) => {
    if (!noteText.trim()) return

    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const updated = area[type].map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                progressNotes: [
                  ...(m.progressNotes || []),
                  {
                    id: `note-${Date.now()}`,
                    text: noteText.trim(),
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : m,
        )
        return { ...area, [type]: updated }
      }),
    )
  }

  const updateMilestoneText = (areaId: string, milestoneId: string, type: "measures" | "rocks", newText: string) =>
    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const updated = area[type].map((m) => (m.id === milestoneId ? { ...m, text: newText } : m))
        return { ...area, [type]: updated }
      }),
    )

  const updateStrategyText = (areaId: string, index: number, newText: string) => {
    setGoalAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area
        const updatedStrategies = [...area.strategies]
        updatedStrategies[index] = newText
        return { ...area, strategies: updatedStrategies }
      }),
    )
  }

  /* -------------------------------------------------- drag and drop */
  const handleDragStart = (e: React.DragEvent, areaId: string) => {
    setDraggedArea(areaId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetAreaId: string) => {
    e.preventDefault()

    if (!draggedArea || draggedArea === targetAreaId) {
      setDraggedArea(null)
      return
    }

    const draggedIndex = goalAreas.findIndex((area) => area.id === draggedArea)
    const targetIndex = goalAreas.findIndex((area) => area.id === targetAreaId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedArea(null)
      return
    }

    const newGoalAreas = [...goalAreas]
    const [draggedItem] = newGoalAreas.splice(draggedIndex, 1)
    newGoalAreas.splice(targetIndex, 0, draggedItem)

    setGoalAreas(newGoalAreas)
    setDraggedArea(null)
  }

  const handleDragEnd = () => {
    setDraggedArea(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading shared business plan...</p>
        </div>
      </div>
    )
  }

  /* -------------------------------------------------- presentation */
  if (presentationMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
            <Button variant="outline" onClick={() => setPresentationMode(false)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Edit
            </Button>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Business Plan – Progress</h1>
              <p className="text-lg sm:text-xl mt-2">
                Overall Progress&nbsp;
                <span className="font-bold text-blue-600">{Math.round(overallProgress())}%</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowSaveInput(true)} variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save Data
              </Button>
            </div>
          </div>

          {/* Save input */}
          {showSaveInput && (
            <div className="text-center mb-6">
              <div className="flex gap-2 justify-center max-w-md mx-auto">
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Enter save name..."
                  onKeyDown={(e) => e.key === "Enter" && saveData()}
                />
                <Button onClick={saveData} disabled={!saveName.trim()}>
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setShowSaveInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Saved versions dropdown */}
          {savedVersions.length > 0 && (
            <div className="flex justify-center mb-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <MoreHorizontal className="h-4 w-4" />
                    Load Saved ({savedVersions.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-72 sm:w-80 max-w-[90vw]">
                  {savedVersions.map((save) => (
                    <DropdownMenuItem key={save.id} className="flex justify-between items-center p-3">
                      <div className="flex-1">
                        <div className="font-medium">{save.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(save.timestamp).toLocaleDateString()} at{" "}
                          {new Date(save.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button onClick={() => loadData(save)} size="sm" variant="outline">
                          Load
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSave(save.id)
                          }}
                          className="text-red-500 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* area grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {goalAreas.map((area) => (
              <PresentationCard
                key={area.id}
                area={area}
                progress={areaProgress(area)}
                toggle={toggleMilestone}
                addProgressNote={addProgressNote}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* -------------------------------------------------- edit mode */
  const handleVisionChange = (newVision: string) => {
    setVision(newVision)
  }

  const handleMissionChange = (newMission: string) => {
    setMission(newMission)
  }

  const handleLogoChange = (newLogo: string) => {
    setLogo(newLogo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-0">
        {/* header */}
        <div className="text-center mb-8">
          {/* logo */}
          <div className="mb-6">
            {logo ? (
              <div className="flex items-center justify-center gap-4">
                <img src={logo} alt="Logo" className="h-16 object-contain" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Change Logo
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 border-dashed border-2 p-8"
              >
                <ImageIcon className="h-8 w-8" />
                <span className="font-medium">Upload Company Logo</span>
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const reader = new FileReader()
                reader.onload = (ev) => handleLogoChange(ev.target?.result as string)
                reader.readAsDataURL(f)
              }}
              className="hidden"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Shared Business Plan</h1>
          <p className="text-sm text-gray-600 mb-4">
            {isSaving ? "💾 Saving changes..." : "✅ All changes auto-saved"}
          </p>

          {/* vision / mission */}
          <InlineEdit
            label="Vision"
            value={vision}
            onChange={handleVisionChange}
            editing={isEditingVision}
            setEditing={setIsEditingVision}
          />
          <InlineEdit
            label="Mission"
            value={mission}
            onChange={handleMissionChange}
            editing={isEditingMission}
            setEditing={setIsEditingMission}
            italic
          />

          {/* overall progress */}
          {goalAreas.length > 0 && (
            <div className="mt-6 max-w-md mx-auto px-4 sm:px-0">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress())}%</span>
              </div>
              <Progress value={overallProgress()} className="h-3" />
            </div>
          )}
        </div>

        {/* Team Management */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
            <Button onClick={() => setShowTeamInput(true)} variant="outline" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>

          {/* Team input */}
          {showTeamInput && (
            <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto mb-4 px-4 sm:px-0">
              <Input
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                placeholder="Enter team member name..."
                onKeyDown={(e) => e.key === "Enter" && addTeamMember()}
              />
              <Button onClick={addTeamMember} disabled={!newTeamMember.trim()}>
                Add
              </Button>
              <Button variant="ghost" onClick={() => setShowTeamInput(false)}>
                Cancel
              </Button>
            </div>
          )}

          {/* Team members display */}
          {teamMembers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {teamMembers.map((member, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    👤 {member}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                      className="h-4 w-4 p-0 ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* add area / presentation btns */}
        <div className="text-center mb-6 flex flex-wrap gap-2 sm:gap-3 justify-center px-4 sm:px-0">
          <Button onClick={addGoalArea} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Goal Area
          </Button>
          {goalAreas.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setPresentationMode(true)}
              className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
            >
              <Presentation className="h-4 w-4" />
              Presentation Mode
            </Button>
          )}
          <Button onClick={() => setShowSaveInput(true)} variant="outline" className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            Save Data
          </Button>
        </div>

        {/* Save input */}
        {showSaveInput && (
          <div className="text-center mb-6">
            <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto px-4 sm:px-0">
              <Input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter save name..."
                onKeyDown={(e) => e.key === "Enter" && saveData()}
              />
              <Button onClick={saveData} disabled={!saveName.trim()}>
                Save
              </Button>
              <Button variant="ghost" onClick={() => setShowSaveInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Saved versions dropdown */}
        {savedVersions.length > 0 && (
          <div className="text-center mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <MoreHorizontal className="h-4 w-4" />
                  Load Saved ({savedVersions.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-72 sm:w-80 max-w-[90vw]">
                {savedVersions.map((save) => (
                  <DropdownMenuItem key={save.id} className="flex justify-between items-center p-3">
                    <div className="flex-1">
                      <div className="font-medium">{save.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(save.timestamp).toLocaleDateString()} at{" "}
                        {new Date(save.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button onClick={() => loadData(save)} size="sm" variant="outline">
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSave(save.id)
                        }}
                        className="text-red-500 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* area grid */}
        {goalAreas.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {goalAreas.map((a) => (
              <GoalAreaCard
                key={a.id}
                area={a}
                updateTitle={updateAreaTitle}
                updateAssignees={updateAreaAssignees}
                deleteArea={deleteGoalArea}
                addItem={addItem}
                removeItem={removeItem}
                toggle={toggleMilestone}
                updateNotes={updateNotes}
                updateMilestoneAssignees={updateMilestoneAssignees}
                updateMilestoneText={updateMilestoneText}
                progress={areaProgress(a)}
                rockError={rockError}
                setRockError={setRockError}
                teamMembers={teamMembers}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={draggedArea === a.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

/* ------------------------- reusable components ------------------------- */

function InlineEdit({
  label,
  value,
  onChange,
  editing,
  setEditing,
  italic = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  editing: boolean
  setEditing: (b: boolean) => void
  italic?: boolean
}) {
  return (
    <div className="mb-4">
      {editing ? (
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter your ${label.toLowerCase()} statement...`}
            className="text-lg text-center"
          />
          <Button size="sm" onClick={() => setEditing(false)}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p
            className={`text-xl ${italic ? "text-gray-600 italic" : "text-blue-600 font-semibold"}`}
            onClick={() => setEditing(true)}
          >
            {value || `Click to add your ${label.toLowerCase()} statement`}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-500">
      <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg">No goal areas yet</p>
      <p className="text-sm">Click "Add Goal Area" to get started</p>
    </div>
  )
}

/* -------------------------- presentation card -------------------------- */
function PresentationCard({
  area,
  progress,
  toggle,
  addProgressNote,
}: {
  area: GoalArea
  progress: number
  toggle: (id: string, mid: string, type: "measures" | "rocks") => void
  addProgressNote: (areaId: string, milestoneId: string, type: "measures" | "rocks", noteText: string) => void
}) {
  const color = area.color || "bg-blue-500"
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex gap-3">
          <div className={`rounded-full p-3 ${color} text-white`}>
            <Target className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{area.title}</CardTitle>
            {area.assignees && area.assignees.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">👤 {area.assignees.join(", ")}</div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* measures */}
        {area.measures.length > 0 && (
          <Section
            title="Key Measures"
            icon={<CalendarDays className="h-4 w-4" />}
            tip="Define specific, measurable outcomes that indicate success."
          >
            {area.measures.map((m) => (
              <MilestoneRow key={m.id} item={m} onToggle={() => toggle(area.id, m.id, "measures")} />
            ))}
          </Section>
        )}

        {/* strategies */}
        {area.strategies.length > 0 && (
          <Section
            title="Strategies"
            icon={<TrendingUp className="h-4 w-4" />}
            tip="High-level approaches or methods to achieve your measures."
          >
            <ul className="space-y-1">
              {area.strategies.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* rocks */}
        {area.rocks.length > 0 && (
          <Section
            title="Rocks"
            icon={<Users className="h-4 w-4" />}
            tip="Specific, time-bound actions to complete this quarter."
          >
            {area.rocks.map((r) => (
              <MilestoneRow
                key={r.id}
                item={r}
                onToggle={() => toggle(area.id, r.id, "rocks")}
                onAddProgressNote={(noteText) => addProgressNote(area.id, r.id, "rocks", noteText)}
                showProgressNotes={true}
              />
            ))}
          </Section>
        )}
      </CardContent>
    </Card>
  )
}

function Section({
  title,
  icon,
  tip,
  children,
}: {
  title: string
  icon: React.ReactNode
  tip: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="font-semibold flex gap-2 items-center mb-1">
        {icon} {title}
      </h4>
      <p className="text-xs text-gray-500 mb-2">{tip}</p>
      {children}
    </div>
  )
}

function MilestoneRow({
  item,
  onToggle,
  onAddProgressNote,
  showProgressNotes = false,
}: {
  item: Milestone
  onToggle: () => void
  onAddProgressNote?: (noteText: string) => void
  showProgressNotes?: boolean
}) {
  const [newNote, setNewNote] = useState("")
  const [showNoteInput, setShowNoteInput] = useState(false)

  const handleAddNote = () => {
    if (onAddProgressNote && newNote.trim()) {
      onAddProgressNote(newNote)
      setNewNote("")
      setShowNoteInput(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-start">
        <Checkbox checked={item.completed} onCheckedChange={onToggle} className="mt-0.5" />
        <div className="flex-1">
          <span className={`text-sm ${item.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
            {item.text}
          </span>
          {item.assignees && item.assignees.length > 0 && (
            <div className="text-xs text-gray-600 mt-1">👤 {item.assignees.join(", ")}</div>
          )}
        </div>
        {item.deadline && (
          <Badge
            variant={
              !item.completed && new Date(item.deadline) < new Date()
                ? "destructive"
                : item.completed
                  ? "secondary"
                  : "outline"
            }
            className="ml-2 text-xs"
          >
            📅 {new Date(item.deadline).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {/* Progress Notes Section */}
      {showProgressNotes && (
        <div className="ml-6 space-y-2">
          {/* Add Note Button */}
          {!showNoteInput && (
            <Button variant="outline" size="sm" onClick={() => setShowNoteInput(true)} className="text-xs h-6">
              📝 Add Progress Note
            </Button>
          )}

          {/* Add Note Input */}
          {showNoteInput && (
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add progress note..."
                className="text-xs sm:text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <Button size="sm" onClick={handleAddNote} className="h-6">
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowNoteInput(false)
                  setNewNote("")
                }}
                className="h-6"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Display Progress Notes */}
          {item.progressNotes && item.progressNotes.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-gray-600">Progress Notes:</h5>
              {item.progressNotes.map((note) => (
                <div key={note.id} className="bg-gray-50 p-2 rounded text-xs">
                  <div className="text-gray-700">{note.text}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------ edit card ------------------------------ */
function GoalAreaCard({
  area,
  updateTitle,
  updateAssignees,
  deleteArea,
  addItem,
  removeItem,
  toggle,
  updateNotes,
  updateMilestoneAssignees,
  updateMilestoneText,
  progress,
  rockError,
  setRockError,
  teamMembers,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}: {
  area: GoalArea
  updateTitle: (id: string, title: string) => void
  updateAssignees: (id: string, assignees: string[]) => void
  deleteArea: (id: string) => void
  addItem: (id: string, type: ListKey, value: string, deadline?: string, assignees?: string[]) => void
  removeItem: (id: string, type: ListKey, index: number) => void
  toggle: (id: string, mid: string, type: "measures" | "rocks") => void
  updateNotes: (id: string, mid: string, type: "measures" | "rocks", notes: string) => void
  updateMilestoneAssignees: (id: string, mid: string, type: "measures" | "rocks", assignees: string[]) => void
  updateMilestoneText: (id: string, mid: string, type: "measures" | "rocks", newText: string) => void
  progress: number
  rockError: string
  setRockError: (error: string) => void
  teamMembers: string[]
  onDragStart: (e: React.DragEvent, areaId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, areaId: string) => void
  onDragEnd: () => void
  isDragging: boolean
}) {
  /* local state for inputs */
  const [editTitle, setEditTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState(area.title)
  const [newMeasure, setNewMeasure] = useState("")
  const [newStrategy, setNewStrategy] = useState("")
  const [newRock, setNewRock] = useState("")
  const [rockDeadline, setRockDeadline] = useState("")
  const [rockAssignees, setRockAssignees] = useState<string[]>([])

  const saveTitle = () => {
    updateTitle(area.id, tempTitle)
    setEditTitle(false)
  }

  return (
    <Card
      className={`transition-all duration-200 ${isDragging ? "opacity-50 scale-95" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, area.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, area.id)}
      onDragEnd={onDragEnd}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 sm:gap-3">
          <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              <div className={`p-2 rounded-lg ${area.color} text-white`}>
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              {editTitle ? (
                <div className="flex gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                    className="text-xs sm:text-sm"
                  />
                  <Button size="sm" onClick={saveTitle}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditTitle(false)
                      setTempTitle(area.title)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1 sm:gap-2 items-center min-w-0">
                  <CardTitle className="text-base sm:text-lg cursor-pointer" onClick={() => setEditTitle(true)}>
                    {area.title}
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setEditTitle(true)}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {/* Area assignee dropdown */}
              <div className="mt-2">
                <MultiSelect
                  options={teamMembers}
                  selected={area.assignees || []}
                  onChange={(assignees) => updateAssignees(area.id, assignees)}
                  placeholder="👤 Assign to people..."
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={progress} className="flex-1 h-2" />
                <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteArea(area.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* measures */}
        <EditSection
          title="Key Measures"
          icon={<CalendarDays className="h-4 w-4" />}
          tip="Define specific, measurable outcomes that indicate success."
        >
          {area.measures.map((m, i) => (
            <EditableMilestone
              key={m.id}
              m={m}
              onToggle={() => toggle(area.id, m.id, "measures")}
              onRemove={() => removeItem(area.id, "measures", i)}
              onNotes={(n) => updateNotes(area.id, m.id, "measures", n)}
              onEdit={(newText) => updateMilestoneText(area.id, m.id, "measures", newText)}
              type="measures"
              teamMembers={teamMembers}
            />
          ))}
          <NewItemInput
            placeholder="Add new measure..."
            value={newMeasure}
            setValue={setNewMeasure}
            onAdd={() => addItem(area.id, "measures", newMeasure)}
          />
        </EditSection>

        {/* strategies */}
        <EditSection
          title="Strategies"
          icon={<TrendingUp className="h-4 w-4" />}
          tip="High-level approaches or methods to achieve your measures."
        >
          {area.strategies.map((s, i) => (
            <EditableStrategy
              key={i}
              text={s}
              onRemove={() => removeItem(area.id, "strategies", i)}
              onEdit={(newText) => updateStrategyText(area.id, i, newText)}
            />
          ))}
          <NewItemInput
            placeholder="Add new strategy..."
            value={newStrategy}
            setValue={setNewStrategy}
            onAdd={() => addItem(area.id, "strategies", newStrategy)}
          />
        </EditSection>

        {/* rocks */}
        <EditSection
          title="Rocks"
          icon={<Users className="h-4 w-4" />}
          tip="Specific, time-bound actions to complete this quarter."
        >
          {area.rocks.map((r, i) => (
            <EditableMilestone
              key={r.id}
              m={r}
              onToggle={() => toggle(area.id, r.id, "rocks")}
              onRemove={() => removeItem(area.id, "rocks", i)}
              onNotes={(n) => updateNotes(area.id, r.id, "rocks", n)}
              onAssigneeUpdate={(assignees) => updateMilestoneAssignees(area.id, r.id, "rocks", assignees)}
              onEdit={(newText) => updateMilestoneText(area.id, r.id, "rocks", newText)}
              type="rocks"
              teamMembers={teamMembers}
            />
          ))}
          <div className="space-y-2">
            <NewItemInput
              placeholder="Add new rock/action..."
              value={newRock}
              setValue={setNewRock}
              onAdd={() => {
                if (!rockDeadline || !rockAssignees.length) {
                  setRockError("Both deadline and at least one assignee are required for rocks")
                  setTimeout(() => setRockError(""), 3000)
                  return
                }
                setRockError("")
                addItem(area.id, "rocks", newRock, rockDeadline, rockAssignees)
                setNewRock("")
                setRockDeadline("")
                setRockAssignees([])
              }}
            />
            <p className="text-xs text-gray-500 italic">💡 Press Enter after typing the rock name to save it</p>
            <Input
              type="date"
              value={rockDeadline}
              onChange={(e) => setRockDeadline(e.target.value)}
              className="text-xs sm:text-sm"
              placeholder="Deadline"
            />
            <MultiSelect
              options={teamMembers}
              selected={rockAssignees}
              onChange={setRockAssignees}
              placeholder="👤 Assign to people..."
              className="text-xs sm:text-sm"
            />
            {rockError && <div className="text-red-500 text-xs mt-1 p-2 bg-red-50 rounded">{rockError}</div>}
          </div>
        </EditSection>
      </CardContent>
    </Card>
  )
}

/* small helper sub-components used inside GoalAreaCard */
function EditSection({
  title,
  icon,
  tip,
  children,
}: {
  title: string
  icon: React.ReactNode
  tip: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="font-semibold flex gap-2 items-center mb-1">
        {icon} {title}
      </h4>
      <p className="text-xs text-gray-500 mb-2">{tip}</p>
      {children}
    </div>
  )
}

function EditableMilestone({
  m,
  onToggle,
  onRemove,
  onNotes,
  onAssigneeUpdate,
  onEdit,
  type,
  teamMembers,
}: {
  m: Milestone
  onToggle: () => void
  onRemove: () => void
  onNotes: (n: string) => void
  onAssigneeUpdate?: (assignees: string[]) => void
  onEdit: (newText: string) => void
  type?: "measures" | "rocks"
  teamMembers: string[]
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(m.text)

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-start">
        <Checkbox checked={m.completed} onCheckedChange={onToggle} className="mt-0.5" />
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2 flex-1">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onEdit(editText)
                    setIsEditing(false)
                  }
                  if (e.key === "Escape") {
                    setEditText(m.text)
                    setIsEditing(false)
                  }
                }}
                className="text-xs sm:text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  onEdit(editText)
                  setIsEditing(false)
                }}
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditText(m.text)
                  setIsEditing(false)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <span
              className={`text-sm cursor-pointer ${m.completed ? "line-through text-gray-500" : "text-gray-700"}`}
              onClick={() => setIsEditing(true)}
            >
              {m.text}
            </span>
          )}
          {m.completed && m.completedDate && (
            <Badge variant="secondary" className="ml-2 text-xs">
              ✓ {m.completedDate}
            </Badge>
          )}
          {type === "rocks" && m.assignees && m.assignees.length > 0 && (
            <div className="text-xs text-gray-600 mt-1">👤 {m.assignees.join(", ")}</div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-500">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      {type === "rocks" && onAssigneeUpdate && (
        <div className="ml-6">
          <MultiSelect
            options={teamMembers}
            selected={m.assignees || []}
            onChange={onAssigneeUpdate}
            placeholder="👤 Assign to people..."
            className="text-xs sm:text-sm"
          />
        </div>
      )}
      {m.completed && (
        <Textarea
          value={m.notes || ""}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="Add notes..."
          rows={2}
          className="text-xs sm:text-sm"
        />
      )}
    </div>
  )
}

function EditableStrategy({
  text,
  onRemove,
  onEdit,
}: { text: string; onRemove: () => void; onEdit: (newText: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-1">•</span>
      {isEditing ? (
        <div className="flex gap-2 flex-1">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEdit(editText)
                setIsEditing(false)
              }
              if (e.key === "Escape") {
                setEditText(text)
                setIsEditing(false)
              }
            }}
            className="text-xs sm:text-sm"
          />
          <Button
            size="sm"
            onClick={() => {
              onEdit(editText)
              setIsEditing(false)
            }}
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditText(text)
              setIsEditing(false)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <span className="text-sm flex-1 text-gray-700 cursor-pointer" onClick={() => setIsEditing(true)}>
          {text}
        </span>
      )}
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-500">
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}

function NewItemInput({
  placeholder,
  value,
  setValue,
  onAdd,
}: {
  placeholder: string
  value: string
  setValue: (v: string) => void
  onAdd: () => void
}) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        className="text-xs sm:text-sm"
      />
      <Button size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
