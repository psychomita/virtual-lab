"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, RotateCcw, Dna } from "lucide-react";

export default function GeneticsLab() {
  const [activeTab, setActiveTab] = useState("inheritance");

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="inheritance">Inheritance Patterns</TabsTrigger>
          <TabsTrigger value="mutations">Genetic Mutations</TabsTrigger>
        </TabsList>

        <TabsContent value="inheritance" className="mt-0">
          <InheritanceSimulation />
        </TabsContent>

        <TabsContent value="mutations" className="mt-0">
          <MutationSimulation />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InheritanceSimulation() {
  const [trait, setTrait] = useState("eye-color");
  const [parent1Genotype, setParent1Genotype] = useState("BB");
  const [parent2Genotype, setParent2Genotype] = useState("bb");
  const [offspring, setOffspring] = useState<string[]>([]);
  const [showPunnett, setShowPunnett] = useState(false);

  const traits = {
    "eye-color": {
      name: "Eye Color",
      dominant: "Brown (B)",
      recessive: "Blue (b)",
      genotypes: ["BB", "Bb", "bb"],
      phenotypes: {
        BB: "Brown Eyes",
        Bb: "Brown Eyes",
        bb: "Blue Eyes",
      },
    },
    "hair-color": {
      name: "Hair Color",
      dominant: "Dark (D)",
      recessive: "Light (d)",
      genotypes: ["DD", "Dd", "dd"],
      phenotypes: {
        DD: "Dark Hair",
        Dd: "Dark Hair",
        dd: "Light Hair",
      },
    },
    height: {
      name: "Height",
      dominant: "Tall (T)",
      recessive: "Short (t)",
      genotypes: ["TT", "Tt", "tt"],
      phenotypes: {
        TT: "Tall",
        Tt: "Tall",
        tt: "Short",
      },
    },
  };

  const simulateCross = () => {
    // Extract alleles
    const p1Allele1 = parent1Genotype[0];
    const p1Allele2 = parent1Genotype[1];
    const p2Allele1 = parent2Genotype[0];
    const p2Allele2 = parent2Genotype[1];

    // Generate offspring genotypes
    const offspringGenotypes = [
      p1Allele1 + p2Allele1,
      p1Allele1 + p2Allele2,
      p1Allele2 + p2Allele1,
      p1Allele2 + p2Allele2,
    ];

    // Sort alleles in each genotype (e.g., "bB" becomes "Bb")
    const sortedGenotypes = offspringGenotypes.map((genotype) => {
      return genotype
        .split("")
        .sort((a, b) => {
          if (a.toUpperCase() === b.toUpperCase()) {
            return a === a.toUpperCase() ? -1 : 1;
          }
          return a.toUpperCase() < b.toUpperCase() ? -1 : 1;
        })
        .join("");
    });

    setOffspring(sortedGenotypes);
    setShowPunnett(true);
  };

  const resetSimulation = () => {
    setOffspring([]);
    setShowPunnett(false);
  };

  const getGenotypeCounts = () => {
    const counts: Record<string, number> = {};

    offspring.forEach((genotype) => {
      counts[genotype] = (counts[genotype] || 0) + 1;
    });

    return counts;
  };

  const getPhenotypeCounts = () => {
    const counts: Record<string, number> = {};

    offspring.forEach((genotype) => {
      const phenotype =
        traits[trait as keyof typeof traits].phenotypes[
          genotype as keyof (typeof traits)[keyof typeof traits]["phenotypes"]
        ];
      counts[phenotype] = (counts[phenotype] || 0) + 1;
    });

    return counts;
  };

  const getGenotypeColor = (genotype: string) => {
    const traitInfo = traits[trait as keyof typeof traits];
    const dominantAllele = traitInfo.dominant
      .split(" ")[1]
      .replace(/[()]/g, "");

    if (genotype === dominantAllele + dominantAllele) {
      return "bg-blue-100";
    } else if (genotype.includes(dominantAllele)) {
      return "bg-purple-100";
    } else {
      return "bg-red-100";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Inheritance Patterns</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={simulateCross}>
              <Play className="mr-2 h-4 w-4" />
              Simulate Cross
            </Button>
            <Button variant="outline" size="sm" onClick={resetSimulation}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trait</label>
              <Select value={trait} onValueChange={setTrait}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trait" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eye-color">Eye Color</SelectItem>
                  <SelectItem value="hair-color">Hair Color</SelectItem>
                  <SelectItem value="height">Height</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Parent 1 Genotype</label>
              <Select
                value={parent1Genotype}
                onValueChange={setParent1Genotype}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genotype" />
                </SelectTrigger>
                <SelectContent>
                  {traits[trait as keyof typeof traits].genotypes.map(
                    (genotype) => (
                      <SelectItem key={genotype} value={genotype}>
                        {genotype}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs">
                Phenotype:{" "}
                {
                  traits[trait as keyof typeof traits].phenotypes[
                    parent1Genotype as keyof (typeof traits)[keyof typeof traits]["phenotypes"]
                  ]
                }
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Parent 2 Genotype</label>
              <Select
                value={parent2Genotype}
                onValueChange={setParent2Genotype}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genotype" />
                </SelectTrigger>
                <SelectContent>
                  {traits[trait as keyof typeof traits].genotypes.map(
                    (genotype) => (
                      <SelectItem key={genotype} value={genotype}>
                        {genotype}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs">
                Phenotype:{" "}
                {
                  traits[trait as keyof typeof traits].phenotypes[
                    parent2Genotype as keyof (typeof traits)[keyof typeof traits]["phenotypes"]
                  ]
                }
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-md mb-2 font-medium">Trait Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Trait:</span>{" "}
                {traits[trait as keyof typeof traits].name}
              </p>
              <p>
                <span className="font-medium">Dominant:</span>{" "}
                {traits[trait as keyof typeof traits].dominant}
              </p>
              <p>
                <span className="font-medium">Recessive:</span>{" "}
                {traits[trait as keyof typeof traits].recessive}
              </p>

              <div className="pt-2">
                <p className="font-medium">Possible Genotypes:</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
                  <li>
                    <span className="font-medium">
                      {traits[trait as keyof typeof traits].genotypes[0]}:
                    </span>{" "}
                    Homozygous Dominant
                  </li>
                  <li>
                    <span className="font-medium">
                      {traits[trait as keyof typeof traits].genotypes[1]}:
                    </span>{" "}
                    Heterozygous
                  </li>
                  <li>
                    <span className="font-medium">
                      {traits[trait as keyof typeof traits].genotypes[2]}:
                    </span>{" "}
                    Homozygous Recessive
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {showPunnett && (
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-md mb-4 font-medium">Punnett Square</h3>

            <div className="mb-6 grid grid-cols-3 gap-1">
              <div className="bg-gray-100 p-2 text-center font-medium"></div>
              <div className="bg-gray-100 p-2 text-center font-medium">
                {parent2Genotype[0]}
              </div>
              <div className="bg-gray-100 p-2 text-center font-medium">
                {parent2Genotype[1]}
              </div>

              <div className="bg-gray-100 p-2 text-center font-medium">
                {parent1Genotype[0]}
              </div>
              <div
                className={`p-2 text-center ${getGenotypeColor(parent1Genotype[0] + parent2Genotype[0])}`}
              >
                {parent1Genotype[0] + parent2Genotype[0]}
              </div>
              <div
                className={`p-2 text-center ${getGenotypeColor(parent1Genotype[0] + parent2Genotype[1])}`}
              >
                {parent1Genotype[0] + parent2Genotype[1]}
              </div>

              <div className="bg-gray-100 p-2 text-center font-medium">
                {parent1Genotype[1]}
              </div>
              <div
                className={`p-2 text-center ${getGenotypeColor(parent1Genotype[1] + parent2Genotype[0])}`}
              >
                {parent1Genotype[1] + parent2Genotype[0]}
              </div>
              <div
                className={`p-2 text-center ${getGenotypeColor(parent1Genotype[1] + parent2Genotype[1])}`}
              >
                {parent1Genotype[1] + parent2Genotype[1]}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Genotype Ratio</h4>
                <div className="space-y-1">
                  {Object.entries(getGenotypeCounts()).map(
                    ([genotype, count]) => (
                      <div key={genotype} className="flex justify-between">
                        <span className="text-sm">{genotype}:</span>
                        <span className="text-sm">
                          {count}/4 ({((count / 4) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Phenotype Ratio</h4>
                <div className="space-y-1">
                  {Object.entries(getPhenotypeCounts()).map(
                    ([phenotype, count]) => (
                      <div key={phenotype} className="flex justify-between">
                        <span className="text-sm">{phenotype}:</span>
                        <span className="text-sm">
                          {count}/4 ({((count / 4) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Inheritance Patterns</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-md mb-2 font-semibold">Mendel's Laws</h4>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              <li>
                <span className="font-medium">Law of Segregation:</span> Each
                individual has two alleles for each gene, which segregate during
                gamete formation.
              </li>
              <li>
                <span className="font-medium">
                  Law of Independent Assortment:
                </span>{" "}
                Genes for different traits assort independently during gamete
                formation.
              </li>
              <li>
                <span className="font-medium">Law of Dominance:</span> Some
                alleles are dominant while others are recessive.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Inheritance Patterns</h4>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Complete Dominance</h5>
              <p className="mt-1 text-xs">
                One allele completely masks the other. Example: Brown eyes (B)
                are dominant over blue eyes (b).
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Incomplete Dominance</h5>
              <p className="mt-1 text-xs">
                Neither allele is dominant, resulting in a blended phenotype.
                Example: Red flowers (R) and white flowers (r) produce pink
                flowers (Rr).
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Codominance</h5>
              <p className="mt-1 text-xs">
                Both alleles are expressed simultaneously. Example: AB blood
                type expresses both A and B antigens.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="mb-2 text-sm font-medium">Instructions:</h4>
            <ol className="list-decimal space-y-1 pl-5 text-xs">
              <li>Select a trait to study</li>
              <li>Choose genotypes for both parents</li>
              <li>Click "Simulate Cross" to see the offspring</li>
              <li>Analyze the Punnett square and ratios</li>
              <li>Try different combinations to observe patterns</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function MutationSimulation() {
  const [dnaSequence, setDnaSequence] = useState("ATGCCTAGGCTA");
  const [mutationType, setMutationType] = useState("substitution");
  const [mutationRate, setMutationRate] = useState(10);
  const [generations, setGenerations] = useState(1);
  const [mutatedSequences, setMutatedSequences] = useState<string[]>([]);

  const simulateMutation = () => {
    let currentSequence = dnaSequence;
    const sequences = [currentSequence];

    for (let i = 0; i < generations; i++) {
      currentSequence = mutateDNA(currentSequence);
      sequences.push(currentSequence);
    }

    setMutatedSequences(sequences);
  };

  const resetSimulation = () => {
    setMutatedSequences([]);
  };

  const mutateDNA = (sequence: string) => {
    const mutated = sequence.split("");

    // Determine how many mutations based on rate
    const numMutations = Math.floor((mutationRate / 100) * sequence.length);

    for (let i = 0; i < numMutations; i++) {
      const position = Math.floor(Math.random() * sequence.length);

      if (mutationType === "substitution") {
        // Substitution: replace with a different nucleotide
        const nucleotides = ["A", "T", "G", "C"].filter(
          (n) => n !== sequence[position],
        );
        mutated[position] =
          nucleotides[Math.floor(Math.random() * nucleotides.length)];
      } else if (mutationType === "insertion") {
        // Insertion: add a random nucleotide
        const nucleotides = ["A", "T", "G", "C"];
        const newNucleotide =
          nucleotides[Math.floor(Math.random() * nucleotides.length)];
        mutated.splice(position, 0, newNucleotide);
      } else if (mutationType === "deletion") {
        // Deletion: remove a nucleotide
        mutated.splice(position, 1);
      }
    }

    return mutated.join("");
  };

  const countMutations = (original: string, mutated: string) => {
    let count = 0;
    const maxLength = Math.max(original.length, mutated.length);

    for (let i = 0; i < maxLength; i++) {
      if (original[i] !== mutated[i]) {
        count++;
      }
    }

    return count;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Genetic Mutations</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={simulateMutation}>
              <Dna className="mr-2 h-4 w-4" />
              Simulate Mutations
            </Button>
            <Button variant="outline" size="sm" onClick={resetSimulation}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">DNA Sequence</label>
              <input
                type="text"
                value={dnaSequence}
                onChange={(e) =>
                  setDnaSequence(
                    e.target.value.toUpperCase().replace(/[^ATGC]/g, ""),
                  )
                }
                className="mt-1 w-full rounded-md border p-2"
                placeholder="Enter DNA sequence (A, T, G, C)"
                maxLength={20}
              />
              <p className="mt-1 text-xs">Use only A, T, G, C nucleotides</p>
            </div>

            <div>
              <label className="text-sm font-medium">Mutation Type</label>
              <Select value={mutationType} onValueChange={setMutationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mutation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="substitution">Substitution</SelectItem>
                  <SelectItem value="insertion">Insertion</SelectItem>
                  <SelectItem value="deletion">Deletion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Mutation Rate (%)</label>
                <span className="text-sm">{mutationRate}%</span>
              </div>
              <Slider
                value={[mutationRate]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setMutationRate(value[0])}
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Generations</label>
                <span className="text-sm">{generations}</span>
              </div>
              <Slider
                value={[generations]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setGenerations(value[0])}
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-md mb-2 font-medium">Mutation Types</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium">Substitution</p>
                <p className="text-xs">
                  One nucleotide is replaced with another.
                </p>
                <p className="mt-1 font-mono text-xs">
                  Original: AT<span className="bg-yellow-200">G</span>CTA
                  <br />
                  Mutated: AT<span className="bg-yellow-200">C</span>CTA
                </p>
              </div>

              <div>
                <p className="font-medium">Insertion</p>
                <p className="text-xs">
                  A nucleotide is added to the sequence.
                </p>
                <p className="mt-1 font-mono text-xs">
                  Original: ATG<span className="bg-green-200"></span>CTA
                  <br />
                  Mutated: ATG<span className="bg-green-200">A</span>CTA
                </p>
              </div>

              <div>
                <p className="font-medium">Deletion</p>
                <p className="text-xs">
                  A nucleotide is removed from the sequence.
                </p>
                <p className="mt-1 font-mono text-xs">
                  Original: ATG<span className="bg-red-200">C</span>TA
                  <br />
                  Mutated: ATG<span className="bg-red-200"></span>TA
                </p>
              </div>
            </div>
          </div>
        </div>

        {mutatedSequences.length > 0 && (
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-md mb-4 font-medium">Mutation Results</h3>

            <div className="space-y-2">
              {mutatedSequences.map((sequence, index) => (
                <div key={index} className="rounded-lg border p-2">
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">
                      {index === 0 ? "Original" : `Generation ${index}`}
                    </span>
                    {index > 0 && (
                      <span className="text-xs">
                        Mutations:{" "}
                        {countMutations(mutatedSequences[0], sequence)}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm break-all">
                    {sequence.split("").map((nucleotide, i) => {
                      const isChanged =
                        index > 0 &&
                        i < mutatedSequences[index - 1].length &&
                        nucleotide !== mutatedSequences[index - 1][i];
                      return (
                        <span
                          key={i}
                          className={isChanged ? "bg-yellow-200" : ""}
                        >
                          {nucleotide}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Analysis</h4>
              <div className="text-sm">
                <p>Original Length: {mutatedSequences[0].length} nucleotides</p>
                <p>
                  Final Length:{" "}
                  {mutatedSequences[mutatedSequences.length - 1].length}{" "}
                  nucleotides
                </p>
                <p>
                  Total Mutations:{" "}
                  {countMutations(
                    mutatedSequences[0],
                    mutatedSequences[mutatedSequences.length - 1],
                  )}
                </p>
                <p>
                  Mutation Rate:{" "}
                  {(
                    (countMutations(
                      mutatedSequences[0],
                      mutatedSequences[mutatedSequences.length - 1],
                    ) /
                      mutatedSequences[0].length) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Genetic Mutations</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-md mb-2 font-semibold">About Mutations</h4>
            <p className="text-sm">
              Mutations are changes in the DNA sequence that can alter genes and
              potentially affect the proteins they encode. They are the source
              of genetic variation and drive evolution.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Effects of Mutations</h4>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Silent Mutations</h5>
              <p className="mt-1 text-xs">
                Do not change the amino acid sequence of the protein. Often
                occur in the third position of a codon.
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Missense Mutations</h5>
              <p className="mt-1 text-xs">
                Change one amino acid in the protein. May affect protein
                function depending on the location and chemical properties.
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Nonsense Mutations</h5>
              <p className="mt-1 text-xs">
                Create a premature stop codon, resulting in a truncated protein
                that may not function properly.
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <h5 className="text-sm font-medium">Frameshift Mutations</h5>
              <p className="mt-1 text-xs">
                Insertions or deletions that change the reading frame, affecting
                all amino acids downstream of the mutation.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="mb-2 text-sm font-medium">Instructions:</h4>
            <ol className="list-decimal space-y-1 pl-5 text-xs">
              <li>Enter a DNA sequence or use the default</li>
              <li>Select a mutation type</li>
              <li>Set the mutation rate and number of generations</li>
              <li>Click "Simulate Mutations" to see the results</li>
              <li>Observe how mutations accumulate over generations</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
