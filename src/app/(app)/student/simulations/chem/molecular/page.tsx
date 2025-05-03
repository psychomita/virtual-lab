"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCw, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ExperimentLayout } from "@/components/simulations/explore/experiment-layout"
import type { QuestionType } from "@/components/simulations/explore/assessment"

export default function MolecularStructuresPage() {
  return (
    <ExperimentLayout
      title="Molecular Structures"
      labPath="/student/simulations/chem"
      theory={<MolecularTheory />}
      procedure={<MolecularProcedure />}
      simulation={<MolecularStructuresSimulation />}
      assessment={molecularAssessment}
    />
  )
}

function MolecularTheory() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Molecular Structure Theory</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Introduction to Molecular Structure</h3>
        <p>
          Molecular structure refers to the three-dimensional arrangement of atoms in a molecule and the chemical bonds
          that hold the atoms together. Understanding molecular structure is crucial for predicting a molecule's
          properties, reactivity, and behavior in chemical reactions.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Chemical Bonding</h3>
        <p>Atoms join together to form molecules through chemical bonds. The main types of chemical bonds include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Covalent bonds:</strong> Formed when atoms share electrons. These can be single, double, or triple
            bonds depending on the number of electron pairs shared.
          </li>
          <li>
            <strong>Ionic bonds:</strong> Formed when electrons are transferred from one atom to another, creating
            positively and negatively charged ions that attract each other.
          </li>
          <li>
            <strong>Hydrogen bonds:</strong> Weak electrostatic attractions between a hydrogen atom bonded to a highly
            electronegative atom and another electronegative atom.
          </li>
          <li>
            <strong>Van der Waals forces:</strong> Weak attractions between molecules or atoms, including dipole-dipole
            interactions and London dispersion forces.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Molecular Geometry</h3>
        <p>
          The geometry of a molecule is determined by the arrangement of electron pairs (both bonding and non-bonding)
          around the central atom. The Valence Shell Electron Pair Repulsion (VSEPR) theory predicts molecular shapes
          based on the principle that electron pairs repel each other and arrange themselves to minimize repulsion.
        </p>
        <p>Common molecular geometries include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Linear:</strong> Two electron groups (e.g., CO₂, BeF₂)
          </li>
          <li>
            <strong>Trigonal planar:</strong> Three electron groups (e.g., BF₃, CO₃²⁻)
          </li>
          <li>
            <strong>Tetrahedral:</strong> Four electron groups (e.g., CH₄, NH₄⁺)
          </li>
          <li>
            <strong>Trigonal bipyramidal:</strong> Five electron groups (e.g., PCl₅)
          </li>
          <li>
            <strong>Octahedral:</strong> Six electron groups (e.g., SF₆)
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Hybridization</h3>
        <p>
          Hybridization is a mathematical model that explains the formation of chemical bonds in terms of atomic orbital
          mixing. When atoms form bonds, their atomic orbitals can combine to form hybrid orbitals with different
          orientations in space.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>sp hybridization:</strong> Mixing of one s and one p orbital, resulting in linear geometry
          </li>
          <li>
            <strong>sp² hybridization:</strong> Mixing of one s and two p orbitals, resulting in trigonal planar
            geometry
          </li>
          <li>
            <strong>sp³ hybridization:</strong> Mixing of one s and three p orbitals, resulting in tetrahedral geometry
          </li>
          <li>
            <strong>sp³d hybridization:</strong> Mixing of one s, three p, and one d orbital, resulting in trigonal
            bipyramidal geometry
          </li>
          <li>
            <strong>sp³d² hybridization:</strong> Mixing of one s, three p, and two d orbitals, resulting in octahedral
            geometry
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Polarity and Electronegativity</h3>
        <p>
          Electronegativity is a measure of an atom's ability to attract electrons in a chemical bond. Differences in
          electronegativity between bonded atoms create bond polarity, where electrons are pulled more toward the more
          electronegative atom.
        </p>
        <p>
          A molecule's overall polarity depends on both bond polarity and molecular geometry. Even with polar bonds, a
          molecule can be nonpolar if the bond dipoles cancel due to symmetrical arrangement.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Isomerism</h3>
        <p>
          Isomers are molecules with the same molecular formula but different structural arrangements. Types of
          isomerism include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Structural isomers:</strong> Different connectivity of atoms (e.g., butane and isobutane)
          </li>
          <li>
            <strong>Stereoisomers:</strong> Same connectivity but different spatial arrangement (e.g., cis-trans
            isomers)
          </li>
          <li>
            <strong>Conformational isomers:</strong> Different arrangements due to rotation around single bonds
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Molecular Spectroscopy</h3>
        <p>Molecular structures can be studied using various spectroscopic techniques:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Infrared (IR) spectroscopy:</strong> Identifies functional groups based on molecular vibrations
          </li>
          <li>
            <strong>Nuclear Magnetic Resonance (NMR) spectroscopy:</strong> Provides information about the
            carbon-hydrogen framework
          </li>
          <li>
            <strong>X-ray crystallography:</strong> Determines the precise three-dimensional structure of crystalline
            molecules
          </li>
        </ul>
      </div>
    </div>
  )
}

function MolecularProcedure() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Molecular Structure Exploration Procedure</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Objectives</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Visualize and explore the three-dimensional structures of various molecules</li>
          <li>Identify different molecular geometries and bond types</li>
          <li>Understand the relationship between molecular structure and properties</li>
          <li>Compare and contrast structures of different molecules</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Materials and Equipment</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Molecular visualization software</li>
          <li>3D molecular models</li>
          <li>Molecular structure database</li>
          <li>Periodic table of elements</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Step-by-Step Procedure</h3>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Part 1: Basic Molecular Visualization</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Select a molecule from the dropdown menu (e.g., water, methane, ammonia)</li>
            <li>Observe the default 3D representation of the molecule</li>
            <li>Identify the elements present and their positions in the molecule</li>
            <li>Note the number and types of bonds (single, double, triple)</li>
            <li>Record your observations in a data table</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Part 2: Exploring Molecular Geometry</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>For each molecule, identify its molecular geometry (e.g., linear, tetrahedral, trigonal planar)</li>
            <li>Measure or estimate bond angles between atoms</li>
            <li>Compare the observed geometry with VSEPR theory predictions</li>
            <li>Identify any lone pairs of electrons and their effect on the molecular shape</li>
            <li>Classify each molecule according to its geometry</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Part 3: Manipulating Molecular Models</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Use the rotation controls to view the molecule from different angles</li>
            <li>Adjust the zoom level to examine specific features more closely</li>
            <li>Toggle the display of element labels to help with identification</li>
            <li>Adjust the bond thickness for better visualization</li>
            <li>Practice rotating and manipulating each molecule to gain a full 3D understanding</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Part 4: Comparing Different Molecules</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Compare simple molecules (e.g., water) with more complex ones (e.g., benzene)</li>
            <li>Note similarities and differences in structure, bond types, and geometry</li>
            <li>Identify patterns in molecular structure across different chemical families</li>
            <li>Relate the molecular structure to known physical and chemical properties</li>
            <li>Create a comparative chart of the molecules studied</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Data Analysis</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            For each molecule, record:
            <ul className="list-disc pl-6 mt-2">
              <li>Chemical formula</li>
              <li>Number and types of atoms</li>
              <li>Bond types and lengths</li>
              <li>Molecular geometry</li>
              <li>Presence of symmetry elements</li>
            </ul>
          </li>
          <li>Classify molecules based on their geometry and bond types</li>
          <li>Predict physical properties (e.g., boiling point, solubility) based on structure</li>
          <li>Compare your predictions with known properties from reference sources</li>
        </ol>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-emerald-950 rounded-md">
        <h3 className="text-lg font-semibold">Tips for Effective Visualization</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Start with simpler molecules before moving to more complex structures</li>
          <li>Use different viewing angles to fully understand the 3D arrangement</li>
          <li>Pay attention to bond angles and distances, as they provide clues about hybridization</li>
          <li>Compare your observations with theoretical models and predictions</li>
          <li>Try to relate the molecular structure to the chemical behavior of the molecule</li>
        </ul>
      </div>
    </div>
  )
}

// Molecule data structure
type Atom = {
  element: string
  position: { x: number; y: number; z: number }
  color: string
  radius: number
}

type Bond = {
  from: number
  to: number
  type: "single" | "double" | "triple"
}

type Molecule = {
  name: string
  atoms: Atom[]
  bonds: Bond[]
}

function MolecularStructuresSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedMolecule, setSelectedMolecule] = useState<string>("water")
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const [rotationZ, setRotationZ] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showBonds, setShowBonds] = useState(true)
  const [bondThickness, setBondThickness] = useState(5)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Molecule library
  const molecules: { [key: string]: Molecule } = {
    water: {
      name: "Water (H₂O)",
      atoms: [
        { element: "O", position: { x: 0, y: 0, z: 0 }, color: "#ff0000", radius: 15 },
        { element: "H", position: { x: -20, y: 15, z: 0 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 20, y: 15, z: 0 }, color: "#ffffff", radius: 8 },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 0, to: 2, type: "single" },
      ],
    },
    methane: {
      name: "Methane (CH₄)",
      atoms: [
        { element: "C", position: { x: 0, y: 0, z: 0 }, color: "#808080", radius: 15 },
        { element: "H", position: { x: 20, y: 20, z: 20 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -20, y: -20, z: 20 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 20, y: -20, z: -20 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -20, y: 20, z: -20 }, color: "#ffffff", radius: 8 },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 0, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
        { from: 0, to: 4, type: "single" },
      ],
    },
    ammonia: {
      name: "Ammonia (NH₃)",
      atoms: [
        { element: "N", position: { x: 0, y: 0, z: 0 }, color: "#3050f8", radius: 15 },
        { element: "H", position: { x: 15, y: 15, z: 15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -15, y: 15, z: -15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 0, y: -20, z: 0 }, color: "#ffffff", radius: 8 },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 0, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
      ],
    },
    carbon_dioxide: {
      name: "Carbon Dioxide (CO₂)",
      atoms: [
        { element: "C", position: { x: 0, y: 0, z: 0 }, color: "#808080", radius: 15 },
        { element: "O", position: { x: -30, y: 0, z: 0 }, color: "#ff0000", radius: 15 },
        { element: "O", position: { x: 30, y: 0, z: 0 }, color: "#ff0000", radius: 15 },
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 0, to: 2, type: "double" },
      ],
    },
    ethanol: {
      name: "Ethanol (C₂H₅OH)",
      atoms: [
        { element: "C", position: { x: -20, y: 0, z: 0 }, color: "#808080", radius: 15 },
        { element: "C", position: { x: 20, y: 0, z: 0 }, color: "#808080", radius: 15 },
        { element: "O", position: { x: 50, y: 0, z: 0 }, color: "#ff0000", radius: 15 },
        { element: "H", position: { x: -20, y: 20, z: 15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -20, y: -20, z: 15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -40, y: 0, z: -15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 20, y: 20, z: -15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 20, y: -20, z: -15 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 70, y: 0, z: 0 }, color: "#ffffff", radius: 8 },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 1, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
        { from: 0, to: 4, type: "single" },
        { from: 0, to: 5, type: "single" },
        { from: 1, to: 6, type: "single" },
        { from: 1, to: 7, type: "single" },
        { from: 2, to: 8, type: "single" },
      ],
    },
    benzene: {
      name: "Benzene (C₆H₆)",
      atoms: [
        { element: "C", position: { x: 0, y: 30, z: 0 }, color: "#808080", radius: 15 },
        { element: "C", position: { x: 26, y: 15, z: 0 }, color: "#808080", radius: 15 },
        { element: "C", position: { x: 26, y: -15, z: 0 }, color: "#808080", radius: 15 },
        { element: "C", position: { x: 0, y: -30, z: 0 }, color: "#808080", radius: 15 },
        { element: "C", position: { x: -26, y: -15, z: 0 }, color: "#808080", radius: 15 },
        { element: "C", position: { x: -26, y: 15, z: 0 }, color: "#808080", radius: 15 },
        { element: "H", position: { x: 0, y: 45, z: 0 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 39, y: 22.5, z: 0 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 39, y: -22.5, z: 0 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: 0, y: -45, z: 0 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -39, y: -22.5, z: 0 }, color: "#ffffff", radius: 8 },
        { element: "H", position: { x: -39, y: 22.5, z: 0 }, color: "#ffffff", radius: 8 },
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 1, to: 2, type: "single" },
        { from: 2, to: 3, type: "double" },
        { from: 3, to: 4, type: "single" },
        { from: 4, to: 5, type: "double" },
        { from: 5, to: 0, type: "single" },
        { from: 0, to: 6, type: "single" },
        { from: 1, to: 7, type: "single" },
        { from: 2, to: 8, type: "single" },
        { from: 3, to: 9, type: "single" },
        { from: 4, to: 10, type: "single" },
        { from: 5, to: 11, type: "single" },
      ],
    },
  }

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setRotationY((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [autoRotate])

  // Draw the molecule
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const molecule = molecules[selectedMolecule]
    if (!molecule) return

    // Center of canvas
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Convert 3D coordinates to 2D with rotation
    const project = (x: number, y: number, z: number) => {
      // Apply rotations
      const radX = (rotationX * Math.PI) / 180
      const radY = (rotationY * Math.PI) / 180
      const radZ = (rotationZ * Math.PI) / 180

      // Rotate around X axis
      const y1 = y * Math.cos(radX) - z * Math.sin(radX)
      const z1 = y * Math.sin(radX) + z * Math.cos(radX)

      // Rotate around Y axis
      const x2 = x * Math.cos(radY) + z1 * Math.sin(radY)
      const z2 = -x * Math.sin(radY) + z1 * Math.cos(radY)

      // Rotate around Z axis
      let x3 = x2 * Math.cos(radZ) - y1 * Math.sin(radZ)
      let y3 = x2 * Math.sin(radZ) + y1 * Math.cos(radZ)

      // Apply zoom
      const scale = zoom / 100
      x3 *= scale
      y3 *= scale

      return {
        x: centerX + x3,
        y: centerY + y3,
        z: z2, // Keep z for depth sorting
      }
    }

    // Project all atoms
    const projectedAtoms = molecule.atoms.map((atom) => {
      const projected = project(atom.position.x, atom.position.y, atom.position.z)
      return {
        ...atom,
        projectedPosition: projected,
        depth: projected.z,
      }
    })

    // Sort atoms by depth (painter's algorithm)
    projectedAtoms.sort((a, b) => b.depth - a.depth)

    // Draw bonds
    if (showBonds) {
      molecule.bonds.forEach((bond) => {
        const atom1 = projectedAtoms.find((_, i) => i === bond.from)
        const atom2 = projectedAtoms.find((_, i) => i === bond.to)

        if (atom1 && atom2) {
          const x1 = atom1.projectedPosition.x
          const y1 = atom1.projectedPosition.y
          const x2 = atom2.projectedPosition.x
          const y2 = atom2.projectedPosition.y

          // Draw bond
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = "#666666"
          ctx.lineWidth = bondThickness

          if (bond.type === "single") {
            ctx.stroke()
          } else if (bond.type === "double") {
            // Draw double bond
            const dx = x2 - x1
            const dy = y2 - y1
            const length = Math.sqrt(dx * dx + dy * dy)
            const offsetX = (-dy * 3) / length
            const offsetY = (dx * 3) / length

            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(x1 + offsetX, y1 + offsetY)
            ctx.lineTo(x2 + offsetX, y2 + offsetY)
            ctx.stroke()
          } else if (bond.type === "triple") {
            // Draw triple bond
            const dx = x2 - x1
            const dy = y2 - y1
            const length = Math.sqrt(dx * dx + dy * dy)
            const offsetX = (-dy * 4) / length
            const offsetY = (dx * 4) / length

            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(x1 + offsetX, y1 + offsetY)
            ctx.lineTo(x2 + offsetX, y2 + offsetY)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(x1 - offsetX, y1 - offsetY)
            ctx.lineTo(x2 - offsetX, y2 - offsetY)
            ctx.stroke()
          }
        }
      })
    }

    // Draw atoms
    projectedAtoms.forEach((atom) => {
      const { x, y } = atom.projectedPosition
      const radius = atom.radius * (zoom / 100)

      // Draw atom
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = atom.color
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw element label
      if (showLabels) {
        ctx.fillStyle = "#000000"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(atom.element, x, y)
      }
    })

    // Draw molecule name
    ctx.fillStyle = "#000000"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(molecule.name, centerX, 20)
  }, [selectedMolecule, rotationX, rotationY, rotationZ, zoom, showLabels, showBonds, bondThickness])

  // Handle mouse events for rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setAutoRotate(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setRotationY((prev) => (prev + dx * 0.5) % 360)
    setRotationX((prev) => {
      const newRotation = prev + dy * 0.5
      return Math.max(-90, Math.min(90, newRotation)) // Limit vertical rotation
    })

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Reset view
  const resetView = () => {
    setRotationX(0)
    setRotationY(0)
    setRotationZ(0)
    setZoom(100)
  }

  return (
    <div className="w-full">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>3D Molecule Viewer</CardTitle>
          <CardDescription>Explore the 3D structure of various molecules</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border rounded-md bg-gray-50"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          <div className="flex gap-4 mt-4">
            <Button onClick={() => setAutoRotate(!autoRotate)} variant={autoRotate ? "default" : "outline"}>
              <RotateCw className="mr-2 h-4 w-4" />
              {autoRotate ? "Stop Rotation" : "Auto Rotate"}
            </Button>
            <Button onClick={resetView} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset View
            </Button>
            <Button onClick={() => setZoom(Math.min(zoom + 20, 200))} variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={() => setZoom(Math.max(zoom - 20, 40))} variant="outline">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-500 w-full">
            <div className="flex justify-between mb-1">
              <span>Zoom:</span>
              <span>{zoom}%</span>
            </div>
            <Slider value={[zoom]} min={40} max={200} step={10} onValueChange={(value) => setZoom(value[0])} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
            <div>
              <h3 className="text-lg font-medium mb-2">Molecule Selection</h3>
              <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a molecule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">Water (H₂O)</SelectItem>
                  <SelectItem value="methane">Methane (CH₄)</SelectItem>
                  <SelectItem value="ammonia">Ammonia (NH₃)</SelectItem>
                  <SelectItem value="carbon_dioxide">Carbon Dioxide (CO₂)</SelectItem>
                  <SelectItem value="ethanol">Ethanol (C₂H₅OH)</SelectItem>
                  <SelectItem value="benzene">Benzene (C₆H₆)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Display Options</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="showLabels">Show Element Labels</Label>
                <Switch id="showLabels" checked={showLabels} onCheckedChange={setShowLabels} />
              </div>

              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="showBonds">Show Bonds</Label>
                <Switch id="showBonds" checked={showBonds} onCheckedChange={setShowBonds} />
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Bond Thickness</label>
                  <span className="text-sm text-gray-500">{bondThickness}px</span>
                </div>
                <Slider
                  value={[bondThickness]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setBondThickness(value[0])}
                  disabled={!showBonds}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Manual Rotation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">X-Axis Rotation</label>
                  <span className="text-sm text-gray-500">{rotationX}°</span>
                </div>
                <Slider
                  value={[rotationX]}
                  min={-90}
                  max={90}
                  step={5}
                  onValueChange={(value) => setRotationX(value[0])}
                />
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Y-Axis Rotation</label>
                  <span className="text-sm text-gray-500">{rotationY}°</span>
                </div>
                <Slider
                  value={[rotationY]}
                  min={0}
                  max={360}
                  step={5}
                  onValueChange={(value) => setRotationY(value[0])}
                />
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Z-Axis Rotation</label>
                  <span className="text-sm text-gray-500">{rotationZ}°</span>
                </div>
                <Slider
                  value={[rotationZ]}
                  min={0}
                  max={360}
                  step={5}
                  onValueChange={(value) => setRotationZ(value[0])}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const molecularAssessment: QuestionType[] = [
  {
    id: "molecular-q1",
    type: "multiple-choice",
    question: "What is the molecular geometry of methane (CH₄)?",
    options: ["Linear", "Trigonal planar", "Tetrahedral", "Octahedral"],
    correctAnswer: "Tetrahedral",
    explanation:
      "Methane has a central carbon atom bonded to four hydrogen atoms. The four electron pairs around the carbon repel each other, resulting in a tetrahedral arrangement with bond angles of approximately 109.5°.",
  },
  {
    id: "molecular-q2",
    type: "multiple-choice",
    question: "Which type of hybridization is present in the carbon atom of carbon dioxide (CO₂)?",
    options: ["sp", "sp²", "sp³", "sp³d"],
    correctAnswer: "sp",
    explanation:
      "The carbon atom in CO₂ forms two double bonds with oxygen atoms in a linear arrangement. This linear geometry is characteristic of sp hybridization, where one s orbital and one p orbital combine to form two hybrid orbitals.",
  },
  {
    id: "molecular-q3",
    type: "multiple-choice",
    question: "What is the bond angle between hydrogen atoms in a water molecule (H₂O)?",
    options: ["90°", "104.5°", "120°", "180°"],
    correctAnswer: "104.5°",
    explanation:
      "Water has a bent molecular geometry due to the presence of two lone pairs on the oxygen atom. The H-O-H bond angle is approximately 104.5°, which is less than the tetrahedral angle of 109.5° due to the greater repulsion from the lone pairs.",
  },
  {
    id: "molecular-q4",
    type: "multiple-choice",
    question: "Which of the following molecules has a trigonal pyramidal geometry?",
    options: ["CH₄", "NH₃", "CO₂", "BF₃"],
    correctAnswer: "NH₃",
    explanation:
      "Ammonia (NH₃) has a trigonal pyramidal geometry. The nitrogen atom has three bonding pairs and one lone pair of electrons, resulting in a pyramidal shape with the nitrogen at the apex and the three hydrogen atoms forming the base.",
  },
  {
    id: "molecular-q5",
    type: "multiple-choice",
    question: "What type of bond is present between carbon atoms in benzene (C₆H₆)?",
    options: [
      "Single bonds only",
      "Double bonds only",
      "Triple bonds only",
      "Alternating single and double bonds (delocalized)",
    ],
    correctAnswer: "Alternating single and double bonds (delocalized)",
    explanation:
      "Benzene has a ring of six carbon atoms with alternating single and double bonds. However, these electrons are actually delocalized around the ring, creating a resonance structure where all carbon-carbon bonds are equivalent.",
  },
  {
    id: "molecular-q6",
    type: "multiple-choice",
    question: "Which factor most strongly influences molecular geometry?",
    options: [
      "The mass of the atoms",
      "The electron pair repulsion around the central atom",
      "The temperature of the molecule",
      "The number of neutrons in each atom",
    ],
    correctAnswer: "The electron pair repulsion around the central atom",
    explanation:
      "According to VSEPR theory, molecular geometry is determined by the arrangement of electron pairs (both bonding and non-bonding) around the central atom. These electron pairs repel each other and arrange themselves to minimize repulsion.",
  },
  {
    id: "molecular-q7",
    type: "open-ended",
    question: "Explain why carbon dioxide (CO₂) is a linear molecule while water (H₂O) is bent.",
    explanation:
      "Carbon dioxide is linear because the central carbon atom has two double bonds with oxygen atoms and no lone pairs. The two bonding regions repel each other equally, resulting in a 180° bond angle and linear geometry. Water, on the other hand, has two bonding pairs and two lone pairs on the central oxygen atom. The lone pairs take up more space than bonding pairs, pushing the hydrogen atoms closer together and resulting in a bent structure with a bond angle of approximately 104.5°.",
  },
  {
    id: "molecular-q8",
    type: "open-ended",
    question: "Describe how the polarity of a molecule is determined by both its bond polarity and molecular geometry.",
    explanation:
      "Molecular polarity depends on both the polarity of individual bonds and the overall geometry of the molecule. A bond is polar when there is a difference in electronegativity between the bonded atoms, creating a dipole. However, even with polar bonds, a molecule can be nonpolar if the bond dipoles cancel each other due to a symmetrical arrangement. For example, CO₂ has polar C=O bonds, but the linear arrangement causes the dipoles to cancel, making the molecule nonpolar. In contrast, H₂O has polar O-H bonds, and its bent geometry means the dipoles do not cancel, resulting in a polar molecule.",
  },
]